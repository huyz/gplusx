
/****************************************************************************
 * GPlusX + WebXDK
 * File was combined by 'make' on Fri Sep 16 19:10:43 EST 2011.
 ****************************************************************************/

 ;(function(window, $, undefined) { // Semicolon coz https://github.com/mootools/slick/wiki/IIFE

 // Like jQuery
 var document = window.document;

/****************************************************************************
 * Gplusx Class
 *
 * Requires jQuery internally but you don't have to use it yourself.
 * TODO: port so that jQuery is no longer required.
 ****************************************************************************/

/**
 * Constructor for Gplusx.
 *
 * @param config {Object} configuration parameters for end-user extensions, all optional:
 * extendJQuerySelectors     {Boolean} Change jQuery selectors to accept '%post' selectors [default: false]
 * extendJQueryPseudoClasses {Boolean} Extend jQuery selectors to accept ':Xpost' [ default: false]
 * extendQuerySelectors      {Boolean} Extend (Document|Element).querySelector(All|) to accept '%post' selectors
 *                             [default: false]
 * aliasAPI                  {Boolean} or {String} If set, aliases API functions to shorthand, by default
 *                             'X', so that you have access to $X('%post') for jQuery or X('%post') for DOM.
 *                             If set to string, then overrides 'X' with your choice
 *
 * strict                    {Boolean} If true, keys that are not (yet) mapped to selectors will generate
 *                             syntax exceptions from jQuery and querySelector(All|). If false, then the error
 *                             will be silent, and that part of the selectors will not match any elements,
 *                             e.g. '.top > div%post, .comment' will then only return elements that
 *                             match '.comment'
 *
 * @param initCallback {Function} For convenience, this triggers the automatic calling of init()
 *   with the initCallback as argument.
 */
function Gplusx(config, initCallback) {
  // Call the parent constructor
  Webx.call(this, $.extend({
      mapIdFunc: Gplusx.gplusxMapIdFunc,
      mappingRulesForId: Gplusx.gplusxMappingRulesForId,
      mappingRules: Gplusx.gplusxMappingRules,

      // Names of generated files that ship with an extension.
      // Since the Gplusx library is in charge of providing these files
      // and we expect the Chrome extension to put Gplusx in the /gplusx/ library
      // we can hardcode the file paths.
      bundledMapFilepath: '/gplusx/gen/gplusx-map.json',
      bundledRulesFilepath: '/gplusx/gen/gplusx-rules-cache.json'
    }, config),
    initCallback);
}

Gplusx.debug = function() {
    var args = Array.prototype.slice.call(arguments);
      args.unshift('Gplusx:');
        console.debug.apply(console, args);
};

Gplusx.error = function() {
    var args = Array.prototype.slice.call(arguments);
      args.unshift('Gplusx:');
        console.error.apply(console, args);
};

// Super class
Gplusx.prototype = new Webx;

Gplusx.prototype.getProfile = function() {
  return {
    name: this.find$('gbarToolsProfileNameText').text(),
    email: this.find$('gbarToolsProfileEmail').text()
  };
};

Gplusx.prototype.getNotificationCount = function() {
  return this.find$('gbarToolsNotificationUnitFg').text();
};

Gplusx.prototype.getGbar$ = function() {
  return this.find$('gbar');
};

Gplusx.prototype.getGplusBar$ = function() {
  return this.find$('gplusBar');
};

Gplusx.prototype.getStream$ = function() {
  return this.find$('postsStream');
};

Gplusx.prototype.getPosts$ = function() {
  return this.find$('post');
};

// Extended version of posts$
Gplusx.prototype.getPostsX$ = function() {
  return this.find$(this.map.s.post + ',[id^="sgp-post-"]');
};

// Gplusx namespace
if (!this.Gplusx)
  this.Gplusx = Gplusx;

/****************************************************************************
 * GPlusX mapping rules.
 * This section was compiled from CoffeeScript on Fri Sep 16 19:10:42 EST 2011.
 ****************************************************************************/


Gplusx.gplusxMapIdFunc = function() {
  var c;
  if (/\/up\/start\//.test(window.location.href)) {
    return null;
  }
  c = $(this.s.gbarParent).attr('class');
  if (c) {
    return c.replace(/\s*(?:gpr_gbar|SkipMeIAmAlradyFixPushed|undefined)\s*$/, '').replace(/^(\S+\s+\S+)\s.*/, '$1');
  }
};
Gplusx.gplusxMappingRulesForId = function() {
  this.e('gbar', '#gb', function() {
    return this.e('gbarParent', (function() {
      return this.el.parentNode;
    }));
  });
};
Gplusx.gplusxMappingRules = function() {
  var SS_gbarParentIsFixed, SS_gbarToolsNotificationUnitBgZero, SS_gbarToolsNotificationUnitFgZero, SS_gplusBarIsFixed, SS_postCommentContentExpandableIsCollapsed, SS_postCommentsButtonChevronWouldCollapse, SS_postCommentsTogglerIsGrayed, SS_postIsNew, SS_postIsSelected, fn_makeChildShareIconHoverable2_, fn_postContentSharedParent_, fn_postHeadInfoMuted, genSlaves_postContentVariantEntry, simpleSelectorForShareIcon;
  SS_gbarParentIsFixed = {
    position: 'fixed',
    top: '0',
    width: '100%',
    '!*': ''
  };
  SS_gplusBarIsFixed = {
    position: 'fixed',
    top: '',
    zIndex: '',
    '!*': ''
  };
  SS_postIsSelected = {
    borderLeftColor: 'rgb(77, 144, 240)'
  };
  SS_postIsNew = {
    borderLeftColor: 'rgb(167, 199, 247)'
  };
  SS_postCommentContentExpandableIsCollapsed = {
    overflow: 'hidden'
  };
  SS_gbarToolsNotificationUnitBgZero = {
    backgroundPosition: '-26px'
  };
  SS_gbarToolsNotificationUnitFgZero = {
    color: 'rgb(153, 153, 153)'
  };
  SS_postCommentsTogglerIsGrayed = {
    color: 'rgb(153, 153, 153)',
    '!*': ''
  };
  SS_postCommentsButtonChevronWouldCollapse = {
    backgroundImage: 'stream/collapse'
  };
  simpleSelectorForShareIcon = function(sel, key) {
    var results, simple, singleSimple, _i, _len, _ref;
    results = {};
    singleSimple = null;
    _ref = sel.split(/\s*,\s*/).map(function(s) {
      var parts;
      parts = s.split(/\s+/);
      if (parts.length === 1) {
        singleSimple = parts[0];
      }
      return parts[parts.length - 1];
    });
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      simple = _ref[_i];
      results[simple] = true;
    }
    if (singleSimple) {
      return singleSimple;
    } else if (Object.keys(results).length === 1) {
      return Object.keys(results)[0];
    } else {
      this.error(key, 'Incorrect number of matches in selector "' + sel + '"');
      return null;
    }
  };
  this.ss({
    shareIconsPhoto2: {
      backgroundImage: 'sharebox/sprite2',
      backgroundPositionY: '-88px'
    }
  }, simpleSelectorForShareIcon);
  this.ss({
    shareIconsVideo2: {
      backgroundImage: 'sharebox/sprite2',
      backgroundPositionY: '-143px'
    }
  }, simpleSelectorForShareIcon);
  this.ss({
    shareIconsLink2: {
      backgroundImage: 'sharebox/sprite2',
      backgroundPositionY: '-239px'
    }
  }, simpleSelectorForShareIcon);
  this.ss({
    shareIconsLocation2: {
      backgroundImage: 'sharebox/sprite2',
      backgroundPositionY: '-107px'
    }
  }, simpleSelectorForShareIcon);
  fn_makeChildShareIconHoverable2_ = function() {
    return this.ss({
      makeChildShareIconHoverable2_: {
        backgroundImage: 'sharebox/sprite2',
        backgroundPositionY: '-52px'
      }
    }, function(sel) {
      return sel.replace(/^(?:.*,)?\s*(\.[^\s,]+)\s+[^\s,]+:hover\s*(?:,.*)?$/, '$1');
    });
  };
  this.ss({
    warnDuplicate: false
  }, {
    makeChildShareIconNonHoverable2: {
      backgroundImage: 'sharebox/sprite2',
      backgroundPositionY: '-239px'
    }
  }, function(sel, key) {
    var makeChildShareIconHoverable2_;
    this.call(fn_makeChildShareIconHoverable2_);
    makeChildShareIconHoverable2_ = this.mappedSelector.makeChildShareIconHoverable2_;
    return '' + sel.split(/\s*,\s*/).map(function(s) {
      return s.split(/\s+/)[0];
    }).filter(function(s) {
      return s !== makeChildShareIconHoverable2_;
    });
  });
  this.e('gbar', '#gb', function() {
    return this.e('gbarParent', {
      ssFilter: SS_gbarParentIsFixed
    }, (function() {
      return this.parent();
    }), function() {
      return this.e('gplusBar', {
        ssFilter: SS_gplusBarIsFixed
      }, (function() {
        return this.nextAll(':not(:empty)').first();
      }), function() {
        return this.e('gplusBarContent', (function() {
          return this.children();
        }), function() {
          return this.e('gplusBarNav', (function() {
            return this.find('[role="navigation"]');
          }), function() {
            return this.e('gplusBarNavStreamA', (function() {
              return this.children('a:first-child');
            }), function() {
              this.e('gplusBarNavStreamIcon', {
                allClassNames: true
              }, (function() {
                return this.children();
              }));
              return this.e('gplusBarNavPhotosA', (function() {
                return this.next();
              }), function() {
                this.e('gplusBarNavPhotosIcon', {
                  allClassNames: true
                }, (function() {
                  return this.children();
                }));
                return this.e('gplusBarNavProfileA', (function() {
                  return this.next();
                }), function() {
                  this.e('gplusBarNavProfileIcon', {
                    allClassNames: true
                  }, (function() {
                    return this.children();
                  }));
                  return this.e('gplusBarNavCirclesA', (function() {
                    return this.next();
                  }), function() {
                    this.e('gplusBarNavCirclesIcon', {
                      allClassNames: true
                    }, (function() {
                      return this.children();
                    }));
                    return this.e('gplusBarNavGamesA', (function() {
                      return this.next();
                    }), function() {
                      return this.e('gplusBarNavGamesIcon', {
                        allClassNames: true
                      }, (function() {
                        return this.children();
                      }));
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  this.e('gbarTop', '#gbw');
  this.e('gbarLinks', '#gbz', function() {
    return this.e('gbarLinksList_c', (function() {
      return this.children('ol');
    }), function() {
      this.combo('gbarLinksList', '%gbarLinks > %gbarLinksList_c');
      return this.e('gbarLinksListItem_c', (function() {
        return this.children('li').first();
      }), function() {
        return this.combo('gbarLinksListItem', '%gbarLinksList > %gbarLinksListItem_c');
      });
    });
  });
  this.e('gbarLinksMoreUnit', '#gbztms');
  this.e('gbarLinksMoreUnitText', '#gbztms1');
  this.e('gbarMorePullDown', '#gbd');
  this.e('gbarTools', '#gbg', function() {
    return this.e('gbarToolsList_c', {
      warnDuplicate: false
    }, (function() {
      return this.children('ol');
    }), function() {
      this.combo('gbarToolsList', '%gbarTools > %gbarToolsList_c');
      return this.e('gbarToolsListItem_c', {
        warnDuplicate: false
      }, (function() {
        return this.children('li').first();
      }), function() {
        return this.combo('gbarToolsListItem', '%gbarToolsList > %gbarLinksListItem_c');
      });
    });
  });
  this.e('gbarToolsProfileNameA', '#gbg6');
  this.e('gbarToolsProfileNameText', '#gbi4t');
  this.e('gbarToolsNotificationA', '#gbg1');
  this.e('gbarToolsNotificationUnit', '#gbgs1');
  this.e('gbarToolsNotificationUnitBg', {
    ssFilter: {
      gbarToolsNotificationUnitBgZero: SS_gbarToolsNotificationUnitBgZero
    }
  }, '#gbi1a');
  this.e('gbarToolsNotificationUnitFg', {
    ssFilter: {
      gbarToolsNotificationUnitFgZero: SS_gbarToolsNotificationUnitFgZero
    }
  }, '#gbi1');
  this.e('gbarToolsShareA', '#gbg3');
  this.e('gbarToolsShareUnit', '#gbgs3');
  this.e('gbarToolsShareUnitText', '#gbi3');
  this.e('gbarToolsProfilePhotoA', '#gbg4');
  this.e('gbarToolsProfilePullDown', '#gbd4');
  this.e('gbarToolsProfileCard', '#gbmpdv', function() {
    return this.e('gbarToolsProfileCardContent_c', (function() {
      return this.children('div').first();
    }), function() {
      return this.e('gbarToolsProfileCardContentList_c', (function() {
        return this.children('ol');
      }), function() {
        return this.e('gbarToolsProfileCardContentListItem_c', {
          warnMany: false
        }, (function() {
          return this.children('li');
        }));
      });
    });
  });
  this.e('gbarToolsProfileName', '#gbmpn', function() {
    return this.e('gbarToolsProfileEmail_c', (function() {
      return this.next();
    }), function() {
      return this.combo('gbarToolsProfileEmail', '%gbarToolsProfileName > %gbarToolsProfileEmail_c');
    });
  });
  this.e('gbarToolsProfileSwitch', '#gbmps');
  this.e('gbarToolsGear', '#gbg5');
  this.e('gbarToolsGearPullDown', '#gbd5');
  this.e('searchForm', '#searchForm');
  this.e('searchBox', '#searchBox');
  this.ss({
    gbarParentIsFixed: SS_gbarParentIsFixed
  });
  this.ss({
    gplusBarIsFixed: SS_gplusBarIsFixed
  });
  this.e('content', '#content', function() {
    return this.e('copyrightRow', (function() {
      return this.next();
    }));
  });
  this.e('contentPane', '#contentPane', function() {
    this.e('leftPane', (function() {
      return this.prev();
    }));
    return this.e('rightPane', (function() {
      return this.next();
    }));
  });
  this.e('feedbackLink', 'body > [href*="learnmore"]');
  this.e('notification', {
    warnMany: false
  }, (function() {
    return $('#contentPane > div > div > div > [data-nid]');
  }), void 0, function() {
    return this.e('notificationsStream', (function() {
      return this.first().parent();
    }), function() {
      return this.combo('notificationsPageMarker', {
        warnDuplicate: false
      }, '%notificationsStream');
    });
  });
  this.e('sparksFeaturedInterestsA', {
    warnMany: false,
    allClassNames: true
  }, (function() {
    return $('a[href^="sparks/interest"]');
  }), void 0, function() {
    this.e('sparksFeaturedInterestsImg', (function() {
      return this.first().children('img');
    }), function() {
      return this.e('sparksFeaturedInterestsCaption', (function() {
        return this.next();
      }), function() {
        this.e('sparksFeaturedInterestsCaptionOverlay', (function() {
          return this.children(':eq(0)');
        }));
        return this.e('sparksFeaturedInterestsCaptionText', (function() {
          return this.children(':eq(1)');
        }));
      });
    });
    return this.e('sparksFeaturedInterestsListItem', (function() {
      return this.first().parent();
    }), function() {
      return this.e('sparksFeaturedInterestsList', (function() {
        return this.parent();
      }), function() {
        return this.e('sparksFeaturedInterestsHeading', (function() {
          return this.parent();
        }), function() {
          return this.e('sparksFeaturedInterests', (function() {
            return this.parent();
          }), function() {
            return this.combo('sparksPageMarker', {
              warnDuplicate: false
            }, '%sparksFeaturedInterests');
          });
        });
      });
    });
  });
  this.e('sparkBody', (function() {
    return $('input[type="text"] + [role="button"]').parent().next().find('> div > div > [id^="update-"]:first').parent().parent().parent();
  }), function() {
    this.combo('sparkPageMarker', {
      warnDuplicate: false
    }, '%sparkBody');
    return this.e('sparkStreamParent_c', {
      warnDuplicate: false
    }, (function() {
      return this.find('> div > div > [id^="update-"]:first').parent().parent();
    }), function() {
      this.combo('sparkStreamParent', '%sparkBody > %sparkStreamParent_c');
      return this.e('sparkStream_c', {
        warnDuplicate: false
      }, (function() {
        return this.children('div:first');
      }), function() {
        return this.combo('sparkStream', '%sparkStreamParent > %sparkStream_c');
      });
    });
  });
  this.e('singlePostParent', (function() {
    return $('#contentPane > div > div > [id^="update-"]').parent();
  }), function() {
    return this.combo('singlePostPageMarker', {
      warnDuplicate: false
    }, '%singlePostParent');
  });
  this.e('gamesLinksWidgetHomeLink', {
    warnMany: false
  }, 'a[href="games"]', function() {
    this.combo('gamesPageMarker', {
      warnDuplicate: false
    }, '%gamesLinksWidgetHomeLink');
    return this.e('gamesLinksWidget', (function() {
      return this.parent();
    }), function() {
      this.e('gamesSelfWidget', (function() {
        return this.prev();
      }), function() {
        return this.e('gamesSelfWidgetCon"tent', (function() {
          return this.children();
        }), function() {
          this.e('gamesSelfWidgetAvatarA', {
            allClassNames: true
          }, (function() {
            return this.children('a:eq(0)');
          }), function() {
            return this.e('gamesSelfWidgetAvatarImg', (function() {
              return this.children('img');
            }), function() {});
          });
          return this.e('gamesSelfWidgetNameLink', (function() {
            return this.children('a:eq(1)');
          }));
        });
      });
      this.e('gamesRecentWidget', (function() {
        return this.children().last();
      }), function() {
        this.e('gamesRecentWidgetHeading', (function() {
          return this.children(':eq(0)');
        }));
        return this.e('gamesRecentWidgetBody', (function() {
          return this.children(':eq(1)');
        }), function() {
          return this.e('gamesRecentWidgetList', (function() {
            return this.children(':eq(0)');
          }), function() {
            return this.e('gamesRecentWidgetListItem', {
              warnMany: false
            }, (function() {
              return this.children();
            }));
          });
        });
      });
      return this.e('gamesLeftPane', (function() {
        return this.parent();
      }), function() {
        return this.e('gamesMainPane', (function() {
          return this.next();
        }), function() {
          this.e('gamesMainPaneHeading', (function() {
            return this.children(':eq(0)');
          }));
          return this.e('gamesActivitiesStream', (function() {
            return this.children(':last').filter(':nth-child(3)').children(':eq(2)').children('[id^="update-"]').parent();
          }), function() {
            this.e('gamesActivitiesStreamNoActivityText', (function() {
              return this.prev();
            }), function() {
              return this.e('gamesActivitiesStreamHeading', (function() {
                return this.prev();
              }), function() {
                return this.e('gamesActivitiesStreamHeadingText', (function() {
                  return this.children().first();
                }));
              });
            });
            return this.e('gamesActivitiesStreamParent', (function() {
              return this.parent();
            }), function() {
              return this.combo('gamesActivitiesStreamBanner', '%gamesMainPane > :nth-child(2):not(:last-child)');
            });
          });
        });
      });
    });
  });
  this.e('gamesLinksWidgetDirectoryLink', {
    warnMany: false
  }, 'a[href="games/directory"]');
  this.e('gamesLinksWidgetNotificationsLink', {
    warnMany: false
  }, 'a[href="games/notifications"]');
  this.e('profileContentPane', '.vcard', function() {
    this.combo('profilePageMarker', {
      warnDuplicate: false
    }, '%profileContentPane');
    return this.e('profileScaffold', (function() {
      return this.children();
    }), function() {
      this.e('profileCirclesUnit', (function() {
        return this.children(':eq(0)').children(':eq(0)');
      }), function() {});
      return this.e('profileHeading', (function() {
        return this.children(':eq(0)').children(':eq(1)');
      }), function() {
        return this.e('profileHeadingName', (function() {
          return this.children('span:eq(0)');
        }));
      });
    });
  });
  this.e('circleStream_c', {
    warnMany: false
  }, (function() {
    return $('#contentPane > *').not($('a[href^="games"]').closest('#contentPane > *')).not($('input[type="text"] + [role="button"]').closest('#contentPane > *')).not($('#contentPane > div > div > [id^="update-"]').closest('#contentPane > *')).find('[id^="update-"]:first').parent();
  }), function() {
    this.combo('circleStream', {
      jQuerySelector: true
    }, '%circleStream_c:not(%sparkStream)');
    this.e('circleStreamParent_c', (function() {
      return this.parent();
    }), function() {
      this.combo('circleStreamParent', {
        jQuerySelector: true
      }, '%circleStreamParent_c:not(%sparkStreamParent)');
      this.e('circleStreamContentPaneHeading', (function() {
        return this.parent().children(':eq(0)');
      }), function() {
        return this.e('circleStreamContentPaneHeadingText', (function() {
          return this.children('span');
        }));
      });
      return this.e('shareRow', (function() {
        return this.parent().children(':eq(1)');
      }), function() {
        return this.e('shareBox', (function() {
          return this.children().first();
        }), function() {
          this.e('shareIconsPhoto', (function() {
            return this.find('[title]:eq(0)');
          }), function() {
            var hoverableClassName, rule, _i, _len, _ref;
            _ref = this.cssRules();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              rule = _ref[_i];
              if (rule.selectorText.match(/:hover/)) {
                hoverableClassName = rule.selectorText.replace(/^(?:.*,)?\s*\.([^\s,]+)\s+[^\s,]+:hover\s*(?:,.*)?$/, '$1');
              }
            }
            return this.ss({
              makeChildShareIconNonHoverable: {
                background: 'url',
                cursor: 'default'
              }
            }, function(sel) {
              var isStyled;
              isStyled = this.isStyled;
              return hoverableClassName && '' + sel.split(/\s*,\s*/).map(function(s) {
                return s.split(/\s+/)[0];
              }).filter(function(s) {
                var className;
                className = s.replace(/^\./, '');
                return !isStyled(className) && className !== hoverableClassName;
              });
            });
          });
          this.e('shareIconsVideo', (function() {
            return this.find('[title]:eq(1)');
          }));
          return this.e('shareIconsLink', (function() {
            return this.find('[title]:eq(2)');
          }), function() {
            this.e('shareIconsLocation', (function() {
              return this.next();
            }));
            return this.e('shareIcons', (function() {
              return this.parent();
            }), function() {
              return this.e('shareWhatsNewText', (function() {
                return this.next();
              }), function() {
                return this.e('shareOpeningText', (function() {
                  return this.next();
                }));
              });
            });
          });
        });
      });
    });
    return this.e('circleStreamMoreRow', (function() {
      return this.next();
    }), function() {
      return this.e('circleStreamMoreButton', (function() {
        return this.find('[role="button"]');
      }), function() {
        return this.e('circleStreamMoreLoadingUnit', (function() {
          return this.next();
        }), function() {
          return this.e('circleStreamMoreLoadingText', (function() {
            return this.children();
          }));
        });
      });
    });
  });
  genSlaves_postContentVariantEntry = function(treeName) {
    var key, opt, optNoEl;
    key = function(s) {
      return s.replace(/\{\}/g, treeName);
    };
    opt = treeName === 'Original' ? {} : {
      warnDuplicate: false
    };
    optNoEl = treeName === 'Original' ? {
      warnNoElement: false
    } : {
      warnDuplicate: false,
      warnNoElement: false
    };
    return function() {
      if (treeName === 'Original') {
        this.combo('postContent', '%postBody > %postContent_c');
      } else if (treeName === 'Shared') {
        this.combo('postContentShared', '%postContentSharedParent > %postContentShared_c');
      }
      if (treeName === 'Original') {
        this.e('postContentProflinkWrapper', {
          warnMany: false
        }, (function() {
          return this.find('.proflinkWrapper').first();
        }), function() {
          this.e('postContentProflinkPrefix', (function() {
            return this.children('span:eq(0)');
          }));
          return this.e('postContentProflink', (function() {
            return this.children('a[oid]');
          }));
        });
        this.e('postContentSharedParent', (function() {
          this.call(fn_postContentSharedParent_);
          return this.children(this.mappedSelector.postContentSharedParent_);
        }), (function() {
          this.e('postContentSharedHeading', (function() {
            return this.prev();
          }), function() {
            this.e('postContentSharedUserAvatarImg_c', {
              warnDuplicate: false
            }, (function() {
              return this.children('img');
            }), function() {
              this.combo('postContentSharedUserAvatarImg', '%postContentSharedHeading > %postContentSharedUserAvatarImg_c');
              return this.e('postContentSharedUserNameA', (function() {
                return this.next('a[oid]');
              }));
            });
            return this.e('postContentSharedPrologue', (function() {
              return this.prev();
            }), function() {
              this.combo('postContentSharedPrologueText', '%postContentSharedPrologue > div');
              return this.e(key('postContentSharedPrologueEdit_c'), (function() {
                return this.filter(':visible').find('span:not(:visible)');
              }));
            });
          });
          return this.e('postContentShared_c', {
            warnDuplicate: false
          }, (function() {
            return this.children();
          }), genSlaves_postContentVariantEntry('Shared'));
        }));
      }
      return this.e(key('postContent{}Message_c'), opt, (function() {
        var children;
        this.call(fn_postContentSharedParent_);
        this.children(this.mappedSelector.postContentSharedParent_);
        children = this.children();
        if (children.filter(this.mappedSelector.postContentSharedParent_).length) {
          return null;
        } else {
          return children.first();
        }
      }), function() {
        this.e(key('postContent{}MessageText_c'), opt, (function() {
          return this.children().first();
        }), function() {
          this.e(key('postContent{}MessageEdit_c'), {
            warnDuplicate: false
          }, (function() {
            return this.filter(':visible').find('span:not(:visible)');
          }));
          return this.e(key('postContent{}MessageExpandButton_c'), optNoEl, (function() {
            return this.next('[role="button"]:contains(»)');
          }), function() {});
        });
        this.e(key('postContent{}MessageCollapseButton_c'), optNoEl, (function() {
          return this.next().children('[role="button"]');
        }), function() {
          return this.e(key('postContent{}MessageExpanded_c'), opt, (function() {
            return this.parent();
          }), function() {
            return this.e(key('postContent{}MessageExpandedText_c'), optNoEl, (function() {
              return this.children().first();
            }), function() {});
          });
        });
        return this.e(key('postContent{}Attachment_c'), opt, (function() {
          return this.next();
        }), function() {
          this.e(key('postContent{}AttachmentLinkFavIcon_c'), opt, (function() {
            return this.find('img[src*="favicons"]');
          }), function() {
            this.e(key('postContent{}AttachmentLinkHeading_c'), opt, (function() {
              return this.next();
            }), function() {
              this.e(key('postContent{}AttachmentLinkTitleA_c'), $.extend({
                allClassNames: true
              }, opt), (function() {
                return this.children('a');
              }));
              return this.e(key('postContent{}AttachmentLinkImage_c'), opt, (function() {
                return this.next('[data-content-url]');
              }), function() {
                return this.combo(key('postContent{}AttachmentLinkImageImg_c'), opt, key('%postContent{}AttachmentLinkImage_c > img'));
              });
            });
            return this.e(key('postContent{}AttachmentLink_c'), opt, (function() {
              return this.parent();
            }), function() {
              return this.e(key('postContent{}AttachmentLinkFloatClear_c'), opt, (function() {
                return this.children().last();
              }), function() {
                return this.e(key('postContent{}AttachmentLinkSnippet_c'), opt, (function() {
                  return this.prev(':not([data-content-url]):not(:has(a))');
                }));
              });
            });
          });
          this.e(key('postContent{}AttachmentPhotoWrapper_c'), opt, (function() {
            return this.find('> div > [data-content-url*="plus.google.com/photos"]');
          }), function() {
            this.combo(key('postContent{}AttachmentPhotoImg_c'), key('%postContent{}AttachmentPhotoWrapper_c > img'));
            return this.e(key('postContent{}AttachmentPhoto_c'), opt, (function() {
              return this.parent();
            }), function() {
              return this.e(key('postContent{}AttachmentPhotoFloatClear_c'), opt, (function() {
                return this.children().last();
              }));
            });
          });
          return this.e(key('postContent{}AttachmentVideoPreview_c'), opt, (function() {
            return this.find('> div > * > div[data-content-type*="shockwave"]');
          }), function() {
            this.combo(key('postContent{}AttachmentVideoPreviewImg_c'), key('%postContent{}AttachmentVideoPreview_c > img'));
            this.combo(key('postContent{}AttachmentVideoIframe_c'), key('%postContent{}AttachmentVideoPreview_c > iframe'));
            this.e(key('postContent{}AttachmentVideoPreviewOverlay_c'), opt, (function() {
              return this.children('div:last');
            }));
            this.e(key('postContent{}AttachmentVideoCaption_c'), opt, (function() {
              return this.next();
            }), function() {
              return this.combo(key('postContent{}AttachmentVideoSourceA_c'), key('%postContent{}AttachmentVideoCaption_c > a:first-child'));
            });
            return this.e(key('postContent{}AttachmentVideoWrapper_c'), opt, (function() {
              return this.parent();
            }), function() {
              this.e(key('postContent{}AttachmentVideoHeading_c'), opt, (function() {
                return this.prev();
              }), function() {
                return this.e(key('postContent{}AttachmentVideoTitleA_c'), $.extend({
                  allClassNames: true
                }, opt), (function() {
                  return this.children('a');
                }));
              });
              return this.e(key('postContent{}AttachmentVideo_c'), opt, (function() {
                return this.parent();
              }), function() {
                return this.e(key('postContent{}AttachmentVideoFloatClear_c'), opt, (function() {
                  return this.children().last();
                }));
              });
            });
          });
        });
      });
    };
  };
  this.ss({
    hangoutLiveIcon: {
      background: 'icon_live_active',
      width: '48px'
    }
  });
  this.ss({
    hangoutLiveInactiveIcon: {
      background: 'icon_live_active',
      width: '22px'
    }
  });
  this.ss({
    hangoutJoinButton: {
      backgroundColor: 'rgb(77, 144, 254)',
      borderColor: 'rgb(48, 121, 237)'
    }
  });
  this.ss({
    deferred: true
  }, {
    postIsMutedOrDeleted_d: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      '!*': ''
    }
  });
  this.ss({
    postCommentsButtonChevronWouldCollapse: SS_postCommentsButtonChevronWouldCollapse
  });
  fn_postHeadInfoMuted = function() {
    return this.ss({
      postHeadInfoMuted: {
        color: 'rgb(196, 43, 44)',
        '!fontSize': '',
        '!fontStyle': ''
      }
    });
  };
  this.call(fn_postHeadInfoMuted);
  fn_postContentSharedParent_ = function() {
    return this.ss({
      warnDuplicate: false
    }, {
      postContentSharedParent_: {
        borderLeft: '1px solid rgb(234, 234, 234)'
      }
    });
  };
  this.call(fn_postContentSharedParent_);
  this.e('post', {
    warnMany: false,
    alt: '[id^="update-"]',
    ssFilter: {
      postIsSelected: SS_postIsSelected,
      postIsNew: SS_postIsNew
    }
  }, (function() {
    return this.xpath('//*[starts-with(@id, "update-")]');
  }), function() {
    this.e('postPlaceholder', {
      warnNoElement: false
    }, (function() {
      return this.children(':empty');
    }));
    this.e('postMenu', {
      pri: '[role="menu"]',
      warnNoElement: false
    }, (function() {
      return this.find('[role="menu"]');
    }), function() {
      this.e('postMenuItemUnmute', {
        warnNoElement: false
      }, function() {
        var $menuItems, $post;
        this.call(fn_postHeadInfoMuted);
        $post = this.closest('[id^="update-"]');
        if ($post.find(this.mappedSelector.postHeadInfoMuted).length > 0 && (($menuItems = $post.find('[role="menu"]').children()).length === 2 || $menuItems.length === 3)) {
          return $menuItems[$menuItems.length - 1];
        } else {
          return null;
        }
      });
      return this.e('postMenuItemMute', function() {
        var $greatest, $menuItems, $post, classCount, greatest, greatestClassCount, menuItem, secondGreatestClassCount, _i, _len, _ref;
        this.call(fn_postHeadInfoMuted);
        $post = this.closest('[id^="update-"]');
        if ($post.find(this.mappedSelector.postHeadInfoMuted).length === 0) {
          $menuItems = $post.find('[role="menu"]').children();
          greatestClassCount = secondGreatestClassCount = -1;
          $greatest = null;
          for (_i = 0, _len = $menuItems.length; _i < _len; _i++) {
            menuItem = $menuItems[_i];
            classCount = menuItem.className.trim().split(/\s+/).length;
            if (classCount > greatestClassCount) {
              _ref = [greatestClassCount, classCount], secondGreatestClassCount = _ref[0], greatestClassCount = _ref[1];
              greatest = menuItem;
            } else if (classCount === greatestClassCount) {
              greatest = null;
            } else if (classCount < greatestClassCount && classCount > secondGreatestClassCount) {
              secondGreatestClassCount = classCount;
            }
          }
          if (secondGreatestClassCount > 0) {
            return greatest;
          } else {
            return null;
          }
        } else {
          return null;
        }
      });
    });
    return this.e('postUserHeading', (function() {
      return this.find('h3:first');
    }), function() {
      this.e('postUserHeadingName', (function() {
        return this.children();
      }));
      return this.e('postHead', (function() {
        return this.parent();
      }), function() {
        this.e('postMenuButton', (function() {
          return this.children('[role="button"]');
        }));
        this.e('postUserAvatarA_c', (function() {
          return this.children('a[oid]');
        }), function() {
          this.combo('postUserAvatarA', '%postHead > %postUserAvatarA_c');
          return this.e('postUserAvatarImg_c', (function() {
            return this.children('img');
          }), function() {
            return this.combo('postUserAvatarImg', '%postUserAvatarA > %postUserAvatarImg_c');
          });
        });
        this.e('postUserNameA_c', (function() {
          return this.find('div:eq(0) a[oid]');
        }), function() {
          return this.e('postUserName', (function() {
            return this.parent();
          }), function() {
            this.combo('postUserNameA', '%postUserName > postUserNameA_c');
            return this.e('postHeadInfo', (function() {
              return this.next();
            }), function() {
              this.e('postTime', (function() {
                return this.children('span:first');
              }), function() {
                this.e('postTimeA', {
                  allClassNames: true
                }, (function() {
                  return this.children('a');
                }));
                return this.e('postCategory', {
                  alt: this.mappedSelector.postTime + ' + :not([role="button"])',
                  warnNoElement: false
                }, (function() {
                  return this.next(':not([role="button"])');
                }));
              });
              return this.e('postPermissions', (function() {
                return this.children('[role="button"]');
              }));
            });
          });
        });
        this.e('postContainer', (function() {
          return this.parent();
        }));
        return this.e('postBody', (function() {
          return this.next();
        }), function() {
          this.e('postContent_c', (function() {
            return this.children(':first');
          }), genSlaves_postContentVariantEntry('Original'));
          this.e('postPlusOneButton', {
            alt: 'button[id][g\\:entity]'
          }, (function() {
            return this.find('button[id][g\\:entity]');
          }), function() {
            this.e('postActionBar', (function() {
              return this.parent();
            }), function() {
              return this.e('postStats', (function() {
                return this.next();
              }));
            });
            return this.e('postCommentLink', (function() {
              return this.next();
            }), function() {
              return this.e('postShareLink', (function() {
                return this.next();
              }));
            });
          });
          return this.e('postComments', (function() {
            return this.next();
          }), function() {
            this.e('postCommentsButtonTextCount', (function() {
              return this.find('[role="button"] + div > [role="button"]');
            }), function() {
              this.e('postCommentsButtonTextCountNumber', (function() {
                return this.children(':eq(0)');
              }));
              this.e('postCommentsButtonTextCountWord', (function() {
                return this.children(':eq(1)');
              }));
              return this.e('postCommentsButtonText', (function() {
                return this.parent();
              }), function() {
                this.e('postCommentsButtonTextNames', (function() {
                  return this.children(':eq(1)');
                }), function() {
                  return this.e('postCommentsButtonTextNamesText_c', (function() {
                    return this.children();
                  }), function() {
                    return this.combo('postCommentsButtonTextNamesText', '%postCommentsButtonTextNames > %postCommentsButtonTextNamesText_c');
                  });
                });
                return this.e('postCommentsButtonChevron_c', {
                  ssFilter: SS_postCommentsButtonChevronWouldCollapse
                }, (function() {
                  return this.prev();
                }), function() {
                  return this.e('postCommentsToggler', {
                    ssFilter: {
                      postCommentsTogglerIsGrayed: SS_postCommentsTogglerIsGrayed
                    }
                  }, (function() {
                    return this.parent();
                  }), function() {
                    this.combo('postCommentsButtonChevron', '%postCommentsToggler > %postCommentsButtonChevron_c');
                    return this.e('postCommentsList', (function() {
                      return this.next();
                    }), function() {
                      this.e('postCommentsOlderButton', (function() {
                        return this.children('[role="button"]:eq(0)');
                      }));
                      return this.e('postCommentsStream', (function() {
                        return this.children(':eq(1)');
                      }), function() {
                        return this.e('postComment', {
                          warnMany: false
                        }, (function() {
                          return this.children('[id]');
                        }), function() {
                          return this.e('postCommentUserAvatarImg_c', {
                            warnDuplicate: false
                          }, (function() {
                            return this.find('img[alt]');
                          }), function() {
                            return this.e('postCommentUserAvatarA_c', {
                              warnDuplicate: false
                            }, (function() {
                              return this.parent('a[oid]');
                            }), function() {
                              return this.e('postCommentContainer', (function() {
                                return this.parent();
                              }), function() {
                                this.combo('postCommentUserAvatarA', '%postCommentContainer > %postCommentUserAvatarA_c');
                                this.combo('postCommentUserAvatarImg', '%postCommentUserAvatarA > %postCommentUserAvatarImg_c');
                                this.combo('postCommentContent', '%postCommentContainer > div:nth-child(2)');
                                this.e('postCommentUserNameA_c', {
                                  warnDuplicate: false
                                }, (function() {
                                  return this.find('> div:nth-child(2) > a[href^="/"][oid]');
                                }), function() {
                                  this.combo('postCommentUserNameA', '%postCommentContainer > div:nth-child(2) > %postCommentUserNameA_c');
                                  return this.e('postCommentUserNameDelimiter', (function() {
                                    return this.next('span');
                                  }), function() {
                                    return this.e('postCommentContentText', (function() {
                                      return this.next('span');
                                    }), function() {});
                                  });
                                });
                                this.e('postCommentContentExpandButton', {
                                  warnNoElement: false
                                }, (function() {
                                  return this.children('[role="button"]:contains(»)');
                                }), function() {
                                  return this.e('postCommentContentExpandable', {
                                    warnNoElement: false,
                                    ssFilter: {
                                      postCommentContentExpandableIsCollapsed: SS_postCommentContentExpandableIsCollapsed
                                    }
                                  }, (function() {
                                    return this.prev();
                                  }), void 0, function() {
                                    return this.ss({
                                      postCommentContentExpandableIsCollapsed: SS_postCommentContentExpandableIsCollapsed
                                    });
                                  });
                                });
                                this.e('postCommentContentCollapseButton', {
                                  warnNoElement: false
                                }, (function() {
                                  return this.children('[role="button"]:not(:contains(»))');
                                }));
                                this.e('postCommentLeftBorder', {
                                  warnNoElement: false
                                }, (function() {
                                  return this.prev();
                                }));
                                return this.e('postCommentManagement', {
                                  warnNoElement: false
                                }, (function() {
                                  return this.next();
                                }));
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
            return this.e('postCommentsFooter', (function() {
              return this.next();
            }), function() {
              this.e('postCommentsFooterChevron_c', {
                warnDuplicate: false
              }, (function() {
                return this.children('span[role="button"]');
              }), function() {
                return this.combo('postCommentsFooterChevron', '%postCommentsFooter > %postCommentsFooterChevron_c');
              });
              return this.e('postCommentButton', (function() {
                return this.children('div[role="button"]');
              }));
            });
          });
        });
      });
    });
  }, function() {
    this.ss({
      postIsSelected: SS_postIsSelected
    });
    return this.ss({
      postIsNew: SS_postIsNew
    });
  });
};

}).call(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this, window, jQuery);

