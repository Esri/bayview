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
      isEnabled: true,
      title: 'Legend',
      container: 'titlepane', // options are: 'titlepane', 'dropdown', 'none'
      autoUpdate: true, // ignored if Portal
      respectCurrentMapScale: true, // ignored if Portal
      includeLayerIds: ['addresses', 'hydrants', 'parcels'] // leave empty if all  // ignored if Portal
    },

    drawTool: {
      tools: ['POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'], // 'POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'
      symbology: { // http://resources.arcgis.com/en/help/rest/apiref/index.html?renderer.html
        point: {
          'type': 'esriSMS',
          'style': 'esriSMSCircle', // esriSMSCircle | esriSMSCross | esriSMSDiamond | esriSMSSquare | esriSMSX | esriSMSTriangle
          'color': [255, 0, 0, 255],
          'size': 8,
          'angle': 0,
          'xoffset': 0,
          'yoffset': 0,
          'outline': {
            'color': [255, 0, 0, 255],
            'width': 1
          }
        },
        line: {
          'type': 'esriSLS',
          'style': 'esriSLSDash', // esriSLSDash | esriSLSDashDotDot | esriSLSDot | esriSLSNull | esriSLSSolid
          'color': [255, 0, 0, 255], // blue
          'width': 2
        },
        fill: {
          'type': 'esriSFS',
          'style': 'esriSFSSolid', // esriSFSBackwardDiagonal | esriSFSCross | esriSFSDiagonalCross | esriSFSForwardDiagonal | esriSFSHorizontal | esriSFSNull | esriSFSSolid | esriSFSVertical
          'color': [255, 0, 0, 100],
          'outline': {
            'type': 'esriSLS',
            'style': 'esriSLSDash',
            'color': [255, 0, 0, 255],
            'width': 2
          }
        }
      },
      hasSaveButton: false,
      hasClearButton: true
    },

    infoPanel: {
      'addresses': {
        'hasDetails': true,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'ADDRESS',
            'label': 'Address'
          }
        ],
        'analysis': {
          'buffer': {
            'radius': [1, 3, 5],
            'radiusUnit': 'esriMiles',
            'radiusUnitLabel': 'miles',
            'layers': [
              {
                'id': 'schools',
                'label': 'Schools'
              },
              {
                'id': 'libraries',
                'label': 'Libraries'
              },
              {
                'id': 'beachaccess',
                'label': 'Beach Access'
              },
              {
                'id': 'parks',
                'label': 'Parks'
              }
            ]
          },
          'layers': [
            {
              'id': 'municipalboundaries',
              'field': 'NAME',
              'label': 'Municipal Boundary'
            }
          ]
        }
      }
    },

    layerList: {
      groups: [
        {
          name: 'Points of Interest',
          isSelected: false,
          icon: 'turned_in_not',
          layers: [
              {
                name: 'Beach Access',
                id: 'beachaccess',
                isSelected: false,
                url: ''
              },
            {
              name: 'Boat Ramps',
              id: 'boatramps',
              isSelected: false,
              url: ''
            },
            {
              name: 'Libraries',
              id: 'libraries',
              isSelected: false,
              url: ''
            },
            {
              name: 'Parks',
              id: 'parks',
              isSelected: false,
              url: ''
            },
            {
              name: 'Recycling',
              id: 'recycling',
              isSelected: false,
              url: ''
            },
            {
              name: 'Schools',
              id: 'schools',
              isSelected: false,
              url: ''
            }
          ]
      },
        {
          name: 'Parcels & Community',
          isSelected: false,
          icon: 'store',
          layers: [
              {
                name: 'Addresses',
                id: 'addresses',
                isSelected: false,
                url: ''
              },
              {
                name: 'Community Redev Agencies',
                id: 'CommunityRedevAgencies',
                isSelected: false,
                url: ''
              },
              {
                name: 'County Commissioner Districts',
                id: 'CountyCommissionerDistricts',
                isSelected: false,
                url: ''
              },
              {
                name: 'Easements',
                id: 'easements',
                isSelected: false,
                url: ''
              },
              {
                name: 'Municipal Boundaries',
                id: 'municipalboundaries',
                isSelected: false,
                url: ''
              },
            {
              name: 'Parcels',
              id: 'parcels',
              isSelected: false,
              url: ''
            }
          ]
      },
      {
        name: 'Roads & Highways',
        isSelected: false,
        icon: 'traffic',
        layers: [
            {
              name: 'Roads',
              id: 'roads',
              isSelected: false,
              url: ''
            }
        ]
      },
      {
        name: 'Land Use & Zoning',
        isSelected: false,
        icon: 'terrain',
        layers: [

            {
              name: 'Future Land Use',
              id: 'futurelanduse',
              isSelected: false,
              url: ''
            },
            {
              name: 'Planned Unit Development',
              id: 'PlannedUnitDevelopments',
              isSelected: false,
              url: ''
            },
            {
              name: 'Service Areas',
              id: 'serviceareas',
              isSelected: false,
              url: ''
            },
            {
              name: 'Soils',
              id: 'soils',
              isSelected: false,
              url: ''
            },
            {
              name: 'Zoning',
              id: 'zoning',
              isSelected: false,
              url: ''
            }
        ]
      },
      {
          name: 'Flood & Coastal',
          isSelected: false,
          icon: 'pool',
          layers: [
              {
                name: 'FEMA COBRA & OPA',
                id: 'femacobraopa',
                isSelected: false,
                url: ''
              },
              {
                name: 'FEMA FIRM Index',
                id: 'femafirmindex',
                isSelected: false,
                url: ''
              },
              {
                name: 'FEMA Floodways',
                id: 'femafloodways',
                isSelected: false,
                url: ''
              },
              {
                name: 'FEMA Flood Zones',
                id: 'FEMAfloodzones',
                isSelected: false,
                url: ''
              },
              {
                name: 'One Foot Contours',
                id: 'onefootcontours',
                isSelected: false,
                url: ''
              },
              {
                name: 'Storm Surge',
                id: 'StormSurge',
                isSelected: false,
                url: ''
              },
              {
                name: 'Wetlands',
                id: 'wetlands',
                isSelected: false,
                url: ''
              }
          ]
      },
      {
        name: 'Hazards & Impacts',
        isSelected: false,
        icon: 'report',
        layers: [
            {
              name: 'Coastal High Hazard Area',
              id: 'CoastalHighHazardArea',
              isSelected: false,
              url: ''
            },
            {
              name: 'Ecosystem Management Areas',
              id: 'EcosystemManagementAreas',
              isSelected: false,
              url: ''
            },
            {
              name: 'Evacuation Zones',
              id: 'evacuationzones',
              isSelected: false,
              url: ''
          },
            {
              name: 'Hydrants',
              id: 'hydrants',
              isSelected: false,
              url: ''
            }
        ]
      },

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
      showInfoWindow: false, // show info window after zooming to feature,
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
