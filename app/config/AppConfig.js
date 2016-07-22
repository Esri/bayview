define(function() {
  return {

    app: {
      hasLogin: false
    },

    services: {
      geometry: 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',
      layers: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/1'
    }

  };
});
