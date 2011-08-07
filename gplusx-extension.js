/****************************************************************************
 * Main
 ***************************************************************************/
    
$(document).ready(function() {
  var gpx = new Gpx();
  gpx.update('dependencySurvey');
  gpx.gpxMap.saveMap();

  Gpx.debug("dependencySurvey: s=", gpx.map.s);
  Gpx.debug("dependencySurvey: c=", gpx.map.c);
  Gpx.debug("dependencySurvey: ruleDependencies=", gpx.gpxMap.ruleDependencies);
  Gpx.debug("dependencySurvey: map=", gpx.writeToString());

  gpx.readFromFile(function() {
    Gpx.debug("fromFile: s=", gpx.map.s);
    Gpx.debug("fromFile: c=", gpx.map.c);
  }, '/gplusx-map.json');
});
