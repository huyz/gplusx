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

  # These are used for both ssFilter and @ss
  SS_gbarParentIsFixed = position: 'fixed', top: '0', width: '100%', '!*': '' # FIXME: need to handled media queries
  SS_gplusBarIsFixed   = position: 'fixed', top: '', zIndex: '', '!*': '' # FIXME: need to handled media queries
  SS_postIsSelected  = borderLeftColor: 'rgb(77, 144, 240)'
  SS_postIsNew       = borderLeftColor: 'rgb(167, 199, 247)'
  SS_postCommentContentExpandableIsCollapsed = overflow: 'hidden'

  # These are just used for ssFilter
  SS_gbarToolsNotificationUnitBgZero = backgroundPosition: '-26px'
  SS_gbarToolsNotificationUnitFgZero = color: 'rgb(153, 153, 153)'
  SS_postCommentsTogglerIsGrayed =
    color: 'rgb(153, 153, 153)'
    '!*': ''
  SS_postCommentsButtonChevronWouldCollapse = backgroundImage: 'stream/collapse'

  #
  # Some global stylesheet extraction rules
  #
  
  # Returns the proper simple selector (in particular class name) for the share icons,
  # given a complex selector from the stylesheets.
  simpleSelectorForShareIcon = (sel, key) ->
    results = {}
    singleSimple = null
    # Take the selector, split into its 3 sequences, take the last simple selectors of each,
    # check that they're all the same
    for simple in sel.split(/\s*,\s*/).map( (s)->
      parts = s.split(/\s+/)
      singleSimple = parts[0] if parts.length == 1
      parts[parts.length - 1]
    )
      results[simple] = true
    # Special case for check-in location icon which has a single simple selector
    if singleSimple
      return singleSimple
    else if Object.keys(results).length == 1
      return Object.keys(results)[0]
    else
      @error key, 'Incorrect number of matches in selector "' + sel + '"'
      return null

  # shareIconsPhoto2: backup to shareIconsPhoto.  shareIconsPhoto2 is potentially more brittle
  # because the sprite may change but shareIconsPhoto cannot be automapped from anywhere but the main page.
  # Same for other icons.
  @ss shareIconsPhoto2:
    backgroundImage: 'sharebox/sprite2'
    backgroundPositionY: '-88px'
  , simpleSelectorForShareIcon
  @ss shareIconsVideo2:
    backgroundImage: 'sharebox/sprite2'
    backgroundPositionY: '-143px'
  , simpleSelectorForShareIcon
  @ss shareIconsLink2:
    backgroundImage: 'sharebox/sprite2'
    backgroundPositionY: '-239px'
  , simpleSelectorForShareIcon
  @ss shareIconsLocation2:
    backgroundImage: 'sharebox/sprite2'
    backgroundPositionY: '-107px'
  , simpleSelectorForShareIcon

  # Helper mapping
  fn_makeChildShareIconHoverable2_ = ->
    @ss makeChildShareIconHoverable2_:
      backgroundImage: 'sharebox/sprite2'
      backgroundPositionY: '-52px'
    , (sel)->
      # Take the ancestor simple_selector_sequence from the selector with :hover
      # See shareIconsPhoto below -- difference here is we include the '.'
      sel.replace /^(?:.*,)?\s*(\.[^\s,]+)\s+[^\s,]+:hover\s*(?:,.*)?$/, '$1'
  @ss {warnDuplicate: false}, makeChildShareIconNonHoverable2:
    backgroundImage: 'sharebox/sprite2'
    backgroundPositionY: '-239px'
  , (sel, key)->
    @call fn_makeChildShareIconHoverable2_
    makeChildShareIconHoverable2_ = @mappedSelector.makeChildShareIconHoverable2_
    # Take the selector, split into its 3 sequences, take the first simple selectors of each,
    # and check that it's not styled and not the one that's hoverable.
    # See shareIconsPhoto below
    '' + sel.split(/\s*,\s*/).map( (s)-> s.split(/\s+/)[0] ).filter (s)->
      s != makeChildShareIconHoverable2_

  #
  # Gbar
  #

  @e 'gbar', '#gb', ->
    @e 'gbarParent', {ssFilter: SS_gbarParentIsFixed}, (-> @parent()), ->

      #
      # WebXBar
      #

      # FIXME: there's a different kind of bar in the Settings page.  So all the icons need backups
      # as done with shareIconsPhoto2.
      # gplusBarBg: 2011-08-28 There seems to be an empty div between gbarParent and gplusBarParent now
      @e 'gplusBar', {ssFilter: SS_gplusBarIsFixed}, (-> @nextAll(':not(:empty)').first()), ->
        @e 'gplusBarContent', (-> @children()), ->
          @e 'gplusBarNav', (-> @find('[role="navigation"]')), ->
            @e 'gplusBarNavStreamA', (-> @children('a:first-child')), ->
              @e 'gplusBarNavStreamIcon', {allClassNames: true}, (-> @children())
              @e 'gplusBarNavPhotosA', (-> @next()), ->
                @e 'gplusBarNavPhotosIcon', {allClassNames: true}, (-> @children())
                @e 'gplusBarNavProfileA', (-> @next()), ->
                  @e 'gplusBarNavProfileIcon', {allClassNames: true}, (-> @children())
                  @e 'gplusBarNavCirclesA', (-> @next()), ->
                    @e 'gplusBarNavCirclesIcon', {allClassNames: true}, (-> @children())
                    @e 'gplusBarNavGamesA', (-> @next()), ->
                      @e 'gplusBarNavGamesIcon', {allClassNames: true}, (-> @children())

  @e 'gbarTop', '#gbw'

  @e 'gbarLinks', '#gbz', ->
    @e 'gbarLinksList_c', (-> @children('ol')), -> # This is the same as for gbarTools, so requires context
      @combo 'gbarLinksList', '%gbarLinks > %gbarLinksList_c'
      @e 'gbarLinksListItem_c', (-> @children('li').first()), -> # This is the same as for gbarTools, so requires context
        @combo 'gbarLinksListItem', '%gbarLinksList > %gbarLinksListItem_c'

  @e 'gbarLinksMoreUnit', '#gbztms'
  @e 'gbarLinksMoreUnitText', '#gbztms1'
  @e 'gbarMorePullDown', '#gbd'
  @e 'gbarTools', '#gbg', ->
    @e 'gbarToolsList_c', {warnDuplicate: false}, (-> @children('ol')), -> # This is the same as for gbarLinks, so requires context
      @combo 'gbarToolsList', '%gbarTools > %gbarToolsList_c'
      @e 'gbarToolsListItem_c', {warnDuplicate: false}, (-> @children('li').first()), -> # This is the same as for gbarLinks, so requires context
        @combo 'gbarToolsListItem', '%gbarToolsList > %gbarLinksListItem_c'
  @e 'gbarToolsProfileNameA', '#gbg6'
  @e 'gbarToolsProfileNameText', '#gbi4t'
  @e 'gbarToolsNotificationA', '#gbg1'
  @e 'gbarToolsNotificationUnit', '#gbgs1'
  # gbarToolsNotificationUnit(Bg|Fg): The ssFilters work because when G+ loads up, the zero/gray class is there.
  @e 'gbarToolsNotificationUnitBg', {ssFilter: gbarToolsNotificationUnitBgZero: SS_gbarToolsNotificationUnitBgZero}, '#gbi1a'
  @e 'gbarToolsNotificationUnitFg', {ssFilter: gbarToolsNotificationUnitFgZero: SS_gbarToolsNotificationUnitFgZero}, '#gbi1'
  @e 'gbarToolsShareA', '#gbg3'
  @e 'gbarToolsShareUnit', '#gbgs3'
  @e 'gbarToolsShareUnitText', '#gbi3'
  @e 'gbarToolsProfilePhotoA', '#gbg4'
  @e 'gbarToolsProfilePullDown', '#gbd4'
  @e 'gbarToolsProfileCard', '#gbmpdv', ->
    @e 'gbarToolsProfileCardContent_c', (-> @children('div').first()), ->
      @e 'gbarToolsProfileCardContentList_c', (-> @children('ol')), ->
        @e 'gbarToolsProfileCardContentListItem_c', {warnMany: false}, (-> @children('li'))

  @e 'gbarToolsProfileName', '#gbmpn', ->
    @e 'gbarToolsProfileEmail_c', (-> @next()), -> # Also in the "Switch" panel
      @combo 'gbarToolsProfileEmail', '%gbarToolsProfileName > %gbarToolsProfileEmail_c'

  @e 'gbarToolsProfileSwitch', '#gbmps'
  @e 'gbarToolsGear', '#gbg5'
  @e 'gbarToolsGearPullDown', '#gbd5'

  @e 'searchBox', '#searchBox'
  @e 'searchBoxInput', '#ozIdSearchBox'

  @ss gbarParentIsFixed: SS_gbarParentIsFixed
  @ss gplusBarIsFixed: SS_gplusBarIsFixed

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
  # Notifications Stream Page
  #

  @e 'notification', {warnMany: false}, (-> $('#contentPane > div > div > div > [data-nid]')), undefined, -> # agg
    @e 'notificationsStream', (-> @first().parent()), ->
      @combo 'notificationsPageMarker', {warnDuplicate: false}, '%notificationsStream'

  #
  # Sparks Home Page
  #

  @e 'sparksFeaturedInterestsA', {warnMany: false, allClassNames: true}, (-> $('a[href^="sparks/interest"]')), undefined, -> # agg
    @e 'sparksFeaturedInterestsImg', (-> @first().children('img')), ->
      @e 'sparksFeaturedInterestsCaption', (-> @next()), ->
        @e 'sparksFeaturedInterestsCaptionOverlay', (-> @children(':eq(0)'))
        @e 'sparksFeaturedInterestsCaptionText', (-> @children(':eq(1)'))
    @e 'sparksFeaturedInterestsListItem', (-> @first().parent()), ->
      @e 'sparksFeaturedInterestsList', (-> @parent()), ->
        @e 'sparksFeaturedInterestsHeading', (-> @parent()), ->
          @e 'sparksFeaturedInterests', (-> @parent()), ->
            @combo 'sparksPageMarker', {warnDuplicate: false}, '%sparksFeaturedInterests'

  #
  # Spark Page
  #

  @e 'sparkBody', (->
    # Because the spark stream is very similar to the circle stream, we have to start at a distinctive point.
    # Start at an input-and-button, which could be on a Spark page or the Sparks Home page, go the stream,
    # and then go back up to the unique div
    $('input[type="text"] + [role="button"]').parent().next().find('> div > div > [id^="update-"]:first').parent().parent().parent()
  ), ->
    # FIXME: the way it's written, sparkPageMarker is also found on sparksPage
    @combo 'sparkPageMarker', {warnDuplicate: false}, '%sparkBody'
    @e 'sparkStreamParent_c', {warnDuplicate: false}, (-> @find('> div > div > [id^="update-"]:first').parent().parent() ), ->
      @combo 'sparkStreamParent', '%sparkBody > %sparkStreamParent_c'
      @e 'sparkStream_c', {warnDuplicate: false}, (-> @children('div:first')), ->
        @combo 'sparkStream', '%sparkStreamParent > %sparkStream_c'

  #
  # Single Post page
  #

  @e 'singlePostParent', (-> $('#contentPane > div > div > [id^="update-"]').parent()), ->
    @combo 'singlePostPageMarker', {warnDuplicate: false}, '%singlePostParent'

  #
  # Games page
  #
  # NOTE:
  # - there could be up to 3 games sub-pages (all but 1 hidden) under #contentPane.
  #   So you may want to check for visibility if you want to ensure you get the correct subpage:
  #   $('%gamesMainPane').is(':visible')
  # - all the top elements of the sub-pages look pretty much the same with the same class names.
  #   So if you want to reference an ancestor that's specific to a subpage, you'll have to do:
  #   $('%gamesMainPane').has('%gamesStream')

  @e 'gamesLinksWidgetHomeLink', {warnMany: false}, 'a[href="games"]', ->
    @combo 'gamesPageMarker', {warnDuplicate: false}, '%gamesLinksWidgetHomeLink'
    @e 'gamesLinksWidget', (-> @parent()), ->
      @e 'gamesSelfWidget', (-> @prev()), ->
        @e 'gamesSelfWidgetCon"tent', (-> @children()), ->
          @e 'gamesSelfWidgetAvatarA', {allClassNames: true}, (-> @children('a:eq(0)')), ->
            @e 'gamesSelfWidgetAvatarImg', (-> @children('img')), ->
          @e 'gamesSelfWidgetNameLink', (-> @children('a:eq(1)'))
      @e 'gamesRecentWidget', (-> @children().last()), ->
        @e 'gamesRecentWidgetHeading', (-> @children(':eq(0)'))
        @e 'gamesRecentWidgetBody', (-> @children(':eq(1)')), ->
          @e 'gamesRecentWidgetList', (-> @children(':eq(0)')), ->
            @e 'gamesRecentWidgetListItem', {warnMany: false}, (-> @children())
              # TODO: the rest
      @e 'gamesLeftPane', (-> @parent()), ->
        # 'gamesMainPane' and not 'gamesContentPane' because it doesn't go under #contentPane
        @e 'gamesMainPane', (-> @next()), ->
          @e 'gamesMainPaneHeading', (-> @children(':eq(0)'))
          @e 'gamesActivitiesStream', (-> @children(':last').filter(':nth-child(3)').children(':eq(2)').children('[id^="update-"]').parent()), ->
            @e 'gamesActivitiesStreamNoActivityText', (-> @prev()), ->
              @e 'gamesActivitiesStreamHeading', (-> @prev()), ->
                @e 'gamesActivitiesStreamHeadingText', (-> @children().first())
            @e 'gamesActivitiesStreamParent', (-> @parent()), ->
              # gamesStreamSubPageBanner is unique to the Games Activity Stream subpage.
              # @combo because it's an empty <div>
              @combo 'gamesActivitiesStreamBanner', '%gamesMainPane > :nth-child(2):not(:last-child)'

  @e 'gamesLinksWidgetDirectoryLink', {warnMany: false}, 'a[href="games/directory"]'
  @e 'gamesLinksWidgetNotificationsLink', {warnMany: false}, 'a[href="games/notifications"]'

  #
  # Profile page
  #

  @e 'profileContentPane', '.vcard', ->
    @combo 'profilePageMarker', {warnDuplicate: false}, '%profileContentPane'
    @e 'profileScaffold', (-> @children()), ->
      @e 'profileCirclesUnit', (-> @children(':eq(0)').children(':eq(0)')), ->
      @e 'profileHeading', (-> @children(':eq(0)').children(':eq(1)')), ->
        @e 'profileHeadingName', (-> @children('span:eq(0)'))

  #
  # Circle stream page
  #

  # 'stream' because 'circleStream' and 'sparkStream' have the same class names.
  @e 'circleStream_c', {warnMany: false}, (->
    # Avoid any contentPanes that are not for the circleStream
    $('#contentPane > *').
      not( $('a[href^="games"]').closest('#contentPane > *') ).  # Any Games page
      not( $('input[type="text"] + [role="button"]').closest('#contentPane > *') ). # Spark stream or Sparks Home
      not( $('#contentPane > div > div > [id^="update-"]').closest('#contentPane > *') ). # Single post page
      find('[id^="update-"]:first').parent()
  ), ->
    # TODO: This :not() pseudo-class means that when the user navigates to a spark page, we have to
    # automap the page *before* the extension makes a reference to %circleStream; otherwise %circleStream
    # may pick up the incoming spark doc fragment.
    @combo 'circleStream', {jQuerySelector: true}, '%circleStream_c:not(%sparkStream)'
    # circleStreamParent and sparkStreamParent have the same class names.
    @e 'circleStreamParent_c', (-> @parent()), ->
      @combo 'circleStreamParent', {jQuerySelector: true}, '%circleStreamParent_c:not(%sparkStreamParent)'
      # NOTE: the parent of circleStreamParent can sometimes have no class whatsoever (e.g. when navigating in
      # from games).  So we can't get a selector
      @e 'circleStreamContentPaneHeading', (-> @parent().children(':eq(0)')), ->
        @e 'circleStreamContentPaneHeadingText', (-> @children('span'))
      @e 'shareRow', (-> @parent().children(':eq(1)')), ->
        @e 'shareBox', (-> @children().first()), ->
          # shareIconsPhoto and its brethen can only be automapped from the circle page.  So you
          # can use shareIconsPhoto2 as backup
          @e 'shareIconsPhoto', (-> @find('[title]:eq(0)')), ->
            for rule in @cssRules() when rule.selectorText.match /:hover/
              # Take the ancestor simple_selector_sequence from the selector with :hover
              hoverableClassName = rule.selectorText.replace /^(?:.*,)?\s*\.([^\s,]+)\s+[^\s,]+:hover\s*(?:,.*)?$/, '$1'
            @ss makeChildShareIconNonHoverable: {background: 'url', cursor: 'default'}, (sel)-> # selectorFilter
              isStyled = @isStyled
              # Take the selector, split into its 3 sequences, take the first simple selectors of each,
              # and check that it's not styled and not the one that's hoverable
              return hoverableClassName and '' + sel.split(/\s*,\s*/).map( (s)-> s.split(/\s+/)[0] ).filter (s)->
                className =  s.replace /^\./, ''
                ! isStyled(className) and className != hoverableClassName
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

  #
  # Post Content, either original or shared
  #

  # This helper function generates 2 similar trees of rules, one for when the post is original, i.e. by the poster,
  # or shared, i.e. by someone other than the poster.
  genSlaves_postContentVariantEntry = (treeName)->
    # Supplants part of the keyname with the treeName argument
    key = (s)-> s.replace /\{\}/g, treeName
    opt = if treeName == 'Original' then {} else {warnDuplicate: false}
    optNoEl = if treeName == 'Original' then {warnNoElement: false} else {warnDuplicate: false, warnNoElement: false}

    return ->
      if treeName == 'Original'
        @combo 'postContent', '%postBody > %postContent_c'
      else if treeName == 'Shared'
        @combo 'postContentShared', '%postContentSharedParent > %postContentShared_c'

      # Strange, only an original post can be expandable.
      #@e 'postContentExpandButton_c', {warnNoElement: false}, (-> @find('[role="button"]:contains(»)'))

      # There can only be one level of share (and one level of recursion). So we don't need '{}' in this section
      if treeName == 'Original'
        # These can be anywhere, and we only need the first one
        @e 'postContentProflinkWrapper', {warnMany: false}, (-> @find('.proflinkWrapper').first()), ->
          @e 'postContentProflinkPrefix', (-> @children('span:eq(0)'))
          @e 'postContentProflink', (-> @children('a[oid]'))

        # postContentSharedParent: this is to be used to differentiate between posts that are original or shared.
        # e.g., To get the text of a shared item,
        #   $post.find('%postContentSharedParent %postContentSharedMessageText_c')
        # To get the text of a non-shared item,
        #   $post.find('%postContentSharedParent').length == 0 && $post.find('%postContentOriginalMessageText_c')
        @e 'postContentSharedParent', (->
          # TODO: In Webx, create method so that we get selector directly, e.g.
          # @find(@ssSelector(borderLeft: '1px solid rgb(234, 234, 234)'))
          @call fn_postContentSharedParent_
          @children(@mappedSelector.postContentSharedParent_)
        ), (->
          @e 'postContentSharedHeading', (-> @prev()), ->
            @e 'postContentSharedUserAvatarImg_c', {warnDuplicate: false}, (-> @children('img')), ->
              @combo 'postContentSharedUserAvatarImg', '%postContentSharedHeading > %postContentSharedUserAvatarImg_c'
              @e 'postContentSharedUserNameA', (-> @next('a[oid]'))

            @e 'postContentSharedPrologue', (-> @prev()), ->
              # postContentSharedPrologueText has no class name
              @combo 'postContentSharedPrologueText', '%postContentSharedPrologue > div'
              @e key('postContentSharedPrologueEdit_c'), (-> @filter(':visible').find('span:not(:visible)'))

          @e 'postContentShared_c', {warnDuplicate: false}, (-> @children()), genSlaves_postContentVariantEntry 'Shared'
        )

      # postContent{}Message_c must not have any postContentSharedParent_ sibling (i.e. div with gray left border)
      @e key('postContent{}Message_c'), opt, (->
        @call fn_postContentSharedParent_
        @children(@mappedSelector.postContentSharedParent_)
        children = @children()
        if children.filter(@mappedSelector.postContentSharedParent_).length then null else children.first()
      ), ->
        @e key('postContent{}MessageText_c'), opt, (-> @children().first()), ->
          @e key('postContent{}MessageEdit_c'), {warnDuplicate: false}, (-> @filter(':visible').find('span:not(:visible)'))
          @e key('postContent{}MessageExpandButton_c'), optNoEl, (-> @next('[role="button"]:contains(»)')), ->

        @e key('postContent{}MessageCollapseButton_c'), optNoEl, (-> @next().children('[role="button"]')), ->
          @e key('postContent{}MessageExpanded_c'), opt, (-> @parent()), ->
            @e key('postContent{}MessageExpandedText_c'), optNoEl, (-> @children().first()), ->

        @e key('postContent{}Attachment_c'), opt, (-> @next()), ->
          @e key('postContent{}AttachmentLinkFavIcon_c'), opt, (-> @find('img[src*="favicons"]')), ->
            @e key('postContent{}AttachmentLinkHeading_c'), opt, (-> @next()), ->
              @e key('postContent{}AttachmentLinkTitleA_c'), $.extend({allClassNames: true}, opt), (-> @children('a'))
              @e key('postContent{}AttachmentLinkImage_c'), opt, (-> @next('[data-content-url]')), ->
                @combo key('postContent{}AttachmentLinkImageImg_c'), key '%postContent{}AttachmentLinkImage_c > img'

            @e key('postContent{}AttachmentLink_c'), opt, (-> @parent()), ->
              @e key('postContent{}AttachmentLinkFloatClear_c'), opt, (-> @children().last()), ->
                # postContent{}AttachmentLinkSnippet: snippet is before the float, but neither the heading
                # nor the image
                @e key('postContent{}AttachmentLinkSnippet_c'), opt, (-> @prev(':not([data-content-url]):not(:has(a))'))

          @e key('postContent{}AttachmentPhotoWrapper_c'), opt, (-> @find('> div > [data-content-url*="plus.google.com/photos"]')), ->
            @combo key('postContent{}AttachmentPhotoImg_c'),  key '%postContent{}AttachmentPhotoWrapper_c > img'
            @e key('postContent{}AttachmentPhoto_c'), opt, (-> @parent()), ->
              @e key('postContent{}AttachmentPhotoFloatClear_c'), opt, (-> @children().last())

          @e key('postContent{}AttachmentVideoPreview_c'), opt, (-> @find('> div > * > div[data-content-type*="shockwave"]')), ->
            @combo key('postContent{}AttachmentVideoPreviewImg_c'), key '%postContent{}AttachmentVideoPreview_c > img'
            # postContent{}AttachmentVideoIframe_c only appears after user hits play
            @combo key('postContent{}AttachmentVideoIframe_c'), key '%postContent{}AttachmentVideoPreview_c > iframe'
            @e key('postContent{}AttachmentVideoPreviewOverlay_c'), opt, (-> @children('div:last'))

            @e key('postContent{}AttachmentVideoCaption_c'), opt, (-> @next()), ->
              @combo key('postContent{}AttachmentVideoSourceA_c'), key '%postContent{}AttachmentVideoCaption_c > a:first-child'

            @e key('postContent{}AttachmentVideoWrapper_c'), opt, (-> @parent()), ->
              @e key('postContent{}AttachmentVideoHeading_c'), opt, (-> @prev()), ->
                @e key('postContent{}AttachmentVideoTitleA_c'), $.extend({allClassNames: true}, opt), (-> @children('a'))
              @e key('postContent{}AttachmentVideo_c'), opt, (-> @parent()), ->
                @e key('postContent{}AttachmentVideoFloatClear_c'), opt, (-> @children().last())


  #
  # Post
  #

  @ss hangoutLiveIcon: background: 'icon_live_active', marginLeft: ''
  @ss hangoutJoinButton: backgroundColor: 'rgb(77, 144, 254)', borderColor: 'rgb(48, 121, 237)'
  # postIsMutedOrDeleted_d class doesn't appear until we meet a muted post.  So we defer.
  # To diffentiate between muted and deleted, use a more complex selector:
  # muted: '%postIsMutedOrDeleted_d [role="button"]'
  # deleted: $('%postIsMutedOrDeleted_d').length > 0 but filter out the muted selector as above
  # FIXME: Deferred only works for jQuery
  @ss {deferred: true}, postIsMutedOrDeleted_d:
    paddingTop: '0px'
    paddingRight: '0px'
    paddingBottom: '0px'
    paddingLeft: '0px'
    '!*': ''
  @ss postCommentsButtonChevronWouldCollapse: SS_postCommentsButtonChevronWouldCollapse

  fn_postHeadInfoMuted = ->
    # postHeadInfoMuted: is for the "- Muted" that only shows up on a profile page, where you can see muted posts.
    # Must be defined before the postMenuItemMute and postMenuItemUnmute rules.
    @ss postHeadInfoMuted: color: 'rgb(196, 43, 44)', '!fontSize': '', '!fontStyle': ''
  @call fn_postHeadInfoMuted
  fn_postContentSharedParent_ = ->
    # postContentSharedParent_: used for postContentQuotedMessage
    @ss {warnDuplicate: false}, postContentSharedParent_:
      borderLeft:  '1px solid rgb(234, 234, 234)'
  @call fn_postContentSharedParent_

  # Post ID prefix is unlikely to change
  # Note that posts can be found in many places: main stream, games stream, notifications
  @e 'post', {
    warnMany: false,
    alt: '[id^="update-"]'
    ssFilter: {postIsSelected: SS_postIsSelected, postIsNew: SS_postIsNew}
  # DEMO: Use of xpath
  #}, (-> $('[id^="update-"]') ), ->
  }, (-> @xpath('//*[starts-with(@id, "update-")]') ), ->

    # postPlaceholder: temporarily shown when loading a page with a live hangout
    @e 'postPlaceholder', {warnNoElement: false}, (-> @children(':empty'))

    # postMenu is injected a bit later into the post.
    @e 'postMenu', {pri: '[role="menu"]', warnNoElement: false}, (-> @find('[role="menu"]')), ->
      # Structure of post menu.
      # Other people's posts
      # - Circle stream
      #   0) Link to this post [only if post is public]
      #   1) Report Abuse
      #   2) Mute this post
      #   3) Block this person
      # - Profile stream  OR  Notifications
      #   0) Link to this post [only if post is public]
      #   1) Report Abuse
      #   2) Mute this post  OR  Unmute this post
      # One's own post:
      #   0) Edit this post
      #   1) Delete this post
      #   2) Link to this post [only if post is public]
      #   3) Report or remove comments [only if the post has comments]
      #   4) Disable comments  OR  enable comments
      #   5) Lock this post  OR  unlock this post

      # postMenuItemUnmute: the 3rd element in a menu with 3 entries on a profile for an item that has been muted
      @e 'postMenuItemUnmute', {warnNoElement: false}, ->
        @call fn_postHeadInfoMuted
        $post = @closest('[id^="update-"]')
        if $post.find(@mappedSelector.postHeadInfoMuted).length > 0 and
          #  Use 'find' and not 'children' because the menu may have been moved by an extension.
          (($menuItems = $post.find('[role="menu"]').children() ).length == 2 or $menuItems.length == 3)
            $menuItems[$menuItems.length - 1]
        else null
      # postMenuItemMute: since there's no easy way to distinguish between two menus with 4 entries, we use
      # another heurisitic: the number of classes must exceed that of the other menu items
      # (For some reason mute has an extra non-styled class.)
      @e 'postMenuItemMute', ->
        @call fn_postHeadInfoMuted
        $post = @closest('[id^="update-"]')
        if $post.find(@mappedSelector.postHeadInfoMuted).length == 0
          $menuItems = $post.find('[role="menu"]').children()
          greatestClassCount = secondGreatestClassCount = -1
          $greatest = null
          for menuItem in $menuItems
            classCount = menuItem.className.trim().split(/\s+/).length
            if classCount > greatestClassCount
              [secondGreatestClassCount, greatestClassCount] = [greatestClassCount, classCount]
              greatest = menuItem
            else if classCount == greatestClassCount
              greatest = null
            else if classCount < greatestClassCount and classCount > secondGreatestClassCount
              secondGreatestClassCount = classCount
          if secondGreatestClassCount > 0 then greatest else null
        else null

    # Look for contents of a typical post.
    # We anchor from deep inside and go up because there are cases where there are extra divs before postHead:
    # - hangout 'Live' icon (e.g. .a-lx-i-ie-ms-Ha-q)
    # - "Shared by ..." in Incoming page (e.g. a-f-i-Jf-Om a-b-f-i-Jf-Om)
    # - Google Plus Reply+
    @e 'postUserHeading', (-> @find('h3:first')), ->
      @e 'postUserHeadingName', (-> @children())
      # postHead: excludes avatar and menu icon
      @e 'postHead', (-> @parent()), ->
        @e 'postMenuButton', (-> @children('[role="button"]'))
        @e 'postUserAvatarA_c', (-> @children('a[oid]')), ->
          @combo 'postUserAvatarA', '%postHead > %postUserAvatarA_c'
          @e 'postUserAvatarImg_c', (-> @children('img')), ->
            @combo 'postUserAvatarImg', '%postUserAvatarA > %postUserAvatarImg_c'

        @e 'postUserNameA_c', (-> @find('div:eq(0) a[oid]')), ->
          @e 'postUserName', (-> @parent()), ->
            @combo 'postUserNameA', '%postUserName > postUserNameA_c'
            @e 'postHeadInfo', (-> @next()), ->
              @e 'postTime', (-> @children('span:first')), ->
                @e 'postTimeA', {allClassNames: true}, (-> @children('a'))
                @e 'postCategory', {
                  alt: @mappedSelector.postTime + ' + :not([role="button"])',
                  warnNoElement: false
                }, (-> @next(':not([role="button"])'))
              @e 'postPermissions', (-> @children('[role="button"]'))

        @e 'postContainer', (-> @parent())
        @e 'postBody', (-> @next()), ->
          @e 'postContent_c', (-> @children(':first')), genSlaves_postContentVariantEntry 'Original'

          @e 'postPlusOneButton', {alt: 'button[id][g\\:entity]'}, (-> @find('button[id][g\\:entity]')), ->
            @e 'postActionBar', (-> @parent()), ->
              @e 'postStats', (-> @next())
            @e 'postCommentLink', (-> @next()), ->
              @e 'postShareLink', (-> @next())

          @e 'postComments', (-> @next()), ->
            @e 'postCommentsButtonTextCount', (-> @find('[role="button"] + div > [role="button"]')), ->
              @e 'postCommentsButtonTextCountNumber', (-> @children(':eq(0)'))
              @e 'postCommentsButtonTextCountWord', (-> @children(':eq(1)'))
              @e 'postCommentsButtonText', (-> @parent()), ->
                @e 'postCommentsButtonTextNames', (-> @children(':eq(1)')), ->
                  @e 'postCommentsButtonTextNamesText_c', (-> @children()), ->
                    @combo 'postCommentsButtonTextNamesText', '%postCommentsButtonTextNames > %postCommentsButtonTextNamesText_c'
                @e 'postCommentsButtonChevron_c', {
                  ssFilter: SS_postCommentsButtonChevronWouldCollapse
                }, (-> @prev()), ->
                  @e 'postCommentsToggler', {ssFilter: postCommentsTogglerIsGrayed: SS_postCommentsTogglerIsGrayed}, (-> @parent()), ->
                    @combo 'postCommentsButtonChevron', '%postCommentsToggler > %postCommentsButtonChevron_c'

                    @e 'postCommentsList', (-> @next()), ->
                      @e 'postCommentsOlderButton', (-> @children('[role="button"]:eq(0)'))
                      @e 'postCommentsStream', (-> @children(':eq(1)')), ->
                        @e 'postComment', {warnMany: false}, (-> @children('[id]')), ->
                          # postCommentUserAvatarImg_c is the anchor for postCommentContainer because
                          # postCommentContainer may or may not have siblings.
                          @e 'postCommentUserAvatarImg_c', {warnDuplicate: false}, (-> @find('img[alt]')), ->
                            @e 'postCommentUserAvatarA_c', {warnDuplicate: false}, (-> @parent('a[oid]')), ->
                              @e 'postCommentContainer', (-> @parent()), ->
                                @combo 'postCommentUserAvatarA', '%postCommentContainer > %postCommentUserAvatarA_c'
                                @combo 'postCommentUserAvatarImg', '%postCommentUserAvatarA > %postCommentUserAvatarImg_c'
                                # postCommentContent: usually doesn't have any classes; only when expandable
                                @combo 'postCommentContent', '%postCommentContainer > div:nth-child(2)'
                                @e 'postCommentUserNameA_c', {warnDuplicate: false}, (-> @find('> div:nth-child(2) > a[href^="/"][oid]')), ->
                                  @combo 'postCommentUserNameA', '%postCommentContainer > div:nth-child(2) > %postCommentUserNameA_c'
                                  @e 'postCommentUserNameDelimiter', (-> @next('span')), ->
                                    @e 'postCommentContentText', (-> @next('span')), ->
                                @e 'postCommentContentExpandButton', {
                                  warnNoElement: false
                                }, (-> @children('[role="button"]:contains(»)')), ->
                                  @e 'postCommentContentExpandable', {
                                    warnNoElement: false
                                    ssFilter: postCommentContentExpandableIsCollapsed: SS_postCommentContentExpandableIsCollapsed
                                  }, (-> @prev()), undefined, ->
                                    @ss postCommentContentExpandableIsCollapsed: SS_postCommentContentExpandableIsCollapsed
                                @e 'postCommentContentCollapseButton', {
                                  warnNoElement: false
                                }, (-> @children('[role="button"]:not(:contains(»))'))

                                # postCommentLeftBorder: we do prev() because sometimes there isn't one
                                @e 'postCommentLeftBorder', {warnNoElement: false}, (-> @prev())

                                # postCommentManagement: only on one's own posts, hidden until you click
                                # "Report or remove comments"
                                @e 'postCommentManagement', {warnNoElement: false}, (-> @next())
                                  # TODO


            @e 'postCommentsFooter', (-> @next()), ->
              @e 'postCommentsFooterChevron_c', {warnDuplicate: false}, (-> @children('span[role="button"]')), ->
                @combo 'postCommentsFooterChevron', '%postCommentsFooter > %postCommentsFooterChevron_c'
              # postCommentButton: Fake input box 'Add a comment' which is really a button
              @e 'postCommentButton', (-> @children('div[role="button"]'))

  , -> # aggSlaveRules to 'post'
    @ss postIsSelected: SS_postIsSelected
    @ss postIsNew: SS_postIsNew

# TODO
#    # Let's look for stats from the list of posts
#
#    # FIXME: the post may not have +1s; need to search through all posts
#    @e 'postStatsPlus', @children(':first'), ->
#      @e 'postStatsPlusCount', @children(':eq(0)'), ->
#        @e 'postStatsPlusScoreText', @children()
#      # FIXME: there's an empty div after the +1  class="QD mz"
#    # FIXME: the post may not have shares; need to search through all posts
#    @e 'postStatsShare', @children(':eq(1)'), ->
#      @e 'postStatsShareScore', @children('span:eq(0)')
#      @e 'postStatsShareNames', @children('span:eq(1)')


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
