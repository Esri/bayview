define([

  // core dojo packages
  'dojo/topic',
  'dojo/on',
  'dojo/dom',
  'dojo/dom-style',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/_base/window',
  'dojo/_base/lang',
  'dojo/_base/fx',
  'dojo/query',
  'dojo/sniff',
  'dojo/json',

  // configruation files
  'app/config/AppConfig',
  'app/config/MapConfig',

  // application dijits
  './widget/Navigation',

  './model/AppModel',

  'core/MapController',

  'esri/tasks/GeometryService',
  'esri/config',

  'dojo/domReady!'

], function(
  topic, on, dom, domStyle, domConstruct, domClass, win, lang, fx, query, has, JSON,
  appConfig, mapConfig,
  Navigation,
  appModel,
  MapController,
  GeometryService, esriConfig
) {

  return {

    startup: function() {
      esriConfig.defaults.geometryService = new GeometryService(appConfig.services.geometry);
      this._initWidgets();
      this._attachTopics();
    },

    _initWidgets: function(mapObj) {
      console.log('initWidgets called');

      this.mapController = MapController.createMap('map', mapConfig);
      this.mapController.then(lang.hitch(this, function(mapObj) {
        this.map = mapObj;

        this.navigation = new Navigation({}, 'navigation');
        this.navigation.startup();

        // finally remove the loading screen
        this.clearLoadingScreen();
      }));
    },

    clearLoadingScreen: function() {
      domClass.replace(dom.byId('loadingOuter'), 'splash-finished', ['splash-loading', 'splash-login']);
      setTimeout(function() {
        domStyle.set(dom.byId('loadingOuter'), 'display', 'none');
      }, (has('ie') <= '9' ? 0 : 1000));

      console.log('+++ all started +++');
    },

    _attachTopics: function() {
      topic.subscribe('/map/loaded', lang.hitch(this, function() {
        console.log('/map/loaded' + ' received');
        this.initMapWidgets();
        this.initWidgets();
      }));

      topic.subscribe('/MapLoading/show', lang.hitch(this, function() {
        var loadingIndicators = query('.map-loading-indicator');
        _.each(loadingIndicators, function(element, index, loadingIndicators) {
          domStyle.set(element, 'display', 'block');
        });
      }));

      topic.subscribe('/MapLoading/hide', lang.hitch(this, function() {
        var loadingIndicators = query('.map-loading-indicator');
        _.each(loadingIndicators, function(element, index, loadingIndicators) {
          domStyle.set(element, 'display', 'none');
        });
      }));
    }

  };
});
