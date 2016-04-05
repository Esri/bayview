/**
 * Esri © 2015
 **/
define([
  'esri/layers/FeatureLayer',
  'esri/basemaps'
], function(FeatureLayer, esriBasemaps) {

  // Define custom basemap
  esriBasemaps.campus = {
    baseMapLayers: [
      {
        url: 'http://arcgis-tenone2012-1974758903.us-west-1.elb.amazonaws.com/arcgis/rest/services/Campus/MapServer'
      }
    ],
    thumbnailUrl: '',
    title: 'Esri Campus'
  };

  return {

    /* https://developers.arcgis.com/javascript/jsapi/map-amd.html */
    map: {
      options: {
        // default basemap
        basemap: 'streets',

        // if center & zoom are not defined then extent as defined in "initialExtent" below is being used
        //center: [-122.45,37.77],
        //zoom: 12,

        maxZoom: 23,
        lods: [
                { 'level': 0,  'resolution': 156543.033928,    'scale': 591657527.591555 },
                { 'level': 1,  'resolution': 78271.5169639999, 'scale': 295828763.795777 },
                { 'level': 2,  'resolution': 39135.7584820001, 'scale': 147914381.897889 },
                { 'level': 3,  'resolution': 19567.8792409999, 'scale': 73957190.948944 },
                { 'level': 4,  'resolution': 9783.93962049996, 'scale': 36978595.474472 },
                { 'level': 5,  'resolution': 4891.96981024998, 'scale': 18489297.737236 },
                { 'level': 6,  'resolution': 2445.98490512499, 'scale': 9244648.868618 },
                { 'level': 7,  'resolution': 1222.99245256249, 'scale': 4622324.434309 },
                { 'level': 8,  'resolution': 611.49622628138,  'scale': 2311162.217155 },
                { 'level': 9,  'resolution': 305.748113140558, 'scale': 1155581.108577 },
                { 'level': 10, 'resolution': 152.874056570411, 'scale': 577790.554289 },
                { 'level': 11, 'resolution': 76.4370282850732, 'scale': 288895.277144 },
                { 'level': 12, 'resolution': 38.2185141425366, 'scale': 144447.638572 },
                { 'level': 13, 'resolution': 19.1092570712683, 'scale': 72223.819286 },
                { 'level': 14, 'resolution': 9.55462853563415, 'scale': 36111.909643 },
                { 'level': 15, 'resolution': 4.77731426794937, 'scale': 18055.954822 },
                { 'level': 16, 'resolution': 2.38865713397468, 'scale': 9027.977411 },
                { 'level': 17, 'resolution': 1.19432856685505, 'scale': 4513.988705 },
                { 'level': 18, 'resolution': 0.59716428355982, 'scale': 2256.994353 },
                { 'level': 19, 'resolution': 0.29858214164762, 'scale': 1128.497176 },
                // these last four levels are zoomed in beyond any publicly available basemaps.
                // If you have a basemap beyond level 19, you've gotta make sure the resolution
                // and scale it's published at match the LODs you put in there for 20+
                { 'level': 20, 'resolution': 0.14929144441622, 'scale': 564.25 },
                { 'level': 21, 'resolution': 0.07464439928880, 'scale': 282.12 },
                { 'level': 22, 'resolution': 0.03747036660734, 'scale': 141.62 },
                { 'level': 23, 'resolution': 0.0187351833037,  'scale': 70.8 }
            ],

        scrollWheelZoom: false,

        // navigation
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
      'xmin':-9650021.94694455,
      'ymin':3472504.6031683576,
      'xmax':-9479414.49981197,
      'ymax':3642347.6800180846,
      spatialReference: {
        wkid: 102100
      }
    },

    basemapGallery: {
      isEnabled: false, //basemaps: ['streets', 'satellite', 'hybrid', 'topo', 'gray', 'oceans', 'national-geographic', 'osm'],
      showCustomBasemaps: true,
      defaultBasemapOverridden: 'gray', // if using the basemapGallery (isEnabled = true) this property will override the defaultBasemap set above
      showArcGISBasemaps: false
    },

    agsPortal: {
      isEnabled: false,
      appId: '2IHv1oAV1MHKXIq4',
      portalUrl: 'http://aocia.esri.com/portal',
      popup: false,
      webmapId: '6c076299fc804cfe9a8898b86824f0e7'
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

    coordinates: {
      isEnabled: false
    },

    legend: {
      isEnabled: true,
      title: 'Legend',
      container: 'titlepane', // options are: 'titlepane', 'dropdown', 'none'
      autoUpdate: true, // ignored if Portal
      respectCurrentMapScale: true, // ignored if Portal
      includeLayerIds: ['states', 'farmers_markets', 'fsa_state_offices'] // leave empty if all  // ignored if Portal
    },

    routeTask: {
      url: 'http://3dcampus.arcgis.com/arcgis/rest/services/Routing/EsriCampusRouteService_NA/NAServer/Route',
      timeDisplayFunction: function(attrs) {
        var hrs = "00";
        var min = "00";
        var time = attrs.Total_WalkTime;
        if (time > 0) {
          hrs = parseInt(Number(time), 10);
          var m = Math.round((Number(time) - hrs) * 60);
          min = (m < 10) ? '0' + m : m;
        }
        return hrs + ':' + min + ' mins';
      },
      distanceDisplayFunction: function(attrs) {
        var distance = '?';
        if (attrs.Total_Length) {
          distance = Math.round(attrs.Total_Length * 100) / 100 + ' ft';
        }
        return distance;
      },
      outputGeometryPrecisionUnits: 'feet', // no other options defined yet
      routeParams: {
        returnDirections: true,
        returnRoutes: true,
        returnZ: true,
        returnStops: true,
        returnBarriers: false,
        returnPolygonBarriers: false,
        returnPolylineBarriers: false,
        outputGeometryPrecision: 2
      }
    },

    unifiedSearchConfig: {
      isEnabled: true,
      placeholder: 'Find employee or room...',
      searchDelay: 400,
      zoomToFeature: true, // zoom to the feature after selecting it
      showInfoWindow: true, // show info window after zooming to feature,
      queryIndividually: true,
      tables: [
      {
        url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/4',
        idField: 'OBJECTID', // this is the id field that serves as the unique id and needs to be related to the feature layer
        query: {
          returnGeometry: true, // if false then relatedQuery is used to determine geometry
          id: 'place', // unique identifier within the unifiedSearch Config
          fields: ['SHORTNAME', 'LOCATION'], // field to be queried on (where clause)
          group: {
            isGrouped: false,
            sectionHeader: 'States',
            iconClass: 'fa fa-folder'
          },
          results: {
            labelFields: ['SHORTNAME', 'LOCATION'],
            // comment out to use the label field instead (only first field in the array of labelFields will be used)
            labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
              return attrs.SHORTNAME + ' (' + attrs.LOCATION + ')';
            },
            // iconClassFunction: function(attrs) {
            //   return 'stateface stateface-' + attrs.STATE_ABBR.toLowerCase();
            // },
            priority: 1
          },
          relatedQuery: null
        }
      }, {
        url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/8',
        idField: 'LOCATION', // this is the id field that serves as the unique id and needs to be related to the feature layer
        query: {
          returnGeometry: true, // if false then relatedQuery is used to determine geometry
          id: 'people', // unique identifier within the unifiedSearch Config
          fields: ['KNOWN_AS_N', 'LOCATION'], // field to be queried on (where clause)
          group: {
            isGrouped: false,
            sectionHeader: 'Phone Incidents',
            iconClass: 'fa fa-phone'
          },
          results: {
            labelFields: ['KNOWN_AS_N', 'LOCATION'],
            labelFunction: function(attrs) { // label to show in results (must refer to queryLabelFields)
              return attrs.KNOWN_AS_N + ' (' + attrs.LOCATION + ')';
            },
            // iconClassFunction: function(attrs) {
            //   return 'fa fa-flash';
            // },
            priority: 3
          },
          relatedQuery: {
            isRelated: true,
            url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/4',
            foreignKeyField: 'LOCATION' // relate the idField to this foreignKeyField
          }
        }
      }],
      // http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators
      locators: [
        // {
        //   id: 'world_geocoder',
        //   url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
        //   minScore: 80,
        //   countryCode: 'US',
        //   maxLocations: 3
        // }
      ]
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

    },

    // operationalLayers: Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
    // 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
    operationalLayers: [
      {
        type: 'feature',
        url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/6',
        options: {
          id: 'buildings',
          title: 'Buildings',
          opacity: 1,
          visible: true,
          outFields: ['*']
        }
      },
      {
        type: 'feature',
        url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/4',
        options: {
          id: 'interior',
          title: 'Interior',
          opacity: 1,
          visible: false,
          outFields: ['*'],
          showLabels: true
        }
      },
      {
        type: 'feature',
        url: 'https://campusviewer.esri.com/arcgis/rest/services/EsriCampusViewer/CampusViewer/MapServer/3',
        options: {
          id: 'floorplan_lines',
          title: 'Floorplan Lines',
          opacity: 1,
          visible: false
        }
      }
    ],

    resourceLayers: [
      {
        resourceName: 'Restroom',
        resourceIconString: 'wc',
        resourceIconUrl: {
          male: '../../app/css/images/resource-icons/RestroomMale.svg',
          female: '../../app/css/images/resource-icons/RestroomFemale.svg',
          neutral: '../../app/css/images/resource-icons/RestroomMaleFemale.svg'
        }
      },
      {
        resourceName: 'Breakroom',
        resourceIconString: 'local_cafe',
        resourceIconUrl:'../../app/css/images/resource-icons/Breakroom.svg'
      },
      {
        resourceName: 'ConferenceRoom',
        resourceIconString: 'group',
        resourceIconUrl:'../../app/css/images/resource-icons/ConferenceRoom.svg'
      },
      {
        resourceName: 'CopyRoom',
        resourceIconString: 'print',
        resourceIconUrl:'../../app/css/images/resource-icons/CopyRoom.svg'
      }
    ]
  };
});
