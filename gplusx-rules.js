
/****************************************************************************
 * GPlusX mapping rules.
 * This section was compiled from CoffeeScript on Wed Aug 31 19:20:38 EST 2011.
 ****************************************************************************/


Gplusx.gplusxMapIdFunc = function() {
  var c;
  c = $(this.s.gbarParent).attr('class');
  if (c) {
    return c.replace(/\s*(?:gpr_gbar|SkipMeIAmAlradyFixPushed)/, '').replace(/^(\S+\s+\S+)\s.*/, '$1');
  }
};
Gplusx.gplusxMappingRulesForId = function() {
  var e;
  e = this.e;
  e('gbar', '#gb', function() {
    return e('gbarParent', (function() {
      return this.parent();
    }));
  });
};
Gplusx.gplusxMappingRules = function() {
  var POST_IS_NEW_COLOR, POST_IS_SELECTED_COLOR, X, debug, e, error, mapParentContext, s, ss;
  debug = this.debug;
  error = this.error;
  e = this.e;
  ss = this.ss;
  X = this.X;
  POST_IS_SELECTED_COLOR = 'rgb(77, 144, 240)';
  POST_IS_NEW_COLOR = 'rgb(167, 199, 247)';
  e('gbar', '#gb', function() {
    return e('gbarParent', {
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
      return e('gplusBar', {
        ssFilter: {
          gplusBarIsFixed: {
            position: 'fixed',
            top: /./,
            zIndex: /./
          }
        }
      }, (function() {
        return this.nextAll(':not(:empty)').first();
      }), function() {
        return e('gplusBarContent', (function() {
          return this.children();
        }), function() {
          return e('gplusBarNav', (function() {
            return this.find('[role="navigation"]');
          }), function() {
            return e('gplusBarNavStreamA', (function() {
              return this.children('a:first-child');
            }), function() {
              e('gplusBarNavStreamIcon_c', (function() {
                return this.children();
              }));
              return e('gplusBarNavPhotosA', (function() {
                return this.next();
              }), function() {
                e('gplusBarNavPhotosIcon_c', (function() {
                  return this.children();
                }));
                return e('gplusBarNavProfileA', (function() {
                  return this.next();
                }), function() {
                  e('gplusBarNavProfileIcon_c', (function() {
                    return this.children();
                  }));
                  return e('gplusBarNavCirclesA', (function() {
                    return this.next();
                  }), function() {
                    e('gplusBarNavCirclesIcon_c', (function() {
                      return this.children();
                    }));
                    return e('gplusBarNavGamesA', (function() {
                      return this.next();
                    }), function() {
                      return e('gplusBarNavGamesIcon_c', (function() {
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
  e('gbarTop', '#gbw');
  e('gbarLinks', '#gbz', function() {
    return e('gbarList_c', (function() {
      return this.children('ol');
    }), function() {
      return e('gbarListItem_c', (function() {
        return this.children('li').first();
      }));
    });
  });
  e('gbarLinksMoreUnit', '#gbztms');
  e('gbarLinksMoreUnitText', '#gbztms1');
  e('gbarMorePullDown', '#gbd');
  e('gbarTools', '#gbg');
  e('gbarToolsProfileNameA', '#gbg6');
  e('gbarToolsProfileNameText', '#gbi4t');
  e('gbarToolsNotificationA', '#gbg1');
  e('gbarToolsNotificationUnit', '#gbgs1');
  e('gbarToolsNotificationUnitBg', '#gbi1a', function() {
    return ss({
      gbarToolsNotificationUnitBgZero: {
        backgroundPosition: '-26px'
      }
    });
  });
  e('gbarToolsNotificationUnitFg', '#gbi1', function() {
    return ss({
      gbarToolsNotificationUnitFgZero: {
        color: 'rgb(153, 153, 153)'
      }
    });
  });
  e('gbarToolsShareA', '#gbg3');
  e('gbarToolsShareUnit', '#gbgs3');
  e('gbarToolsShareUnitText', '#gbi3');
  e('gbarToolsProfilePhotoA', '#gbg4');
  e('gbarToolsProfilePullDown', '#gbd4');
  e('gbarToolsProfileCard', '#gbmpdv', function() {
    return e('gbarToolsProfileCardContent_c', (function() {
      return this.children('div').first();
    }), function() {
      return e('gbarToolsProfileCardContentList_c', (function() {
        return this.children('ol');
      }), function() {
        return e('gbarToolsProfileCardContentListItem_c', (function() {
          return this.children('li');
        }));
      });
    });
  });
  e('gbarToolsProfileName', '#gbmpn', function() {
    return e('gbarToolsProfileEmail_c', (function() {
      return this.next();
    }));
  });
  e('gbarToolsProfileSwitch', '#gbmps');
  e('gbarToolsGear', '#gbg5');
  e('gbarToolsGearPullDown', '#gbd5');
  e('searchBox', '#search-box');
  e('searchBoxInput', '#ozIdSearchBox');
  e('content', '#content', function() {
    return e('copyrightRow', (function() {
      return this.next();
    }));
  });
  e('contentPane', '#contentPane');
  e('feedbackLink', 'body > [href*="learnmore"]');
  e('postsStream', (function() {
    return $('[id^="update-"]').first().parent();
  }), function() {
    e('postsStreamParent', (function() {
      return this.parent();
    }), function() {
      return e('postsStreamContentPane', (function() {
        return this.parent();
      }), function() {
        e('postStreamContentPaneHeading', (function() {
          return this.children(':eq(0)');
        }), function() {
          return e('postStreamContentPaneHeadingText', (function() {
            return this.children('span');
          }));
        });
        return e('shareRow', (function() {
          return this.children(':eq(1)');
        }), function() {
          return e('shareBox', (function() {
            return this.children().first();
          }), function() {
            e('shareIconsPhoto', (function() {
              return this.find('[title]:eq(0)');
            }), function() {});
            e('shareIconsVideo', (function() {
              return this.find('[title]:eq(1)');
            }));
            return e('shareIconsLink', (function() {
              return this.find('[title]:eq(2)');
            }), function() {
              e('shareIconsLocation', (function() {
                return this.next();
              }));
              return e('shareIcons', (function() {
                return this.parent();
              }), function() {
                return e('shareWhatsNewText', (function() {
                  return this.next();
                }), function() {
                  return e('shareOpeningText', (function() {
                    return this.next();
                  }));
                });
              });
            });
          });
        });
      });
    });
    return e('postsStreamMoreRow', (function() {
      return this.next();
    }), function() {
      return e('postsStreamMoreButton', (function() {
        return this.find('[role="button"]');
      }), function() {
        return e('postsStreamMoreLoadingUnit', (function() {
          return this.next();
        }), function() {
          return e('postsStreamMoreLoadingText', (function() {
            return this.children();
          }));
        });
      });
    });
  });
  e('post', {
    alt: '[id^="update-"]',
    ssFilter: {
      postIsSelected: {
        borderLeftColor: POST_IS_SELECTED_COLOR
      },
      postIsNew: {
        borderLeftColor: POST_IS_NEW_COLOR
      }
    }
  }, (function() {
    return $('[id^="update-"]');
  }), function() {
    e('postPlaceholder_c', (function() {
      return this.children(':empty');
    }));
    e('postMenu_c', {
      pri: '[role="menu"]'
    }, (function() {
      return this.children('[role="menu"]');
    }));
    return e('postUserHeading_c', (function() {
      return this.find('h3:first');
    }), function() {
      e('postUserHeadingName_c', (function() {
        return this.children();
      }));
      return e('postHead_c', (function() {
        return this.parent();
      }), function() {
        e('postMenuButton_c', (function() {
          return this.children('[role="button"]');
        }));
        e('postUserAvatarA_cc', (function() {
          return this.children('a[href^="/"][oid]');
        }), function() {
          return e('postUserAvatarImg_cc', (function() {
            return this.children('img');
          }));
        });
        e('postUserNameA_c', (function() {
          return this.find('div:eq(0) a[href^="/"][oid]');
        }), function() {
          return e('postUserName_c', (function() {
            return this.parent();
          }), function() {
            return e('postHeadInfo_c', (function() {
              return this.next();
            }), function() {
              e('postTime_c', (function() {
                return this.children('span:first');
              }), function() {
                e('postTimeA_c', (function() {
                  return this.children('a');
                }));
                return e('postCategoryA_c', (function() {
                  return this.next().children('a');
                }), function() {
                  return e('postCategory_c', (function() {
                    return this.parent();
                  }), function() {});
                });
              });
              return e('postPermissions_c', (function() {
                return this.children('[role="button"]');
              }));
            });
          });
        });
        e('postContainer_c', (function() {
          return this.parent();
        }));
        return e('postBody_c', (function() {
          return this.next();
        }), function() {
          e('postContent_c', (function() {
            return this.children(':first');
          }), function() {
            return e('postContentExpandButton_c', (function() {
              return this.find('[role="button"]:contains(»)');
            }));
          });
          e('postPlusOneButton_c', {
            alt: 'button[id][g\\:entity]'
          }, (function() {
            return this.find('button[id][g\\:entity]');
          }), function() {
            e('postActionBar_c', (function() {
              return this.parent();
            }), function() {
              return e('postStats_c', (function() {
                return this.next();
              }));
            });
            return e('postCommentLink_c', (function() {
              return this.next();
            }), function() {
              return e('postShareLink_c', (function() {
                return this.next();
              }));
            });
          });
          return e('postComments_c', (function() {
            return this.next();
          }), function() {
            e('postCommentsToggler_c', (function() {
              return this.children(':eq(0)');
            }), function() {
              return e('postCommentsButtonChevron_c', (function() {
                return this.children('[role="button"]:eq(0)');
              }), function() {
                return e('postCommentsButtonText_c', (function() {
                  return this.next();
                }), function() {
                  e('postCommentsButtonTextLink_c', (function() {
                    return this.children('[role="button"]');
                  }), function() {
                    e('postCommentsButtonTextLinkCount_c', (function() {
                      return this.children(':eq(0)');
                    }));
                    return e('postCommentsButtonTextLinkWord_c', (function() {
                      return this.children(':eq(1)');
                    }));
                  });
                  return e('postCommentsButtonTextFromNames_c', (function() {
                    return this.children(':eq(1)');
                  }), function() {
                    return e('postCommentsButtonTextFromNamesText_c', (function() {
                      return this.children();
                    }));
                  });
                });
              });
            });
            e('postCommentsList_c', (function() {
              return this.children(':eq(1)');
            }), function() {
              e('postCommentsOlderButton_c', (function() {
                return this.children('[role="button"]:eq(0)');
              }));
              return e('postCommentsStream_c', (function() {
                return this.children(':eq(1)');
              }));
            });
            e('postCommentsFooter_c', (function() {
              return this.next();
            }), function() {
              e('postCommentFooterChevron_c', (function() {
                return this.children('span[role="button"]');
              }));
              return e('postCommentButton_c', (function() {
                return this.children('div[role="button"]');
              }));
            });
            return e('postCommentAddRow_c', (function() {
              return this.next();
            }), function() {
              return e('postCommentAddButton_c', (function() {
                return this.children('div[role="button"]');
              }));
            });
          });
        });
      });
    });
  }, function() {
    ss({
      postIsSelected: {
        borderLeftColor: POST_IS_SELECTED_COLOR
      }
    });
    return ss({
      postIsNew: {
        borderLeftColor: POST_IS_NEW_COLOR
      }
    });
  });
  ss({
    gbarParentIsFixed: {
      position: 'fixed',
      top: '0',
      width: '100%'
    }
  });
  ss({
    gplusBarIsFixed: {
      position: 'fixed',
      top: /./,
      zIndex: /./
    }
  });
  ss({
    postHeadInfoMuted: {
      color: 'rgb(196, 43, 44)'
    }
  });
  ss({
    hangoutLiveIcon: {
      background: 'icon_live_active'
    }
  });
  s = this.s;
  mapParentContext = function(target, parent, child) {
    if (s[parent] && s[child]) {
      return s[target] = s[parent] + ' > ' + s[child];
    }
  };
  mapParentContext('postUserAvatarA_c', 'postHead_c', 'postUserAvatarA_cc');
  mapParentContext('postUserAvatarImg_c', 'postUserAvatarA_c', 'postUserAvatarImg_cc');
  mapParentContext('gbarToolsProfileEmail', 'gbarToolsProfileName', 'gbarToolsProfileEmail_c');
  mapParentContext('gbarLinksList', 'gbarLinks', 'gbarList_c');
  mapParentContext('gbarLinksListItem', 'gbarLinksList', 'gbarListItem_c');
  mapParentContext('gbarToolsList', 'gbarTools', 'gbarList_c');
  mapParentContext('gbarToolsListItem', 'gbarToolsList', 'gbarListItem_c');
};
