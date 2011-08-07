
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
