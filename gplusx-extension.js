/****************************************************************************
 * Main
 ***************************************************************************/
    
$(document).ready(function() {
  var gpx = new GPlusX(gplusxMappingRules);
  gpx.surveyRules();
  gpx.wxMap.saveMap();

  GPlusX.debug("dependencySurvey: s=", gpx.map.s);
  GPlusX.debug("dependencySurvey: c=", gpx.map.c);
  GPlusX.debug("dependencySurvey: ruleDependencies=", gpx.wxMap.ruleDependencies);
  GPlusX.debug("dependencySurvey: map=", gpx.writeToString());

  wx.readFromFile(function() {
    GPlusX.debug("fromFile: s=", gpx.map.s);
    GPlusX.debug("fromFile: c=", gpx.map.c);
  }, '/gplusx-map.json');
});
