/*    Copyright 2017 Esri

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License. */
define(['esri/layers/FeatureLayer'], function(FeatureLayer) {
  return {

    coordinates: {
      isEnabled: true
    },

    // LEGEND //
    legend: {
      isEnabled: true,
      title: 'Legend',
      container: 'titlepane', // options are: 'titlepane', 'dropdown', 'none'
      autoUpdate: true, // ignored if Portal
      respectCurrentMapScale: true, // ignored if Portal
      includeLayerIds: ['beachaccess', 'boatramps', 'libraries', 'parks', 'recycling', 'schools', 'addresses', 'roads', 'hydrants', 'parcels', 'CommunityRedevAgencies',
       'CountyCommissionerDistricts', 'easements', 'municipalboundaries', 'futurelanduse', 'PlannedUnitDevelopments', 'serviceareas', 'soils', 'zoning', 'femacobraopa',
       'femafirmindex', 'femafloodways', 'FEMAfloodzones', 'onefootcontours', 'StormSurge', 'wetlands', 'CoastalHighHazardArea', 'EcosystemManagementAreas', 'evacuationzones']
    },

    // DRAW TOOL //
    drawTool: {
      tools: ['POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON', 'TEXT'], // 'POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'
      symbology: {
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

    // EXTRACT DATA TOOL //
    'extractData': {
      'taskUrl': 'http://arcgis4.roktech.net/arcgis/rest/services/Bay/BayViewExtractDataTask/GPServer/Extract%20Data%20Task',
      'parameters': {
        'layersToClip': {
          'name': 'Layers_to_Clip'
        },
        'areaOfInterest': {
          'name': 'Area_of_Interest',
          'drawOptions': {
            'tools': ['POLYGON', 'FREEHAND_POLYGON'], // 'POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'
            'symbology': { // http://resources.arcgis.com/en/help/rest/apiref/index.html?renderer.html
              'point': {
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
              'line': {
                'type': 'esriSLS',
                'style': 'esriSLSDash', // esriSLSDash | esriSLSDashDotDot | esriSLSDot | esriSLSNull | esriSLSSolid
                'color': [255, 0, 0, 255], // blue
                'width': 2
              },
              'fill': {
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
            'hasSaveButton': false,
            'hasClearButton': false
          }
        },
        'featureFormat': {
          'name': 'Feature_Format',
          'options': [
            {
              'label': '.gdb',
              'value': 'File Geodatabase - GDB - .gdb'
            },
            {
              'label': '.shp',
              'value': 'Shapefile - SHP - .shp'
            },
            {
              'label': '.dxf',
              'value': 'Autodesk AutoCAD - DXF_R2007 - .dxf'
            },
            {
              'label': '.dwg',
              'value': 'Autodesk AutoCAD - DWG_R2007 - .dwg'
            },
            {
              'label': '.dgn',
              'value': 'Bentley Microstation Design (V8) - DGN_V8 - .dgn'
            }
          ]
        }
      }
    },

    // LAYER LIST //
    // part of the Navigation side panel
    layerList: {
      groups: [
        {
          // Layer List Group
          'name': 'Points of Interest',
          icon: 'turned_in_not',
          layers: [
            {
              'name': 'Beach Access',
              'id': 'beachaccess',
              'isSelected': false, // this will determine if the layer is on by default
            },
            {
              'name': 'Boat Ramps',
              'id': 'boatramps',
              'isSelected': false,
            },
            {
              'name': 'Libraries',
              'id': 'libraries',
              'isSelected': false,
            },
            {
              'name': 'Parks',
              'id': 'parks',
              'isSelected': false,
            },
            {
              'name': 'Recycling',
              'id': 'recycling',
              'isSelected': false,
            },
            {
              'name': 'Schools',
              'id': 'schools',
              'isSelected': false,
            }
          ]
        },
        {
          'name': 'Parcels & Community',
          icon: 'store',
          layers: [
            {
              'name': 'Addresses',
              'id': 'addresses',
              'isSelected': false,
            },
            {
              'name': 'Community Redev Agencies',
              'id': 'CommunityRedevAgencies',
              'isSelected': false,
            },
            {
              'name': 'County Commissioner Districts',
              'id': 'CountyCommissionerDistricts',
              'isSelected': false,
            },
            {
              'name': 'Easements',
              'id': 'easements',
              'isSelected': false,
            },
            {
              'name': 'Municipal Boundaries',
              'id': 'municipalboundaries',
              'isSelected': false,
            },
            {
              'name': 'Parcels',
              'id': 'parcels',
              'isSelected': true,
            }
          ]
      },
      {
        'name': 'Roads & Highways',
        'isSelected': false,
        icon: 'directions_car',
        layers: [
            {
              'name': 'Roads',
              'id': 'roads',
              'isSelected': false,
            }
        ]
      },
      {
        'name': 'Land Use & Zoning',
        icon: 'terrain',
        layers: [
            {
              'name': 'Future Land Use',
              'id': 'futurelanduse',
              'isSelected': false,
            },
            {
              'name': 'Planned Unit Development',
              'id': 'PlannedUnitDevelopments',
              'isSelected': false,
            },
            {
              'name': 'Service Areas',
              'id': 'serviceareas',
              'isSelected': false,
            },
            {
              'name': 'Soils',
              'id': 'soils',
              'isSelected': false,
            },
            {
              'name': 'Zoning',
              'id': 'zoning',
              'isSelected': false,
            }
        ]
      },
      {
          'name': 'Flood & Coastal',
          icon: 'pool',
          layers: [
              {
                'name': 'FEMA COBRA & OPA',
                'id': 'femacobraopa',
                'isSelected': false,
              },
              {
                'name': 'FEMA FIRM Index',
                'id': 'femafirmindex',
                'isSelected': false,
              },
              {
                'name': 'FEMA Floodways',
                'id': 'femafloodways',
                'isSelected': false,
              },
              {
                'name': 'FEMA Flood Zones',
                'id': 'FEMAfloodzones',
                'isSelected': false,
              },
              {
                'name': 'One Foot Contours',
                'id': 'onefootcontours',
                'isSelected': false,
              },
              {
                'name': 'Storm Surge',
                'id': 'StormSurge',
                'isSelected': false,
              },
              {
                'name': 'Wetlands',
                'id': 'wetlands',
                'isSelected': false,
              }
          ]
      },
      {
        'name': 'Hazards & Impacts',
        icon: 'report',
        layers: [
            {
              'name': 'Coastal High Hazard Area',
              'id': 'CoastalHighHazardArea',
              'isSelected': false,

            },
            {
              'name': 'Ecosystem Management Areas',
              'id': 'EcosystemManagementAreas',
              'isSelected': false,

            },
            {
              'name': 'Evacuation Zones',
              'id': 'evacuationzones',
              'isSelected': false,

          },
            {
              'name': 'Hydrants',
              'id': 'hydrants',
              'isSelected': false,

            }
        ]
      },

      ]
    },

    // BASEMAP TOGGLE //
    basemapToggle: {
      basemaps: [
        {
          'name': 'Streets',
          basemap: 'topo-vector'
        },
        {
          'name': 'Satellite',
          basemap: 'satellite'
        }
      ]
    },

    // SEARCH BAR //
    // this section will configure the search output
    unifiedSearch: {
      isEnabled: true,
      placeholder: 'Search for parcels, addresses, or roads...',
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
      tables: [ // Search results table
          {
            url: 'http://arcgis4.roktech.net/arcgis/rest/services/Bay/BayView/MapServer/0',
            idField: 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
            query: {
              returnGeometry: true, // if false then relatedQuery is used to determine geometry
              'id': 'addresses', // unique identifier within the unifiedSearch Config
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
                priority: 1
              },
              relatedQuery: null
            }
        },
        {
          url: 'http://arcgis4.roktech.net/arcgis/rest/services/Bay/BayView/MapServer/1',
          idField: 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
          query: {
            returnGeometry: true, // if false then relatedQuery is used to determine geometry
            'id': 'roads', // unique identifier within the unifiedSearch Config
            fields: ['OWNER', 'FULL_NAME'], // field to be queried on (where clause)
            group: {
              isGrouped: true,
              sectionHeader: 'Roads',
              iconClass: 'fa fa-folder'
            },
            results: {
              labelFields: ['FULL_NAME'],
              iconClass: 'fa fa-road',
              priority: 2
            },
            relatedQuery: null
          }
        },
        {
          url: 'http://arcgis4.roktech.net/arcgis/rest/services/Bay/BayView/MapServer/2',
          idField: 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
          query: {
            returnGeometry: true, // if false then relatedQuery is used to determine geometry
            'id': 'parcels', // unique identifier within the unifiedSearch Config
            fields: ['A1RENUM', 'DSITEADDR', 'A2OWNAME'], // field to be queried on (where clause)
            group: {
              isGrouped: true,
              sectionHeader: 'Parcels',
              iconClass: 'fa fa-folder'
            },
            results: {
              labelFields: ['A1RENUM', 'DSITEADDR', 'A2OWNAME'],
              labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
                return attrs.A1RENUM + ' (' + attrs.DSITEADDR + ')';
              },
              iconClass: 'fa fa-map-marker',
              priority: 0
            },
            relatedQuery: null
          }
        }
      ],
      locators: [  // geocode locators is enabled at the begining of this section - geocode: { isEnabled: true }
        {
          'id': 'bc_geocoder',
          'url': 'http://gis.baycountyfl.gov/arcgis/rest/services/Locator/GeocodeServer',
          'minScore': 50,
          'maxLocations': 5
        }
      ]
    },

    // SEARCH INFO PANEL //
    // this section will configure the displayed data on a selected search result
    infoPanel: {
        // Area Analysis config
        'analysis': {
            // Buffer config
          'buffer': {
            'radius': [1, 3, 5],
            'radiusUnit': 'esriMiles',
            'radiusUnitLabel': 'miles',
            // layers that are search within buffer
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
              },
              {
                'id': 'recycling',
                'label': 'Recycling'
              }
            ]
          },
          // related layers
          'layers': [
            {
              'id': 'CountyCommissionerDistricts',
              'field': 'NAME',
              'label': 'County Commissioner District'
            },
            {
                'id': 'evacuationzones',
                'field': 'EZONE',
                'label': 'Evacuation Zone'
            },
            {
                'id': 'FEMAfloodzones',
                'field': 'FLD_ZONE',
                'label': 'FEMA Flood Zone'
            },
            {
                'id': 'futurelanduse',
                'field': 'FLU_CODE',
                'label': 'Future Land Use'
            },
            {
              'id': 'municipalboundaries',
              'field': 'NAME',
              'label': 'Municipal Boundary'
            },
            {
                'id': 'serviceareas',
                'field': 'SERVICE',
                'label': 'Service Area'
            },
            {
                'id': 'soils',
                'field': 'SOILDESC',
                'label': 'Soil'
            }
          ]
      },
      // Configure each layers output details here
      'addresses': { // layer ID
        'hasDetails': false, // Enables the details button
        'hasAnalyzeButton': true, // Enables the Analyze Surrounding Area button
        'hasPrint': true, // Enables the Print button
        'hasExportData': true, // Enables the Export Data button
        'infos': [
          {
            'field': 'ADDRESS', // The data field from the map server
            'label': 'Address' //the desired label for the data field
          }
        ]
      },
      'roads': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'OWNER',
            'label': 'Owner'
          },
          {
            'field': 'FULL_NAME',
            'label': 'Name'
          },
          {
            'field': 'SURFACE',
            'label': 'Surface Type'
          }
        ]
      },
      'parcels': {
        'hasDetails': true,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'A1RENUM',
            'label': 'Parcel ID'
          },
          {
            'field': 'A2OWNAME',
            'label': 'Owner'
          },
          {
            'field': 'DSITEADDR',
            'label': 'Address'
          },
          {
            'field': 'DTAXACRES',
            'label': 'Acres'
          },
          {
            'field': 'DORAPPDESC',
            'label': 'Current Use'
          },
        ]
      },
      'futurelanduse': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'SUB_FLU',
            'label': 'Government'
          },
          {
            'field': 'FLU_CODE',
            'label': 'Designation'
          },
          {
            'field': 'ORD_NUM',
            'label': 'Ordinance'
          }
        ]
      },
      'zoning': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'SUB_ZONING',
            'label': 'Government'
          },
          {
            'field': 'ZONING',
            'label': 'Designation'
          },
          {
            'field': 'ORD_NUM',
            'label': 'Ordinance'
          }
        ]
      },
      'easements': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'OWNER',
            'label': 'Owner'
          },
          {
            'field': 'SOURCE_TYP',
            'label': 'Source'
          },
          {
            'field': 'BOOK',
            'label': 'Book'
          },
          {
            'field': 'PAGE',
            'label': 'Page'
          },
          {
            'field': 'CATEGORY',
            'label': 'Category'
          }
        ]
      },
      'FEMAfloodzones': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'FLD_ZONE',
            'label': 'Flood Zone'
          }
        ]
      },
      'beachaccess': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'NUM',
            'label': 'Access Number'
          }
        ]
      },
      'femafirmindex': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'FIRM_PAN',
            'label': 'Map Panel'
          }
        ]
      },
      'boatramps': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'ADMINISTRA',
            'label': 'Manager'
          }
        ]
      },
      'libraries': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          }
        ]
      },
      'recycling': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'Name',
            'label': 'Name'
          },
          {
            'field': 'Accepts',
            'label': 'Accepts'
          },
          {
            'field': 'OperatingH',
            'label': 'Hours'
          }
        ]
      },
      'schools': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          }
        ]
      },
      'parks': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'ADMINISTRA',
            'label': 'Owner'
          }
        ]
      },
      'soils': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'SOILDESC',
            'label': 'Description'
          }
        ]
      },
	  'CountyCommissionerDistricts': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'NAME',
            'label': 'District'
          },
		  {
            'field': 'REPNAME',
            'label': 'Commissioner'
          }
        ]
      },
	  'femacobraopa': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'CBRS_TYP',
            'label': 'Type'
          }
        ]
      },
	  'wetlands': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'WETLAND_TYPE',
            'label': 'Type'
          },
		  {
            'field': 'ATTRIBUTE',
            'label': 'Attribute'
          }
        ]
      },
	  'evacuationzones': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
          {
            'field': 'EZONE',
            'label': 'Zone'
          }
        ]
      }    }
  };
});
