/****************************************************************************
 * Gplusx standalone browser extension
 ***************************************************************************/

// Turns on debugging for this extension and Webx
var DEBUG = true;
    
// Main
$(document).ready(function() {
  var mapFilename = 'gplusx-map.json';
  var rulesFilename = 'gplusx-rules-cache.json'; // Don't use 'js' because won't allow us to save it

  var gpx = new Gplusx({
    bundledMapFilepath: '/gen/' + mapFilename,
    bundledRulesFilepath: '/gen/' + rulesFilename,
    strict: true,
    warn: true,
    debug: DEBUG
  }, function() {

    gpx.dumpToConsole('From bundled file');

    // Survey rules and new mappings
    gpx.surveyRules();
    gpx.dumpToConsole('From rules survey');

    //Gplusx.debug($(':Xpost'));

    // Convoluted functional programming so that code gets invoked synchronously
    // regardless of user choice (result of confirm())
    function writeRulesToFile() {
      // Write out rules to tab
      if (confirm("Gplusx: save new rules to file?")) {
        gpx.writeRulesToFile(rulesFilename, function(url) {
          url = url.replace(/\/$/, '') + '/';
          chrome.extension.sendRequest({action: 'gplusxOpenTab', url: url + rulesFilename});
        });
      }
    }

    // Write out Mappings to tab
    if (confirm("Gplusx: save new mappings to file?")) {
      gpx.writeMapToFile(mapFilename, function(url) {
        url = url.replace(/\/$/, '') + '/';
        chrome.extension.sendRequest({action: 'gplusxOpenTab', url: url + mapFilename}, function() {
          writeRulesToFile();
        });
      });
    } else {
      writeRulesToFile();
    }
  });
});
