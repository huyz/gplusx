
function GPlusX() {
  // Inherit all the WebX properties
  for (var i in WebX) {
    this[i] = WebX[i];
  }
}

GPlusX.prototype = {

  getProfile: function() {
    return {
      name: this.find$('gbarToolsProfileNameText').text(),
      email: this.find$('gbarToolsProfileEmail').text()
    };
  },

  getNotificationCount: function() {
    return this.find$('gbarToolsNotificationUnitFg').text();
  },

  getGbar$: function() {
    return this.find$('gbar');
  },

  getGplusBar$: function() {
    return this.find$('gplusBar');
  },

  getStream$: function() {
    return this.find$('postsStream');
  },

  getPosts$: function() {
    return this.find$('post');
  },

  // Extended version of posts$
  getPostsX$: function() {
    return this.find$(this.map.s.post + ',[id^="sgp-post-"]');
  }
}

GPlusX.createNonJQueryFunctions();
