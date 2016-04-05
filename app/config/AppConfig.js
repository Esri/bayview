/**
 * Esri © 2015
 **/
define(function() {
  return {

    // valid themes: 'claro', 'nihilo', 'soria', 'tundra', 'bootstrap', 'flat', 'arcgis'
    theme: 'flat',

    layout: {
      hasGutters: false,
      panels: {
        hasHeader: true,
        hasLeftPanel: false,
        hasRightPanel: false,
        hasFooter: true
      }
    },

    app: {
      hasLogin: false
    },

    services: {
      geometry: 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer',
      query: {
        // http://arcgis-localgov-61933129.us-west-1.elb.amazonaws.com/arcgis/rest/services/CampusPlaceFinder/BuildingInterior/MapServer
        buildings: {
          url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/6',
          keyField: 'BUILDINGID',
          orderByFields: ['BUILDINGID'],
          layerId: 'buildings'
        },
        floors: {
          url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/5',
          keyField: 'FLOORID',
          floorField: 'FLOOR',
          relatedKeyBuildings: 'BUILDINGKEY',
          orderByFields: ['FLOOR'],
          layerId: 'interior',
          defExpressionFunction: function(attrs) {
            return 'BUILDING = \'' + attrs.BUILDINGID + '\' AND FLOOR = \'' + attrs.FLOOR + '\'';
          }
        },
        rooms: {
          url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/4',
          keyField: 'LOCATION',
          relatedKeyFloors: 'FLOORKEY',
          labelLocation: 'LOCATION',
          labelShortname: 'SHORTNAME'
        },
        employees: {
          url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/8',
          relatedKeyRooms: 'LOCATION',
          labelNameFunction: function(attrs) {
              return attrs.KNOWN_AS_N || attrs.SHORTNAME || attrs.Match_addr;
          },
          labelLocationFunction: function(attrs) {
            return attrs.LOCATION || (attrs.Subregion + ', ' + attrs.Region) || '';
          }
        },
        floorLines: {
          layerId: 'floorplan_lines',
          defExpressionFunction: function(attrs) {
            return 'BUILDINGKEY = \'' + attrs.BUILDINGKEY + '\'';
          }
        }
      }
    },

    localStorage: {
      key: 'savedRouteLocations',
      maxSavedLocations: 8
    }

  };
});
