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
      includeLayerIds: [
        'floodzone',
        'contours',
        'addresses',
        'buildingfootprints',
        'citycouncildistricts',
        'citylimits',
        'neighborhoodassociations',
        'parcels',
        'parks',
        'subdivisions',
        'schools',
        'streetaddressdirection',
        'streetcenterlines',
        'streetnames',
        'zipcodes',
        'currentzoningcases',
        'designdistricts',
        'futurelanduseplan',
        'pendingzbacases',
        'pendingzonecases',
        'preliminaryplats',
        'lake',
        'lakenumber',
        'firehydrants',
        'watermains',
        'sewermanholes',
        'sewercleanouts',
        'sewergravitymains',
        'sewerforcemains',
        'stormwatermanholes',
        'stormwaterinlets',
        'stormwateroutfalls',
        'stormwaterpipes',
        'trafficvolumetotals',
        'trafficsignals',
        'residentpermitonlyparkingzones',
        'impactfeeservicearea',
        'alleydedicationdeeds',
        'blocknumbers',
        'drainageeasements',
        'lotlines',
        'lotdimensions',
        'lotnumbers',
        'ordinanceclosures',
        'parkdedicationdeeds',
        'platdedicatedrow',
        'propertyacquisitiondeeds',
        'railroaddeedsandeasements',
        'rowdimensions',
        'roweasements',
        'sectionlines',
        'staterowdeedsandeasements',
        'streetdedicationdeeds',
        'subdivisionnames',
        'uselicenses',
        'utilityequipmenteasements',
        'utilitygarbageaccesseasements',
        'airports',
        'animalservices',
        'citibustransferplaza',
        'citizenstower',
        'cementaries',
        'utilities',
        'civiccenter',
        'communitycenters',
        'firestations',
        'healthdepartments',
        'libraries',
        'museums',
        'policestations',
        'pools',
        'recyclingcenters',
        'sportcomplexes',
      ]
    },

    // DRAW TOOL //
    drawTool: {
      tools: ['POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON', 'TEXT'], // 'POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'
      symbology: {
        point: {
          'type': 'esriSMS',
          'style': 'esriSMSCircle', // esriSMSCircle | esriSMSCross | esriSMSDiamond | esriSMSSquare | esriSMSX | esriSMSTriangle
          'color': [255, 153, 0, 100],
          'size': 8,
          'angle': 0,
          'xoffset': 0,
          'yoffset': 0,
          'outline': {
            'color': [255, 153, 0, 255],
            'width': 1
          }
        },
        line: {
          'type': 'esriSLS',
          'style': 'esriSLSDash', // esriSLSDash | esriSLSDashDotDot | esriSLSDot | esriSLSNull | esriSLSSolid
          'color': [255, 153, 0, 255], // blue
          'width': 2
        },
        fill: {
          'type': 'esriSFS',
          'style': 'esriSFSSolid', // esriSFSBackwardDiagonal | esriSFSCross | esriSFSDiagonalCross | esriSFSForwardDiagonal | esriSFSHorizontal | esriSFSNull | esriSFSSolid | esriSFSVertical
          'color': [255, 153, 0, 100],
          'outline': {
            'type': 'esriSLS',
            'style': 'esriSLSDash',
            'color': [255, 153, 0, 100],
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
          'icon': 'place',
          'layers': [
            {
              'id': 'airports',
              'name': 'Airports',
              'isSelected': false,
            },
            {
              'id': 'animalservices',
              'name': 'Animal Services',
              'isSelected': false,
            },
            {
              'id': 'citibustransferplaza',
              'name': 'Citibus Transfer Plaza',
              'isSelected': false,
            },
            {
              'id': 'citizenstower',
              'name': 'Citizens Tower',
              'isSelected': false,
            },
            {
              'id': 'cementaries',
              'name': 'City of Lubbock Cementary',
              'isSelected': false,
            },
            {
              'id': 'utilities',
              'name': 'City of Lubbock Utilities',
              'isSelected': false,
            },
            {
              'id': 'civiccenter',
              'name': 'Civic Center',
              'isSelected': false,
            },
            {
              'id': 'communitycenters',
              'name': 'Community Centers',
              'isSelected': false,
            },
            {
              'id': 'firestations',
              'name': 'Fire Stations',
              'isSelected': false,
            },
            {
              'id': 'healthdepartments',
              'name': 'Health Departments',
              'isSelected': false,
            },
            {
              'id': 'libraries',
              'name': 'Libraries',
              'isSelected': false,
            },
            {
              'id': 'museums',
              'name': 'Museums',
              'isSelected': false,
            },
            {
              'id': 'policestations',
              'name': 'Police Stations',
              'isSelected': false,
            },
            {
              'id': 'pools',
              'name': 'Pools',
              'isSelected': false,
            },
            {
              'id': 'recyclingcenters',
              'name': 'Recycling Centers',
              'isSelected': false,
            },
            {
              'id': 'sportcomplexes',
              'name': 'Sport Complexes',
              'isSelected': false,
            },
          ]
        },
        {
          'name': 'Parcels & Community',
          'icon': 'maps_home_work',
          'layers': [
            {
              'id': 'addresses',
              'name': 'Addresses',
              'isSelected': true,
            },
            {
              'id': 'buildingfootprints',
              'name': 'Building Footprints',
              'isSelected': false,
            },
            {
              'id': 'citycouncildistricts',
              'name': 'City Council Districts',
              'isSelected': false,
            },
            {
              'id': 'citylimits',
              'name': 'City Limits',
              'isSelected': true,
            },
            {
              'id': 'neighborhoodassociations',
              'name': 'Neighborhood Associations',
              'isSelected': false,
            },
            {
              'id': 'parcels',
              'name': 'Parcels',
              'isSelected': true,
            },
            {
              'id': 'parks',
              'name': 'Parks',
              'isSelected': false,
            },
            {
              'id': 'subdivisions',
              'name': 'Platted Subdivisions',
              'isSelected': false,
            },
            {
              'id': 'schools',
              'name': 'Schools',
              'isSelected': false,
            },
            {
              'id': 'streetaddressdirection',
              'name': 'Street Address Direction',
              'isSelected': false,
            },
            {
              'id': 'streetcenterlines',
              'name': 'Street Centerlines',
              'isSelected': false,
            },
            {
              'id': 'streetnames',
              'name': 'Street Names',
              'isSelected': false,
            },
            {
              'id': 'zipcodes',
              'name': 'Zip Codes',
              'isSelected': false,
            },
          ]
      },
      {
        'name': 'Planning & Zoning',
        'icon': 'map',
        'layers': [
          {
            'id': 'currentzoningcases',
            'name': 'Current Zoning Cases',
            'isSelected': false,
          },
          {
            'id': 'designdistricts',
            'name': 'Design Districts',
            'isSelected': false,
          },
          {
            'id': 'futurelanduseplan',
            'name': 'Future Land Use Plan',
            'isSelected': false,
          },
          {
            'id': 'pendingzbacases',
            'name': 'Pending ZBA Cases',
            'isSelected': false,
          },
          {
            'id': 'pendingzonecases',
            'name': 'Pending Zone Cases',
            'isSelected': false,
          },
          {
            'id': 'preliminaryplats',
            'name': 'Preliminary Plats',
            'isSelected': false,
          },
        ]
      },
      {
        'name': 'Topography & Lakes',
        'icon': 'water',
        'layers': [
          {
            'id': 'floodzone',
            'name': 'Flood Zone',
            'isSelected': true,
          },
          {
            'id': 'lake',
            'name': 'Lake',
            'isSelected': false,
          },
          {
            'id': 'lakenumber',
            'name': 'Lake Number',
            'isSelected': false,
          },
          {
            'id': 'contours',
            'name': 'Contours',
            'isSelected': false,
          },
        ]
      },
      {
          'name': 'Public Works',
          'icon': 'engineering',
          'layers': [
            {
              'id': 'firehydrants',
              'name': 'Fire Hydrants',
              'isSelected': false,
            },
            {
              'id': 'watermains',
              'name': 'Water Mains',
              'isSelected': false,
            },
            {
              'id': 'sewermanholes',
              'name': 'Sewer Manholes',
              'isSelected': false,
            },
            {
              'id': 'sewercleanouts',
              'name': 'Sewer Clean Outs',
              'isSelected': false,
            },
            {
              'id': 'sewergravitymains',
              'name': 'Sewer Gravity Mains',
              'isSelected': false,
            },
            {
              'id': 'sewerforcemains',
              'name': 'Sewer Force Mains',
              'isSelected': false,
            },
            {
              'id': 'stormwatermanholes',
              'name': 'Stormwater Manholes',
              'isSelected': false,
            },
            {
              'id': 'stormwaterinlets',
              'name': 'Stormwater Inlets',
              'isSelected': false,
            },
            {
              'id': 'stormwateroutfalls',
              'name': 'Stormwater Outfalls',
              'isSelected': false,
            },
            {
              'id': 'stormwaterpipes',
              'name': 'Stormwater Pipes',
              'isSelected': false,
            },
            {
              'id': 'trafficvolumetotals',
              'name': 'Traffic Volume Totals',
              'isSelected': false,
            },
            {
              'id': 'trafficsignals',
              'name': 'Traffic Signals',
              'isSelected': false,
            },
            {
              'id': 'residentpermitonlyparkingzones',
              'name': 'Resident Permit Only Parking Zones',
              'isSelected': false,
            },
            {
              'id': 'impactfeeservicearea',
              'name': 'Impact Fee Service Area',
              'isSelected': false,
            },
          ]
        },
        {
          'name': 'Base Map',
          'icon': 'description',
          'layers': [
            {
              'id': 'alleydedicationdeeds',
              'name': 'Alley Dedication Deeds',
              'isSelected': false,
            },
            {
              'id': 'blocknumbers',
              'name': 'Block Numbers',
              'isSelected': false,
            },
            {
              'id': 'drainageeasements',
              'name': 'Drainage Easements',
              'isSelected': false,
            },
            {
              'id': 'lotlines',
              'name': 'Lot Lines',
              'isSelected': false,
            },
            {
              'id': 'lotdimensions',
              'name': 'Lot Dimensions',
              'isSelected': false,
            },
            {
              'id': 'lotnumbers',
              'name': 'Lot Numbers',
              'isSelected': false,
            },
            {
              'id': 'ordinanceclosures',
              'name': 'Ordinance Closures',
              'isSelected': false,
            },
            {
              'id': 'parkdedicationdeeds',
              'name': 'Park Dedication Deeds',
              'isSelected': false,
            },
            {
              'id': 'platdedicatedrow',
              'name': 'Plat Dedicated ROW',
              'isSelected': false,
            },
            {
              'id': 'propertyacquisitiondeeds',
              'name': 'Property Acquisition Deeds',
              'isSelected': false,
            },
            {
              'id': 'railroaddeedsandeasements',
              'name': 'Railroad Deeds and Easements',
              'isSelected': false,
            },
            {
              'id': 'rowdimensions',
              'name': 'ROW Dimensions',
              'isSelected': false,
            },
            {
              'id': 'roweasements',
              'name': 'ROW Easements',
              'isSelected': false,
            },
            {
              'id': 'sectionlines',
              'name': 'Section Lines',
              'isSelected': false,
            },
            {
              'id': 'staterowdeedsandeasements',
              'name': 'State ROW Deeds and Easements',
              'isSelected': false,
            },
            {
              'id': 'streetdedicationdeeds',
              'name': 'Street Dedication Deeds',
              'isSelected': false,
            },
            {
              'id': 'subdivisionnames',
              'name': 'Subdivision Names',
              'isSelected': false,
            },
            {
              'id': 'uselicenses',
              'name': 'Use Licenses',
              'isSelected': false,
            },
            {
              'id': 'utilityequipmenteasements',
              'name': 'Utility Equipment Easements',
              'isSelected': false,
            },
            {
              'id': 'utilitygarbageaccesseasements',
              'name': 'Utility, Garbage & Access Easements',
              'isSelected': false,
            },
          ]
        }
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
          'basemap': 'custom',
          'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/Imagery/Lubbock_Image_Cache_2021_Mercator/ImageServer',
        }
      ]
    },

    // SEARCH BAR //
    // this section will configure the search output
    unifiedSearch: {
      isEnabled: true,
      placeholder: 'Search for parcels, addresses, places...',
      searchDelay: 1000,
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
          'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/0',
          'idField': 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
          'query': {
            'textSearch': true,
            'returnGeometry': true, // if false then relatedQuery is used to determine geometry
            'id': 'addresses', // unique identifier within the unifiedSearch Config
            'searchFields': ['FULL_ADDRESS'],
            'fields': ['FULL_ADDRESS'], // field to be queried on (where clause)
            'group': {
              'isGrouped': true,
              'sectionHeader': 'Addresses',
              'iconClass': 'fa fa-folder'
            },
            'results': {
              'labelFields': ['FULL_ADDRESS'],
              'iconClass': 'fa fa-map-marker',
              'priority': 1
            },
            'relatedQuery': null
          }
      },
      
      {
          'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/4',
          'idField': 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
          'query': {
            'textSearch': true,
            'returnGeometry': true, // if false then relatedQuery is used to determine geometry
            'id': 'parcels', // unique identifier within the unifiedSearch Config
            'searchFields': ['LCADID', 'PIN', 'OWNER_CITY', 'OWNER_ZIP', 'OWNER_ST', 'OWNER_NAME', 'SUBDIVISION', 'OWNER_ADDRESS', 'LEGAL_DESCRIPTION'], // field to be queried on (where clause)
            'fields': ['LCADID', 'PIN', 'OWNER_CITY', 'OWNER_ZIP', 'OWNER_ST', 'OWNER_NAME', 'SUBDIVISION', 'OWNER_ADDRESS', 'LEGAL_DESCRIPTION', 'GUC', 'POOL', 'NO_PARKING_SPACES', 'SQUARE_FOOT', 'last_edited_date'], // return fields
            'group': {
              'isGrouped': true,
              'sectionHeader': 'Parcels',
              'iconClass': 'fa fa-folder'
            },
            'results': {
              'labelFields': ['LCADID', 'OWNER_NAME', 'SUBDIVISION'],
              'labelFunction': function(attrs) { // label to show in results (must refer to queryLabelFields)
                return attrs.OWNER_ADDRESS + ' (' + attrs.SUBDIVISION + ', ' + attrs.LCADID + ')';
              },
              'iconClass': 'fa fa-house',
              'priority': 2
            },
            'relatedQuery': null
          }
        },
      
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/1',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'animalservices',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 6
          },
        },
      },
      
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/2',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'citibustransferplaza',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 7
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/3',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'citizenstower',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 9
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/4',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'cementaries',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 10
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/5',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'utilities',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 11
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/6',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'civiccenter',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 12
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/7',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'communitycenters',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 13
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/8',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'firestations',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 14
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/9',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'healthdepartments',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 15
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/10',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'libraries',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 16
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/11',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'museums',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 17
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/12',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'policestations',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 18
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/13',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'pools',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 19
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/14',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'recyclingcenters',
          'searchFields': ['LOCATION'],
          'fields': ['LOCATION', 'STATUS'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['LOCATION'],
            'priority': 20
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/15',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'sportcomplexes',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 21
          },
        },
      },
    
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/3',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'buildingfootprints',
          'searchFields': ['STRUCTURE_NAME', 'GUC_DESCRIPTION'],
          'fields': ['STRUCTURE_NAME', 'TOTAL_NUMB_FLOORS', 'FIRST_FLOOR_AREA', 'TOTAL_FLOOR_AREA','NUMBER_RESIDENCES', 'DATE_BUILT', 'GUC', 'GUC_DESCRIPTION', 'last_edited_date'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['STRUCTURE_NAME'],
            'iconClass': 'fa fa-building',
            'priority': 23
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/11',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'citycouncildistricts',
          'searchFields': ['DISTRICT'],
          'fields': ['DISTRICT', 'POPTOTAL'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['DISTRICT'],
            'iconClass': 'fa fa-users',
            'priority': 24
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/10',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'neighborhoodassociations',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'ASSOC_NUM'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'iconClass': 'fa fa-chart-network',
            'priority': 26
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/9',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'parks',
          'searchFields': ['NAME', 'Address'],
          'fields': ['NAME', 'Address', 'Classification', 'Acres'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME', 'Address'],
            'labelFunction': function(attrs) {
              return attrs.NAME + ' (' + attrs.Address + ')';
            },
            'iconClass': 'fa fa-bench-tree',
            'priority': 28
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/8',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'subdivisions',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'PLAT', 'YEAR'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'iconClass': 'fa fa-vector-square',
            'priority': 29
          },
        },
      },
    
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/MapServer/0',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'airports',
          'searchFields': ['NAME'],
          'fields': ['NAME', 'TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': 'Airports',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['NAME'],
            'priority': 5
          },
        }
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/2',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': true,
          'returnGeometry': true,
          'id': 'schools',
          'searchFields': ['SCHOOL_NAME', 'SCHOOL_TYPE', 'ADDR'],
          'fields': ['SCHOOL_NAME', 'SCHOOL_LEVEL', 'SCHOOL_TYPE', 'ADDR', 'PHONE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['SCHOOL_NAME', 'ADDR'],
            'labelFunction': function(attrs) {
              return attrs.SCHOOL_NAME + ' (' + attrs.ADDR + ')';
            },
            'priority': 30
          },
        },
      },
      
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/MapServer/4',
        'idField': 'OBJECTID',
        'query': {
          'returnGeometry': true,
          'id': 'currentzoningcases',
          'searchFields': ['CaseNumber'],
          'fields': ['CaseNumber', 'ZoningActual', 'ZoningRequested'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['CaseNumber'],
            'iconClass': 'fa fa-border-all',
            'priority': 35
          },
        },
      },

      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/MapServer/0',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': true,
          'returnGeometry': true,
          'id': 'designdistricts',
          'searchFields': ['CommonName', 'DetailName', 'CaseNumber'],
          'fields': ['CommonName', 'DetailName', 'CaseNumber'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['CommonName'],
            'iconClass': 'fa fa-border-all',
            'priority': 36
          },
        },
      },

      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/MapServer/5',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': true,
          'returnGeometry': true,
          'id': 'futurelanduseplan',
          'searchFields': ['FLUP'],
          'fields': ['FLUP', 'Vacant'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['FLUP'],
            'iconClass': 'fa fa-border-all',
            'priority': 37
          },
        },
      },

      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/MapServer/1',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': true,
          'returnGeometry': true,
          'id': 'preliminaryplats',
          'searchFields': ['Plan_Num', 'Project_Name', 'Main_Address'],
          'fields': ['Plan_Num', 'Project_Name', 'Main_Address', 'Current_District', 'Proposed_District', 'Plan_Status'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['Project_Name'],
            'iconClass': 'fa fa-border-all',
            'priority': 40
          },
        },
      },
    
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_FloodZonesLakes/MapServer/0',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': true,
          'returnGeometry': true,
          'id': 'floodzone',
          'searchFields': ['FLD_ZONE'],
          'fields': ['FLD_ZONE', 'STUDY_TYP'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['FLD_ZONE'],
            'iconClass': 'fa fa-house-flood',
            'priority': 41
          },
        },
      },
      {
        'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_FloodZonesLakes/MapServer/1',
        'idField': 'OBJECTID',
        'query': {
          'textSearch': false,
          'returnGeometry': true,
          'id': 'lake',
          'searchFields': ['LAKE_NAME', 'LAKE_SITE'],
          'fields': ['LAKE_NAME', 'LAKE_SITE', 'LAKE_TYPE'],
          'group': {
            'isGrouped': false,
            'sectionHeader': '',
            'iconClass': 'fa fa-folder'
          },
          'results': {
            'labelFields': ['LAKE_NAME'],
            'iconClass': 'fa fa-water',
            'priority': 42
          },
        },
      },

      ],
      locators: [  // geocode locators is enabled at the begining of this section - geocode: { isEnabled: true }
        {
          'id': 'geocoder',
          'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/SingleAddressLocator2/GeocodeServer',
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
                'id': 'parks',
                'label': 'Parks'
              },
            ]
          },
          // related layers
          'layers': [
            {
              'id': 'futurelanduseplan',
              'field': 'FLUP',
              'label': 'Future Land Use'
            },
          {
              'id': 'citycouncildistricts',
              'field': 'DISTRICT',
              'label': 'City Council District'
            },
            {
                'id': 'neighborhoodassociations',
                'field': 'NAME',
                'label': 'Neighborhood Association'
            },
          ]
      },
      // Configure each layers output details here
      'airports': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'animalservices': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'citibustransferplaza': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'citizenstower': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'cementaries': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'utilities': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'civiccenter': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'communitycenters': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'firestations': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'healthdepartments': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'libraries': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'museums': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'policestations': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'pools': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
      'recyclingcenters': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'LOCATION',
            'label': 'Locaton'
          },
          {
            'field': 'STATUS',
            'label': 'Status'
          },
        ]
      },
      'sportcomplexes': {
        'hasDetails': false,
        'hasAnalyzeButton': false,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'TYPE',
            'label': 'Type'
          },
        ]
      },
    
      'addresses': { // layer ID
        'hasDetails': false, // Enables the details button
        'hasAnalyzeButton': true, // Enables the Analyze Surrounding Area button
        'hasPrint': true, // Enables the Print button
        'hasExportData': true, // Enables the Export Data button
        'domain': 'Name',
        'infos': [
            {
            'field': 'FULL_ADDRESS', // The data field from the map server
            'label': 'Address' //the desired label for the data field
            },
        ]
      },
      'buildingfootprints': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
            {
            'field': 'STRUCTURE_NAME',
            'label': 'Structure Name',
            },
            {
            'field': 'TOTAL_NUMB_FLOORS',
            'label': 'Total Number of Floors',
            },
            {
            'field': 'FIRST_FLOOR_AREA',
            'label': 'First Floor Area',
            'format': 'number',
            'suffix': 'sqft',
            },
            {
            'field': 'TOTAL_FLOOR_AREA',
            'label': 'Total Floor Area',
            'format': 'number',
            'suffix': 'sqft',
            },
            {
            'field': 'NUMBER_RESIDENCES',
            'label': 'Number of Residences',
            },
            {
            'field': 'DATE_BUILT',
            'label': 'Date Built',
            'format': 'date',
            },
            {
            'field': 'GUC',
            'label': 'GUC',
            },
            {
            'field': 'GUC_DESCRIPTION',
            'label': 'GUC Description',
            },
            {
            'field': 'last_edited_date',
            'label': 'Last Edit Date',
            'format': 'date',
            },
        ]
      },
      'citycouncildistricts': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'DISTRICT',
            'label': 'District'
          },
          {
            'field': 'POPTOTAL',
            'label': 'Total Population'
          },
        ]
      },
      'neighborhoodassociations': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'ASSOC_NUM',
            'label': 'Association #'
          },
        ]
      },
      'parcels': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': true,
        'hasExportData': true,
        'infos': [
            {
            'field': 'LCADID',
            'label': 'LCADID'
            },
            {
            'field': 'SUBDIVISION',
            'label': 'Subdivision',
            },
            {
            'field': 'LEGAL_DESCRIPTION',
            'label': 'Legal Description',
            },
            {
            'field': 'GUC',
            'label': 'Landuse',
            },
            {
            'field': 'OWNER_NAME',
            'label': 'Owner Name',
            },
            {
            'field': 'OWNER_ADDRESS',
            'label': 'Owner Address',
            },
            {
            'field': 'NO_PARKING_SPACES',
            'label': 'Number of Parking Spaces',
            },
            {
            'field': 'POOL',
            'label': 'Pool',
            },
            {
            'field': 'SQUARE_FOOT',
            'label': 'Area',
            'format': 'number',
            'suffix': 'sqft',
            },
            {
            'field': 'last_edited_date',
            'label': 'Last Edit Date',
            'format': 'date',
            },
        ]
      },
      'parks': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'Address',
            'label': 'Address'
          },
          {
            'field': 'Classification',
            'label': 'Classification'
          },
          {
            'field': 'Acres',
            'label': 'Acres'
          },
        ]
      },
      'subdivisions': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'NAME',
            'label': 'Name'
          },
          {
            'field': 'PLAT',
            'label': 'Plat'
          },
          {
            'field': 'YEAR',
            'label': 'Year'
          },
        ]
      },
      'schools': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'SCHOOL_NAME',
            'label': 'School Name'
          },
          {
            'field': 'SCHOOL_LEVEL',
            'label': 'School Level'
          },
          {
            'field': 'SCHOOL_TYPE',
            'label': 'School Type'
          },
          {
            'field': 'ADDR',
            'label': 'Address'
          },
          {
            'field': 'PHONE',
            'label': 'Phone'
          },
        ]
      },
      'currentzoningcases': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'CaseNumber',
            'label': 'Case #'
          },
          {
            'field': 'ZoningActual',
            'label': 'Zoning Actual'
          },
          {
            'field': 'ZoningRequested',
            'label': 'Zoning Requested'
          },
        ]
      },
      'designdistricts': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'CommonName',
            'label': 'Common Name'
          },
          {
            'field': 'DetailName',
            'label': 'Detail Name'
          },
          {
            'field': 'CaseNumber',
            'label': 'Case Number'
          },
        ]
      },
      'futurelanduseplan': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'FLUP',
            'label': 'FLUP'
          },
          {
            'field': 'Vacant',
            'label': 'Vacant'
          },
        ]
      },
      'preliminaryplats': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'Plan_Num',
            'label': 'Plan #'
          },
          {
            'field': 'Project_Name',
            'label': 'Project Name'
          },
          {
            'field': 'Main_Address',
            'label': 'Main Address'
          },
          {
            'field': 'Current_District',
            'label': 'Current District'
          },
          {
            'field': 'Proposed_District',
            'label': 'Proposed District'
          },
          {
            'field': 'Plan_Status',
            'label': 'Plan Status'
          },
        ]
      },
      'floodzone': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'FLD_ZONE',
            'label': 'Flood Zone'
          },
          {
            'field': 'STUDY_TYP',
            'label': 'Study Type'
          },
        ]
      },
      'lake': {
        'hasDetails': false,
        'hasAnalyzeButton': true,
        'hasPrint': false,
        'hasExportData': false,
        'infos': [
          {
            'field': 'LAKE_NAME',
            'label': 'Lake Name'
          },
          {
            'field': 'LAKE_SITE',
            'label': 'Lake Site'
          },
          {
            'field': 'LAKE_TYPE',
            'label': 'Lake Type'
          },
        ]
      },
    }

  };
});
