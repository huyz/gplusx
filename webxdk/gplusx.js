/*
 * GPlusX - Google+ Extension SDK
 */

// Requires jQuery internally but you don't have to use it yourself.
// Later, to be ported to not use jQuery.

/*
 * Gpx
 */

function Gpx() {
}

// Current version of Gpx being used
Gpx.gplusx = '0.1.0';

Gpx.STORAGE_PREFIX = 'GPlusX_';

Gpx.debug = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('GPlusX:');
  console.debug.apply(console, args);
};

Gpx.error = function() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('GPlusX:');
  console.error.apply(console, args);
};

Gpx.prototype = {

  /*
   * G+ DOM
   */

  check: function() {
    //Gpx.debug('Current ID', this.gpxMap.getID());
    //Gpx.debug('Page ID', this.gpxMap.getID.call(undefined));
    return this.gpxMap.getID() == this.gpxMap.getID.call(undefined);
  },

  checkAndUpdate: function() {
    if (! this.check())
      this.update();
  },

  /*
   * This method of generating class names is based on heuristics,
   * primarily targeting the case when only class names change.
   * If the actual DOM structure changes, much of this won't work
   * and this library will need to be updated.
   */
  update: function(mode) {
    this.gpxMap = new GpxMap();
    this.map = this.gpxMap.map;

    this.gpxMap.update(mode);
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
    this.gpxMap = gpxMap = new GpxMap();
    this.map = this.gpxMap.map;
    
    $.getJSON(url, function(data) {
      gpxMap.version = data.version;
      for (var i in data.map) {
        // NOTE: In JSON format, to save space, we keep the data as
        //   key: { s: 'selector', c: 'className' }
        // but internally we want to be able to do map.s.key so that we don't have
        // to have guards for 'undefined' everywhere when doing map.key.s
        if (typeof data.map[i].s != 'undefined')
          gpxMap.map.s[i] = data.map[i].s;
        if (typeof data.map[i].c != 'undefined')
          gpxMap.map.c[i] = data.map[i].c;
      }
      callback();

    }).error(function() {
      Gpx.error("Can't read JSON mappings from url: " + url);
    });
  },

  /*
   * Convert map to string
   */
  writeToString: function() {
    var data = {
      id: this.gpxMap.getID(),
      version: this.gpxMap.version,
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

  // Returns a jQuery object containing all the matches for
  // the key within that context
  // Usage: Gpx.find$('gbar')
  find$: function(key, context) {
    var $context = context ? (context.jquery ? context : $(context)) : $();
    return $context.find(this.map.s[key]);
  },

  children$: function(key, context) {
    if (typeof context == 'undefined')
      return undefined;

    var $context = context.jquery ? context : $(context);
    return $context.children(this.map.s[key]);
  },

  // Returns an array of the DOM elements that match the key
  // within a context.
  // Most of the time, you'll be interested only in the first one,
  // so just call: Gpx.find('gbar')[0]
  find: function(key, context) {
    return this.find$(key, context).get();
  },

  children: function(key, context) {
    return this.children$(key, context).get();
  },

  /*
   * Gpx API
   */

  getProfile: function() {
    return {
      name: this.find$('gbarToolsProfileNameText').text(),
      email: this.find$('gbarToolsProfileEmail').text()
    };
  },

  getNotificationCount: function() {
    return this.find$('gbarToolsNotificationUnitFg').text();
  },

  getGbar$: function() {
    return this.find$('gbar');
  },

  getGplusBar$: function() {
    return this.find$('gplusBar');
  },

  getStream$: function() {
    return this.find$('postsStream');
  },

  getPosts$: function() {
    return this.find$('post');
  },

  // Extended version of posts$
  getPostsX$: function() {
    return this.find$(this.map.s.post + ',[id^="sgp-post-"]');
  }

};

// Create non-jQuery functions
for (var i in Gpx.prototype) {
  if (Gpx.prototype.hasOwnProperty(i)) {
    var fn = Gpx.prototype[i];
    var fnName = Gpx.prototype[i].toString();
    if (fnName.charAt(fnName.length - 1) === '$') {
      (function(fn) {
        Gpx.prototype[fnName.substring(0, fnName.length - 1)] = function() {
          return fn.apply(this, arguments).get();
        };
      })(fn);
    }
  }
}

/*
 * GpxMap
 */

function GpxMap() {

  // Normally, 'library' mode; but in its dev extension, GPlusX can run 'dependencySurvey' mode
  // to output rule dependencies
  this.mode = 'library';

  this.map = {
    s: {},
    c: {}
  };

  this.ruleDependencies = {};
}

GpxMap.debug = function() {
  Gpx.debug.apply(undefined, arguments);
};
GpxMap.error = function error(key) {
  Gpx.error.call(undefined, "Error while digging for '" + key + "'");
};


// Class names to ignore because they've been added by extensions
GpxMap.CLASSNAMES_FILTER = /^(?:gpme-)/;

GpxMap.prototype = {

  /*
  * Returns whether removing the className changes the elements
  * style
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
  },

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
      if (! GpxMap.CLASSNAMES_FILTER.test(c)) {
        (_this.isStyled($el, c) ? result.styled : result.nonStyled).push(c);
      }
    });
    // We try non-styled classes first because that's probably why G+ has them
    // there: to selecte elements.
    return result;
  },

  /**
   * Internal function that does all the work
   */
  _extract: function(outerCallback, key, $el, options, callback) {
    var result;
    if (! $el.length) {
      GpxMap.error(key);
      result = false;
    } else {

      var classes = this.getClasses($el.first());
      if (classes.styled.length)
        this.map.c[key] = '.' + classes.styled.join('.');

      // If passing in a selector
      if (typeof options.selector != 'undefined' && options.selector !== null) {
        this.map.s[key] = options.selector +
          (typeof options.addClassSelectors != 'undefined' && options.addClassSelectors ?
            '.' + classes.nonStyled.join('.') : '');
        result = true;

      } else { // If not, we create a selector out of class names

        var selectorClasses = classes.nonStyled.length ? classes.nonStyled : classes.styled;
        if (! selectorClasses.length) {
          GpxMap.error(key);
          result = false;
        } else {
          this.map.s[key] = '.' + selectorClasses.join('.');
          result = true;
        }
      }
    }

    // Record rule dependency
    if (typeof outerCallback.dependsOnKey != 'undefined')
      this.ruleDependencies[key] = outerCallback.dependsOnKey;

    // If we're doing a survey of dependencies, we'll go deeper into the rules anyway
    if (result || this.mode == 'dependencySurvey') {
      if (typeof callback == 'function') {
        callback.dependsOnKey = key;
        callback.call($el, key);
      }
    }
    return result;
  },

  /**
   * Extracts selectors and classnames for the given key from the specified
   * element.
   * Only the first element will be looked at.
   * @param callback: Optional callback to call with 'this' set to $el
   *   for convenience.
   */
  extract: function(outerCallback, key, $el, callback) {
    return this._extract(outerCallback, key, $el, {}, callback);
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
  extractWithSelector: function(outerCallback, key, $el, selector, callback, addClassSelectors) {
    return this._extract(outerCallback, key, $el, {selector: selector, addClassSelectors: addClassSelectors}, callback);
  },

  /**
   * Convenience method that calls jQuery on the selector and then
   * calls extractWithSelector().
   * Good for #id because it doesn't require a context, so this
   * calls jQuery for you.
   */
  extractCallingJQuery: function(outerCallback, key, selector, callback, addClassSelectors) {
    return this._extract(outerCallback, key, $(selector), {selector: selector, addClassSelectors: addClassSelectors}, callback);
  },

  /**
   * Returns id that identifies mapping.
   * If called without 'this', then gets the ID of the current page
   * NOTE: this won't work on the settings page since it only has the gbar but not the gplusbar
   */
  getID: function() {
    var tmpMap;
    if (!(this instanceof GpxMap)) {
      tmpMap = new GpxMap();

      tmpMap.extractCallingJQuery('gbar', '#gb', function() {
        tmpMap.extract('gbarParent', this.parent(), function() {
          tmpMap.extract('gplusBarBg', this.next(), function() {
            tmpMap.extract('gplusBar', this.children());
          });
        });
      });

    } else {
      tmpMap = this.map;
    }

    if (typeof tmpMap.s.gbarParent == 'undefined') {
      GpxMap.error("Not enough to create a mapping id");
      return null;
    }

    // The settings page has no gplusbar, but I hesitate to only take
    // one element's className as an ID
    return tmpMap.s.gbarParent + (typeof tmpMap.s.gplusBar != 'undefined' ? ',' + tmpMap.s.gplusBar : '');
  },

  /**
   * Persists mappings to localStorage.
   * @return true on success
   */
  saveMap: function() {
    var id = this.getID();
    if (id) {
      // Store with mapping id
      localStorage.setItem(Gpx.STORAGE_PREFIX + 'map_' + id, JSON.stringify({
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
      GpxMap.error("Invalid mapping id '" + id + "'");
      return false;
    }
      
    // Restore with mapping id
    var val = localStorage.getItem(Gpx.STORAGE_PREFIX + 'map_' + id);
    if (val === null) {
      GpxMap.error("No selectors or classNames found for mapping id '" + id + "'");
      return false;
    } else {
      try {
        // Internal format is different from JSON format in that the id
        // is stored in the key and we preserve c and s as only 2 separate objects.
        var data = JSON.parse(val);
        this.version = data.version;
        this.map = data.map;
      } catch (e) {
        GpxMap.error("Can't parse mapping id '" + id + "' from localStorage");
        return false;
      }
      return true;
    }
  }
};

// vim:set ai et sts=2 sw=2 tw=0:
