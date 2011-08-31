/****************************************************************************
 * Gplusx Class
 *
 * Requires jQuery internally but you don't have to use it yourself.
 * TODO: port so that jQuery is no longer required.
 ****************************************************************************/

;(function($){ // Semicolon coz https://github.com/mootools/slick/wiki/IIFE

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

}).call(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this, jQuery);

