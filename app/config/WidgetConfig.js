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

    drawTool: {
      tools: ['POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'], // 'POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'
      hasSaveButton: false,
      hasClearButton: true
    },

    layerList: {
      groups: [
        {
          name: 'Points of Interest',
          isSelected: false,
          icon: 'fa fa-thumb-tack',
          layers: [
            {
              name: 'Hydrants',
              id: 'hydrants',
              isSelected: false,
              url: ''
            },
            {
              name: 'Beach Access',
              isSelected: false,
              url: ''
            },
            {
              name: 'Boat Ramps',
              isSelected: false,
              url: ''
            },
            {
              name: 'Libraries',
              isSelected: false,
              url: ''
            },
            {
              name: 'Parks',
              isSelected: false,
              url: ''
            },
            {
              name: 'Recycling',
              isSelected: false,
              url: ''
            },
            {
              name: 'Schools',
              isSelected: false,
              url: ''
            }
          ]
        },

        {
          name: 'Parcels and Community',
          isSelected: false,
          icon: 'fa fa-home',
          layers: [
            {
              name: 'Parcels',
              isSelected: false,
              url: ''
            },
            {
              name: 'Addresses',
              isSelected: false,
              url: ''
            },
            {
              name: 'AADT',
              isSelected: false,
              url: ''
            },
            {
              name: 'Municipal Boundaries',
              isSelected: false,
              url: ''
            },
            {
              name: 'Creeks',
              isSelected: false,
              url: ''
            },
            {
              name: 'Planned unit Development',
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
          name: 'Streets',
          basemap: 'streets'
        },
        {
          name: 'Satellite',
          basemap: 'satellite'
        }
      ]
    },

    unifiedSearch: {
      isEnabled: true,
      placeholder: 'Find parcels, addresses, or roads...',
      searchDelay: 400,
      zoomToFeature: true, // zoom to the feature after selecting it
      showInfoWindow: true, // show info window after zooming to feature,
      geocode: {
        isEnabled: false,
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
        addressLabelFunction: function(attrs) {
          return attrs.Match_addr;
        },
        distance: 500
      },
      tables: [{
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/0',
        idField: 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
        query: {
          returnGeometry: true, // if false then relatedQuery is used to determine geometry
          id: 'addresses', // unique identifier within the unifiedSearch Config
          fields: ['ADDRESS'], // field to be queried on (where clause)
          group: {
            isGrouped: true,
            sectionHeader: 'Addresses',
            iconClass: 'fa fa-folder'
          },
          results: {
            labelFields: ['ADDRESS'],
            // comment out to use the label field instead (only first field in the array of labelFields will be used)
            /*
            labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
              return attrs.pocname + ' (' + attrs.opsstatus + ')';
            },
            iconClassFunction: function(attrs) {
              return 'stateface stateface-' + attrs.STATE_ABBR.toLowerCase();
            },
            */
            iconClass: 'fa fa-map-marker',
            priority: 0
          },
          relatedQuery: null
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
