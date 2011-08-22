# ***************************************************************************
# GPlusX - Google+ Extension SDK
#
# This file contains all the rules for extracting selectors and classnames for all
# parts of the Google+ page.
# ***************************************************************************

# Returns a unique ID for this set of mapping;
# null, if there aren't enough mappings to generate an ID
gplusxMapIdFunc = ->
#  if @s.gbarParent?
#    # The settings page has no gplusbar, but I hesitate to only take
#    # one element's className as an ID
#    @s.gbarParent + if @s.gplusBar? then ',' + @s.gplusBar else ''
#  else
#    null
  if @s.gbarParent? then @s.gbarParent else null

# Executes just the rules sufficient for generating an ID
gplusxMappingRulesForId = ->
  ed 'gbar', '#gb', ->
    e 'gbarParent', @(-> @parent()), ->
      e 'gplusBarBg', @(-> @next()), ->
        e 'gplusBar', @(-> @children())
  return

# Executes rules to extract selectors and CSS class names
#
# This method of generating class names is based on heuristics,
# primarily targeting the case when only class names change.
# If the actual DOM structure changes, much of this won't work
# and this library will need to be updated.
gplusxMappingRules = ->

  ###########################################################################
  # Aliases
  #

  debug = @debug
  error = @error

  # extract: function(key, $el, callback)
  # Extracts selector and classnames for the given key from the specified
  # element.
  # Only the first element will be looked at.
  # @param callback: Optional callback to call with 'this' set to $el
  #   for convenience.
  e = @e

  # extractWithAlternate: function(key, $el, selector, callback, addClassSelectors):
  # Extracts selector and classnames for the given key from the specified
  # element where you've already decided on a selector.
  # Only processes the first element passed in.
  # Example selectors: '#id' or '[role="button"]' or 'span[role="menu"]'
  # @param callback: Optional callback to call with 'this' set to $el
  #   for convenience.
  # @param addClassSelectors: If true, makes selector even more specific by adding
  #   classes.
  ea = @ea
  ep = @ep

  # extractFromDocument: Convenience method, when there is no context to use, that calls
  # jQuery/querySelector on the specified selector.  The specified selector will be
  # recorded as a primary.
  # For example, good for #id because it doesn't require a context.
  ed = @ed

  # End of aliases
  ###########################################################################


  #
  # Gbar
  #

  ed 'gbar', '#gb', ->
    e 'gbarParent', @(-> @parent()), ->

      #
      # WebXBar
      #

      # FIXME: there's a different kind of bar in the Settings page
      e 'gplusBarBg', @(-> @next()), ->
        e 'gplusBar', @(-> @children()), ->

          e 'gplusBarNav', @(-> @find('[role="navigation"]')), ->
    # Too early for Aria
    #e('gplusBarNavHomeA', $_ = $('[aria-label="Home"]'));
    #e('gplusBarNavHomeIcon_c', $_.children());
    #e('gplusBarNavPhotosA', $_ = $('[aria-label="Photos"]'));
    #e('gplusBarNavPhotosIcon_c', $_.children());
    #e('gplusBarNavProfileA', $_ = $('[aria-label="Profile"]'));
    #e('gplusBarNavProfileIcon_c', $_.children());
    #e('gplusBarNavCirclesA', $_ = $('[aria-label="Circles"]'));
    #e('gplusBarNavCirclesIcon_c', $_.children());
            e 'gplusBarNavStreamA', @(-> @children('a:first-child')), ->
              e 'gplusBarNavStreamIcon_c', @(-> @children())
              e 'gplusBarNavPhotosA', @(-> @next()), ->
                e 'gplusBarNavPhotosIcon_c', @(-> @children())
                e 'gplusBarNavProfileA', @(-> @next()), ->
                  e 'gplusBarNavProfileIcon_c', @(-> @children())
                  e 'gplusBarNavCirclesA', @(-> @next()), ->
                    e 'gplusBarNavCirclesIcon_c', @(-> @children())

  ed 'gbarTop', '#gbw'

  ed 'gbarLinks', '#gbz', ->
    e 'gbarList_c', @(-> @children('ol')), -> # This is the same as for gbarTools, so requires context
      e 'gbarListItem_c', @(-> @children('li')) # This is the same as for gbarTools, so requires context

  ed 'gbarLinksMoreUnit', '#gbztms'
  ed 'gbarLinksMoreUnitText', '#gbztms1'
  ed 'gbarMorePullDown', '#gbd'
  ed 'gbarTools', '#gbg'
  ed 'gbarToolsProfileNameA', '#gbg6'
  ed 'gbarToolsProfileNameText', '#gbi4t'
  ed 'gbarToolsNotificationA', '#gbg1'
  ed 'gbarToolsNotificationUnit', '#gbgs1'
  ed 'gbarToolsNotificationUnitBg', '#gbi1a'
  ed 'gbarToolsNotificationUnitFg', '#gbi1'
  ed 'gbarToolsShareA', '#gbg3'
  ed 'gbarToolsShareUnit', '#gbgs3'
  ed 'gbarToolsShareUnitText', '#gbi3'
  ed 'gbarToolsProfilePhotoA', '#gbg4'
  ed 'gbarToolsProfilePullDown', '#gbd4'
  ed 'gbarToolsProfileCard', '#gbmpdv', ->
    e 'gbarToolsProfileCardContent_c', @(-> @children('div').first()), ->
      e 'gbarToolsProfileCardContentList_c', @(-> @children('ol')), ->
        e 'gbarToolsProfileCardContentListItem_c', @(-> @children('li'))

  ed 'gbarToolsProfileName', '#gbmpn', ->
    e 'gbarToolsProfileEmail_c', @(-> @next()) # Also in the "Switch" panel
  ed 'gbarToolsProfileSwitch', '#gbmps'
  ed 'gbarToolsGear', '#gbg5'
  ed 'gbarToolsGearPullDown', '#gbd5'

  ed 'searchBox', '#search-box'
  ed 'searchBoxInput', '#ozIdSearchBox'

  #
  # IDs -- these are unlikely to change any time soon
  #

  ed 'content', '#content' # FIXME: too early: sometimes gets 'maybe-hide' class
  ed 'contentPane', '#contentPane'

  #
  # Main stream page
  #

  e 'postsStream', @(-> $('[id^="update-"]').first().parent())

  # Posts ID prefix is also unlikely to change
  ea 'post', @(-> $('[id^="update-"]') ), '[id^="update-"]', ->
    # Look for placeholder
    e 'postPlaceholder_c', @(-> @children(':empty'))

    # Look for menu, XXX injected later
    e 'postMenu_c', @(-> @children('[role="menu"]'))

    # Look for contents of a typical post
    e 'postUserHeading_c', @(-> @find('h3:first')), ->
      e 'postUserHeadingName_c', @(-> @children())
      e 'postHead_c', @(-> @parent()), ->
        e 'postMenuButton_c', @(-> @children('[role="button"]'))
        e 'postUserAvatarA_c', @(-> @children('a[href^="/"][oid]')), ->
          e 'postUserAvatarImg_c', @(-> @children('img'))
        e 'postUserNameA_c', @(-> @find('a[href^="/"][oid]')), ->
          e 'postUserName_c', @(-> @parent()), ->
            e 'postHeadInfo_c', @(-> @next()), ->
              e 'postTime_c', @(-> @children('span:first')), ->
                e 'postTimeA_c', @(-> @children('a'))
              e 'postPermissions_c', @(-> @children('[role="button"]'))

        e 'postContainer_c', @(-> @parent())
        e 'postBody_c', @(-> @next()), ->
          e 'postContent_c', @(-> @children(':first')), ->
            # TODO: this may vary depending on the type of post

          ea 'postPlusOneButton_c', @(-> @find('button[id][g\\:entity]')), 'button[id][g\\:entity]', ->
            e 'postTools_c', @(-> @parent()), ->
              e 'postStats_c', @(-> @next())
              # NOTE: we can't look inside the stats div, coz there may not be anything for this
              # particular post
            e 'postCommentLink_c', @(-> @next()), ->
              e 'postShareLink_c', @(-> @next())

          e 'postComments_c', @(-> @next()), ->
            # NOTE: we can't look inside these divs coz there may not be any comments; we'll look below
            e 'postCommentsToggler_c', @(-> @children(':eq(0)')), ->
              e 'postCommentsButtonChevron_c', @(-> @children('[role="button"]:eq(0)'))
              e 'postCommentsButtonText_c', @(-> @children('[role="button"]:eq(1)')), ->
                e 'postCommentsButtonTextCount_c', @(-> @children(':eq(0)'))
                e 'postCommentsButtonTextWord_c', @(-> @children(':eq(1)'))

            e 'postCommentsList_c', @(-> @children(':eq(1)')), ->
              e 'postCommentsOlderButton_c', @(-> @children('[role="button"]:eq(0)'))
              e 'postCommentsStream_c', @(-> @children(':eq(1)'))

            e 'postCommentsFooter_c', @(-> @next()), ->
              e 'postCommentFooterChevron_c', @(-> @children('span[role="button"]'))
              # Fake input box 'Add a comment' which is really a button
              e 'postCommentButton_c', @(-> @children('div[role="button"]'))

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
  # Path Combos that give more context
  #

  @s.gbarToolsProfileEmail       = @s.gbarToolsProfileName + ' > ' + @s.gbarToolsProfileEmail_c
  @s.gbarLinksList               = @s.gbarLinks           + ' > ' + @s.gbarList_c
  @s.gbarLinksListItem           = @s.gbarLinksList       + ' > ' + @s.gbarListItem_c
  @s.gbarToolsList               = @s.gbarTools           + ' > ' + @s.gbarList_c
  @s.gbarToolsListItem           = @s.gbarToolsList       + ' > ' + @s.gbarListItem_c

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
