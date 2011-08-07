
/****************************************************************************
 * GPlusX + WebXDK
 * File was combined from multiple input files by 'make'.
 ****************************************************************************/


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

WebX.prototype = {

  /**
   * Creates new mapping.
   */
  createMap() {
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
    
    $.getJSON(url, function(data) {
      wxMap.version = data.version;
      for (var i in data.map) {
        // NOTE: In JSON format, to save space, we keep the data as
        //   key: { s: 'selector', c: 'className' }
        // but internally we want to be able to do map.s.key so that we don't have
        // to have guards for 'undefined' everywhere when doing map.key.s
        if (typeof data.map[i].s != 'undefined')
          wxMap.map.s[i] = data.map[i].s;
        if (typeof data.map[i].c != 'undefined')
          wxMap.map.c[i] = data.map[i].c;
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
   * Creates non-jQuery equivalents of function.
   * To be used by WebX's subclass after defining its jQuery-based
   * API.
   */
  createNonJQueryFunctions: function() {
    var object = this;
    for (var i in object.prototype) {
      if (object.prototype.hasOwnProperty(i)) {
        var fn = WebX.prototype[i];
        var fnName = WebX.prototype[i].toString();
        if (fnName.charAt(fnName.length - 1) === '$') {
          (function(fn) {
            object.prototype[fnName.substring(0, fnName.length - 1)] = function() {
              return fn.apply(this, arguments).get();
            };
          })(fn);
        }
      }
    }
  },

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
  },
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

  this.ruleDependencies = {};
}

WebXMap.debug = function() {
  WebX.debug.apply(undefined, arguments);
};
WebXMap.error = function error(key) {
  WebX.error.call(undefined, "Error while digging for '" + key + "'");
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
      } catch (e) {
        WebX.error("Can't parse mapping id '" + id + "' from localStorage");
        return false;
      }
      return true;
    }
  },

  /*
   * Surveys all existing rules and generates dependencies.
   * As a side effect, creates a new map and auto-maps as much as possible.
   */
  surveyRules: function() {
    try {
      this.mode = 'survey';
    } finally {
      this.mode = 'library';
    }
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
   * Internal function that does all the work
   */
  _extract: function(outerCallback, key, $el, options, callback) {
    var result;
    if (! $el.length) {
      WebXMap.error(key);
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
          WebXMap.error(key);
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
    if (result || this.mode == 'survey') {
      if (typeof callback == 'function') {
        callback.dependsOnKey = key;
        callback.call($el, key);
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
      if (! WebXMap.CLASSNAMES_FILTER.test(c)) {
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

/****************************************************************************
 * GPlusX mapping rules.
 * File was generated from CoffeeScript.
 ****************************************************************************/


var gplusxMapIdFunc, gplusxMappingRules, gplusxMappingRulesForId;
gplusxMapIdFunc = function() {
  if (this.s.gbarParent != null) {
    return this.s.gbarParent + (this.s.gplusBar != null ? this.s.gplusBar : '');
  } else {
    return null;
  }
};
gplusxMappingRulesForId = function() {
  ej('gbar', '#gb', function() {
    return e('gbarParent', this.parent(), function() {
      return e('gplusBarBg', this.next(), function() {
        return e('gplusBar', this.children());
      });
    });
  });
  return;
};
gplusxMappingRules = function(mode) {
  var $posts, c, debug, e, ej, error, es, nonPlaceholderFound, placeholderFound, s, _this;
  s = this.s = {};
  c = this.c = {};
  this.mode = mode;
  _this = this;
  debug = function() {
    return WebXMap.debug.apply(void 0, arguments);
  };
  error = function() {
    return WebXMap.error.apply(void 0, arguments);
  };
  e = function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    args.unshift(e.caller);
    return _this.extract.apply(_this, args);
  };
  es = function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    args.unshift(es.caller);
    return _this.extractWithSelector.apply(_this, args);
  };
  ej = function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    args.unshift(ej.caller);
    return _this.extractCallingJQuery.apply(_this, args);
  };
  ej('gbar', '#gb', function() {
    return e('gbarParent', this.parent(), function() {
      return e('gplusBarBg', this.next(), function() {
        return e('gplusBar', this.children(), function() {
          return e('gplusBarNav', this.find('[role="navigation"]'), function() {
            return e('gplusBarNavStreamA', this.children('a:first-child'), function() {
              e('gplusBarNavStreamIcon_c', this.children());
              return e('gplusBarNavPhotosA', this.next(), function() {
                e('gplusBarNavPhotosIcon_c', this.children());
                return e('gplusBarNavProfileA', this.next(), function() {
                  e('gplusBarNavProfileIcon_c', this.children());
                  return e('gplusBarNavCirclesA', this.next(), function() {
                    return e('gplusBarNavCirclesIcon_c', this.children());
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  ej('gbarTop', '#gbw');
  ej('gbarLinks', '#gbz', function() {
    return e('gbarList_c', this.children('ol'), function() {
      return e('gbarListItem_c', this.children('li'));
    });
  });
  ej('gbarLinksMoreUnit', '#gbztms');
  ej('gbarLinksMoreUnitText', '#gbztms1');
  ej('gbarMorePullDown', '#gbd');
  ej('gbarTools', '#gbg');
  ej('gbarToolsProfileNameA', '#gbg6');
  ej('gbarToolsProfileNameText', '#gbi4t');
  ej('gbarToolsNotificationA', '#gbg1');
  ej('gbarToolsNotificationUnit', '#gbgs1');
  ej('gbarToolsNotificationUnitBg', '#gbi1a');
  ej('gbarToolsNotificationUnitFg', '#gbi1');
  ej('gbarToolsShareA', '#gbg3');
  ej('gbarToolsShareUnit', '#gbgs3');
  ej('gbarToolsShareUnitText', '#gbi3');
  ej('gbarToolsProfilePhotoA', '#gbg4');
  ej('gbarToolsProfilePullDown', '#gbd4');
  ej('gbarToolsProfileCard', '#gbmpdv', function() {
    return e('gbarToolsProfileCardContent_c', this.children('div').first(), function() {
      return e('gbarToolsProfileCardContentList_c', this.children('ol'), function() {
        return e('gbarToolsProfileCardContentListItem_c', this.children('li'));
      });
    });
  });
  ej('gbarToolsProfileName', '#gbmpn', function() {
    return e('gbarToolsProfileEmail_c', this.next());
  });
  ej('gbarToolsProfileSwitch', '#gbmps');
  ej('gbarToolsGear', '#gbg5');
  ej('gbarToolsGearPullDown', '#gbd5');
  ej('searchBox', '#search-box');
  ej('searchBoxInput', '#oz-search-box');
  ej('content', '#content');
  es('contentPane', $('#contentPane'), '#contentPane');
  $posts = $('[id^="update-"]');
  if (!$posts.length) {
    error('post');
  } else {
    placeholderFound = false;
    nonPlaceholderFound = false;
    $posts.each(function(i, el) {
      var $postChildren, postWithShortestClassName, shortestClassName;
      if (!(typeof shortestClassName !== "undefined" && shortestClassName !== null) || el.className.length < shortestClassName) {
        shortestClassName = el.className;
        postWithShortestClassName = el;
      }
      $postChildren = $(el).children(':not([role="menu"])');
      if (!$postChildren.length) {
        return error('post is completely empty');
      } else if (!placeholderFound && $postChildren.is(':empty')) {
        placeholderFound = true;
        return e('postPlaceholder_c', $postChildren);
      } else if (!nonPlaceholderFound && !$postChildren.is(':empty')) {
        nonPlaceholderFound = true;
        return e('postUserHeading_c', $postChildren.find('h3:first'), function() {
          e('postUserHeadingName_c', this.children());
          return e('postHead_c', this.parent(), function() {
            e('postMenuButton_c', this.children('[role="button"]'));
            e('postUserAvatarA_c', this.children('a[href^="/"][oid]'), function() {
              return e('postUserAvatarImg_c', this.children('img'));
            });
            e('postUserNameA_c', this.find('a[href^="/"][oid]'), function() {
              return e('postUserName_c', this.parent(), function() {
                return e('postHeadInfo_c', this.next(), function() {
                  e('postTime_c', this.children('span:first'), function() {
                    return e('postTimeA_c', this.children('a'));
                  });
                  return e('postPermissions_c', this.children('[role="button"]'));
                });
              });
            });
            e('postContainer_c', this.parent());
            return e('postBody_c', this.next(), function() {
              e('postContent_c', this.children(':first'), function() {});
              es('postPlusOneButton_c', this.find('button[g\\:type="plusone"]'), 'button[g\\:type="plusone"]', function() {
                e('postTools_c', this.parent(), function() {
                  return e('postStats_c', this.next());
                });
                return e('postCommentLink_c', this.next(), function() {
                  return e('postShareLink_c', this.next());
                });
              });
              return e('postComments_c', this.next(), function() {
                es('postCommentsOld_c', this.children(':eq(0)'), ':eq(0)');
                e('postCommentsShown_c', this.children(':eq(1)'));
                es('postCommentsMore_c', this.children(':eq(2)'), ':eq(2)', function() {
                  e('postCommentsClickArea_cc', this.children(':eq(0)'));
                  return e('postCommentsMoreLeftEdge_c', this.children(':eq(1)'));
                });
                return e('postCommentButton_c', this.next('[role="button"]'));
              });
            });
          });
        });
      }
    });
    es('post', $(postWithShortestClassName), '[id^="update-"]', function() {
      return e('postsStream', $posts.first().parent());
    });
  }
  s.gbarToolsProfileEmail = s.gbarToolsProfileName + ' > ' + s.gbarToolsProfileEmail_c;
  s.gbarLinksList = s.gbarLinks + ' > ' + s.gbarList_c;
  s.gbarLinksListItem = s.gbarLinksList + ' > ' + s.gbarListItem_c;
  s.gbarToolsList = s.gbarTools + ' > ' + s.gbarList_c;
  s.gbarToolsListItem = s.gbarToolsList + ' > ' + s.gbarListItem_c;
  s.postCommentsOldClickArea_c = s.postCommentsOld_c + ' > ' + s.postCommentsClickArea_cc;
  s.postCommentsMoreClickArea_c = s.postCommentsMore_c + ' > ' + s.postCommentsClickArea_cc;
  ej('gbarToolsNotificationPullDown', '#gbwc');
  ej('gbarToolsNotificationFrame', '#gbsf');
  e('postMenu', $posts.first().find('[role="menu"]'));
  return;
};
/****************************************************************************
 * GPlusX Class
 *
 * Requires jQuery internally but you don't have to use it yourself.
 * TODO: port so that jQuery is no longer required.
 ****************************************************************************/

function GPlusX(config) {
  // Inherit all the WebX properties
  for (var i in WebX) {
    this[i] = WebX[i];
  }

  this.config = config;
}

GPlusX.prototype = {

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
}

GPlusX.createNonJQueryFunctions();
