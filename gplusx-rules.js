
/****************************************************************************
 * GPlusX mapping rules.
 * This section was compiled from CoffeeScript on Mon Aug 22 23:24:57 EST 2011.
 ****************************************************************************/


var gplusxMapIdFunc, gplusxMappingRules, gplusxMappingRulesForId;
gplusxMapIdFunc = function() {
  if (this.s.gbarParent != null) {
    return this.s.gbarParent;
  } else {
    return null;
  }
};
gplusxMappingRulesForId = function() {
  ed('gbar', '#gb', function() {
    return e('gbarParent', this(function() {
      return this.parent();
    }), function() {
      return e('gplusBarBg', this(function() {
        return this.next();
      }), function() {
        return e('gplusBar', this(function() {
          return this.children();
        }));
      });
    });
  });
};
gplusxMappingRules = function() {
  var debug, e, ea, ed, ep, error;
  debug = this.debug;
  error = this.error;
  e = this.e;
  ea = this.ea;
  ep = this.ep;
  ed = this.ed;
  ed('gbar', '#gb', function() {
    return e('gbarParent', this(function() {
      return this.parent();
    }), function() {
      return e('gplusBarBg', this(function() {
        return this.next();
      }), function() {
        return e('gplusBar', this(function() {
          return this.children();
        }), function() {
          return e('gplusBarNav', this(function() {
            return this.find('[role="navigation"]');
          }), function() {
            return e('gplusBarNavStreamA', this(function() {
              return this.children('a:first-child');
            }), function() {
              e('gplusBarNavStreamIcon_c', this(function() {
                return this.children();
              }));
              return e('gplusBarNavPhotosA', this(function() {
                return this.next();
              }), function() {
                e('gplusBarNavPhotosIcon_c', this(function() {
                  return this.children();
                }));
                return e('gplusBarNavProfileA', this(function() {
                  return this.next();
                }), function() {
                  e('gplusBarNavProfileIcon_c', this(function() {
                    return this.children();
                  }));
                  return e('gplusBarNavCirclesA', this(function() {
                    return this.next();
                  }), function() {
                    return e('gplusBarNavCirclesIcon_c', this(function() {
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
  ed('gbarTop', '#gbw');
  ed('gbarLinks', '#gbz', function() {
    return e('gbarList_c', this(function() {
      return this.children('ol');
    }), function() {
      return e('gbarListItem_c', this(function() {
        return this.children('li');
      }));
    });
  });
  ed('gbarLinksMoreUnit', '#gbztms');
  ed('gbarLinksMoreUnitText', '#gbztms1');
  ed('gbarMorePullDown', '#gbd');
  ed('gbarTools', '#gbg');
  ed('gbarToolsProfileNameA', '#gbg6');
  ed('gbarToolsProfileNameText', '#gbi4t');
  ed('gbarToolsNotificationA', '#gbg1');
  ed('gbarToolsNotificationUnit', '#gbgs1');
  ed('gbarToolsNotificationUnitBg', '#gbi1a');
  ed('gbarToolsNotificationUnitFg', '#gbi1');
  ed('gbarToolsShareA', '#gbg3');
  ed('gbarToolsShareUnit', '#gbgs3');
  ed('gbarToolsShareUnitText', '#gbi3');
  ed('gbarToolsProfilePhotoA', '#gbg4');
  ed('gbarToolsProfilePullDown', '#gbd4');
  ed('gbarToolsProfileCard', '#gbmpdv', function() {
    return e('gbarToolsProfileCardContent_c', this(function() {
      return this.children('div').first();
    }), function() {
      return e('gbarToolsProfileCardContentList_c', this(function() {
        return this.children('ol');
      }), function() {
        return e('gbarToolsProfileCardContentListItem_c', this(function() {
          return this.children('li');
        }));
      });
    });
  });
  ed('gbarToolsProfileName', '#gbmpn', function() {
    return e('gbarToolsProfileEmail_c', this(function() {
      return this.next();
    }));
  });
  ed('gbarToolsProfileSwitch', '#gbmps');
  ed('gbarToolsGear', '#gbg5');
  ed('gbarToolsGearPullDown', '#gbd5');
  ed('searchBox', '#search-box');
  ed('searchBoxInput', '#ozIdSearchBox');
  ed('content', '#content');
  ed('contentPane', '#contentPane');
  e('postsStream', this(function() {
    return $('[id^="update-"]').first().parent();
  }));
  ea('post', this(function() {
    return $('[id^="update-"]');
  }), '[id^="update-"]', function() {
    e('postPlaceholder_c', this(function() {
      return this.children(':empty');
    }));
    e('postMenu_c', this(function() {
      return this.children('[role="menu"]');
    }));
    return e('postUserHeading_c', this(function() {
      return this.find('h3:first');
    }), function() {
      e('postUserHeadingName_c', this(function() {
        return this.children();
      }));
      return e('postHead_c', this(function() {
        return this.parent();
      }), function() {
        e('postMenuButton_c', this(function() {
          return this.children('[role="button"]');
        }));
        e('postUserAvatarA_c', this(function() {
          return this.children('a[href^="/"][oid]');
        }), function() {
          return e('postUserAvatarImg_c', this(function() {
            return this.children('img');
          }));
        });
        e('postUserNameA_c', this(function() {
          return this.find('a[href^="/"][oid]');
        }), function() {
          return e('postUserName_c', this(function() {
            return this.parent();
          }), function() {
            return e('postHeadInfo_c', this(function() {
              return this.next();
            }), function() {
              e('postTime_c', this(function() {
                return this.children('span:first');
              }), function() {
                return e('postTimeA_c', this(function() {
                  return this.children('a');
                }));
              });
              return e('postPermissions_c', this(function() {
                return this.children('[role="button"]');
              }));
            });
          });
        });
        e('postContainer_c', this(function() {
          return this.parent();
        }));
        return e('postBody_c', this(function() {
          return this.next();
        }), function() {
          e('postContent_c', this(function() {
            return this.children(':first');
          }), function() {});
          ea('postPlusOneButton_c', this(function() {
            return this.find('button[id][g\\:entity]');
          }), 'button[id][g\\:entity]', function() {
            e('postTools_c', this(function() {
              return this.parent();
            }), function() {
              return e('postStats_c', this(function() {
                return this.next();
              }));
            });
            return e('postCommentLink_c', this(function() {
              return this.next();
            }), function() {
              return e('postShareLink_c', this(function() {
                return this.next();
              }));
            });
          });
          return e('postComments_c', this(function() {
            return this.next();
          }), function() {
            e('postCommentsToggler_c', this(function() {
              return this.children(':eq(0)');
            }), function() {
              e('postCommentsButtonChevron_c', this(function() {
                return this.children('[role="button"]:eq(0)');
              }));
              return e('postCommentsButtonText_c', this(function() {
                return this.children('[role="button"]:eq(1)');
              }), function() {
                e('postCommentsButtonTextCount_c', this(function() {
                  return this.children(':eq(0)');
                }));
                return e('postCommentsButtonTextWord_c', this(function() {
                  return this.children(':eq(1)');
                }));
              });
            });
            e('postCommentsList_c', this(function() {
              return this.children(':eq(1)');
            }), function() {
              e('postCommentsOlderButton_c', this(function() {
                return this.children('[role="button"]:eq(0)');
              }));
              return e('postCommentsStream_c', this(function() {
                return this.children(':eq(1)');
              }));
            });
            return e('postCommentsFooter_c', this(function() {
              return this.next();
            }), function() {
              e('postCommentFooterChevron_c', this(function() {
                return this.children('span[role="button"]');
              }));
              return e('postCommentButton_c', this(function() {
                return this.children('div[role="button"]');
              }));
            });
          });
        });
      });
    });
  });
  this.s.gbarToolsProfileEmail = this.s.gbarToolsProfileName + ' > ' + this.s.gbarToolsProfileEmail_c;
  this.s.gbarLinksList = this.s.gbarLinks + ' > ' + this.s.gbarList_c;
  this.s.gbarLinksListItem = this.s.gbarLinksList + ' > ' + this.s.gbarListItem_c;
  this.s.gbarToolsList = this.s.gbarTools + ' > ' + this.s.gbarList_c;
  this.s.gbarToolsListItem = this.s.gbarToolsList + ' > ' + this.s.gbarListItem_c;
};
