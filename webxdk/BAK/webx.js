/****************************************************************************
 * WebXDK - Web Browser Extension SDK
 *
 * Requires jQuery internally but you don't have to use it yourself.
 * TODO: port so that jQuery is no longer required.
 ****************************************************************************/

/**********************************************************
 * WebX class
 */

/**
 * Constructor for WebX.
 * config consists of: {
 *   mapIdFunc: // Function that computes the ID,
 *   mappingRulesForId: // Function that extracts enough selectors to compute the ID,
 *   mappingRules: // Function that extracts all the rules
 * }
 */
function WebX(config) {
  this.config = config;
}

// Current version of WebX being used
WebX.gplusx = '0.1.0';

WebX.STORAGE_PREFIX = 'WebX_';

WebX.debug = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('WebX:');
  console.debug.apply(console, args);
};

WebX.error = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('WebX:');
  console.error.apply(console, args);
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
  createMap: function() {
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
    this.createMap().surveyRules();
  },

  /*
   * This method of generating class names is based on heuristics,
   * primarily targeting the case when only class names change.
   * If the actual DOM structure changes, much of this won't work
   * and this library will need to be updated.
   */
  automap: function() {
    this.createMap().automap();
  },

  /*
   * Read map from file
   */
  readFromFile: function(callback, file) {
    if (typeof file != 'string')
      file = '/gplusx/gplusx-map.json';
    this.readFromURL(chrome.extension.getURL(file), function() {
      if (typeof callback == 'function')
        callback();
    });
  },

  /*
   * Read map from URL
   */
  readFromURL: function(url, callback) {
    this.createMap();
    var _this = this;
    
    $.getJSON(url, function(data) {
      _this.wxMap.version = data.version;
      for (var i in data.map) {
        // NOTE: In JSON format, to save space, we keep the data as
        //   key: { s: 'selector', c: 'className' }
        // but internally we want to be able to do map.s.key so that we don't have
        // to have guards for 'undefined' everywhere when doing map.key.s
        if (typeof data.map[i].s != 'undefined')
          _this.wxMap.map.s[i] = data.map[i].s;
        if (typeof data.map[i].c != 'undefined')
          _this.wxMap.map.c[i] = data.map[i].c;
      }
      callback();

    }).error(function() {
      WebX.error("Can't read JSON mappings from url: " + url);
    });
  },

  /*
   * Convert map to string
   */
  writeToString: function() {
    var data = {
      id: this.wxMap.getId(),
      version: this.wxMap.version,
      map: {}
    };
    var i;
    for (i in this.map.s) {
      if (!(i in data.map))
        data.map[i] = {};
      data.map[i].s = this.map.s[i];
    }
    for (i in this.map.c) {
      if (!(i in data.map))
        data.map[i] = {};
      data.map[i].c = this.map.c[i];
    }
    return JSON.stringify(data);
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
    var $context = context ? (context.jquery ? context : $(context)) : $();
    return $context.find(this.map.s[key]);
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
  // to output rule dependencies
  this.mode = 'library';

  // NOTE: keep this reference permanent so that WebX can alias it
  this.map = {
    s: {},
    c: {}
  };
  // Aliases for convenience in mapping rules
  this.s = this.map.s;
  this.c = this.map.c;

  this.rules = {};
}

WebXMap.debug = function() {
  WebX.debug.apply(undefined, arguments);
};
WebXMap.error = function error(key) {
  WebX.error.call(undefined, "Error while digging for '" + key + "'");
//console.trace();
};


// Class names to ignore because they've been added by extensions
WebXMap.CLASSNAMES_FILTER = /^(?:gpme-)/;

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
   * Persists mappings to localStorage.
   * @return true on success
   */
  saveMap: function() {
    var id = this.getId();
    if (id) {
      // Store with mapping id
      localStorage.setItem(WebX.STORAGE_PREFIX + 'map_' + id, JSON.stringify({
        version: this.version,
        map: this.map
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
  restoreMap: function(id) {
    if (typeof id != 'string' || ! id) {
      WebX.error("Invalid mapping id '" + id + "'");
      return false;
    }
      
    // Restore with mapping id
    var val = localStorage.getItem(WebX.STORAGE_PREFIX + 'map_' + id);
    if (val === null) {
      WebX.error("No selectors or classNames found for mapping id '" + id + "'");
      return false;
    } else {
      try {
        // Internal format is different from JSON format in that the id
        // is stored in the key and we preserve c and s as only 2 separate objects.
        var data = JSON.parse(val);
        this.version = data.version;
        this.map = data.map;
        this.s = this.map.s;
        this.c = this.map.c;
      } catch (e) {
        WebX.error("Can't parse mapping id '" + id + "' from localStorage");
        return false;
      }
      return true;
    }
  },

  /*
   * Surveys all existing rules and generates dependencies.
   * As a side effect, creates a new map and automaps as much as possible.
   */
  surveyRules: function() {
    try {
      this.mode = 'survey';
      this.config.mappingRules.apply(this);
    } finally {
      this.mode = 'library';
    }
  },

  extractLoopWithSelector: function(key, $elements, selector, callback, addClassSelectors) {
    return this._extractLoop(arguments.callee.caller, key, $elements, {selector: selector, addClassSelectors: addClassSelectors}, callback);
  },

  /**
   * Expects to match a series of elements and extracts the selector and classnames
   * that are the lowest common denominator
   * @param callback: Optional callback to call with (i, el) for each match
   */
  extractLoop: function(key, $elements, callback) {
    return this._extractLoop(arguments.callee.caller, key, $elements, {}, callback);
  },

  _extractLoop: function(outerCallback, key, $elements, options, callback) {
    var smallestEntry; // XXX We may need to look deeper into the class names in the future
    var _this = this;
    $.extend(options, {dontStore: true});
    $elements.each(function(i, el) {
      var mapEntry = _this._extract(arguments.callee.caller, key, $(el), options, callback);
      if (mapEntry !== null && (typeof smallestEntry == 'undefined' || smallestEntry.s.length > mapEntry.s.length))
        smallestEntry = mapEntry;
    });
    this.map.s[key] = smallestEntry.s;
    this.map.c[key] = smallestEntry.c;
    return smallestEntry;
  },

  /**
   * Convenience method that calls jQuery on the selector and then
   * calls extractWithSelector().
   * Good for #id because it doesn't require a context, so this
   * calls jQuery for you.
   */
  extractCallingJQuery: function(key, selector, callback, addClassSelectors) {
    return this._extract(arguments.callee.caller, key, $(selector), {selector: selector, addClassSelectors: addClassSelectors}, callback);
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
  extractWithSelector: function(key, $el, selector, callback, addClassSelectors) {
    return this._extract(arguments.callee.caller, key, $el, {selector: selector, addClassSelectors: addClassSelectors}, callback);
  },

  /**
   * Extracts selectors and classnames for the given key from the specified
   * element.
   * Only the first element will be looked at.
   * @param callback: Optional callback to call with 'this' set to $el
   *   for convenience.
   */
  extract: function(key, $el, callback) {
    return this._extract(arguments.callee.caller, key, $el, {}, callback);
  },

  /**
   * Internal function that does all the work
   * @return null if no result, or an Object {s:, c:}
   */
  _extract: function(outerCallback, key, $el, options, callback) {
    var result;
    if (! $el.length) {
      WebXMap.error(key);
      result = null;
    } else {
      result = {};

      var classes = this.getClasses($el.first());
      if (classes.styled.length)
        result.c = '.' + classes.styled.join('.');

      // If passing in a selector
      if (typeof options.selector != 'undefined' && options.selector !== null) {
        result.s = options.selector +
          (typeof options.addClassSelectors != 'undefined' && options.addClassSelectors ?
            '.' + classes.nonStyled.join('.') : '');

      } else { // If not, we create a selector out of class names

        var selectorClasses = classes.nonStyled.length ? classes.nonStyled : classes.styled;
        if (! selectorClasses.length) {
          WebXMap.error(key);
          result = null;
        } else {
          result.s = '.' + selectorClasses.join('.');
        }
      }
    }

    // Unless option is not to store, e.g. in a loop
    if (result && ! options.dontStore) {
      this.map.c[key] = result.c;
      this.map.s[key] = result.s;
    }

    // Save the rule
    this.rules[key] = {
      search: search,
      callback: callback
    };

    // Handle the case when there is one level of indirection in call stack
    if (typeof outerCallback.dependsOnKey == 'undefined')
      outerCallback = outerCallback.caller;
    // Record rule dependency
    if (typeof outerCallback.dependsOnKey != 'undefined')
      this.rules[key].dependsOnKey = outerCallback.dependsOnKey;

    // If we're doing a survey of dependencies, we'll go deeper into the rules anyway
    if (result || this.mode == 'survey') {
      if (typeof callback == 'function') {
        callback.dependsOnKey = key;
        callback.call($el, key); // Passing the key, but no use so far; no use for return value either
      }
    }
    return result;
  },

  /**
   * Given an element, returns which classes are for styling and which seem primarily
   * usable as selectors
   */
  getClasses: function($el) {
    var result = {
      styled: [],
      nonStyled: []
    };
    var className = $el.attr('class');
    if (typeof className === 'undefined')
      return result;
      
    var _this = this;
    className.split(/\s+/).forEach(function(c) {
      if (c && ! WebXMap.CLASSNAMES_FILTER.test(c)) {
        (_this.isStyled($el, c) ? result.styled : result.nonStyled).push(c);
      }
    });
    // We try non-styled classes first because that's probably why G+ has them
    // there: to selecte elements.
    return result;
  },

  /*
   * Returns whether removing the single className changes the elements'
   * style.
   */
  isStyled: function($el, className) {
    var result;
    var savedClass = $el.attr('class');
    // NOTE: getComputedStyle() must be converted to string immediately
    // because the style object gets reused in subsequent calls
    var savedStyleText = window.getComputedStyle($el.get(0)).cssText;
    $el.removeClass(className);
    result = savedStyleText !== window.getComputedStyle($el.get(0)).cssText;
    $el.attr('class', savedClass); // No addClass() coz we want to preserve the order for looks
    return result;
  }

};
