/****************************************************************************
 * WebXDK - Web Browser Extension SDK
 *
 * Requires jQuery internally but you don't have to use it yourself.
 * TODO: port so that jQuery is no longer required.
 ****************************************************************************/

// Legacy
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

/**********************************************************
 * WebX class
 */

var WEBX_DEBUG = true;

/**
 * Constructor for WebX.
 * config consists of: {
 *   mapIdFunc: // Function that computes the ID,
 *   mappingRulesForId: // Function that extracts enough selectors to compute the ID,
 *   mappingRules: // Function that extracts all the rules
 *   classNamesFilter: // Regexp of class names added by the extension; similar to hard-coded:
 *                     // WebXMap.CLASSNAMES_FILTER = / gpme-\S+/g;
 *   fallbackRemote: // If true, tries to download mappings in case of mapping ID mismatch
 *   fallbackAutomap: // If true, tries to figure out mappings based on rules. fallbackRemote
 *                    // takes precedeence over fallbackAutomap
 * }
 */
function WebX(config) {
  this.config = config;

  // Mode is either "normal" or "automap"
  this.mode = 'normal';

  // When assigning prototype, there is no caller
  if (config && arguments.callee.caller) {
    this.config.storagePrefix = arguments.callee.caller.name;
    this.config.serializationPrefix = '__' + arguments.callee.caller.name + '__:';
  }
}

// Current version of WebX being used
WebX.gplusx = '0.1.0';

// Filenames that ship with an extension
WebX.BUNDLED_MAP_FILENAME = '/gplusx/gplusx-map.json';
WebX.BUNDLED_RULES_FILENAME = '/gplusx/gplusx-rules-cache.json';

WebX.debug = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('WebX:');
  console.debug.apply(console, args);
};

WebX.warn = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('WebX:');
  console.warn.apply(console, args);
};

WebX.error = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('WebX:');
  console.error.apply(console, args);
};

WebX.onFsApiError = function(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  }

  WebX.error('file error', msg);
};

/**
 * Creates non-jQuery equivalents of function.
 * To be used by WebX's subclass after defining its jQuery-based
 * API.
 */
WebX.createNonJQueryFunctions = function() {
  var object = this;
  for (var i in object.prototype) {
    if (object.prototype.hasOwnProperty(i) && typeof object.prototype[i] == 'function') {
      var fn = object.prototype[i];
      var fnName = object.prototype[i].toString();
      if (fnName.charAt(fnName.length - 1) === '$') {
        (function(fn) {
          object.prototype[fnName.substring(0, fnName.length - 1)] = function() {
            return fn.apply(this, arguments).get();
          };
        })(fn);
      }
    }
  }
};

WebX.prototype = {

  /**
   * Creates new mapping.
   */
  newMap: function() {
    this.wxMap = new WebXMap(this.config);
    this.map = this.wxMap.map; // Alias
    return this.wxMap;
  },

  /**
   * Checks that the current mapping is valid for the current page.
   */
  check: function() {
    //WebX.debug('Current ID', this.wxMap.getId());
    //WebX.debug('Page ID', this.wxMap.getId.call(undefined));
    return this.wxMap.getId() == this.wxMap.getId.call(undefined);
  },

  /**
   * Checks that the current mapping is valid for the current page,
   * and automaps otherwise.
   */
  checkAndAutomap: function() {
    if (! this.check())
      this.automap();
  },

  /*
   * Surveys all existing rules and generates dependencies.
   * As a side effect, creates a new map and auto-maps as much as possible.
   */
  surveyRules: function() {
    return this.rules = this.newMap().surveyRules();
  },

  /**
   * Reads map from file
   * @param {String} filename: Optional to override system default
   *   which is set for a user-facing extension
   */
  readMapFromFile: function(callback, filename) {
    if (typeof filename != 'string')
      filename = WebX.BUNDLED_MAP_FILENAME;

    this.readMapFromURL(chrome.extension.getURL(filename), function() {
      if (typeof callback == 'function')
        callback();
    });
  },

  /**
   * Reads map from URL
   */
  readMapFromURL: function(url, callback) {
    this.newMap();
    var _this = this;
    
    $.getJSON(url, function(data) {
      _this.wxMap.fromCompactJSON.call(_this, data);
      callback(data);
    }).error(function() {
      WebX.error("Can't read JSON mappings from url: " + url);
    });
  },

  /**
   * Writes map to FileSystem API file.
   */
  writeMapToFile: function(filename, callback) {
    this.writeToFile(this.wxMap.toString(), filename, callback);
  },

  /**
   * Reads rules from file
   * @param {String} filename: Optional to override system default
   *   which is set for a user-facing extension
   */
  readRulesFromFile: function(callback, filename) {
    var _this = this;

    if (typeof filename != 'string')
      filename = WebX.BUNDLED_RULES_FILENAME;

    $.get(chrome.extension.getURL(filename), function(data) {
      _this.rules = _this.rulesFromString(data);
      if (typeof callback == 'function')
        callback(data);
    }).error(function() {
      WebX.error("Can't read JS rules from filename: " + filename);
    });
  },

  /**
   * Writes rules to FileSystem API file.
   * This will only work if your extension has the 'unlimitedStorage' permission.
   */
  writeRulesToFile: function(filename, callback) {
    this.writeToFile(this.rulesToString(), filename, callback);
  },

  /**
   * Writes string to FileSystem API file.
   */
  writeToFile: function(string, filename, callback) {
    // window.PERSISTENT seems to be broken in Chrome 13 and my Chrome 15
    // http://code.google.com/p/chromium/issues/detail?id=85000
    window.requestFileSystem(window.TEMPORARY, 1024*1024 /*1MB*/, function(fs) {
      fs.root.getFile(filename, {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          fileWriter.onerror = function(e) {
            WebX.error('Write to ' + filename + 'failed', e);
          };

          var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
          bb.append(string);
          fileWriter.write(bb.getBlob('text/plain'));

          // Open the file to see
          WebX.debug('Filesystem = ' + fs.root.toURL());
          callback(fs.root.toURL());
        }, WebX.onFsApiError);
      }, WebX.onFsApiError);
    }, WebX.onFsApiError);
  },

  /**
   * Converts rules to string.
   * Must handle serialization of functions
   */
  rulesToString: function() {
    var _this = this;
    return JSON.stringify(this.rules, function(key, value) {
      //return typeof value === 'function' ? ('' + value).replace(/\n\s*/g, ' ') : value;
      return typeof value === 'function' ? _this.config.serializationPrefix + value : value;
    });
  },

  /**
   * Converts string to rules, which includes functions
   */
  rulesFromString: function(string) {
    var _this = this;

    return JSON.parse(string, function(key, value) {
      if (value && typeof value == 'string' &&
          value.substr(0, _this.config.serializationPrefix.length) == _this.config.serializationPrefix) {
        try {
          var substr = value.substr(_this.config.serializationPrefix.length)
          substr = substr.replace(/\\n/g, '');
          return eval('(' + substr + ')');
        } catch(e) {
          WebX.error('rulesFromString', 'Error while deserializing functions in rules from string.', e);
          return value;
        }
      }
      return value;
    });
  },

  /********************
   * Automapping
   */

  /**
   * Invokes mapping rules for the specified key, with the given optional context
   */
  automapMasterBranch: function(key, $context) {
    var keyRules = this.rules[key];
    if (typeof keyRules == 'undefined') {
      WebX.warn('automapMasterBranch', 'Rules not found for key "' + key + '"');
      return;
    }

    var masterKey = this.rules.masterKey;

    // If we've reached the top level, then invoke the search function and extract
    if (typeof keyRules.masterKey == 'undefined') {
      if (typeof keyRules.search == 'undefined') {
        WebX.error('automapMasterBranch', 'Can\'t find search function for key "' + key + '"');
        return;
      } else {
        this.wxMap.extractWithRules(key, keyRules);
      }

    } else if (this.map.s[masterKey]) { // If the master has a mapping
      do {
        // Find a match for the master key, and possibly recurse
        // XXX This may not work.  The rules don't necessarily go down the tree; e.g.
        // they may go sideways or even upwards, in which case the context may make sense for key
        // while the context may not make sense for masterKey.
        // This all depends on how far up the specified context is.
        // But I need to imagine more scenarios to see what kind of trouble we'll get into.
        var $master = this.find$(masterKey, $context);

        // If we've found the master element.
        // NOTE: this could return multiple hits, in which the case the slaveRules will
        // have a `this` with multiple elements, unlike when we execute mappingRules
        if ($master.length) {
          // Invoke the slave rules to automap the slave keys
          keyRules.slaveRules.call(this.ruleContext($master),
            key); // Passing the key, but no use so far; no use for return value either
          break;
        }

        // Try with context higher up the tree.
        $context = $context.parent();
      } while ($context.length);

    } else { // If the master has no mapping
      // Recurse
      automapMasterBranch(masterKey, $context);
    }
  },

  /********************
   * Generic API
   */

  /**
   * Returns a jQuery object containing all the matches for
   * the key within that context
   * Usage: WebX.find$('gbar')
   */
  find$: function(key, context) {
    // Accept DOM element or jQuery object
    var $context = context ? (context.jquery ? context : $(context)) : null;

    // If no mapping and we're in automap mode
    if (! this.map.s[key] && this.mode == 'automap')
      this.wxMap.automapMasterBranch(key, $context);

    if (this.map.s[key])
      // Accept context or none
      return $context ? $context.find(this.map.s[key]) : $(this.map.s[key]);
    else
      return $();
  },

  children$: function(key, context) {
    if (typeof context == 'undefined')
      return undefined;

    var $context = context.jquery ? context : $(context);
    return $context.children(this.map.s[key]);
  }
};

/**********************************************************
 * WebXMap class
 */

function WebXMap(config) {

  this.config = config;

  // Normally, 'library' mode; but in its dev extension, WebX can run 'survey' mode
  // to output rules
  this.mode = 'library';

  /**
   * Creates new mapping.
   * Defined here so that we can call it upon `new`
   */
  (this.newMap = function() {
    // NOTE: keep this reference permanent so that WebX can alias it
    this.map = {
      s: {},
      sAlt: {},
      c: {}
    };
    // Aliases for convenience in mapping rules
    this.s = this.map.s;
    this.sAlt = this.map.sAlt;
    this.c = this.map.c;
  }).call(this);

  /**
   * Special function to send as `this` to the mapping rules.
   * Defined here so that elements can be bound to the current object `this`.
   * It serves 2 purposes:
   * - the 'this' in the outest scope of the CoffeeScript rules, so that we can have
   *   consistent syntax  between the outermost scope @(-> $('#id') ) and
   *   the inner scopes, even though the outermost scope has no 'this' (different 'this'
   *   than the one previously mentioned) to give to the anonymous function within
   *   which $('#id') is called.
   * - container for rule functions
   */
  this.topRuleContext = this.ruleContext($(document)); // In case a top-level rule accidentally references `this`
  $.extend(this.topRuleContext, {
    debug: WebXMap.debug,
    error: WebXMap.error,
    e: this.extract.bind(this),
    ep: this.extractWithPrimary.bind(this),
    ea: this.extractWithAlternate.bind(this),
    ed: this.extractFromDocument.bind(this),

    s: this.map.s,
    sAlt: this.map.sAlt,
    c: this.map.c
  });
}

WebXMap.debug = function() {
  WebX.debug.apply(undefined, arguments);
};
WebXMap.warn = function warn(key) {
  WebX.warn.call(undefined, "Warning while digging for '" + key + "'");
//console.trace();
};
WebXMap.error = function error(key) {
  WebX.error.call(undefined, "Error while digging for '" + key + "'");
//console.trace();
};


// Class names to ignore because they've been added by extensions
// NOTE: This regex depends on the overall classname to be preceded by a space
WebXMap.CLASSNAMES_FILTER = / gpme-\S+/g;

WebXMap.prototype = {

  /**
   * Returns id that identifies mapping.
   * If 'this' is the window, then gets the ID of the current page
   * NOTE: this won't work on the settings page since it only has the gbar but not the gplusbar
   */
  getId: function() {
    var wxMap;
    if (!(this instanceof WebXMap)) {
      wxMap = new WebXMap(this.config);
      this.config.mappingRulesForId.call(wxMap);

    } else {
      wxMap = this.map;
    }

    var id = this.config.mapIdFunc.call(wxMap);
    if (id === null)
      WebX.error("Not enough to create a mapping id");

    return id;
  },

  /**
   * Returns string representation of map, in compact JSON format,
   * with ID and version
   */
  toString: function() {
    var data = {
      id: this.getId(),
      version: this.version,
      map: this.toCompactJSON()
    };
    return JSON.stringify(data);
  },

  /**
   * Returns the map in compact JSON format
   */
  toCompactJSON: function() {
    var map = {};
    var i;
    for (i in this.map.s) {
      if (!(i in map))
        map[i] = {};
      map[i].s = this.map.s[i];
    }
    for (i in this.map.sAlt) {
      if (!(i in map))
        map[i] = {};
      map[i].sAlt = this.map.sAlt[i];
    }
    for (i in this.map.c) {
      if (!(i in map))
        map[i] = {};
      map[i].c = this.map.c[i];
    }
    return map;
  },

  /**
   * Sets the map from the given compact JSON format
   */
  fromCompactJSON: function(data) {
    this.version = data.version;
    this.newMap();
    for (var i in data.map) {
      // NOTE: In JSON format, to save space, we keep the data as
      //   key: { s: 'selector', c: 'className' }
      // but internally we want to be able to do map.s.key so that we don't have
      // to have guards for 'undefined' everywhere when doing map.key.s
      if (typeof data.map[i].s != 'undefined')
        this.map.s[i] = data.map[i].s;
      if (typeof data.map[i].sAlt != 'undefined')
        this.map.sAlt[i] = data.map[i].sAlt;
      if (typeof data.map[i].c != 'undefined')
        this.map.c[i] = data.map[i].c;
    }
  },

  /**
   * Persists mappings to localStorage.
   * @return true on success
   */
  writeToLocalStorage: function() {
    var id = this.getId();
    if (id) {
      // Store with mapping id
      localStorage.setItem(this.config.storagePrefix + '_map_' + id, JSON.stringify({
        version: this.version,
        map: this.toCompactJSON()
      }));
      return true;
    } else {
      return false;
    }
  },

  /**
   * Restores specified mappings from localStorage
   * @return true on success
   */
  readFromLocalStorage: function(id) {
    if (typeof id != 'string' || ! id) {
      WebX.error("Invalid mapping id '" + id + "'");
      return false;
    }
      
    // Restore with mapping id
    var val = localStorage.getItem(this.config.storagePrefix + '_map_' + id);
    if (val === null) {
      WebX.error("No selectors or classNames found for mapping id '" + id + "'");
      return false;
    } else {
      try {
        // Internal format is different from JSON format in that the id
        // is stored in the key and we preserve s, sAlt, and c as only 3 separate objects.
        var data = JSON.parse(val);
        this.version = data.version;
        this.map = data.map;
        this.s = this.map.s;
        this.sAlt = this.map.sAlt;
        this.c = this.map.c;
      } catch (e) {
        WebX.error("Can't parse mapping id '" + id + "' from localStorage");
        return false;
      }
      return true;
    }
  },

  /**
   * Helper function for creating context for the slave rules.
   */
  ruleContext: function($domContext) {
    return function(search) {
      return [$domContext, search];
    };
  },

  /**
   * Surveys all existing rules and generates dependencies.
   * As a side effect, creates a new map and automaps as much as possible.
   */
  surveyRules: function() {
    this.rules = {};
    try {
      this.mode = 'survey';
      this.config.mappingRules.apply(this.topRuleContext);
    } finally {
      this.mode = 'library';
    }
    return this.rules;
  },

  /**
   * Extracts, given pre-recorded rules.
   * This is used by automap to invoke 
   */
  extractWithRules: function(key, keyRules) {
    return this._extract(undefined, key, this.topRuleContext(keyRules.search), {dontStoreRules: true}, keyRules.slaveRules);
  },

  /**
   * Expects to match a series of elements and extracts the selector and classnames
   * that are the lowest common denominator
   * @param callback: Optional callback to call with (i, el) for each match
   */
/*
  extractLoop: function(key, contextAndSearch, callback) {
    return this._extractLoop(arguments.callee.caller, key, contextAndSearch, {}, callback);
  },

  extractLoopWithPrimary: function(key, contextAndSearch, selector, callback) {
    return this._extractLoop(arguments.callee.caller, key, $elements, {primary: selector}, callback);
  },

  extractLoopWithAlternate: function(key, contextAndSearch, selector, callback) {
    return this._extractLoop(arguments.callee.caller, key, contextAndSearch, {alternate: selector}, callback);
  },

  _extractLoop: function(masterSlaveRules, key, contextAndSearch, options, callback) {
    // Checks
    if (!(contextAndSearch instanceof Array)) {
      WebX.error('Error in rule definition for key "' + key + '": expected an Array for contextAndSearch; instead got ' + contextAndSearch.constructor + '.  Did you properly wrap your parameter `@(-> ... )` ?');
      return null;
    }
    if (typeof contextAndSearch[1] != 'function') {
      WebX.error('Error in rule definition for key "' + key + '": expected a function inside contextAndSearch; instead got ' + typeof contextAndSearch[1] + '.');
      return null;
    }
  },
*/

  /**
   * Convenience method that calls jQuery on the selector and then
   * calls extractWithAlternate().
   * Good for #id because it doesn't require a context, so this
   * calls jQuery for you.
   */
  extractFromDocument: function(key, selector, slaveRules) {
    return this._extract(arguments.callee.caller, key, [undefined, function() { return $(selector); }],
        {primary: selector}, slaveRules);
  },

  extractWithPrimary: function(key, contextAndSearch, selector, slaveRules) {
    return this._extract(arguments.callee.caller, key, contextAndSearch,
        {primary: selector}, slaveRules);
  },

  /**
   * Extracts selector and classnames for the given key from the specified
   * element where you've already decided on a selector.
   * Only processes the first element passed in.
   * Example selectors: '#id' or '[role="button"]' or 'span[role="menu"]'
   * @param callback: Optional callback to call with 'this' set to $el
   *   for convenience.
   * @param addClassSelectors: If true, makes selector even more specific by adding
   *   classes.
   */
  extractWithAlternate: function(key, contextAndSearch, selector, slaveRules) {
    return this._extract(arguments.callee.caller, key, contextAndSearch,
        {alternate: selector}, slaveRules);
  },

  /**
   * Extracts selectors and classnames for the given key from the specified
   * element.
   * Only the first element will be looked at.
   * @param callback: Optional callback to call with 'this' set to $el
   *   for convenience.
   */
  extract: function(key, contextAndSearch, slaveRules) {
    return this._extract(arguments.callee.caller, key, contextAndSearch, {}, slaveRules);
  },

  /**
   * Internal function that does all the work
   * @return null if no result, or an Object {s:, c:}
   */
  _extract: function(masterSlaveRules, key, contextAndSearch, options, slaveRules) {
    // Rule syntax checks
    if (!(contextAndSearch instanceof Array)) {
      WebX.error('Error in rule definition for key "' + key + '": expected an Array for contextAndSearch; instead got ' + contextAndSearch.constructor + '.  Did you properly wrap your parameter `@(-> ... )` ?');
      return null;
    }
    if (typeof contextAndSearch[1] != 'function') {
      WebX.error('Error in rule definition for key "' + key + '": expected a function inside contextAndSearch; instead got ' + typeof contextAndSearch[1] + '.');
      return null;
    }

    // Call the search function
    var $elements = contextAndSearch[1].call(contextAndSearch[0]);

    // If multiple elements, then loop through
    if ($elements.length > 1) {

      var smallestEntry; // XXX We may need to look deeper into the class names in the future
      var _this = this;
      $.extend(options, {dontStore: true});

      // Loop through the elements
      contextAndSearch[1].call(contextAndSearch[0]).each(function(i, el) {
        var mapEntry = _this._extract(masterSlaveRules, key, [undefined, function() { return $(el); }],
          options, slaveRules);
        if (mapEntry && (typeof smallestEntry == 'undefined' || smallestEntry.s.length > mapEntry.s.length))
          smallestEntry = mapEntry;
      });

      // If we don't already have mapping
      if (typeof this.map.s[key] == 'undefined') {
        // Copy the data from the entry with the shortest selector.
        // XXX Time will tell if this is a good heuristic.
        this.map.s[key] = smallestEntry.s;
        if (typeof smallestEntry.sAlt != 'undefined')
          this.map.sAlt[key] = smallestEntry.sAlt;
        if (typeof smallestEntry.c != 'undefined')
          this.map.c[key] = smallestEntry.c;
        this.rules[key] = smallestEntry.rules;
        this.rules[key].search = contextAndSearch[1];
      }

      return smallestEntry;

    } else { // For a single or no match
      var result = {};

      // If we already have a mapping set, use that
      if (typeof this.map.s[key] != 'undefined') {
        result.s = this.map.s[key];
        if (typeof this.map.sAlt[key] != 'undefined')
          result.sAlt = this.map.sAlt[key];
        if (typeof this.map.c[key] != 'undefined')
          result.c = this.map.c[key];
        result.rules = this.rules[key];

      } else if (! $elements.length) { // If no match, give error
        WebXMap.warn(key);
        result = null;

      } else { // If just one element
        // More rule syntax checks
        if (options && typeof options.primary != 'undefined' && typeof options.primary != 'string') {
          WebX.error('Error in rule definition for key "' + key + '": expected a string for selector; instead got ' + typeof selector);
          return null;
        }
        if (options && typeof options.alternate != 'undefined' && typeof options.alternate != 'string') {
          WebX.error('Error in rule definition for key "' + key + '": expected a string for selector; instead got ' + typeof selector);
          return null;
        }

        // Set the styled classes
        var classes = this.getClasses($elements);
        if (classes.styled.length)
          result.c = '.' + classes.styled.join('.');

        // Compute a selector
        var computedSelector;
        if (classes.nonStyled.length) { // If we have non-styled classes, then use that as a selector
          computedSelector = '.' + classes.nonStyled.join('.');
        } else if (classes.styled.length) { // Otherwise, take the styled classes
          computedSelector = '.' + classes.styled.join('.');
        }

        // Take into account rulewriter's choice about primary or alternate selectors
        if (options.primary) {
          result.s = options.primary;
          // Keep computed selector as an alternate
          if (computedSelector)
            result.sAlt = [ computedSelector ];
        } else {
          result.s = computedSelector;
          // Keep an alternate
          if (options.alternate)
            result.sAlt = [ options.alternate ];
        }

        // Check if we have a selector at all
        if (typeof result.s == 'undefined') {
          WebXMap.warn(key);
          result = null;
        }

        if (result) {
          // Return the rule
          result.rules = {
            search: contextAndSearch[1], // We actually only have use for this for a top-level rule
            slaveRules: slaveRules
          };

          // Handle the case when there is one level of indirection in call stack
          if (typeof masterSlaveRules == 'undefined') {
            if (typeof masterSlaveRules.masterKey == 'undefined')
              masterSlaveRules = masterSlaveRules.caller;
            // Record rule dependency
            if (typeof masterSlaveRules.masterKey != 'undefined')
              result.rules.masterKey = masterSlaveRules.masterKey;
          }

          // Unless option is not to store, e.g. in a loop
          if (! options.dontStore) {
            this.map.s[key] = result.s;
            if (typeof result.sAlt !== 'undefined')
              this.map.sAlt[key] = result.sAlt;
            if (typeof result.c !== 'undefined')
              this.map.c[key] = result.c;
            if (! options.dontStoreRules) {
              this.rules[key] = result.rules;
            }
          }
        }
      }

      // If the element was found, call the slaveRules if any, to get at more rules.
      // If we're doing a survey of rules, we'll go deeper into the rules anyway
      if (result || this.mode == 'survey') {
        if (typeof slaveRules == 'function') {
          slaveRules.masterKey = key;
          // Call the slaveRules, setting 'this' to a function that can be called
          // conveniently in CoffeeScript syntax @(search), where search is a function that
          // will be called now (and later, since the rule will recorded for future use) with
          // its own 'this' set to the current element $elements
          slaveRules.call(this.ruleContext($elements),
            key); // Passing the key, but no use so far; no use for return value either
        }
      }

      return result;
    }
  },

  /**
   * Given an element, returns which classes are for styling and which seem primarily
   * usable as selectors
   */
  getClasses: function($el) {
    if (typeof $el == 'undefined') {
      if (WEBX_DEBUG)
        debugger;
    }
    var result = {
      styled: [],
      nonStyled: []
    };
    var className = $el.attr('class');
    if (typeof className == 'undefined')
      return result;

    // First, get rid of all the class names from other extensions
    var savedClassName = className;
    className = (' ' + className + ' ').replace(WebXMap.CLASSNAMES_FILTER, '');
    if (typeof this.config.classNamesFilter != 'undefined')
      className = className.replace(this.config.classNamesFilter, '');
    $el.attr('class', className);

    // Loop through all class names one by one and see which ones gives style
    var _this = this;
    var el = $el.get(0);
    var savedStyleText = window.getComputedStyle(el).cssText;
    className.split(/\s+/).forEach(function(c) {
      if (c) {
        el.className = className.replace(' ' + c + ' ', ' ');
        if (savedStyleText !== window.getComputedStyle(el).cssText) {
          result.styled.push(c);
        } else {
          result.nonStyled.push(c);
        }
        el.className = className;
      }
    });

    // Restore the class name
    $el.attr('class', savedClassName);

    // We try non-styled classes first because that's probably why G+ has them
    // there: to selecte elements.
    return result;
  }
};
