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
  './widget/PrintController',

  'widget/UnifiedSearch',
  'widget/Legend',
  'widget/Coordinates',
  'widget/DrawTool',
  'widget/Measure',
  'widget/ExtractData',

  './model/PortalUserModel',

  'esri/arcgis/utils',
  'esri/arcgis/Portal',
  'esri/arcgis/OAuthInfo',
  'esri/IdentityManager',
  'esri/tasks/GeometryService',
  'esri/config',
  // 'esri/dijit/Print',
  // 'esri/tasks/PrintTemplate',

  'dojo/i18n!./nls/Strings'

], function(
  topic, dom, domClass, lang, has, on,
  MapController,
  appConfig, mapConfig, widgetConfig,
  InfoWindowController, Navigation, InfoPanel, PrintController,
  UnifiedSearch, Legend, Coordinates, DrawTool, Measure, ExtractData,
  PortalUserModel,
  arcgisUtils, arcgisPortal, OAuthInfo, esriId, GeometryService, esriConfig,
  // Print, PrintTemplate,
  i18n
) {

  return {

    startup: function() {
      // instantiate the Geometry Service
      esriConfig.defaults.geometryService = new GeometryService(appConfig.services.geometry);

      // If app has loading screen then
      this._startMap();
      this._attachTopics();
    },

    _startMap: function() {
      // initialize the map
      this.mapController = MapController.createMap('map', mapConfig);
      this.mapController.then(lang.hitch(this, function(mapObj) {
        // attach the map related topics to the mapObject
        MapController.initTopics(mapObj);
        // now that the map is loaded we can initialize the widgets that rely on the map
        this._initWidgets(mapObj);
      }));
    },

    _initWidgets: function(map) {
      console.log('initWidgets called');

      on(map, 'layers-add-result', function() {
        //topic.publish('/map/zoom/extent', this, map.extent);
      });

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

      this.printer = new PrintController({
        map: map
      }, 'printContainer');
      this.printer.startup();

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

      this.measurement = new Measure({
        map: map
      }, 'measureContainer');
      this.measurement.startup();

      this.extractData = new ExtractData({
        map: map,
        config: widgetConfig.extractData
      }, 'extractContainer');

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
          if (!this.measurement.isActiveTool()) {
            //console.debug('no measure tool detected');
            this.search.mapClickEvent(args.event.target);
            // TODO turning this off for now (Reverse Geocode Search)
            //this.search.searchMapPoint(args.event.mapPoint);
          }
        }));

        topic.subscribe('/ToolList/selected', lang.hitch(this, function(sender, args) {
          this.search.hide();
        }));

        topic.subscribe('/ToolList/unselected', lang.hitch(this, function(sender, args) {
          this.search.show();
          this.navigation.clearToolList();
        }));

        //TODO this may be misplaced as it doesnt rely on map?
        topic.subscribe('/ToolList/unselectTool', lang.hitch(this, function(sender, args) {
          this.search.show();
          if (args.type === 'draw') {
            this.drawTool.hide();
          } else if (args.type === 'measure') {
            this.measurement.hide();
          } else if (args.type === 'print') {
            this.printer.hide();
          }
        }));

        // TODO the show/hide methods of draw need to be made like Measurements show/hide methods
        //TODO this may be misplaced as it doesnt rely on map?
        topic.subscribe('/DrawTool/close', lang.hitch(this, function(sender, args) {
          this.search.show();
          this.drawTool.hide();
          this.navigation.clearToolList();
        }));
        
      }

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
        this.infoPanel.hidePanel();
        if (args.type === 'draw') {
          this.drawTool.show();
        } else if (args.type === 'measure') {
          //console.debug('the measure tool was clicked');
          this.measurement.show();
        } else if (args.type === 'print') {
          this.printer.show();
        }
      }));

      topic.subscribe('/InfoPanel/print', lang.hitch(this, function(sender, args) {
        this.infoPanel.hidePanel();
        this.navigation.toolList.handleToolSelect(args.type);
      }));

      topic.subscribe('/Legend/show', lang.hitch(this, function(sender, args) {
        this.legend.showAndOpen();
      }));

      // loading indicator disabled for now since it is almost not needed, map is too fast
      topic.subscribe('/MapLoading/show', lang.hitch(this, function() {
        domClass.remove(dom.byId('mapLoadingIndicator'), 'hidden');
      }));

      topic.subscribe('/MapLoading/hide', lang.hitch(this, function() {
        domClass.add(dom.byId('mapLoadingIndicator'), 'hidden');
      }));

    }

  };
});
