# ***************************************************************************
# GPlusX - Google+ Extension SDK
#
# This file contains all the rules for extracting selectors and classnames for all
# parts of the Google+ page.
# ***************************************************************************

# Returns a unique ID for this set of mapping;
# null, if there aren't enough mappings to generate an ID
gplusxMapIdFunc = () ->
  if @s.gbarParent?
    # The settings page has no gplusbar, but I hesitate to only take
    # one element's className as an ID
    @s.gbarParent + if @s.gplusBar? then @s.gplusBar else ''
  else
    null

# Executes just the rules sufficient for generating an ID
gplusxMappingRulesForId = () ->
  ej 'gbar', '#gb', ->
    e 'gbarParent', @parent(), ->
      e 'gplusBarBg', @next(), ->
        e 'gplusBar', @children()
  undefined

# Executes rules to extract selectors and CSS class names
gplusxMappingRules = (mode) ->
  s = @s = {}
  c = @c = {}
  @mode = mode

  #
  # Aliases
  #

  _this = this
  debug = ->
    WebXMap.debug.apply undefined, arguments
  error = ->
    WebXMap.error.apply undefined, arguments

  # extract: function(key, $el, callback)
  # Extracts selector and classnames for the given key from the specified
  # element.
  # Only the first element will be looked at.
  # @param callback: Optional callback to call with 'this' set to $el
  #   for convenience.
  e = ->
    args = Array::slice.call arguments
    args.unshift e.caller
    _this.extract.apply _this, args

  # extractWithSelector: function(key, $el, selector, callback, addClassSelectors):
  # Extracts selector and classnames for the given key from the specified
  # element where you've already decided on a selector.
  # Only processes the first element passed in.
  # Example selectors: '#id' or '[role="button"]' or 'span[role="menu"]'
  # @param callback: Optional callback to call with 'this' set to $el
  #   for convenience.
  # @param addClassSelectors: If true, makes selector even more specific by adding
  #   classes.
  es = ->
    args = Array::slice.call arguments
    args.unshift es.caller
    _this.extractWithSelector.apply _this, args

  # extractCallingJQuery: Convenience method that calls jQuery on the selector and then
  # calls es().
  # Good for #id because it doesn't require a context, so this
  # calls jQuery for you.
  ej = ->
    args = Array::slice.call arguments
    args.unshift ej.caller
    _this.extractCallingJQuery.apply _this, args

  #
  # Gbar
  #

  ej 'gbar', '#gb', ->
    e 'gbarParent', @parent(), ->

      #
      # WebXBar
      #

      # FIXME: there's a different kind of bar in the Settings page
      e 'gplusBarBg', @next(), ->
        e 'gplusBar', @children(), ->

          e 'gplusBarNav', @find('[role="navigation"]'), ->
    # Too early for Aria
    #e('gplusBarNavHomeA', $_ = $('[aria-label="Home"]'));
    #e('gplusBarNavHomeIcon_c', $_.children());
    #e('gplusBarNavPhotosA', $_ = $('[aria-label="Photos"]'));
    #e('gplusBarNavPhotosIcon_c', $_.children());
    #e('gplusBarNavProfileA', $_ = $('[aria-label="Profile"]'));
    #e('gplusBarNavProfileIcon_c', $_.children());
    #e('gplusBarNavCirclesA', $_ = $('[aria-label="Circles"]'));
    #e('gplusBarNavCirclesIcon_c', $_.children());
            e 'gplusBarNavStreamA', @children('a:first-child'), ->
              e 'gplusBarNavStreamIcon_c', @children()
              e 'gplusBarNavPhotosA', @next(), ->
                e 'gplusBarNavPhotosIcon_c', @children()
                e 'gplusBarNavProfileA', @next(), ->
                  e 'gplusBarNavProfileIcon_c', @children()
                  e 'gplusBarNavCirclesA', @next(), ->
                    e 'gplusBarNavCirclesIcon_c', @children()

  ej 'gbarTop', '#gbw'

  ej 'gbarLinks', '#gbz', ->
    e 'gbarList_c', @children('ol'), -> # This is the same as for gbarTools, so requires context
      e 'gbarListItem_c', @children('li') # This is the same as for gbarTools, so requires context

  ej 'gbarLinksMoreUnit', '#gbztms'
  ej 'gbarLinksMoreUnitText', '#gbztms1'
  ej 'gbarMorePullDown', '#gbd'
  ej 'gbarTools', '#gbg'
  ej 'gbarToolsProfileNameA', '#gbg6'
  ej 'gbarToolsProfileNameText', '#gbi4t'
  ej 'gbarToolsNotificationA', '#gbg1'
  ej 'gbarToolsNotificationUnit', '#gbgs1'
  ej 'gbarToolsNotificationUnitBg', '#gbi1a'
  ej 'gbarToolsNotificationUnitFg', '#gbi1'
  ej 'gbarToolsShareA', '#gbg3'
  ej 'gbarToolsShareUnit', '#gbgs3'
  ej 'gbarToolsShareUnitText', '#gbi3'
  ej 'gbarToolsProfilePhotoA', '#gbg4'
  ej 'gbarToolsProfilePullDown', '#gbd4'
  ej 'gbarToolsProfileCard', '#gbmpdv', ->
    e 'gbarToolsProfileCardContent_c', @children('div').first(), ->
      e 'gbarToolsProfileCardContentList_c', @children('ol'), ->
        e 'gbarToolsProfileCardContentListItem_c', @children('li')

  ej 'gbarToolsProfileName', '#gbmpn', ->
    e 'gbarToolsProfileEmail_c', @next() # Also in the "Switch" panel
  ej 'gbarToolsProfileSwitch', '#gbmps'
  ej 'gbarToolsGear', '#gbg5'
  ej 'gbarToolsGearPullDown', '#gbd5'

  ej 'searchBox', '#search-box'
  ej 'searchBoxInput', '#oz-search-box'

  #
  # IDs -- these are unlike to change any time soon
  # and their close relatives
  #

  ej 'content', '#content' # FIXME: too early: sometimes gets 'maybe-hide' class
  es 'contentPane', $('#contentPane'), '#contentPane'

  #
  # Main stream page
  #

  # Posts ID prefix is also unlikely to change
  $posts = $('[id^="update-"]')
  unless $posts.length
    error 'post'
  else
    # Go through all the posts on the page
    placeholderFound = false
    nonPlaceholderFound = false

    $posts.each (i, el) ->
      # FIXME: no guarantee that they don't all have the occasional light-blue edge,
      # whatever it means (not the dark-blue edge, which means selected)
      if not shortestClassName? or el.className.length < shortestClassName
        shortestClassName = el.className
        postWithShortestClassName = el

      # Look for placeholder
      $postChildren = $(el).children(':not([role="menu"])')
      unless $postChildren.length
        error 'post is completely empty'
      else if not placeholderFound and $postChildren.is(':empty')
        placeholderFound = true;
        e 'postPlaceholder_c', $postChildren
      else if not nonPlaceholderFound and not $postChildren.is(':empty')
        nonPlaceholderFound = true
        e 'postUserHeading_c', $postChildren.find('h3:first'), ->
          e 'postUserHeadingName_c', @children()
          e 'postHead_c', @parent(), ->
            e 'postMenuButton_c', @children('[role="button"]')
            e 'postUserAvatarA_c', @children('a[href^="/"][oid]'), ->
              e 'postUserAvatarImg_c', @children('img')
            e 'postUserNameA_c', @find('a[href^="/"][oid]'), ->
              e 'postUserName_c', @parent(), ->
                e 'postHeadInfo_c', @next(), ->
                  e 'postTime_c', @children('span:first'), ->
                    e 'postTimeA_c', @children('a')
                  e 'postPermissions_c', @children('[role="button"]')

            e 'postContainer_c', @parent()
            e 'postBody_c', @next(), ->
              e 'postContent_c', @children(':first'), ->
                # TODO: this may vary depending on the type of post

              es 'postPlusOneButton_c', @find('button[g\\:type="plusone"]'), 'button[g\\:type="plusone"]', ->
                e 'postTools_c', @parent(), ->
                  e 'postStats_c', @next()
                  # NOTE: we can't look inside the stats div, coz there may not be anything for this
                  # particular post
                e 'postCommentLink_c', @next(), ->
                  e 'postShareLink_c', @next()

              e 'postComments_c', @next(), ->
                # NOTE: we can't look inside these divs coz there may not be any comments; we'll look below
                es 'postCommentsOld_c', @children(':eq(0)'), ':eq(0)'

                e 'postCommentsShown_c', @children(':eq(1)')
                es 'postCommentsMore_c', @children(':eq(2)'), ':eq(2)', ->
                  e 'postCommentsClickArea_cc', @children(':eq(0)') # Class is shared with Old
                  e 'postCommentsMoreLeftEdge_c', @children(':eq(1)')

                # Fake input box 'Add a comment' which is really a button
                e 'postCommentButton_c', @next('[role="button"]')

    es 'post', $(postWithShortestClassName), '[id^="update-"]', ->
      e 'postsStream', $posts.first().parent()

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

  s.gbarToolsProfileEmail       = s.gbarToolsProfileName + ' > ' + s.gbarToolsProfileEmail_c
  s.gbarLinksList               = s.gbarLinks           + ' > ' + s.gbarList_c
  s.gbarLinksListItem           = s.gbarLinksList       + ' > ' + s.gbarListItem_c
  s.gbarToolsList               = s.gbarTools           + ' > ' + s.gbarList_c
  s.gbarToolsListItem           = s.gbarToolsList       + ' > ' + s.gbarListItem_c
  s.postCommentsOldClickArea_c  = s.postCommentsOld_c   + ' > ' + s.postCommentsClickArea_cc
  s.postCommentsMoreClickArea_c = s.postCommentsMore_c  + ' > ' + s.postCommentsClickArea_cc

  #
  # These need to be done carefully with delay, as they're injected later
  #

  ej 'gbarToolsNotificationPullDown', '#gbwc' # FIXME: comes later
  ej 'gbarToolsNotificationFrame', '#gbsf' # FIXME: comes later

  e 'postMenu', $posts.first().find('[role="menu"]') # FIXME: comes later
  # TODO: how to distinguish between the different menuitems in any language?
  # TODO: get the menuitem's hover class

  # TODO: select an item thn another, then wait for that other
  # to have added a classname, which would mean "selected"

  # TODO: get A inside of time when it appears

  #
  # End
  #
  undefined
