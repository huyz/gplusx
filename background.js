/*
 * Filename:         background.js
 * More info, see:   gplusx.js
 *
 * Web:              http://huyz.us/gplusx/
 * Source:           https://github.com/huyz/gplusx
 * Author:           Huy Z  http://huyz.us/
 */

/****************************************************************************
 * Event handlers
 ***************************************************************************/

// Listen to incoming messages from content scripts
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    default: break;
  }
});
