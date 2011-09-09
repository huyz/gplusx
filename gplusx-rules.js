
/****************************************************************************
 * GPlusX mapping rules.
 * This section was compiled from CoffeeScript on Fri Sep  9 04:05:39 EST 2011.
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
  var POST_IS_NEW_COLOR, POST_IS_SELECTED_COLOR;
  POST_IS_SELECTED_COLOR = 'rgb(77, 144, 240)';
  POST_IS_NEW_COLOR = 'rgb(167, 199, 247)';
  this.e('gbar', '#gb', function() {
    return this.e('gbarParent', {
      ssFilter: {
        gbarParentIsFixed: {
          position: 'fixed',
          top: '0',
          width: '100%'
        }
      }
    }, (function() {
      return this.parent();
    }), function() {
      return this.e('gplusBar', {
        ssFilter: {
          gplusBarIsFixed: {
            position: 'fixed',
            top: '',
            zIndex: ''
          }
        }
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
              this.e('gplusBarNavStreamIcon_c', (function() {
                return this.children();
              }));
              return this.e('gplusBarNavPhotosA', (function() {
                return this.next();
              }), function() {
                this.e('gplusBarNavPhotosIcon_c', (function() {
                  return this.children();
                }));
                return this.e('gplusBarNavProfileA', (function() {
                  return this.next();
                }), function() {
                  this.e('gplusBarNavProfileIcon_c', (function() {
                    return this.children();
                  }));
                  return this.e('gplusBarNavCirclesA', (function() {
                    return this.next();
                  }), function() {
                    this.e('gplusBarNavCirclesIcon_c', (function() {
                      return this.children();
                    }));
                    return this.e('gplusBarNavGamesA', (function() {
                      return this.next();
                    }), function() {
                      return this.e('gplusBarNavGamesIcon_c', (function() {
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
    return this.e('gbarList_c', (function() {
      return this.children('ol');
    }), function() {
      this.combo('gbarLinksList', '%gbarLinks > %gbarList_c');
      return this.e('gbarListItem_c', (function() {
        return this.children('li').first();
      }), function() {
        return this.combo('gbarLinksListItem', '%gbarLinksList > %gbarListItem_c');
      });
    });
  });
  this.e('gbarLinksMoreUnit', '#gbztms');
  this.e('gbarLinksMoreUnitText', '#gbztms1');
  this.e('gbarMorePullDown', '#gbd');
  this.e('gbarTools', '#gbg', function() {
    return this.e('gbarList_c', (function() {
      return this.children('ol');
    }), function() {
      this.combo('gbarToolsList', '%gbarTools > gbarList_c');
      return this.e('gbarListItem_c', (function() {
        return this.children('li').first();
      }), function() {
        return this.combo('gbarToolsListItem', '%gbarToolsList > %gbarListItem_c');
      });
    });
  });
  this.e('gbarToolsProfileNameA', '#gbg6');
  this.e('gbarToolsProfileNameText', '#gbi4t');
  this.e('gbarToolsNotificationA', '#gbg1');
  this.e('gbarToolsNotificationUnit', '#gbgs1');
  this.e('gbarToolsNotificationUnitBg', '#gbi1a', function() {
    return this.ss({
      gbarToolsNotificationUnitBgZero: {
        backgroundPosition: '-26px'
      }
    });
  });
  this.e('gbarToolsNotificationUnitFg', '#gbi1', function() {
    return this.ss({
      gbarToolsNotificationUnitFgZero: {
        color: 'rgb(153, 153, 153)'
      }
    });
  });
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
          many: true
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
  this.e('searchBox', '#search-box');
  this.e('searchBoxInput', '#ozIdSearchBox');
  this.ss({
    gbarParentIsFixed: {
      position: 'fixed',
      top: '0',
      width: '100%'
    }
  });
  this.ss({
    gplusBarIsFixed: {
      position: 'fixed',
      top: '',
      zIndex: ''
    }
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
  this.e('notification', (function() {
    return $('#contentPane > div > div > div > [data-nid]');
  }), void 0, function() {
    return this.e('notificationsStream', (function() {
      return this.first().parent();
    }));
  });
  this.e('sparksFeaturedInterestsA', {
    many: true
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
          }));
        });
      });
    });
  });
  this.e('sparkBody', {
    main: true
  }, (function() {
    return $('input[type="text"] + [role="button"]').parent().next().find('> div > div > [id^="update-"]:first').parent().parent().parent();
  }), function() {
    return this.e('streamParent', (function() {
      return this.find('> div > div > [id^="update-"]:first').parent().parent();
    }), function() {
      this.combo('sparkStreamParent', '%sparkBody > %streamParent');
      return this.e('stream', (function() {
        return this.children('div:first');
      }), function() {
        return this.combo('sparkStream', '%sparkStreamParent > %stream');
      });
    });
  });
  this.e('stream', function() {
    return $('#contentPane > *').not($('a[href="games"]').closest('#contentPane > *')).not($('input[type="text"] + [role="button"]').closest('#contentPane > *')).find('[id^="update-"]:first').parent();
  }, function() {
    this.combo('circleStream', '%stream:not(%sparkStream)');
    this.e('streamParent', (function() {
      return this.parent();
    }), function() {
      this.combo('circleStreamParent', '%streamParent:not(%sparkStreamParent)');
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
            debug('shareIconNonHoverable', 'hoverableClassName=' + hoverableClassName);
            return this.ss({
              makeChildShareIconNonHoverable: {
                background: 'url',
                cursor: 'default'
              }
            }, function(_) {
              var isStyled;
              isStyled = this.isStyled;
              return hoverableClassName && '' + _.split(/,\s*/).map(function(s) {
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
  this.e('post', {
    many: true,
    alt: '[id^="update-"]',
    ssFilter: {
      postIsSelected_c: {
        borderLeftColor: POST_IS_SELECTED_COLOR
      },
      postIsNew_c: {
        borderLeftColor: POST_IS_NEW_COLOR
      }
    }
  }, (function() {
    return this.xpath('//*[starts-with(@id, "update-")]');
  }), function() {
    this.e('postPlaceholder_c', {
      deferred: true
    }, (function() {
      return this.children(':empty');
    }));
    this.e('postMenu_c', {
      pri: '[role="menu"]'
    }, (function() {
      return this.children('[role="menu"]');
    }));
    return this.e('postUserHeading_c', (function() {
      return this.find('h3:first');
    }), function() {
      this.e('postUserHeadingName_c', (function() {
        return this.children();
      }));
      return this.e('postHead_c', (function() {
        return this.parent();
      }), function() {
        this.e('postMenuButton_c', (function() {
          return this.children('[role="button"]');
        }));
        this.e('postUserAvatarA_cc', (function() {
          return this.children('a[href^="/"][oid]');
        }), function() {
          this.combo('postUserAvatarA_c', '%postHead_c > %postUserAvatarA_cc');
          return this.e('postUserAvatarImg_cc', (function() {
            return this.children('img');
          }), function() {
            return this.combo('postUserAvatarImg_c', '%postUserAvatarA_c > %postUserAvatarImg_cc');
          });
        });
        this.e('postUserNameA_c', (function() {
          return this.find('div:eq(0) a[href^="/"][oid]');
        }), function() {
          return this.e('postUserName_c', (function() {
            return this.parent();
          }), function() {
            return this.e('postHeadInfo_c', (function() {
              return this.next();
            }), function() {
              this.e('postTime_c', (function() {
                return this.children('span:first');
              }), function() {
                this.e('postTimeA_c', (function() {
                  return this.children('a');
                }));
                return this.e('postCategory_c', {
                  alt: this.s.postTime_c + ' + :not([role="button"])',
                  deferred: true
                }, (function() {
                  return this.next(':not([role="button"])');
                }));
              });
              return this.e('postPermissions_c', (function() {
                return this.children('[role="button"]');
              }));
            });
          });
        });
        this.e('postContainer_c', (function() {
          return this.parent();
        }));
        return this.e('postBody_c', (function() {
          return this.next();
        }), function() {
          this.e('postContent_c', (function() {
            return this.children(':first');
          }), function() {
            return this.e('postContentExpandButton_c', {
              deferred: true
            }, (function() {
              return this.find('[role="button"]:contains(»)');
            }));
          });
          this.e('postPlusOneButton_c', {
            alt: 'button[id][g\\:entity]'
          }, (function() {
            return this.find('button[id][g\\:entity]');
          }), function() {
            this.e('postActionBar_c', (function() {
              return this.parent();
            }), function() {
              return this.e('postStats_c', (function() {
                return this.next();
              }));
            });
            return this.e('postCommentLink_c', (function() {
              return this.next();
            }), function() {
              return this.e('postShareLink_c', (function() {
                return this.next();
              }));
            });
          });
          return this.e('postComments_c', (function() {
            return this.next();
          }), function() {
            this.e('postCommentsToggler_c', (function() {
              return this.children(':eq(0)');
            }), function() {
              return this.e('postCommentsButtonChevron_c', (function() {
                return this.children('[role="button"]:eq(0)');
              }), function() {
                return this.e('postCommentsButtonText_c', (function() {
                  return this.next();
                }), function() {
                  this.e('postCommentsButtonTextLink_c', (function() {
                    return this.children('[role="button"]');
                  }), function() {
                    this.e('postCommentsButtonTextLinkCount_c', (function() {
                      return this.children(':eq(0)');
                    }));
                    return this.e('postCommentsButtonTextLinkWord_c', (function() {
                      return this.children(':eq(1)');
                    }));
                  });
                  return this.e('postCommentsButtonTextFromNames_c', {
                    deferred: true
                  }, (function() {
                    return this.children(':eq(1)');
                  }), function() {
                    return this.e('postCommentsButtonTextFromNamesText_c', (function() {
                      return this.children();
                    }));
                  });
                });
              });
            });
            this.e('postCommentsList_c', (function() {
              return this.children(':eq(1)');
            }), function() {
              this.e('postCommentsOlderButton_c', (function() {
                return this.children('[role="button"]:eq(0)');
              }));
              return this.e('postCommentsStream_c', (function() {
                return this.children(':eq(1)');
              }));
            });
            this.e('postCommentsFooter_c', (function() {
              return this.next();
            }), function() {
              this.e('postCommentFooterChevron_c', (function() {
                return this.children('span[role="button"]');
              }));
              return this.e('postCommentButton_c', (function() {
                return this.children('div[role="button"]');
              }));
            });
            return this.e('postCommentAddRow_c', (function() {
              return this.next();
            }), function() {
              return this.e('postCommentAddButton_c', (function() {
                return this.children('div[role="button"]');
              }));
            });
          });
        });
      });
    });
  }, function() {
    this.ss({
      postIsSelected_c: {
        borderLeftColor: POST_IS_SELECTED_COLOR
      }
    });
    return this.ss({
      postIsNew_c: {
        borderLeftColor: POST_IS_NEW_COLOR
      }
    });
  });
  this.ss({
    postHeadInfoMuted_c: {
      color: 'rgb(196, 43, 44)',
      '!fontSize': '',
      '!fontStyle': ''
    }
  });
  this.ss({
    hangoutLiveIcon: {
      background: 'icon_live_active'
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
    postIsMutedOrDeleted_dc: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      '!*': ''
    }
  });
};
