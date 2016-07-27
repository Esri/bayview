define(['esri/layers/FeatureLayer'], function(FeatureLayer) {
  return {

    map: {
      options: {
        // default basemap
        basemap: 'streets', // 'streets', 'satellite', 'hybrid', 'topo', 'gray', 'oceans', 'national-geographic', 'osm', 'dark-gray'

        // if center & zoom are not defined then extent as defined in "initialExtent" below is being used
        //center: [-122.45,37.77],
        //zoom: 12,

        scrollWheelZoom: true,

        // navigation
        slider: true,
        sliderStyle: 'small',  // "small" or "large"
        sliderPosition: 'bottom-right', // "top-left", "top-right", "bottom-left", "bottom-right"
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
      'xmin': -9665462.226658236,
      'ymin': 3486110.3942031497,
      'xmax': -9386161.325304095,
      'ymax': 3642194.805961539,
      spatialReference: {
        wkid: 102100
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

    drawTool: {
      isEnabled: false,
      tools: ['POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'] // 'POINT', 'POLYLINE', 'POLYGON', 'FREEHAND_POLYGON'
    },

    homeButton: {
      isEnabled: false
    },

    placemarksTool: {
      isEnabled: true,
      useStateFaceIcons: true,
      placemarks: [{
        label: 'US',
        icon: '',
        extent: {
          xmin: -14213618.283681434,
          ymin: 2090676.0058292607,
          xmax: -7448024.036105711,
          ymax: 7525654.465016988
        }
      }, {
        label: 'HI',
        icon: '',
        extent: {
          xmin: -17878620.915898174,
          ymin: 2064381.6680991163,
          xmax: -17190687.661331624,
          ymax: 2614728.271752358
        }
      }, {
        label: 'AK',
        icon: '',
        extent: {
          xmin: -20722384.116219025,
          ymin: 6520354.66901062,
          xmax: -13956789.868643302,
          ymax: 11955333.128198348
        }
      }]
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
            //contentFunction: function(attrs) {
            //  return '<p>Population (2014): ' + attrs.POP2014 + '</p>';
            //},
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
            //contentFunction: function(attrs) {
            //  return '<p>Population (2014): ' + attrs.POP2014 + '</p>';
            //},
            iconClass: 'fa fa-coffee',
            widget: '' // use 'DefaultInfoWindow' or define your own
          }
        },
      }
      
    ]
  };
});
