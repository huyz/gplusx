/****************************************************************************
 * GPlusX standalone browser extension
 ***************************************************************************/
    
// Main
$(document).ready(function() {
  var mapFilename = 'gplusx-map.json';
  var rulesFilename = 'gplusx-rules-cache.json'; // Don't use 'js' because won't allow us to save it

  var gpx = new GPlusX({
    mapIdFunc: gplusxMapIdFunc,
    mappingRulesForId: gplusxMappingRulesForId,
    mappingRules: gplusxMappingRules
  });
  gpx.surveyRules();
  gpx.wxMap.writeToLocalStorage();

  GPlusX.debug("rules-survey: s=", gpx.map.s);
  GPlusX.debug("rules-survey: sAlt=", gpx.map.sAlt);
  GPlusX.debug("rules-survey: c=", gpx.map.c);
  GPlusX.debug("rules-survey: rules=", gpx.rules);
  //GPlusX.debug("rules-survey: map=", gpx.wxMap.toString());

  // Write out Mappings to tab
  if (confirm("GPlusX: save new mappings to file?")) {
    gpx.writeMapToFile(mapFilename, function(url) {
      url = url.replace(/\/$/, '') + '/';
      chrome.extension.sendRequest({action: 'gplusxOpenTab', url: url + mapFilename});
    });
  }
  // Write out Rules to tab
  if (confirm("GPlusX: save new rules to file?")) {
    gpx.writeRulesToFile(rulesFilename, function(url) {
      url = url.replace(/\/$/, '') + '/';
      chrome.extension.sendRequest({action: 'gplusxOpenTab', url: url + rulesFilename});
    });
  }

  // Test reading
  gpx.readMapFromFile(function() {
    GPlusX.debug("fromFile: s=", gpx.map.s);
    GPlusX.debug("fromFile: sAlt=", gpx.map.sAlt);
    GPlusX.debug("fromFile: c=", gpx.map.c);
  }, '/' + mapFilename);
  gpx.readRulesFromFile(function() {
    GPlusX.debug("fromFile: rules=", gpx.rules);
  }, '/' + rulesFilename);
});
