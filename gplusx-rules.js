
GplusMap.prototype.update: function() {
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
};