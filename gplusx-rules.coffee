# ***************************************************************************
# Gplusx - Google+ Extension SDK
#
# This file contains all the rules for extracting selectors and classnames for all
# parts of the Google+ page.
# ***************************************************************************

# Returns a unique ID for this set of mapping;
# null, if there aren't enough mappings to generate an ID.
Gplusx.gplusxMapIdFunc = ->
  # Check if we're at the login page, where the ID would be different
  if /\/up\/start\//.test window.location.href
    return null

  # Grab the class name from gbarParent.
  # Notes:
  # - We don't take the selector directly because the selector is extracted with an ssFilter
  #   which may stop working if Google+ changes its stylesheets.
  # - We want the class names in a consistent order; we choose whatever Google+ has.
  # - Sometimes that element has 2 classNames, sometimes 3.  The 3rd one is for
  #   for fixing the gbar.  Maybe some users still don't have it rolled out.
  #   We don't need it anyway.
  # - Some extensions add crap to the end of that className.
  # - The settings page has no gplusbar, so can't use that.
  c = $(@s.gbarParent).attr('class')
  c.replace(/\s*(?:gpr_gbar|SkipMeIAmAlradyFixPushed|undefined)\s*$/, '').replace(/^(\S+\s+\S+)\s.*/, '$1') if c

# Executes just the rules sufficient for generating an ID
Gplusx.gplusxMappingRulesForId = ->
  @e 'gbar', '#gb', ->
    # Demo: DOM elements work just as well as jQuery
    @e 'gbarParent', (-> @el.parentNode)
  return

# Executes rules to extract selectors and CSS class names
#
# This method of generating class names is based on heuristics,
# primarily targeting the case when only class names change.
# If the actual DOM structure changes, much of this won't work
# and this library will need to be updated.
Gplusx.gplusxMappingRules = ->
  #
  # Constants
  # NOTE: it's ok to have constants that the rule closures can pick up.  But variables will not work
  # because functions can be called in a scope different from what you'd expect.
  #

  POST_IS_SELECTED_COLOR = 'rgb(77, 144, 240)';
  POST_IS_NEW_COLOR      = 'rgb(167, 199, 247)';

  #
  # Gbar
  #

  @e 'gbar', '#gb', ->
    @e 'gbarParent', {
      ssFilter:
        gbarParentIsFixed: {position: 'fixed', top: '0', width: '100%'} # FIXME: need to handled media queries
    }, (-> @parent()), ->

      #
      # WebXBar
      #

      # FIXME: there's a different kind of bar in the Settings page
      # gplusBarBg: 2011-08-28 There seems to be an empty div between gbarParent and gplusBarParent now
      @e 'gplusBar', {
        ssFilter:
          gplusBarIsFixed: {position: 'fixed', top: '', zIndex: ''} # FIXME: need to handled media queries
      }, (-> @nextAll(':not(:empty)').first()), ->
        @e 'gplusBarContent', (-> @children()), ->
          @e 'gplusBarNav', (-> @find('[role="navigation"]')), ->
            @e 'gplusBarNavStreamA', (-> @children('a:first-child')), ->
              @e 'gplusBarNavStreamIcon_c', (-> @children())
              @e 'gplusBarNavPhotosA', (-> @next()), ->
                @e 'gplusBarNavPhotosIcon_c', (-> @children())
                @e 'gplusBarNavProfileA', (-> @next()), ->
                  @e 'gplusBarNavProfileIcon_c', (-> @children())
                  @e 'gplusBarNavCirclesA', (-> @next()), ->
                    @e 'gplusBarNavCirclesIcon_c', (-> @children())
                    @e 'gplusBarNavGamesA', (-> @next()), ->
                      @e 'gplusBarNavGamesIcon_c', (-> @children())

  @e 'gbarTop', '#gbw'

  @e 'gbarLinks', '#gbz', ->
    @e 'gbarList_c', (-> @children('ol')), -> # This is the same as for gbarTools, so requires context
      @combo 'gbarLinksList', '%gbarLinks > %gbarList_c'
      @e 'gbarListItem_c', (-> @children('li').first()), -> # This is the same as for gbarTools, so requires context
        @combo 'gbarLinksListItem', '%gbarLinksList > %gbarListItem_c'

  @e 'gbarLinksMoreUnit', '#gbztms'
  @e 'gbarLinksMoreUnitText', '#gbztms1'
  @e 'gbarMorePullDown', '#gbd'
  @e 'gbarTools', '#gbg', ->
    @e 'gbarList_c', (-> @children('ol')), -> # This is the same as for gbarLinks, so requires context
      @combo 'gbarToolsList', '%gbarTools > gbarList_c'
      @e 'gbarListItem_c', (-> @children('li').first()), -> # This is the same as for gbarLinks, so requires context
        @combo 'gbarToolsListItem', '%gbarToolsList > %gbarListItem_c'
  @e 'gbarToolsProfileNameA', '#gbg6'
  @e 'gbarToolsProfileNameText', '#gbi4t'
  @e 'gbarToolsNotificationA', '#gbg1'
  @e 'gbarToolsNotificationUnit', '#gbgs1'
  @e 'gbarToolsNotificationUnitBg', '#gbi1a', ->
    @ss gbarToolsNotificationUnitBgZero: {backgroundPosition: '-26px'}
  @e 'gbarToolsNotificationUnitFg', '#gbi1', ->
    @ss gbarToolsNotificationUnitFgZero: {color: 'rgb(153, 153, 153)'}
  @e 'gbarToolsShareA', '#gbg3'
  @e 'gbarToolsShareUnit', '#gbgs3'
  @e 'gbarToolsShareUnitText', '#gbi3'
  @e 'gbarToolsProfilePhotoA', '#gbg4'
  @e 'gbarToolsProfilePullDown', '#gbd4'
  @e 'gbarToolsProfileCard', '#gbmpdv', ->
    @e 'gbarToolsProfileCardContent_c', (-> @children('div').first()), ->
      @e 'gbarToolsProfileCardContentList_c', (-> @children('ol')), ->
        @e 'gbarToolsProfileCardContentListItem_c', {many: true}, (-> @children('li'))

  @e 'gbarToolsProfileName', '#gbmpn', ->
    @e 'gbarToolsProfileEmail_c', (-> @next()), -> # Also in the "Switch" panel
      @combo 'gbarToolsProfileEmail', '%gbarToolsProfileName > %gbarToolsProfileEmail_c'

  @e 'gbarToolsProfileSwitch', '#gbmps'
  @e 'gbarToolsGear', '#gbg5'
  @e 'gbarToolsGearPullDown', '#gbd5'

  @e 'searchBox', '#search-box'
  @e 'searchBoxInput', '#ozIdSearchBox'

  @ss gbarParentIsFixed: position: 'fixed', top: '0', width: '100%' # FIXME: need to handled media queries
  @ss gplusBarIsFixed:   position: 'fixed', top: '', zIndex: '' # FIXME: need to handled media queries

  #
  # Content ancestors
  #

  @e 'content', '#content', -> # FIXME: too early: sometimes gets 'maybe-hide' class
    @e 'copyrightRow', (-> @next())
  @e 'contentPane', '#contentPane', ->
    @e 'leftPane', (-> @prev())
    @e 'rightPane', (-> @next())

  @e 'feedbackLink', 'body > [href*="learnmore"]'

  #
  # Notification Stream Page
  #

  @e 'notification', (-> $('#contentPane > div > div > div > [data-nid]')), undefined, -> # agg
    @e 'notificationsStream', (-> @first().parent())

  #
  # Sparks Home Page
  #

  @e 'sparksFeaturedInterestsA', {many: true}, (-> $('a[href^="sparks/interest"]')), undefined, -> # agg
    @e 'sparksFeaturedInterestsImg', (-> @first().children('img')), ->
      @e 'sparksFeaturedInterestsCaption', (-> @next()), ->
        @e 'sparksFeaturedInterestsCaptionOverlay', (-> @children(':eq(0)'))
        @e 'sparksFeaturedInterestsCaptionText', (-> @children(':eq(1)'))
    @e 'sparksFeaturedInterestsListItem', (-> @first().parent()), ->
      @e 'sparksFeaturedInterestsList', (-> @parent()), ->
        @e 'sparksFeaturedInterestsHeading', (-> @parent()), ->
          @e 'sparksFeaturedInterests', (-> @parent())

  #
  # Spark Page
  #

  @e 'sparkBody', {main: true}, (->
    # Because the spark stream is very similar to the circle stream, we have to start at a distinctive point.
    # Start at an input-and-button, which could be on a Spark page or the Sparks Home page, go the stream,
    # and then go back up to the unique div
    $('input[type="text"] + [role="button"]').parent().next().find('> div > div > [id^="update-"]:first').parent().parent().parent() )
  , ->
    @e 'streamParent', (-> @find('> div > div > [id^="update-"]:first').parent().parent() ), ->
      @combo 'sparkStreamParent', '%sparkBody > %streamParent'
      @e 'stream', (-> @children('div:first')), ->
        @combo 'sparkStream', '%sparkStreamParent > %stream'

  #
  # Circle stream page
  #

  # circleStream and sparkStream have the same class names.
  @e 'stream', ->
    # Avoid any contentPanes that are not for the circleStream
    $('#contentPane > *').
      not( $('a[href^="games"]').closest('#contentPane > *') ).  # Any Games page
      not( $('input[type="text"] + [role="button"]').closest('#contentPane > *') ). # Spark stream or Sparks Home
      find('[id^="update-"]:first').parent()
    #$('#contentPane > div > div > div > [id^="update-"]:first, #contentPane > div > div > div > div > [id^="update-"]:first').first().parent()
  , ->
    # FIXME: This :not() pseudo-class means that when the user navigates to a spark page, we have to
    # automap the page *before* the extension makes a reference to %circleStream; otherwise %circleStream
    # may pick up the incoming spark doc fragment.
    # FIXME: only works if 'strict' mode is off
    @combo 'circleStream', '%stream:not(%sparkStream)'
    # circleStreamParent and sparkStreamParent have the same class names.
    @e 'streamParent', (-> @parent()), ->
      @combo 'circleStreamParent', '%streamParent:not(%sparkStreamParent)' # FIXME: only works if 'strict' mode is off
      # NOTE: the parent of circleStreamParent can sometimes have no class whatsoever (e.g. when navigating in
      # from games).  So we can't get a selector
      @e 'circleStreamContentPaneHeading', (-> @parent().children(':eq(0)')), ->
        @e 'circleStreamContentPaneHeadingText', (-> @children('span'))
      @e 'shareRow', (-> @parent().children(':eq(1)')), ->
        @e 'shareBox', (-> @children().first()), ->
          @e 'shareIconsPhoto', (-> @find('[title]:eq(0)')), ->
            for rule in @cssRules() when rule.selectorText.match /:hover/
              # Take the ancestor simple_selector_sequence from the selector with :hover
              hoverableClassName = rule.selectorText.replace /^(?:.*,)?\s*\.([^\s,]+)\s+[^\s,]+:hover\s*(?:,.*)?$/, '$1'
            debug 'shareIconNonHoverable', 'hoverableClassName=' + hoverableClassName
            @ss makeChildShareIconNonHoverable: {background: 'url', cursor: 'default'}, (_)-> 
              isStyled = @isStyled
              # Take the selector, split into its 3 sequences, take the first simple selectors of each,
              # and check that it's not styled and not the one that's hoverable
              return hoverableClassName && '' + _.split(/,\s*/).map( (s)-> s.split(/\s+/)[0] ).filter (s)->
                className =  s.replace /^\./, ''
                ! isStyled(className) && className != hoverableClassName
# Sometimes, chaining is just better than this:
#                return '' + s for s in (sel.split(/\s+/)[0] for sel in @.split(/,\s*/)) \
#                   when ! isStyled s.replace /^\./, ''

          @e 'shareIconsVideo', (-> @find('[title]:eq(1)'))
          @e 'shareIconsLink', (-> @find('[title]:eq(2)')), ->
            @e 'shareIconsLocation', (-> @next())
            @e 'shareIcons', (-> @parent()), ->
              @e 'shareWhatsNewText', (-> @next()), ->
                @e 'shareOpeningText', (-> @next())
    @e 'circleStreamMoreRow', (-> @next()), ->
      @e 'circleStreamMoreButton', (-> @find('[role="button"]')), ->
        @e 'circleStreamMoreLoadingUnit', (-> @next()), ->
          @e 'circleStreamMoreLoadingText', (-> @children())

  # Post ID prefix is unlikely to change
  # Note that posts can be found in many places: main stream, games stream, notifications
  @e 'post', {
    many: true,
    alt: '[id^="update-"]'
    ssFilter:
      postIsSelected_c: {borderLeftColor: POST_IS_SELECTED_COLOR}
      postIsNew_c:      {borderLeftColor: POST_IS_NEW_COLOR}
  # DEMO: Use of xpath
  #}, (-> $('[id^="update-"]') ), ->
  }, (-> @xpath('//*[starts-with(@id, "update-")]') ), ->

    # Look for placeholder
    @e 'postPlaceholder_c', {deferred: true}, (-> @children(':empty'))

    # Look for menu, XXX possibly injected later
    @e 'postMenu_c', {pri: '[role="menu"]'}, (-> @children('[role="menu"]'))

    # Look for contents of a typical post
    @e 'postUserHeading_c', (-> @find('h3:first')), ->
      @e 'postUserHeadingName_c', (-> @children())
      @e 'postHead_c', (-> @parent()), ->
        @e 'postMenuButton_c', (-> @children('[role="button"]'))
        @e 'postUserAvatarA_cc', (-> @children('a[href^="/"][oid]')), ->
          @combo 'postUserAvatarA_c', '%postHead_c > %postUserAvatarA_cc'
          @e 'postUserAvatarImg_cc', (-> @children('img')), ->
            @combo 'postUserAvatarImg_c', '%postUserAvatarA_c > %postUserAvatarImg_cc'

        @e 'postUserNameA_c', (-> @find('div:eq(0) a[href^="/"][oid]')), ->
          @e 'postUserName_c', (-> @parent()), ->
            @e 'postHeadInfo_c', (-> @next()), ->
              @e 'postTime_c', (-> @children('span:first')), ->
                @e 'postTimeA_c', (-> @children('a'))
                @e 'postCategory_c', {
                  alt: @s.postTime_c + ' + :not([role="button"])'
                  deferred: true
                }, (-> @next(':not([role="button"])'))
              @e 'postPermissions_c', (-> @children('[role="button"]'))

        @e 'postContainer_c', (-> @parent())
        @e 'postBody_c', (-> @next()), ->
          @e 'postContent_c', (-> @children(':first')), ->
            # TODO: this may vary depending on the type of post
            @e 'postContentExpandButton_c', {deferred: true}, (-> @find('[role="button"]:contains(»)'))

          @e 'postPlusOneButton_c', {alt: 'button[id][g\\:entity]'}, (-> @find('button[id][g\\:entity]')), ->
            @e 'postActionBar_c', (-> @parent()), ->
              @e 'postStats_c', (-> @next())
              # NOTE: we can't look inside the stats div, coz there may not be anything for this
              # particular post
            @e 'postCommentLink_c', (-> @next()), ->
              @e 'postShareLink_c', (-> @next())

          @e 'postComments_c', (-> @next()), ->
            # NOTE: we can't look inside these divs coz there may not be any comments; we'll look below
            @e 'postCommentsToggler_c', (-> @children(':eq(0)')), ->
              @e 'postCommentsButtonChevron_c', (-> @children('[role="button"]:eq(0)')), ->
                @e 'postCommentsButtonText_c', (-> @next()), ->
                  @e 'postCommentsButtonTextLink_c', (-> @children('[role="button"]')), ->
                    @e 'postCommentsButtonTextLinkCount_c', (-> @children(':eq(0)'))
                    @e 'postCommentsButtonTextLinkWord_c', (-> @children(':eq(1)'))
                  @e 'postCommentsButtonTextFromNames_c', {deferred: true}, (-> @children(':eq(1)')), ->
                    @e 'postCommentsButtonTextFromNamesText_c', (-> @children())

            @e 'postCommentsList_c', (-> @children(':eq(1)')), ->
              @e 'postCommentsOlderButton_c', (-> @children('[role="button"]:eq(0)'))
              @e 'postCommentsStream_c', (-> @children(':eq(1)'))

            @e 'postCommentsFooter_c', (-> @next()), ->
              @e 'postCommentFooterChevron_c', (-> @children('span[role="button"]'))
              # Fake input box 'Add a comment' which is really a button
              @e 'postCommentButton_c', (-> @children('div[role="button"]'))

            @e 'postCommentAddRow_c', (-> @next()), ->
              @e 'postCommentAddButton_c', (-> @children('div[role="button"]')) # What's the span one for?

  , -> # aggSlaveRules to 'post'
    @ss postIsSelected_c: {borderLeftColor: POST_IS_SELECTED_COLOR}
    @ss postIsNew_c:      {borderLeftColor: POST_IS_NEW_COLOR}

  # postHeadInfoMuted is for the "- Muted" that only shows up on a profile page, where you can see muted posts.
  @ss postHeadInfoMuted_c: color: 'rgb(196, 43, 44)', '!fontSize': '', '!fontStyle': ''
  @ss hangoutLiveIcon: background: 'icon_live_active'
  @ss hangoutJoinButton: backgroundColor: 'rgb(77, 144, 254)', borderColor: 'rgb(48, 121, 237)'
  # postIsMutedOrDeleted_dc class doesn't appear until we meet a muted post.  So we defer
  # To diffentiate between muted and deleted, use a more complex selector:
  # muted: '%postIsMutedOrDeleted_dc [role="button"]'
  # deleted: $('%postIsMutedOrDeleted_dc').length > 0 but match the muted selector as above
  @ss {deferred: true}, postIsMutedOrDeleted_dc:
    paddingTop: '0px'
    paddingRight: '0px'
    paddingBottom: '0px'
    paddingLeft: '0px'
    '!*': ''

# TODO
#    # Let's look for stats from the list of posts
#
#    # FIXME: the post may not have +1s; need to search through all posts
#    @e 'postStatsPlus_c', @children(':first'), ->
#      @e 'postStatsPlusCount_c', @children(':eq(0)'), ->
#        @e 'postStatsPlusScoreText_c', @children()
#      # FIXME: there's an empty div after the +1  class="QD mz"
#    # FIXME: the post may not have shares; need to search through all posts
#    @e 'postStatsShare_c', @children(':eq(1)'), ->
#      @e 'postStatsShareScore_c', @children('span:eq(0)')
#      @e 'postStatsShareNames_c', @children('span:eq(1)')


  #
  # These need to be done carefully with delay, as they're injected later
  #

  #ed 'gbarToolsNotificationPullDown', '#gbwc' # FIXME: comes later
  #ed 'gbarToolsNotificationFrame', '#gbsf' # FIXME: comes later

  # TODO: how to distinguish between the different menuitems in any language?
  # TODO: get the menuitem's hover class

  #
  # End
  #
  return
