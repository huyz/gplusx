// Requires jQuery internally but you don't have to use it yourself.

(function(window) {

var $ = jQuery;

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
    navigator = window.navigator,
    location = window.location;

var GPlus = function(key, context) {
};

/*
 * GPlusMap
 */

var GPlusMap = function(key) {
  this.c = this.DEFAULT_CLASSNAMES;
  this.s = this.DEFAULT_SELECTORS;
};

GPlusMap.prototype = {
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
    * Only the first element will be looked at.
    * @param callback: Optional callback to call with this set to $el
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
    * Only processes the first element passed in.
    * Example selectors: '#id' or '[role="button"]' or 'span'
    * @param callback: Optional callback to call with this set to $el
    *   for convenience.
    * @param addClassSelectors: If true, makes selector even more specific by adding
    *   classes.  This is useful in cases when the selector is fine within
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
   * Convenience method that calls jQuery on the selector.
   * Great for #id
   */
  extractCallingJQuery: function(key, selector, callback, addClassSelectors) {
    return this.extractWithSelector(key, $(selector), selector, callback, addClassSelectors);
  },

  update: function() {
    var s = this.s = {};
    var c = this.c = {};

    // Aliases
    var _this = this;
    function e() {
      _this.extract.apply(_this, arguments);
    }
    function es() {
      _this.extractWithSelector.apply(_this, arguments);
    }
    function ej() {
      _this.extractCallingJQuery.apply(_this, arguments);
    }
    function debug() {
      GPlus.fn.debug.apply(undefined, arguments);
    }
    function error(key) {
      GPlus.fn.error.call(undefined, "Error while digging for '" + key + "'");
      console.trace();
    }

    /*
     * Gbar
     */

    var $gbarParent;

    ej('gbar', '#gb', function() {
      e('gbarParent', $gbarParent = this.parent());
    });

    ej('gbarTop', '#gbw');

    ej('gbarLinks', '#gbz', function() {
      e('gbarList_c', this.children('ol'), function() { // This is the same as for gbarTools, so requires context
        e('gbarListItem_c', this.children('li')); // This is the same as for gbarTools, so requires context
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
      e('gbarToolsProfileCardContent_c', this.children('div').first(), function() {
        e('gbarToolsProfileCardContentList_c', this.children('ol'), function() {
          e('gbarToolsProfileCardContentListItem_c', this.children('li'));
        });
      });
    });
    ej('gbarToolsProfileName', '#gbmpn', function() {
      e('gbarToolsProfileEmail_c', this.next()); // Also in the "Switch" panel
    });
    ej('gbarToolsProfileSwitch', '#gbmps');
    ej('gbarToolsGear', '#gbg5');
    ej('gbarToolsGearPullDown', '#gbd5');

    /*
     * GPlusBar
     */

    e('gplusBarBg', $gbarParent.next(), function() {
      e('gplusBar', this.children(), function() {

        e('gplusBarNav', this.find('[role="navigation"]'), function() {
/* Too early for aria
    e('gplusBarNavHomeA', $_ = $('[aria-label="Home"]'));
    e('gplusBarNavHomeIcon_c', $_.children());
    e('gplusBarNavPhotosA', $_ = $('[aria-label="Photos"]'));
    e('gplusBarNavPhotosIcon_c', $_.children());
    e('gplusBarNavProfileA', $_ = $('[aria-label="Profile"]'));
    e('gplusBarNavProfileIcon_c', $_.children());
    e('gplusBarNavCirclesA', $_ = $('[aria-label="Circles"]'));
    e('gplusBarNavCirclesIcon_c', $_.children());
*/
          e('gplusBarNavStreamA', this.children('a:first-child'), function() {
            e('gplusBarNavStreamIcon_c', this.children());
            e('gplusBarNavPhotosA', this.next(), function() {
              e('gplusBarNavPhotosIcon_c', this.children());
              e('gplusBarNavProfileA', this.next(), function() {
                e('gplusBarNavProfileIcon_c', this.children());
                e('gplusBarNavCirclesA', this.next(), function() {
                  e('gplusBarNavCirclesIcon_c', this.children());
                });
              });
            });
          });
        });
      });
    });

    ej('searchBox', '#search-box');
    ej('searchBoxInput', '#oz-search-box');

    /*
     * IDs -- these are unlike to change any time soon
     * and their close relatives
     */

    ej('content', '#content'); // FIXME: too early: sometimes gets 'maybe-hide' class
    var $contentPane;
    es('contentPane', $contentPane = $('#contentPane'), '#contentPane');

    /*
     * Main stream page
     */

    // Posts ID prefix is also unlikely to change
    var $posts = $contentPane.find('[id^="update-"]');
    if (! $posts.length) {
      error('post');
    } else {
      e('postsStream', $posts.first().parent());

      // Go through all the posts on the page
      var lastClass = null;
      var last = null;
      var canonClassesFound = false,
          placeholderFound = false,
          typicalPostFound = false;
      $posts.each(function(i, el) {
        // Looking for 2 similar matches in a row because
        // an item that is selected will have different classes
        if (! canonClassesFound) {
          if (lastClass === null) {
            lastClass = el.className;
            last = el;
          } else if (lastClass == el.className) {
            canonClassesFound = true;
          }
        }

        // Look for placeholder
        var $postChildren = $(el).children(':not([role="menu"])');
        if (! $postChildren.length) {
          error('post is completely empty');
        } else if (! placeholderFound && $postChildren.is(':empty')) {
          e('postPlaceholder_c', $postChildren);
        } else if (! typicalPostFound && ! $postChildren.is(':empty')) {
          // Find first h3
          e('postUserHeading_c', $postChildren.find('h3:first'), function() {
            e('postUserHeadingName_c', this.children());
            e('postHead_c', this.parent(), function() {
              e('postMenuButton_c', this.children('[role="button"]'));
              e('postUserAvatarA_c', this.children('a[href^="/"][oid]'), function() {
                e('postUserAvatarImg_c', this.children('img'));
              });
              e('postUserNameA_c', this.find('a[href^="/"][oid]'), function() {
                e('postUserName_c', this.parent(), function() {
                  e('postHeadInfo_c', this.next(), function() {
                    e('postTime_c', this.children('span:first'), function() {
                      e('postTimeA_c', this.children('a'));
                    });
                    e('postPermissions_c', this.children('[role="button"]'));
                  });
                });
              });

              e('postContainer_c', this.parent());
              e('postBody_c', this.next(), function() {
                e('postContent_c', this.children(':first'), function() {
                  // TODO: this may vary depending on the type of post
                });

                es('postPlusOneButton_c', this.find('button[g\\:type="plusone"]'), 'button[g\\:type="plusone"]', function() {
                  e('postTools_c', this.parent(), function() {
                    e('postStats_c', this.next());
                    // NOTE: we can't look inside the stats div, coz there may not be anything for this
                    // particular post
                  });
                  e('postCommentLink_c', this.next(), function() {
                    e('postShareLink_c', this.next());
                  });
                });

                e('postComments_c', this.next(), function() {
                  // NOTE: we can't look inside these divs coz there may not be any comments; we'll look below
                  e('postCommentsOld_c', this.children(':eq(0)'), function() {
                  });
                  e('postCommentsShown_c', this.children(':eq(1)'));
                  e('postCommentsMore_c', this.children(':eq(2)'), function() {
                    e('postCommentsClickArea_cc', this.children(':eq(0)')); // Class is shared with Old
                    e('postCommentsMoreLeftEdge_c', this.children(':eq(1)'));
                  });

                  // Fake input box 'Add a comment' which is really a button
                  e('postCommentButton_c', this.next('[role="button"]'));
                });
              });
            });
          });
        }

        if (canonClassesFound && placeholderFound && typicalItemFound)
          return false;
      });
      if (canonClassesFound) {
        e('post', $(last));
      } else {
        error('post, part 2');
      }

      // Let's look for stats from the list of posts
      /* TODO

      // FIXME: the post may not have +1s; need to search through all posts
      e('postStatsPlus_c', this.children(':first'), function() {
        e('postStatsPlusCount_c', this.children(':eq(0)'), function() {
          e('postStatsPlusScoreText_c', this.children());
        });
        // FIXME: there's an empty div after the +1  class="QD mz"
      });
      // FIXME: the post may not have shares; need to search through all posts
      e('postStatsShare_c', this.children(':eq(1)'), function() {
        e('postStatsShareScore_c', this.children('span:eq(0)'));
        e('postStatsShareNames_c', this.children('span:eq(1)'));
      });
      */
    }

    /*
     * Path Combos that give morecontext
     */

    s.gbarLinksList               = s.gbarLinks + ' > ' + s.gbarList_c;
    s.gbarLinksListItem           = s.gbarLinksList + ' > ' + s.gbarListItem_c;
    s.gbarToolsList               = s.gbarTools + ' > ' + s.gbarList_c;
    s.gbarToolsListItem           = s.gbarToolsList + ' > ' + s.gbarListItem_c;
    s.postCommentsOldClickArea_c  = s.postCommentsOld_c + ' > ' + s.postCommentsClickArea_cc;
    s.postCommentsMoreClickArea_c = s.postCommentsMore_c + ' > ' + s.postCommentsClickArea_cc;

    /*
     * These need to be done carefully with delay, as they're injected later
     */

    ej('gbarToolsNotificationPullDown', '#gbwc'); // FIXME: comes later
    ej('gbarToolsNotificationFrame', '#gbsf'); // FIXME: comes later

    e('postMenu', $posts.first().find('[role="menu"]')); // FIXME: comes later
    // TODO: how to distinguish between the different menuitems in any language?
    // TODO: get the menuitem's hover class

    // TODO: select an item thn another, then wait for that other
    // to have added a classname, which would mean "selected"

    // TODO: get A inside of time when it appears

    /*
     * End
     */

    this.saveMap();

    debug("update: s=", s);
    debug("update: c=", c);
  },

  /**
   * Returns id that identifies mapping.
   * If called without 'this', then gets the ID of the current page
   */
  getID: function() {
    var map;
    if (!(this instanceof GPlusMap)) {
      map = new GPlusMap();
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
      GPlus.fn.error("Not enough to create a mapping id");
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
      localStorage.setItem(GPlus.fn.STORAGE_PREFIX + 's_' + id, JSON.stringify(this.s));
      localStorage.setItem(GPlus.fn.STORAGE_PREFIX + 'c_' + id, JSON.stringify(this.c));
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
      GPlus.fn.error("Invalid mapping id '" + id + "'");
      return false;
    }
      
    // Restore with mapping id
    var s = localStorage.getItem(GPlus.fn.STORAGE_PREFIX + 's_' + id);
    var c = localStorage.setItem(GPlus.fn.STORAGE_PREFIX + 'c_' + id);
    if (s === null || c === null) {
      GPlus.fn.error("No selectors or classNames found for mapping id '" + id + "'");
      return false;
    } else {
      this.s = JSON.parse(s);
      this.c = JSON.parse(c);
      return true;
    }
  }

};

/*
 * GPlus
 */

GPlus.fn = GPlus.prototype = {
  // Current version of GPlus being used
  gplus: '0.1.0',
  STORAGE_PREFIX: 'GPlusExtSDK_',

  map: new GPlusMap(),

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
    //GPlus.fn.debug('Current ID', this.map.getID());
    //GPlus.fn.debug('Page ID', this.map.getID.call(undefined));
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
    this.map = new GPlusMap();
    this.map.update();
  },

  /*
   * Read map from URL
   */
/*
  updateFromURL: function(url, callback) {
    this.map = new GPlusMap();
    
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
  // Usage: GPlus.find$('gbar')
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
  // so just call: GPlus.find('gbar')[0]
  find: function(key, context) {
    return this.find$(key, context).get();
  },

  children: function(key, context) {
    return this.children$(key, context).get();
  },

  /*
   * GPlus API
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
for (var i in GPlus.prototype) {
  if (GPlus.prototype.hasOwnProperty(i)) {
    var fn = GPlus.prototype[i];
    var fnName = GPlus.prototype[i].toString();
    if (fnName.charAt(fnName.length - 1) === '$') {
      (function(fn) {
        GPlus.prototype[fnName.substring(0, fnName.length - 1)] = function() {
          return fn.apply(this, arguments).get();
        };
      })(fn);
    }
  }
}

// Expose jQuery to the global object
window.GPlus = GPlus;
})(window);


// vim:set ai et sts=2 sw=2 tw=0:
