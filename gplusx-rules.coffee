# ***************************************************************************
# Gplusx - Google+ Extension SDK
#
# This file contains all the rules for extracting selectors and classnames for all
# parts of the Google+ page.
# ***************************************************************************

# Returns a unique ID for this set of mapping;
# null, if there aren't enough mappings to generate an ID
Gplusx.gplusxMapIdFunc = ->
#  if @s.gbarParent?
#    # The settings page has no gplusbar, but I hesitate to only take
#    # one element's className as an ID
#    @s.gbarParent + if @s.gplusBar? then ',' + @s.gplusBar else ''
#  else
#    null
  if @s.gbarParent? then @s.gbarParent else null

# Executes just the rules sufficient for generating an ID
Gplusx.gplusxMappingRulesForId = ->
  # Aliases
  e = @e

  e 'gbar', '#gb', ->
    e 'gbarParent', (-> @parent())
  return

# Executes rules to extract selectors and CSS class names
#
# This method of generating class names is based on heuristics,
# primarily targeting the case when only class names change.
# If the actual DOM structure changes, much of this won't work
# and this library will need to be updated.
Gplusx.gplusxMappingRules = ->
  # Aliases
  debug = @debug
  error = @error
  e = @e
  ss = @ss
  X = @X

  #
  # Constants
  #

  POST_IS_SELECTED_COLOR = 'rgb(77, 144, 240)';
  POST_IS_NEW_COLOR      = 'rgb(167, 199, 247)';

  #
  # Gbar
  #

  e 'gbar', '#gb', ->
    e 'gbarParent', {
      ssFilter:
        gbarParentIsFixed: {position: 'fixed', top: '0', width: '100%'}
    }, (-> @parent()), ->

      #
      # WebXBar
      #

      # FIXME: there's a different kind of bar in the Settings page
      # gplusBarBg: 2011-08-28 There seems to be an empty div between gbarParent and gplusBarParent now
      e 'gplusBar', {
        ssFilter:
          gplusBarIsFixed: {position: 'fixed', top: /./, zIndex: /./}
      }, (-> @nextAll(':not(:empty)').first()), ->
        e 'gplusBarContent', (-> @children()), ->

          e 'gplusBarNav', (-> @find('[role="navigation"]')), ->
    # Too early for Aria
    #e('gplusBarNavHomeA', $_ = $('[aria-label="Home"]'));
    #e('gplusBarNavHomeIcon_c', $_.children());
    #e('gplusBarNavPhotosA', $_ = $('[aria-label="Photos"]'));
    #e('gplusBarNavPhotosIcon_c', $_.children());
    #e('gplusBarNavProfileA', $_ = $('[aria-label="Profile"]'));
    #e('gplusBarNavProfileIcon_c', $_.children());
    #e('gplusBarNavCirclesA', $_ = $('[aria-label="Circles"]'));
    #e('gplusBarNavCirclesIcon_c', $_.children());
            e 'gplusBarNavStreamA', (-> @children('a:first-child')), ->
              e 'gplusBarNavStreamIcon_c', (-> @children())
              e 'gplusBarNavPhotosA', (-> @next()), ->
                e 'gplusBarNavPhotosIcon_c', (-> @children())
                e 'gplusBarNavProfileA', (-> @next()), ->
                  e 'gplusBarNavProfileIcon_c', (-> @children())
                  e 'gplusBarNavCirclesA', (-> @next()), ->
                    e 'gplusBarNavCirclesIcon_c', (-> @children())
                    e 'gplusBarNavGamesA', (-> @next()), ->
                      e 'gplusBarNavGamesIcon_c', (-> @children())

  e 'gbarTop', '#gbw'

  e 'gbarLinks', '#gbz', ->
    e 'gbarList_c', (-> @children('ol')), -> # This is the same as for gbarTools, so requires context
      e 'gbarListItem_c', (-> @children('li').first()) # This is the same as for gbarTools, so requires context

  e 'gbarLinksMoreUnit', '#gbztms'
  e 'gbarLinksMoreUnitText', '#gbztms1'
  e 'gbarMorePullDown', '#gbd'
  e 'gbarTools', '#gbg'
  e 'gbarToolsProfileNameA', '#gbg6'
  e 'gbarToolsProfileNameText', '#gbi4t'
  e 'gbarToolsNotificationA', '#gbg1'
  e 'gbarToolsNotificationUnit', '#gbgs1'
  e 'gbarToolsNotificationUnitBg', '#gbi1a', ->
    ss gbarToolsNotificationUnitBgZero: {backgroundPosition: '-26px'}
  e 'gbarToolsNotificationUnitFg', '#gbi1', ->
    ss gbarToolsNotificationUnitFgZero: {color: 'rgb(153, 153, 153)'}
  e 'gbarToolsShareA', '#gbg3'
  e 'gbarToolsShareUnit', '#gbgs3'
  e 'gbarToolsShareUnitText', '#gbi3'
  e 'gbarToolsProfilePhotoA', '#gbg4'
  e 'gbarToolsProfilePullDown', '#gbd4'
  e 'gbarToolsProfileCard', '#gbmpdv', ->
    e 'gbarToolsProfileCardContent_c', (-> @children('div').first()), ->
      e 'gbarToolsProfileCardContentList_c', (-> @children('ol')), ->
        e 'gbarToolsProfileCardContentListItem_c', (-> @children('li'))

  e 'gbarToolsProfileName', '#gbmpn', ->
    e 'gbarToolsProfileEmail_c', (-> @next()) # Also in the "Switch" panel
  e 'gbarToolsProfileSwitch', '#gbmps'
  e 'gbarToolsGear', '#gbg5'
  e 'gbarToolsGearPullDown', '#gbd5'

  e 'searchBox', '#search-box'
  e 'searchBoxInput', '#ozIdSearchBox'

  #
  # IDs -- these are unlikely to change any time soon
  #

  e 'content', '#content', -> # FIXME: too early: sometimes gets 'maybe-hide' class
    e 'copyrightRow', (-> @next())
  e 'contentPane', '#contentPane'

  e 'feedbackLink', 'body > [href*="learnmore"]'

  #
  # Main stream page
  #

#  e 'sharePhotoIcon'   , '[id^="\\:"][id$=".p"]'
#  e 'shareVideoIcon'   , '[id^="\\:"][id$=".v"]'
#  e 'shareLinkIcon'    , '[id^="\\:"][id$=".l"]'
#  e 'shareLocationIcon', '[id^="\\:"][id$=".lc"]'

  e 'postsStream', (-> $('[id^="update-"]').first().parent()), ->
    e 'postsStreamParent', (-> @parent()), ->
      e 'postsStreamContentPane', (-> @parent()), ->
        e 'postStreamContentPaneHeading', (-> @children(':eq(0)')), ->
          e 'postStreamContentPaneHeadingText', (-> @children('span'))
        e 'shareRow', (-> @children(':eq(1)')), ->
          e 'shareBox', (-> @children().first()), ->
            e 'shareIconsPhoto', (-> @find('[title]:eq(0)')), ->
#              hoverableClassName = rule.selectorText.replace /^(?:.*,)?\s*\.([^\s,]+)\s+[^\s,]+:hover\s*(?:,.*)?$/, '$1' \
#                for rule in X.cssRules(@) when rule.selectorText.match /:hover/
#              ss shareIconNonHoverable: {background: 'url', cursor: 'default'}, -> 
#                # Take the selector, split into its 3 sequences, take the first simple selectors of each,
#                # and check that it's not styled
#                return '' + @.split(/,\s*/).map( (s)-> s.split(/\s+/)[0] ).filter (s)->
#                  className =  s.replace /^\./, ''
#                  ! X.isStyled className && className != hoverableClassName
## Sometimes, chaining is just better than this:
##                return '' + s for s in (sel.split(/\s+/)[0] for sel in @.split(/,\s*/)) \
##                  when ! X.isStyled s.replace /^\./, ''

            e 'shareIconsVideo', (-> @find('[title]:eq(1)'))
            e 'shareIconsLink', (-> @find('[title]:eq(2)')), ->
              e 'shareIconsLocation', (-> @next())
              e 'shareIcons', (-> @parent()), ->
                e 'shareWhatsNewText', (-> @next()), ->
                  e 'shareOpeningText', (-> @next())
    e 'postsStreamMoreRow', (-> @next()), ->
      e 'postsStreamMoreButton', (-> @find('[role="button"]')), ->
        e 'postsStreamMoreLoadingUnit', (-> @next()), ->
          e 'postsStreamMoreLoadingText', (-> @children())

  # Posts ID prefix is also unlikely to change
  e 'post', {
    alt: '[id^="update-"]'
    ssFilter:
      postIsSelected: {borderLeftColor: POST_IS_SELECTED_COLOR}
      postIsNew:      {borderLeftColor: POST_IS_NEW_COLOR}
  }, (-> $('[id^="update-"]') ), ->

    # Look for placeholder
    e 'postPlaceholder_c', (-> @children(':empty'))

    # Look for menu, XXX injected later
    e 'postMenu_c', {pri: '[role="menu"]'}, (-> @children('[role="menu"]'))

    # Look for contents of a typical post
    e 'postUserHeading_c', (-> @find('h3:first')), ->
      e 'postUserHeadingName_c', (-> @children())
      e 'postHead_c', (-> @parent()), ->
        e 'postMenuButton_c', (-> @children('[role="button"]'))
        e 'postUserAvatarA_cc', (-> @children('a[href^="/"][oid]')), ->
          e 'postUserAvatarImg_cc', (-> @children('img'))
        e 'postUserNameA_c', (-> @find('div:eq(0) a[href^="/"][oid]')), ->
          e 'postUserName_c', (-> @parent()), ->
            e 'postHeadInfo_c', (-> @next()), ->
              e 'postTime_c', (-> @children('span:first')), ->
                e 'postTimeA_c', (-> @children('a'))
                e 'postCategoryA_c', (-> @next().children('a')), ->
                  e 'postCategory_c', (-> @parent()), ->
              e 'postPermissions_c', (-> @children('[role="button"]'))

        e 'postContainer_c', (-> @parent())
        e 'postBody_c', (-> @next()), ->
          e 'postContent_c', (-> @children(':first')), ->
            # TODO: this may vary depending on the type of post
            e 'postContentExpandButton_c', (-> @find('[role="button"]:contains(»)'))

          e 'postPlusOneButton_c', {alt: 'button[id][g\\:entity]'}, (-> @find('button[id][g\\:entity]')), ->
            e 'postActionBar_c', (-> @parent()), ->
              e 'postStats_c', (-> @next())
              # NOTE: we can't look inside the stats div, coz there may not be anything for this
              # particular post
            e 'postCommentLink_c', (-> @next()), ->
              e 'postShareLink_c', (-> @next())

          e 'postComments_c', (-> @next()), ->
            # NOTE: we can't look inside these divs coz there may not be any comments; we'll look below
            e 'postCommentsToggler_c', (-> @children(':eq(0)')), ->
              e 'postCommentsButtonChevron_c', (-> @children('[role="button"]:eq(0)')), ->
                e 'postCommentsButtonText_c', (-> @next()), ->
                  e 'postCommentsButtonTextLink_c', (-> @children('[role="button"]')), ->
                    e 'postCommentsButtonTextLinkCount_c', (-> @children(':eq(0)'))
                    e 'postCommentsButtonTextLinkWord_c', (-> @children(':eq(1)'))
                  # TODO: these show up only when there are comments
                  e 'postCommentsButtonTextFromNames_c', (-> @children(':eq(1)')), ->
                    e 'postCommentsButtonTextFromNamesText_c', (-> @children())

            e 'postCommentsList_c', (-> @children(':eq(1)')), ->
              e 'postCommentsOlderButton_c', (-> @children('[role="button"]:eq(0)'))
              e 'postCommentsStream_c', (-> @children(':eq(1)'))

            e 'postCommentsFooter_c', (-> @next()), ->
              e 'postCommentFooterChevron_c', (-> @children('span[role="button"]'))
              # Fake input box 'Add a comment' which is really a button
              e 'postCommentButton_c', (-> @children('div[role="button"]'))

            e 'postCommentAddRow_c', (-> @next()), ->
              e 'postCommentAddButton_c', (-> @children('div[role="button"]')) # What's the span one for?

  , -> # aggSlaveRules to 'post'
    ss postIsSelected: {borderLeftColor: POST_IS_SELECTED_COLOR}
    ss postIsNew:      {borderLeftColor: POST_IS_NEW_COLOR}

# TODO
#    # Let's look for stats from the list of posts
#
#    # FIXME: the post may not have +1s; need to search through all posts
#    e 'postStatsPlus_c', @children(':first'), ->
#      e 'postStatsPlusCount_c', @children(':eq(0)'), ->
#        e 'postStatsPlusScoreText_c', @children()
#      # FIXME: there's an empty div after the +1  class="QD mz"
#    # FIXME: the post may not have shares; need to search through all posts
#    e 'postStatsShare_c', @children(':eq(1)'), ->
#      e 'postStatsShareScore_c', @children('span:eq(0)')
#      e 'postStatsShareNames_c', @children('span:eq(1)')

  #
  # Global stylesheet rules
  #

  ss gbarParentIsFixed: {position: 'fixed', top: '0', width: '100%'}
  ss gplusBarIsFixed: {position: 'fixed', top: /./, zIndex: /./}
  ss postHeadInfoMuted: color: 'rgb(196, 43, 44)'
  ss hangoutLiveIcon: background: 'icon_live_active'

  #
  # Path Combos that give more context
  #
  
  s = @s
  mapParentContext = (target, parent, child)->
    if s[parent] and s[child]
      s[target] = s[parent] + ' > ' + s[child]

  mapParentContext 'postUserAvatarA_c'    , 'postHead_c'           , 'postUserAvatarA_cc'
  mapParentContext 'postUserAvatarImg_c'  , 'postUserAvatarA_c'    , 'postUserAvatarImg_cc'
  mapParentContext 'gbarToolsProfileEmail', 'gbarToolsProfileName' , 'gbarToolsProfileEmail_c'
  mapParentContext 'gbarLinksList'        , 'gbarLinks'            , 'gbarList_c'
  mapParentContext 'gbarLinksListItem'    , 'gbarLinksList'        , 'gbarListItem_c'
  mapParentContext 'gbarToolsList'        , 'gbarTools'            , 'gbarList_c'
  mapParentContext 'gbarToolsListItem'    , 'gbarToolsList'        , 'gbarListItem_c'

  #
  # These need to be done carefully with delay, as they're injected later
  #

  #ed 'gbarToolsNotificationPullDown', '#gbwc' # FIXME: comes later
  #ed 'gbarToolsNotificationFrame', '#gbsf' # FIXME: comes later

  #e 'postMenu', $posts.first().find('[role="menu"]') # FIXME: comes later
  # TODO: how to distinguish between the different menuitems in any language?
  # TODO: get the menuitem's hover class

  # TODO: select an item thn another, then wait for that other
  # to have added a classname, which would mean "selected"

  # TODO: get A inside of time when it appears

  #
  # End
  #
  return
