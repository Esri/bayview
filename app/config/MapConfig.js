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
      'xmin':-9606605.714878388,
      'ymin':3498798.940898446,
      'xmax':-9478191.507359464,
      'ymax':3568509.5106944325,
      spatialReference: {
        'wkid': 102100
      }
    },

    agsPortal: {
      isEnabled: false,
      appId: 'GVI6HH3sKAutXQuG',
      portalUrl: 'http://prof-services.maps.arcgis.com/',
      popup: false,
      webmapId: 'cb5efa6f0ef242369b3bc3e2d1f0d32f',
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
          url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/0',
          options: {
            id: 'addresses',
            title: 'Addresses',
            opacity: 1,
            visible: true,
            infoWindow: {
              isEnabled: true,
              outFields: ['*'],
              title: 'Addresses',
              headerFunction: function(attrs) {
                return '' + attrs.ADDRESS;
              },
              //contentFunction: function(attrs) {
              //  return '<p>Population (2014): ' + attrs.POP2014 + '</p>';
              //},
              iconClass: 'fa fa-tint',
              widget: '' // use 'DefaultInfoWindow' or define your own
            }
          },
        },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/1',
        options: {
          id: 'roads',
          title: 'Roads',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Roads',
            headerFunction: function(attrs) {
              return '' + attrs.NAME;
            },
            iconClass: 'fa fa-road',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/3',
        options: {
          id: 'hydrants',
          title: 'Hydrants',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Hydrants',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/4',
        options: {
          id: 'futurelanduse',
          title: 'Future Land Use',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            showLabels: true,
            title: 'Future Land Use',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/5',
        options: {
          id: 'zoning',
          title: 'Zoning',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Zoning',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/6',
        options: {
          id: 'municipalboundaries',
          title: 'Municipal Boundaries',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Municipal Boundaries',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/7',
        options: {
          id: 'onefootcontours',
          title: 'One Foot Contours',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'One Foot Contours',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/8',
        options: {
          id: 'easements',
          title: 'Easements',
          opacity: 1,
          visible: true,
         infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Easements',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/9',
        options: {
          id: 'femafloodways',
          title: 'FEMA Floodways',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'FEMA Floodways',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/10',
        options: {
          id: 'femacobraopa',
          title: 'FEMA COBRA & OPA',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'FEMA COBRA & OPA',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/11',
        options: {
          id: 'FEMAfloodzones',
          title: 'FEMA Flood Zones',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'FEMA Flood Zones',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/12',
        options: {
          id: 'femafirmindex',
          title: 'FEMA FIRM Index',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'FEMA FIRM Index',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/13',
        options: {
          id: 'wetlands',
          title: 'Wetlands',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Wetlands',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/14',
        options: {
          id: 'soils',
          title: 'Soils',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Soils',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/15',
        options: {
          id: 'evacuationzones',
          title: 'Evacuation Zones',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Evacuation Zones',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/16',
        options: {
          id: 'CoastalHighHazardArea',
          title: 'Coastal High Hazard Area',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Coastal High Hazard Area',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/17',
        options: {
          id: 'StormSurge',
          title: 'Storm Surge',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Storm Surge',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/18',
        options: {
          id: 'EcosystemManagementAreas',
          title: 'Ecosystem Management Areas',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Ecosystem Management Areas',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/19',
        options: {
          id: 'PlannedUnitDevelopments',
          title: 'Planned Unit Developments',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Planned Unit Developments',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/20',
        options: {
          id: 'CommunityRedevAgencies',
          title: 'Community Redev Agencies',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Community Redev Agencies',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/21',
        options: {
          id: 'CountyCommissionerDistricts',
          title: 'County Commissioner Districts',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'County Commissioner Districts',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/22',
        options: {
          id: 'serviceareas',
          title: 'Service Areas',
          opacity: .5,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Service Areas',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/23',
        options: {
          id: 'beachaccess',
          title: 'Beach Access',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Beach Access',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-sun-o',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/24',
        options: {
          id: 'boatramps',
          title: 'Boat Ramps',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Boat Ramps',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-sun-o',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/25',
        options: {
          id: 'libraries',
          title: 'Libraries',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Libraries',
            headerFunction: function(attrs) {
              return '' + attrs.NAME;
            },
            iconClass: 'fa fa-book',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/26',
        options: {
          id: 'recycling',
          title: 'Recycling',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Recycling',
            headerFunction: function(attrs) {
              return '' + attrs.NAME;
            },
            iconClass: 'fa fa-book',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/27',
        options: {
          id: 'schools',
          title: 'Schools',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Schools',
            headerFunction: function(attrs) {
              return '' + attrs.NAME;
            },
            iconClass: 'fa fa-graduation-cap',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
      },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/28',
        options: {
          id: 'parks',
          title: 'Parks',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Parks',
            headerFunction: function(attrs) {
              return '' + attrs.NAME;
            },
            iconClass: 'fa fa-tree',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        }
    },
      {
        type: 'Feature Layer',
        url: 'http://gis.baycountyfl.gov/arcgis/rest/services/PublicViewer/MapServer/2',
        options: {
          id: 'parcels',
          title: 'Parcels',
          opacity: 1,
          visible: true,
          infoWindow: {
            isEnabled: true,
            outFields: ['*'],
            title: 'Parcels',
            headerFunction: function(attrs) {
              return '' + attrs.ADDRESS;
            },
            iconClass: 'fa fa-tint',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      }
    ]
  };
});
