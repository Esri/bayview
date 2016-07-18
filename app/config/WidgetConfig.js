define(['esri/layers/FeatureLayer'], function(FeatureLayer) {
  return {

    basemapGallery: {
      isEnabled: true,
      useCustomBasemaps: true,
      customBasemaps: ['streets', 'satellite', 'hybrid', 'gray', 'dark']
    },

    coordinates: {
      isEnabled: true
    },

    legend: {
      isEnabled: false,
      title: 'Legend',
      container: 'titlepane', // options are: 'titlepane', 'dropdown', 'none'
      autoUpdate: true, // ignored if Portal
      respectCurrentMapScale: true, // ignored if Portal
      includeLayerIds: ['states', 'farmers_markets', 'fsa_state_offices'] // leave empty if all  // ignored if Portal
    },

    layerList: {
      groups: [
        {
          name: 'Points of Interest',
          isSelected: true,
          layers: [
            {
              name: 'Beach Access',
              isSelected: true,
              url: ''
            },
            {
              name: 'Boat Ramps',
              isSelected: false,
              url: ''
            }
          ]
        }
      ]
    },

    basemapToggle: {
      basemaps: [
        {
          name: 'Basemap 1',
          url: ''
        },
        {
          name: 'Basemap 2',
          url: ''
        }
      ]
    },

    unifiedSearch: {
      isEnabled: true,
      placeholder: 'Find projects...',
      searchDelay: 400,
      zoomToFeature: true, // zoom to the feature after selecting it
      showInfoWindow: true, // show info window after zooming to feature,
      geocode: {
        isEnabled: true,
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
        addressLabelFunction: function(attrs) {
          return attrs.Match_addr;
        },
        distance: 500
      },
      tables: [{
        url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer/5',
        idField: 'ObjectID', // this is the id field that serves as the unique id and needs to be related to the feature layer
        query: {
          returnGeometry: true, // if false then relatedQuery is used to determine geometry
          id: 'states', // unique identifier within the unifiedSearch Config
          fields: ['STATE_NAME', 'STATE_ABBR'], // field to be queried on (where clause)
          group: {
            isGrouped: false,
            sectionHeader: 'States',
            iconClass: 'fa fa-folder'
          },
          results: {
            labelFields: ['STATE_ABBR'],
            // comment out to use the label field instead (only first field in the array of labelFields will be used)
            /*
            labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
              return attrs.pocname + ' (' + attrs.opsstatus + ')';
            },
            */
            iconClassFunction: function(attrs) {
              return 'stateface stateface-' + attrs.STATE_ABBR.toLowerCase();
            },
            iconClass: 'fa fa-map-marker',
            priority: 0
          },
          relatedQuery: null
        }
      },
      {
        url: 'http://sampleserver5.arcgisonline.com/arcgis/rest/services/PhoneIncidents/FeatureServer/0',
        idField: 'objectid', // this is the id field that serves as the unique id and needs to be related to the feature layer
        query: {
          returnGeometry: true, // if false then relatedQuery is used to determine geometry
          id: 'phone_incidents', // unique identifier within the unifiedSearch Config
          fields: ['pocname', 'pocemail', 'opsstatus', 'location'], // field to be queried on (where clause)
          group: {
            isGrouped: false,
            sectionHeader: 'Phone Incidents',
            iconClass: 'fa fa-phone'
          },
          results: {
            labelFields: ['pocname', 'opsstatus'],
            labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
              return attrs.pocname + ' (' + attrs.opsstatus + ')';
            },
            iconClassFunction: function(attrs) {
              return 'fa fa-flash';
            },
            priority: 3
          },
          relatedQuery: null
        }
      },
      {
        url: 'http://sampleserver5.arcgisonline.com/arcgis/rest/services/PhoneIncidents/FeatureServer/0',
        idField: 'objectid', // this is the id field that serves as the unique id and needs to be related to the feature layer
        query: {
          returnGeometry: true, // if false then relatedQuery is used to determine geometry
          id: 'phone_incidents_grouped', // unique identifier within the unifiedSearch Config
          fields: ['pocname', 'pocemail', 'opsstatus', 'location'], // field to be queried on (where clause)
          group: {
            isGrouped: true,
            sectionHeader: 'Phone Incidents',
            iconClass: 'fa fa-phone'
          },
          results: {
            labelFields: ['pocname', 'opsstatus'],
            labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
              return attrs.pocname + ' (' + attrs.opsstatus + ')';
            },
            iconClassFunction: function(attrs) {
              return 'fa fa-flash';
            },
            priority: 2
          },
          relatedQuery: null
        }
      },
      {
        url: 'http://165.248.35.76/arcgis/rest/services/Dashboard/Hawaii_DOE_Dashboard/MapServer/6',
        idField: 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
        query: {
          returnGeometry: true, // if false then relatedQuery is used to determine geometry
          id: 'schools', // unique identifier within the unifiedSearch Config
          fields: ['FULLNAME', 'ADDRESS', 'CITY'], // field to be queried on (where clause)
          group: {
            isGrouped: true,
            sectionHeader: 'Schools in Hawaii',
            iconClass: 'fa fa-users'
          },
          results: {
            labelFields: ['FULLNAME'],
            labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
              return attrs.FULLNAME;
            },
            iconClassFunction: function(attrs) {
              return 'fa fa-user';
            },
            priority: 1
          },
          relatedQuery: {
            isRelated: true,
            url: 'http://165.248.35.76/arcgis/rest/services/Dashboard/Hawaii_DOE_Dashboard/MapServer/0', // the url of the related layer
            foreignKeyField: 'OBJECTID' // relate the idField to this foreignKeyField
          }
        }
      }],
      locators: [
        {
          id: 'world_geocoder',
          url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer', // http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators
          minScore: 80,
          countryCode: 'US',
          maxLocations: 3
        },
        {
          id: 'us_geocoder',
          url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer',
          minScore: 80,
          maxLocations: 3
        }
      ]
    }

  };
});
