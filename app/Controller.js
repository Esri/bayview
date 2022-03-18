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

    define([

      // core dojo packages
      'dojo/topic',
      'dojo/dom',
      'dojo/dom-class',
      'dojo/_base/lang',
      'dojo/sniff',
      'dojo/on',
      'dojo/_base/connect',
      'dijit/registry',
      'dojo/dom-style',
    
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
    
      'dojo/i18n!./nls/Strings'
    
    ], function(
      topic, dom, domClass, lang, has, on, connect, registry, domStyle,
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
    
          // Or just load the app (using ArcGIS Server config)
          this._startMap();
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
    
          // this printer uses print GP service
          this.printer = new PrintController({
            map: map,
            printTaskUrl: appConfig.services.print,
          }, 'printContainer');
          this.printer.startup();
    
          this.infoPanel = new InfoPanel({
            map: map,
            config: widgetConfig.infoPanel
          }, 'infoPanelContainer');
    
          this.measurement = new Measure({
            map: map
          }, 'measureContainer');
          this.measurement.startup();
    
          this.extractData = new ExtractData({
             map: map,
             config: widgetConfig.extractData
          }, 'extractContainer');
          this.extractData.startup();
    
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
          }

          //var printDialogButton = document.querySelector('.mdl-dialog-button');
          this.printDialog = document.querySelector('#printDialog');
          if (! printDialog.showModal) {
            dialogPolyfill.registerDialog(this.printDialog);
          }
          this.printDialog.querySelector('button:not([disabled])').addEventListener('click', lang.hitch(this, function() {
            this.printDialog.close();
          }));
    
          // finally remove the loading screen
          this._clearLoadingScreen();

          // FIX resize issue
          on(window, 'resize', function() { 
            var mapContainer = dom.byId('mapContainer');
            var computedStyle = domStyle.getComputedStyle(mapContainer);
            domStyle.set("map", {
              width: computedStyle.width,
              height: computedStyle.height,
            });
          });

        },
    
        _clearLoadingScreen: function() {
          domClass.replace(dom.byId('loadingOuter'), 'splash-finished', ['splash-loading', 'splash-login']);
          setTimeout(function() {
            domClass.add(dom.byId('loadingOuter'), 'hidden');
          }, (has('ie') <= '9' ? 0 : 1000));
    
          console.log('+++ all started +++');
        },
    
        _attachTopics: function() {
    
            topic.subscribe('/UnifiedSearch/result/clicked', lang.hitch(this, function(sender, args) {
              var layerId = args.layerId;
              var selectedFeature = args.obj;
              selectedFeature._layer = args._layer;
              var title = args.layerId;
              if (selectedFeature.attributes && selectedFeature.attributes['NAME']) {
                title = selectedFeature.attributes['NAME'];
              } else {
                var layers = [];
                _.each(widgetConfig.layerList.groups, function(layerGroups) {
                  _.each(layerGroups.layers, function(layer) {
                    layers.push(layer);
                  });
                });

                var layerObj = _.find(layers, layer => layer.id === args.layerId);
                if (layerObj) {
                  title = layerObj.name;
                }
              }
              this.search.lsView.showPopupHandler(title);
              //this.search.lsView.clear();
              this.infoPanel.clear();
              this.infoPanel.showDetails(layerId, selectedFeature);
              this.infoPanel.showPanel();
            }));
    
            topic.subscribe('/UnifiedSearch/clear/clicked', lang.hitch(this, function(sender, args) {
              this.infoPanel.hidePanel();
            }));
    
            topic.subscribe('/UnifiedSearch/back/clicked', lang.hitch(this, function(sender, args) {
              this.infoPanel.hidePanel();
            }));
    
            topic.subscribe('/map/clicked', lang.hitch(this, function(sender, args) {
                if (!this.measurement.isActiveTool()) {
                    //this.search.mapClickEvent(args.event.target);
                    // TODO turning this off for now (Reverse Geocode Search)
                    //this.search.searchMapPoint(args.event.mapPoint);
                    this.search.searchMapPoint(args.event.mapPoint);
                }
            }));
    
            topic.subscribe('/ToolList/selected', lang.hitch(this, function(sender, args) {
              this.search.lsView.hide();
            }));
    
            topic.subscribe('/ToolList/unselected', lang.hitch(this, function(sender, args) {
              this.search.lsView.show();
              this.navigation.clearToolList();
            }));
    
            //TODO this may be misplaced as it doesnt rely on map?
            topic.subscribe('/ToolList/unselectTool', lang.hitch(this, function(sender, args) {
              this.search.lsView.show();
              if (args.type === 'draw') {
                  this.drawTool.hide();
              } else if (args.type === 'measure') {
                  this.measurement.hide();
                  this.measurement.clearResult();
                  this.measurement.setTool(null);
              } else if (args.type === 'print') {
                  this.printer.hide();
              } else if (args.type === 'extract') {
                  this.extractData.hide();
              }
            }));
    
            // TODO the show/hide methods of draw need to be made like Measurements show/hide methods
            //TODO this may be misplaced as it doesnt rely on map?
            topic.subscribe('/DrawTool/close', lang.hitch(this, function(sender, args) {
              this.search.lsView.show();
              this.drawTool.hide();
              this.navigation.clearToolList();
            }));
    
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
                  this.measurement.show();
              } else if (args.type === 'print') {
                  this.printer.show();
              } else if (args.type === 'extract') {
                  this.extractData.show();
              }
          }));
    
          topic.subscribe('/InfoPanel/print', lang.hitch(this, function(sender, args) {
              this.infoPanel.hidePanel();
              this.navigation.toolList.handleToolSelect(args.type);
          }));
    
          topic.subscribe('/Legend/show', lang.hitch(this, function(sender, args) {
              this.legend.showAndOpen();
          }));
    
          topic.subscribe('/InfoPanel/clear', lang.hitch(this, function(sender, args) {
            this.infoPanel.clear();
            //this.search.handleFeatureClick();
          }));
    
          topic.subscribe('/layerlist/layer/clicked', lang.hitch(this, function(sender, args) {
            //this.search.layerVisibilityChanged(args);
          }));

          topic.subscribe('/Print/parcel', lang.hitch(this, function(sender, args) {
            this.printDialog.showModal();
          }));
    
        }
    
      };
    });
    