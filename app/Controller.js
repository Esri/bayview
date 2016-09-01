/**
 * Esri © 2014
 **/

define([

  // core dojo packages
  'dojo/topic',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/_base/lang',
  'dojo/sniff',
  'dojo/on',

  // core components
  'core/MapController',

  // configruation files
  './config/AppConfig',
  './config/MapConfig',
  './config/WidgetConfig',

  // application dijits
  './InfoWindows/InfoWindowController',
  './widget/Navigation',
  './widget/InfoPanel',

  'widget/UnifiedSearch',
  'widget/Legend',
  'widget/Coordinates',
  'widget/DrawTool',
  'widget/Measure',
  'esri/dijit/Measurement',

  './model/PortalUserModel',

  'esri/arcgis/utils',
  'esri/arcgis/Portal',
  'esri/arcgis/OAuthInfo',
  'esri/IdentityManager',
  'esri/tasks/GeometryService',
  'esri/config',

  'dojo/i18n!./nls/Strings'

], function(
  topic, dom, domClass, lang, has, on,
  MapController,
  appConfig, mapConfig, widgetConfig,
  InfoWindowController, Navigation, InfoPanel,
  UnifiedSearch, Legend, Coordinates, DrawTool, Measure, Measurement,
  PortalUserModel,
  arcgisUtils, arcgisPortal, OAuthInfo, esriId, GeometryService, esriConfig,
  i18n
) {

  return {

    startup: function() {
      // instantiate the Geometry Service
      esriConfig.defaults.geometryService = new GeometryService(appConfig.services.geometry);

      // If app has loading screen then show this first
      if (appConfig.app.hasLogin) {
        this._initLogin();
      } else {

        // If app does NOT have a loading screen, then
        // either load Portal User
        if (mapConfig.agsPortal.isEnabled) {
          var info = new OAuthInfo({
            appId: mapConfig.agsPortal.appId,
            portalUrl: mapConfig.agsPortal.portalUrl,
            popup: false
          });
          esriId.registerOAuthInfos([info]);

          esriId.checkSignInStatus(info.portalUrl + '/sharing').then(lang.hitch(this, function(resUrl) {
            console.log('resUrl', resUrl);
            new arcgisPortal.Portal(mapConfig.agsPortal.portalUrl).signIn().then(lang.hitch(this, function(portalUser) {
              console.log('Signed in to the portal: ', portalUser);
              PortalUserModel.setPortalUser(portalUser);
              arcgisUtils.arcgisUrl = PortalUserModel.getArcgisUrl();
              this._startMap();
            })).otherwise(function(error) {
              console.log('Error occurred while signing in: ', error);
            });
          })).otherwise(function() {
            console.log('nope');

            //domClass.add('anonymousPanel', 'hidden');
            //domClass.add('personalizedPanel', 'hidden');
          });

          console.log('get portal credentials');
          esriId.getCredential(info.portalUrl);
        } else {

          // Or just load the app (using ArcGIS Server config)
          this._startMap();
        }
      }

      this._attachTopics();
    },

    _initLogin: function() {
      this.loginPage = new Login({
        controller: this
      }, 'loginContainer');

      domClass.replace(dom.byId('loadingOuter'), 'splash-login', 'splash-loading');
      this.loginPage.startup();
    },

    _startMap: function() {
      if (mapConfig.agsPortal.isEnabled) {
        // initialize the web map
        this.mapController = MapController.createWebMap(mapConfig.agsPortal.webmapId, 'map', mapConfig);
        this.mapController.then(lang.hitch(this, function(mapObj) {
          // attach the map related topics to the mapObject
          MapController.initTopics(mapObj);
          // now that the map is loaded we can initialize the widgets that rely on the map
          this._initWidgets(mapObj.map);
        }));
      } else {
        // initialize the map
        this.mapController = MapController.createMap('map', mapConfig);
        this.mapController.then(lang.hitch(this, function(mapObj) {
          // attach the map related topics to the mapObject
          MapController.initTopics(mapObj);
          // now that the map is loaded we can initialize the widgets that rely on the map
          this._initWidgets(mapObj);
        }));
      }
    },

    _initWidgets: function(map) {
      console.log('initWidgets called');

      this.navigation = new Navigation({
        map: map
      }, 'navigation');
      this.navigation.startup();

      // Legend
      if (widgetConfig.legend.isEnabled) {
        this.legend = new Legend({
          map: map,
          id: 'Legend',
          legendConfig: widgetConfig.legend
        }, 'legendContainer');
        this.legend.startup();
      }

      this.drawTool = new DrawTool({
        map: map,
        drawConfig: widgetConfig.drawTool
      }, 'drawContainer');
      this.drawTool.startup();

      this.infoPanel = new InfoPanel({
        map: map,
        config: widgetConfig.infoPanel
      }, 'infoPanelContainer');

      topic.subscribe('/UnifiedSearch/result/clicked', lang.hitch(this, function(sender, args) {
          //console.log('opening info panel');
        var layerId = args.layerId;
        var selectedFeature = args.obj;
        this.infoPanel.showDetails(layerId, selectedFeature);
        // TODO: show the panel
        this.infoPanel.showPanel();
      }));

      topic.subscribe('/UnifiedSearch/clear/clicked', lang.hitch(this, function(sender, args) {
          //console.debug('hiding info panel');
        this.infoPanel.hidePanel();
      }));

      topic.subscribe('/InfoPanel/clear', lang.hitch(this, function(sender, args) {
          //console.debug('clear info panel');
        this.infoPanel.clear();
      }));

    //   on(this.drawTool, 'started', lang.hitch(this, function(args) {
    //     console.log('draw started', args);
    //   }));

        this.measure = new Measure({
         map: map
        }, 'measureContainer');
        this.measure.startup();

    //   this.measurement = new Measurement({
    //     map: map
    //   }, 'measureContainer');
    //   this.measurement.startup();

      /*
      if (mapConfig.drawTool.isEnabled) {
        this.drawTool = new DrawTool({
          map: this.esriMap.map,
          drawConfig: mapConfig.drawTool
        }, 'drawContainer');
        this.drawTool.startup();
      }

      if (mapConfig.driveTimes.isEnabled) {
        this.driveTimes = new DriveTimes({
          map: this.esriMap.map,
          driveTimesConfig: mapConfig.driveTimes
        }, 'driveTimesContainer');
        this.driveTimes.startup();
      }

      if (mapConfig.homeButton.isEnabled) {
        this.homeButtonTool = new HomeButton({
          myMap: this.esriMap.map
        }, 'homeButtonContainer');
        this.homeButtonTool.startup();
      }

      if (mapConfig.placemarksTool.isEnabled) {
        this.placemarksTool = new Placemarks({
          placemarksConfig: mapConfig.placemarksTool
        }, 'placemarks');
        this.placemarksTool.startup();
      }

      if (mapConfig.layerList.isEnabled) {
        this.layerList = new LayerList({
          esriMap: this.esriMap,
          layerConfig: mapConfig.layerList
        }, domConstruct.create('div'));
        this.layerList.startup();
        var layerListDropDown = new TooltipDialog({
          'content': this.layerList
        });
        var layersDropDownButton = new DropDownButton({
          //label: '<div class='map-tool-title-container'><div class='map-tool-title-icon'><i class='fa advantagepoint-toc'></i></div><div class='map-tool-title-text'><p>Layers</p></div></div>',
          label: 'Boundary Layers',
          dropDown: layerListDropDown,
          //tooltipDialogClass: 'no-space-tooltip-dialog',
          showLabel: true
        }, 'layers');
        layersDropDownButton.startup();
      }
      */

      // InfoWindow Controller
      this.infoWindowController = new InfoWindowController({
        map: map,
        infoWindowConfig: mapConfig.infoWindowConfig
      });

      // Coordinates
      if (widgetConfig.coordinates.isEnabled) {
        this.coordinates = new Coordinates({
          map: map,
          coordinatesConfig: widgetConfig.coordinates
        }, 'coordinatesContainer');
        this.coordinates.startup();
      }

      // UnifiedSearch
      if (widgetConfig.unifiedSearch.isEnabled) {
        this.search = new UnifiedSearch({
          toolPrefix: 'UnifiedSearch',
          searchConfig: widgetConfig.unifiedSearch,
          viewElement: dom.byId('searchContainer'),
          map: map
        });
        this.search.startup();
        topic.subscribe('/map/clicked', lang.hitch(this, function(sender, args) {
            console.debug('the map was clicked yo!', args);
            this.search.mapClickEvent(args.event.target);
          this.search.searchMapPoint(args.event.mapPoint);
        }));

        topic.subscribe('/ToolList/selected', lang.hitch(this, function(sender, args) {
          this.search.hide();
        }));

        //TODO this may be misplaced as it doesnt rely on map?
        topic.subscribe('/ToolList/unselected', lang.hitch(this, function(sender, args) {
          this.search.show();
          if (args.type === 'draw') {
              this.drawTool.hide();
          }
        }));

        //TODO this may be misplaced as it doesnt rely on map?
        topic.subscribe('/DrawTool/close', lang.hitch(this, function(sender, args) {
          this.search.show();
          this.drawTool.hide();
          this.navigation.clearToolList();
        }));

        // topic.subscribe('/map/zoom/feature', lang.hitch(this, function(sender, args) {
        //     console.debug('zoom to feature - sender', sender);
        //     console.debug('zoom to feature - args', args);
        //     console.debug('feature extent', args.feature.geometry.getExtent());
        //     map.setExtent(args.feature.geometry.getExtent());
        // }));
      }

      //-----------------------------------------------------------------------
      // initilize your widgets here

      //-----------------------------------------------------------------------

      // finally remove the loading screen
      this._clearLoadingScreen();
    },

    _clearLoadingScreen: function() {
      domClass.replace(dom.byId('loadingOuter'), 'splash-finished', ['splash-loading', 'splash-login']);
      setTimeout(function() {
        domClass.add(dom.byId('loadingOuter'), 'hidden');
      }, (has('ie') <= '9' ? 0 : 1000));

      console.log('+++ all started +++');
    },

    _attachTopics: function() {
      topic.subscribe('/BasemapToggle/changed', lang.hitch(this, function(sender, args) {
        console.log('toggled to basemap: ', args.newBasemap);
      }));

      /*
      topic.subscribe('/map/loaded', lang.hitch(this, function() {
        console.log('/map/loaded' + ' received');
        this.initMapWidgets();
        this.initWidgets();
      }));
      */

      topic.subscribe('/HomeButton/clicked', lang.hitch(this, function(sender, args) {
        var args2 = mapConfig.initialExtent;
        lang.mixin(args2, mapConfig.initialExtent.spatialReference);
        topic.publish('/map/zoom/extent', this, args2);
      }));

      topic.subscribe('/ErrorDialog/show', lang.hitch(this, function(sender, args) {
        this.initErrorDialog(args || null);
      }));

      topic.subscribe('/InfoWindow/selectionChanged', lang.hitch(this, function(args) {
        this.infoWindowController.show(args.target, this);
      }));

      topic.subscribe('/InfoWindow/Feature/show', lang.hitch(this, function(sender, args) {
        var selectedFeature = args.feature;
        var self = this;
        this.infoWindowController.showFeature(selectedFeature, self);
      }));

      topic.subscribe('/ToolList/tool', lang.hitch(this, function(sender, args) {
          if (args.type === 'draw') {
              this.drawTool.show();
          }
      }));

      /*
      // loading indicator disabled for now since it is almost not needed, map is too fast
      topic.subscribe('/MapLoading/show', lang.hitch(this, function() {
        domClass.remove(dom.byId('mapLoadingIndicator'), 'hidden');
      }));

      topic.subscribe('/MapLoading/hide', lang.hitch(this, function() {
        domClass.add(dom.byId('mapLoadingIndicator'), 'hidden');
      }));
      */

    }

  };
});
