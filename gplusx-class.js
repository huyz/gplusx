/****************************************************************************
 * GPlusX Class
 *
 * Requires jQuery internally but you don't have to use it yourself.
 * TODO: port so that jQuery is no longer required.
 ****************************************************************************/

function GPlusX(config) {
  WebX.call(this, config);
}

GPlusX.debug = function() {
    var args = Array.prototype.slice.call(arguments);
      args.unshift('GPlusX:');
        console.debug.apply(console, args);
};

GPlusX.error = function() {
    var args = Array.prototype.slice.call(arguments);
      args.unshift('GPlusX:');
        console.error.apply(console, args);
};

GPlusX.prototype = new WebX;


GPlusX.prototype.getProfile = function() {
  return {
    name: this.find$('gbarToolsProfileNameText').text(),
    email: this.find$('gbarToolsProfileEmail').text()
  };
};

GPlusX.prototype.getNotificationCount = function() {
  return this.find$('gbarToolsNotificationUnitFg').text();
};

GPlusX.prototype.getGbar$ = function() {
  return this.find$('gbar');
};

GPlusX.prototype.getGplusBar$ = function() {
  return this.find$('gplusBar');
};

GPlusX.prototype.getStream$ = function() {
  return this.find$('postsStream');
};

GPlusX.prototype.getPosts$ = function() {
  return this.find$('post');
};

// Extended version of posts$
GPlusX.prototype.getPostsX$ = function() {
  return this.find$(this.map.s.post + ',[id^="sgp-post-"]');
};

WebX.createNonJQueryFunctions.call(GPlusX);
