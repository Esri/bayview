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

    map: {
      options: {
        basemap: 'streets',
        scrollWheelZoom: true,
        slider: true,
        sliderStyle: 'small',  // "small" or "large"
        sliderPosition: 'bottom-left', // "top-left", "top-right", "bottom-left", "bottom-right"
        sliderOrientation: 'vertical', // "vertical" or "horizontal"
        sliderLabels: ['Street', 'County', 'State', 'Nation', 'World'], // Only valid when the "large" slider style option is true.
        nav: false, // hasPanControls
        fadeOnZoom: true,
        showLabels: true,
        showAttribution: false,
        logo: true,
        smartNavigation: false, // needs to be false in responsive mode
        autoResize: false // needs to be false in responsive mode
      }
    },

    // initialExtent: extent the the map starts at. Helper tool: http://psstl.esri.com/apps/extenthelper/ or http://davidspriggs.github.io/js-extent-helper/extentHelper/
    initialExtent: {
      'xmin':-11373141.87557667,
      'ymin':3952682.9427963775,
      'xmax':-11302131.876299838,
      'ymax':3991245.423566197,
      spatialReference: {
        'wkid': 102100
      }
    },

    agsPortal: {
      isEnabled: false,
      appId: 'GVI6HH3sKAutXQuG',
      portalUrl: '',
      popup: false,
      webmapId: '',
      options: {
        autoRecenter: false, // needs to be false in responsive mode
        responsiveResize: false // needs to be false in responsive mode
      }
    },

    showAttribution: false,
    showLogo: true,

    navigation: {
      slider: {
        isEnabled: true,
        style: 'small', // 'small' or 'large'
        position: 'top-left', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        orientation: 'vertical', // 'vertical' or 'horizontal'
        labels: ['Street', 'County', 'State', 'Nation', 'World'] // Only valid when the 'large' slider style option is true.
      },
      hasPanControls: false
    },

    overview: {
      isEnabled: false,
      position: 'bottom-right', // 'top-right','bottom-right','bottom-left' and 'top-left'
      isVisibleOnStartup: true,
      hasMaximizeButton: false
    },

    scalebar: {
      isEnabled: false,
      position: 'bottom-left', // 'top-right','bottom-right','top-center','bottom-center','bottom-left','top-left'
      style: 'line', // ruler' or 'line' --- When unit is set to dual the scalebar style will be set to line. As of version 3.4
      unit: 'dual' // 'english' or 'metric' and starting at version 3.4 'dual'
    },

    layerList: {
      isEnabled: false,
      canToggleOpacity: true,
      canAddOnlineLayer: false,
      canAddShapefile: false,
      canShowLayerInfo: true,
      structure: {
        title: '', // if title is empty, no title is shown; otherwise show the title
        hasDynamicList: false, // if true then the layer list is generated based on operational layers, if false then use the structure below
        layers: ['tribal', 'districts', 'counties', 'states', 'zipcodes'] // for now just use a list of layer id's / later we can create a true hierarchy
      }
    },

    infoWindowConfig: {
      blurMapOnHover: false
    },

    // operationalLayers: Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
    // 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
    operationalLayers: [
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_FloodZonesLakes/FeatureServer/0',
        options: {
          id: 'floodzone',
          opacity: 1,
        },
      },
      {
        type: 'Vector Tile Layer',
        url: 'https://tiles.arcgis.com/tiles/eYXun6c1pgy8Qpta/arcgis/rest/services/2021_Lubbock_Contours_1ft/VectorTileServer',
        options: {
          id: 'contours',
          opacity: 0.5,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/0',
        options: {
          id: 'addresses',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/3',
        options: {
          id: 'buildingfootprints',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/11',
        options: {
          id: 'citycouncildistricts',
          opacity: 0.5,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/12',
        options: {
          id: 'citylimits',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/10',
        options: {
          id: 'neighborhoodassociations',
          opacity: 0.5,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/4',
        options: {
          id: 'parcels',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/9',
        options: {
          id: 'parks',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/8',
        options: {
          id: 'subdivisions',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/2',
        options: {
          id: 'schools',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/7',
        options: {
          id: 'streetaddressdirection',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/6',
        options: {
          id: 'streetcenterlines',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/1',
        options: {
          id: 'streetnames',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/13',
        options: {
          id: 'zipcodes',
          opacity: 0.5,
        },
      },
    
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/3',
        options: {
          id: 'currentzoningcases',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/1',
        options: {
          id: 'designdistricts',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/4',
        options: {
          id: 'futurelanduseplan',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/2',
        options: {
          id: 'pendingzbacases',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/0',
        options: {
          id: 'pendingzonecases',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/5',
        options: {
          id: 'preliminaryplats',
          opacity: 1,
        },
      },


      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_FloodZonesLakes/FeatureServer/1',
        options: {
          id: 'lake',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_FloodZonesLakes/FeatureServer/2',
        options: {
          id: 'lakenumber',
          opacity: 1,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/0',
        options: {
          id: 'firehydrants',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/6',
        options: {
          id: 'watermains',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/2',
        options: {
          id: 'sewermanholes',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/1',
        options: {
          id: 'sewercleanouts',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/7',
        options: {
          id: 'sewergravitymains',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/8',
        options: {
          id: 'sewerforcemains',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/3',
        options: {
          id: 'stormwatermanholes',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/4',
        options: {
          id: 'stormwaterinlets',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/5',
        options: {
          id: 'stormwateroutfalls',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/9',
        options: {
          id: 'stormwaterpipes',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/11',
        options: {
          id: 'trafficvolumetotals',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/12',
        options: {
          id: 'trafficsignals',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/15',
        options: {
          id: 'residentpermitonlyparkingzones',
          opacity: 0.5,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/10',
        options: {
          id: 'impactfeeservicearea',
          opacity: 0.5,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/12',
        options: {
          id: 'alleydedicationdeeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/20',
        options: {
          id: 'blocknumbers',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/9',
        options: {
          id: 'drainageeasements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/5',
        options: {
          id: 'lotlines',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/21',
        options: {
          id: 'lotdimensions',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/22',
        options: {
          id: 'lotnumbers',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/19',
        options: {
          id: 'ordinanceclosures',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/13',
        options: {
          id: 'parkdedicationdeeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/14',
        options: {
          id: 'platdedicatedrow',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/10',
        options: {
          id: 'propertyacquisitiondeeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/17',
        options: {
          id: 'railroaddeedsandeasements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/23',
        options: {
          id: 'rowdimensions',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/15',
        options: {
          id: 'roweasements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/6',
        options: {
          id: 'sectionlines',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/16',
        options: {
          id: 'staterowdeedsandeasements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/11',
        options: {
          id: 'streetdedicationdeeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/24',
        options: {
          id: 'subdivisionnames',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/18',
        options: {
          id: 'uselicenses',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/7',
        options: {
          id: 'utilityequipmenteasements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/8',
        options: {
          id: 'utilitygarbageaccesseasements',
          opacity: 1,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/0',
        options: {
          id: 'airports',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/1',
        options: {
          id: 'animalservices',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/2',
        options: {
          id: 'citibustransferplaza',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/3',
        options: {
          id: 'citizenstower',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/4',
        options: {
          id: 'cementaries',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/5',
        options: {
          id: 'utilities',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/6',
        options: {
          id: 'civiccenter',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/7',
        options: {
          id: 'communitycenters',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/8',
        options: {
          id: 'firestations',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/9',
        options: {
          id: 'healthdepartments',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/10',
        options: {
          id: 'libraries',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/11',
        options: {
          id: 'museums',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/12',
        options: {
          id: 'policestations',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/13',
        options: {
          id: 'pools',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/14',
        options: {
          id: 'recyclingcenters',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/15',
        options: {
          id: 'sportcomplexes',
          opacity: 1,
        },
      },

    ]
  };
});
