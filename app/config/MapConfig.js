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
          title: 'Flood Zones',
          opacity: 0.5,
        },
      },
      {
        type: 'Vector Tile Layer',
        url: 'https://tiles.arcgis.com/tiles/eYXun6c1pgy8Qpta/arcgis/rest/services/2021_Lubbock_Contours_1ft/VectorTileServer',
        options: {
          id: 'contours',
          title: 'Contours',
          opacity: 0.5,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/0',
        options: {
          id: 'addresses',
          title: 'Addresses',
          opacity: 1,
        },
        showLabels: true,
        labelingInfo: [{
          "labelExpressionInfo": {
            "expression": "$feature.ADDR + ' ' + $feature.SUITE",
          },
          "labelPlacement": "center-center",
          "maxScale": 0,
          "minScale": 2000,
          "symbol": {
            "type": "esriTS",
            "color": [255, 255, 255, 255],
            "haloColor": [0,76,115,255],
            "haloSize": 1,
            "maxScale": 0,
            "minScale": 3000,
            "font": {
              "family": "Arial",
              "size": 12,
            },
          },
        }],
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/3',
        options: {
          id: 'buildingfootprints',
          title: 'Building Footprints',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/11',
        options: {
          id: 'citycouncildistricts',
          title: 'City Council Districts',
          opacity: 0.5,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/12',
        options: {
          id: 'citylimits',
          title: 'City Limits',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/10',
        options: {
          id: 'neighborhoodassociations',
          title: 'Neighborhood Associations',
          opacity: 0.5,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/4',
        options: {
          id: 'parcels',
          title: 'Parcels',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/9',
        options: {
          id: 'parks',
          title: 'Parks',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/8',
        options: {
          id: 'subdivisions',
          title: 'Subdivisions',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/2',
        options: {
          id: 'schools',
          title: 'Schools',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/7',
        options: {
          id: 'streetaddressdirection',
          title: 'Street Address Direction',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/6',
        options: {
          id: 'streetcenterlines',
          title: 'Street Centerlines',
          opacity: 1,
        },
        showLabels: true,
        labelingInfo: [{
          "labelExpressionInfo": {
            "expression": "$feature.PREFIX + ' ' + $feature.STREET + ' ' + $feature.STREET_TYPE",
          },
          "labelPlacement": "above-after",
          "maxScale": 0,
          "minScale": 4000,
          "symbol": {
            "type": "esriTS",
            "color": [255, 255, 255, 255],
            "haloColor": [0, 0, 0, 255],
            "haloSize": 1,
            "font": {
              "family": "Arial",
              "size": 11,
            },
          },
        }],
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/1',
        showLabels: true,
        options: {
          id: 'streetnames',
          title: 'Street Names',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/FeatureServer/13',
        options: {
          id: 'zipcodes',
          title: 'Zip Codes',
          opacity: 0.5,
        },
      },
    
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/4',
        options: {
          id: 'currentzoningcases',
          title: 'Current Zoning Cases',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/0',
        options: {
          id: 'designdistricts',
          title: 'Design Districts',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/5',
        options: {
          id: 'futurelanduseplan',
          title: 'Future Land Use Plan',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/2',
        options: {
          id: 'pendingzbacases',
          title: 'Pending ZBA Cases',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/3',
        options: {
          id: 'pendingzonecases',
          title: 'Pending Zone Cases',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/PubPlanningZoning/FeatureServer/1',
        options: {
          id: 'preliminaryplats',
          title: 'Preliminary Plats',
          opacity: 1,
        },
      },


      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_FloodZonesLakes/FeatureServer/1',
        options: {
          id: 'lake',
          title: 'Lakes',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_FloodZonesLakes/FeatureServer/2',
        options: {
          id: 'lakenumber',
          title: 'Lake Number',
          opacity: 1,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/0',
        options: {
          id: 'firehydrants',
          title: 'Fire Hydrants',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/6',
        options: {
          id: 'watermains',
          title: 'Water Mains',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/2',
        options: {
          id: 'sewermanholes',
          title: 'Sewer Manholes',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/1',
        options: {
          id: 'sewercleanouts',
          title: 'Sewer Cleanouts',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/7',
        options: {
          id: 'sewergravitymains',
          title: 'Sewer Gravity Mains',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/8',
        options: {
          id: 'sewerforcemains',
          title: 'Sewer Force Mains',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/3',
        options: {
          id: 'stormwatermanholes',
          title: 'Stormwater Manholes',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/4',
        options: {
          id: 'stormwaterinlets',
          title: 'Stormwater Inlets',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/5',
        options: {
          id: 'stormwateroutfalls',
          title: 'Stormwater Outfalls',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/9',
        options: {
          id: 'stormwaterpipes',
          title: 'Stormwater Pipes',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/11',
        options: {
          id: 'trafficvolumetotals',
          title: 'Traffic Volume Totals',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/12',
        options: {
          id: 'trafficsignals',
          title: 'Traffic Signals',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/15',
        options: {
          id: 'residentpermitonlyparkingzones',
          title: 'Resident Permit Only Parking Zones',
          opacity: 0.5,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_PubWorks/FeatureServer/10',
        options: {
          id: 'impactfeeservicearea',
          title: 'Impact Fee Service Area',
          opacity: 0.5,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/12',
        options: {
          id: 'alleydedicationdeeds',
          title: 'Alley Dedication Deeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/20',
        options: {
          id: 'blocknumbers',
          title: 'Block Numbers',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/9',
        options: {
          id: 'drainageeasements',
          title: 'Drainage Easements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/5',
        options: {
          id: 'lotlines',
          title: 'Lot Lines',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/21',
        options: {
          id: 'lotdimensions',
          title: 'Lot Dimensions',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/22',
        options: {
          id: 'lotnumbers',
          title: 'Lot Numbers',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/19',
        options: {
          id: 'ordinanceclosures',
          title: 'Ordinance Closures',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/13',
        options: {
          id: 'parkdedicationdeeds',
          title: 'Park Dedication Deeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/14',
        options: {
          id: 'platdedicatedrow',
          title: 'Plat Dedicated ROW',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/10',
        options: {
          id: 'propertyacquisitiondeeds',
          title: 'Property Acquisition Deeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/17',
        options: {
          id: 'railroaddeedsandeasements',
          title: 'Railroad Deeds and Easements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/23',
        options: {
          id: 'rowdimensions',
          title: 'ROW Dimensions',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/15',
        options: {
          id: 'roweasements',
          title: 'ROW Easements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/6',
        options: {
          id: 'sectionlines',
          title: 'Section Lines',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/16',
        options: {
          id: 'staterowdeedsandeasements',
          title: 'State ROW Deeds and Easements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/11',
        options: {
          id: 'streetdedicationdeeds',
          title: 'Street Dedication Deeds',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/24',
        options: {
          id: 'subdivisionnames',
          title: 'Subdivision Names',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/18',
        options: {
          id: 'uselicenses',
          title: 'Use Licenses',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/7',
        options: {
          id: 'utilityequipmenteasements',
          title: 'Utility Equipment Easements',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_BaseMap/MapServer/8',
        options: {
          id: 'utilitygarbageaccesseasements',
          title: 'Utility Garbage Access Easements',
          opacity: 1,
        },
      },

      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/0',
        options: {
          id: 'airports',
          title: 'Airports',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/1',
        options: {
          id: 'animalservices',
          title: 'Animal Services',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/2',
        options: {
          id: 'citibustransferplaza',
          title: 'CitiBus Transfer Plaza',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/3',
        options: {
          id: 'citizenstower',
          title: 'Citizens Tower',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/4',
        options: {
          id: 'cementaries',
          title: 'Cementaries',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/5',
        options: {
          id: 'utilities',
          title: 'Utilities',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/6',
        options: {
          id: 'civiccenter',
          title: 'Civic Center',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/7',
        options: {
          id: 'communitycenters',
          title: 'Community Centers',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/8',
        options: {
          id: 'firestations',
          title: 'Fire Stations',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/9',
        options: {
          id: 'healthdepartments',
          title: 'Health Departments',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/10',
        options: {
          id: 'libraries',
          title: 'Libraries',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/11',
        options: {
          id: 'museums',
          title: 'Museums',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/12',
        options: {
          id: 'policestations',
          title: 'Police Stations',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/13',
        options: {
          id: 'pools',
          title: 'Pools',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/14',
        options: {
          id: 'recyclingcenters',
          title: 'Recycling Centers',
          opacity: 1,
        },
      },
      {
        type: 'Feature Layer',
        url: 'https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_POI/FeatureServer/15',
        options: {
          id: 'sportcomplexes',
          title: 'Sport Complexes',
          opacity: 1,
        },
      },

    ]
  };
});
