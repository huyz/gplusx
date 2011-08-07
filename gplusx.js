
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

// Create non-jQuery functions
for (var i in GPlusX.prototype) {
  if (GPlusX.prototype.hasOwnProperty(i)) {
    var fn = GPlusX.prototype[i];
    var fnName = GPlusX.prototype[i].toString();
    if (fnName.charAt(fnName.length - 1) === '$') {
      (function(fn) {
        GPlusX.prototype[fnName.substring(0, fnName.length - 1)] = function() {
          return fn.apply(this, arguments).get();
        };
      })(fn);
    }
  }
}
