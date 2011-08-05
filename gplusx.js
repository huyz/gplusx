/*
 * GPlusX - Google+ Extension SDK
 */

// Requires jQuery internally but you don't have to use it yourself.

/*
(function(window) {

var $ = jQuery;

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
    navigator = window.navigator,
    location = window.location;
*/

var Gpx = function(key, context) {
};

/*
 * GpxMap
 */

var GpxMap = function(key) {
  this.c = this.DEFAULT_CLASSNAMES;
  this.s = this.DEFAULT_SELECTORS;
};

GpxMap.prototype = {
  // This is the section that we will update all the time for 2 reason:
  // - guarantee correctness (the self-healing may be wrong)
  // - performance
  DEFAULT_CLASSNAMES: {
  },
  DEFAULT_SELECTORS: {
  },

  // Class names to ignore because they've been added by extensions
  CLASSNAMES_FILTER: /^(?:gpme-)/,

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
      if (! _this.CLASSNAMES_FILTER.test(c)) {
        (_this.isStyled($el, c) ? result.styled : result.nonStyled).push(c);
      }
    });
    // We try non-styled classes first because that's probably why G+ has them
    // there: to selecte elements.
    return result;
  },

  /**
   * Extracts selectors and classnames for the given key from the specified
   * element.
   * Only the first element will be looked at.
   * @param callback: Optional callback to call with 'this' set to $el
   *   for convenience.
   */
  extract: function(key, $el, callback) {
    if (! $el.length) {
      error(key);
      return false;
    }

    var classes = this.getClasses($el.first());

    if (classes.styled.length)
      this.c[key] = classes.styled.join(' ');

    var selectorClasses = classes.nonStyled.length ? classes.nonStyled : classes.styled;
    if (! selectorClasses.length) {
      error(key);
      return false;
    }
    this.s[key] = '.' + selectorClasses.join('.');

    // Success
    if (typeof callback === 'function')
      callback.call($el);
    return true;
  },
  /**
    * Adds tagname to selector
    * No longer needed: use es() instead.
    */
  extractWithTag: function(key, $el, callback) {
    if ($el.length !== 1) {
      error(key);
      return false;
    }

    if (! this.extract(key, $el))
      return false;

    // Prepend the tagname
    this.s[key] = $el.get(0).tagName.toLowerCase() + this.s[key];

    // Success
    if (typeof callback === 'function')
      callback.call($el);
    return true;
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
    if (! $el.length) {
      error(key);
      return false;
    }

    var classes = this.getClasses($el.first());

    if (classes.styled.length)
      this.c[key] = classes.styled.join(' ');

    this.s[key] = selector + (addClassSelectors ? classes.nonStyled.join('.') : '');

    // Success
    if (typeof callback === 'function')
      callback.call($el);
    return true;
  },

  /**
   * Convenience method that calls jQuery on the selector and then
   * calls extractWithSelector().
   * Good for #id because it doesn't require a context, so this
   * calls jQuery for you.
   */
  extractCallingJQuery: function(key, selector, callback, addClassSelectors) {
    return this.extractWithSelector(key, $(selector), selector, callback, addClassSelectors);
  },

  /**
   * Returns id that identifies mapping.
   * If called without 'this', then gets the ID of the current page
   */
  getID: function() {
    var map;
    if (!(this instanceof GpxMap)) {
      map = new GpxMap();
      map.s = {};
      map.c = {};

      map.extractCallingJQuery('gbar', '#gb', function() {
        map.extract('gbarParent', this.parent(), function() {
          map.extract('gplusBarBg', this.next(), function() {
            map.extract('gplusBar', this.children());
          });
        });
      });

    } else {
      map = this;
    }

    if (typeof map.s.gbarParent == 'undefined' && typeof map.s.gplusBar == 'undefined') {
      Gpx.fn.error("Not enough to create a mapping id");
      return null;
    }

    return map.s.gbarParent + ',' + map.s.gplusBar;
  },

  /**
   * Persists mappings to localStorage.
   * @return true on success
   */
  saveMap: function() {
    var id = this.getID();
    if (id) {
      // Store with mapping id
      localStorage.setItem(Gpx.fn.STORAGE_PREFIX + 's_' + id, JSON.stringify(this.s));
      localStorage.setItem(Gpx.fn.STORAGE_PREFIX + 'c_' + id, JSON.stringify(this.c));
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
    if (typeof id !== 'string' || ! id) {
      Gpx.fn.error("Invalid mapping id '" + id + "'");
      return false;
    }
      
    // Restore with mapping id
    var s = localStorage.getItem(Gpx.fn.STORAGE_PREFIX + 's_' + id);
    var c = localStorage.setItem(Gpx.fn.STORAGE_PREFIX + 'c_' + id);
    if (s === null || c === null) {
      Gpx.fn.error("No selectors or classNames found for mapping id '" + id + "'");
      return false;
    } else {
      this.s = JSON.parse(s);
      this.c = JSON.parse(c);
      return true;
    }
  }

};

/*
 * Gpx
 */

Gpx.fn = Gpx.prototype = {
  // Current version of Gpx being used
  gplus: '0.1.0',
  STORAGE_PREFIX: 'GpxExtSDK_',

  map: new GpxMap(),

  /*
   * Utility
   */

  debug: function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('gplus');
    console.debug(args);
  },
  error: function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('gplus');
    console.error(args);
  },

  /*
   * G+ DOM
   */

  check: function() {
    //Gpx.fn.debug('Current ID', this.map.getID());
    //Gpx.fn.debug('Page ID', this.map.getID.call(undefined));
    return this.map.getID() == this.map.getID.call(undefined);
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
  update: function() {
    this.map = new GpxMap();
    this.map.update();
  },

  /*
   * Read map from URL
   */
/*
  updateFromURL: function(url, callback) {
    this.map = new GpxMap();
    
    $.getJSON(url, function(data) {
      var items = [];

      $.each(data, function(key, val) {
        items.push('<li id="' + key + '">' + val + '</li>');
      });

      $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      }).appendTo('body');

      callback();
    });
  },
  updateFromFile: function(file, callback) {
    this.updateFromURL(chrome.extension.getURL('/gplus-ext-sdk/gplus-selectors.json', function() {
      this.updateFromURL(chrome.extension.getURL('/gplus-ext-sdk/gplus-classnames.json', function() {
        callback();
      });
    });
  },
*/

  // Returns a jQuery object containing all the matches for
  // the key within that context
  // Usage: Gpx.find$('gbar')
  find$: function(key, context) {
    var $context = context ? (context.jquery ? context : $(context)) : $();
    return $context.find(this.map.s[key]);
  },

  children$: function(key, context) {
    if (typeof context === 'undefined')
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
      name: this.find$('gbarToolsProfileNameText').text()
    };
  },

  getGbar$: function() {
    return this.find$('gbar');
  },

  getStream$: function() {
    return this.find$('postsStream');
  },

  getPosts$: function() {
    return this.stream$.children('[id^="update-"]');
  },

  // Extended version of posts$
  getPostsX$: function() {
    return this.stream$.children('[id^="update-"],[id^="sgp-post-"]');
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
// Expose jQuery to the global object
window.Gpx = Gpx;
})(window);
*/

// vim:set ai et sts=2 sw=2 tw=0:
