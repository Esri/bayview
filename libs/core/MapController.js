// jscs:disable disallowMultipleVarDecl
define([
    'esri/map',
    'esri/SpatialReference',
    'esri/arcgis/utils',
    'esri/geometry/webMercatorUtils',
    'esri/geometry/Geometry',
    'esri/geometry/Point',
    'esri/geometry/Extent',
    'esri/graphic',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleFillSymbol',

    'esri/dijit/Scalebar',
    'esri/dijit/OverviewMap',

    './layerUtils',

    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-construct',
    'dojo/dom-class',

    'dojo/_base/declare',
    'dojo/_base/window',
    'dojo/_base/lang',
    'dojo/_base/Color',

    'dojo/on',
    'dojo/topic',
    'dojo/touch',
    'dojo/query',
    'dojo/Deferred',
    'dojo/NodeList-traverse'],
    function(Map, SpatialReference, EsriUtils,
        webMercatorUtils, Geometry, Point, Extent, Graphic, SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol,
        Scalebar, OverviewMap,
        layerUtils,
        dom, domStyle, domConstruct, domClass,
        declare, win, lang, Color,
        on, topic, touch, query, Deferred, nodecols) {
      'use strict';

      return {
        // BootstrapMap Class Public Functions
        createMap: function(divId, config) {
            console.debug('creating new map');
          var mapObject,
              mapOut,
              deferredOut;
          if (divId && config) {
            deferredOut = new Deferred();
            var options = config.map.options || {};
            mapObject = new this._mapObject(divId, options, config);
            mapOut = mapObject.createMap();
            mapOut._mapObject = mapObject;
            deferredOut.resolve(mapOut);
            return deferredOut;
          }
        },
        createWebMap: function(webMapId, divId, config) {
            console.debug('creating new webmap');
          var mapObject,
              deferredOut;
          if (divId && config) {
            var options = config.agsPortal.options || {};
            mapObject = new this._mapObject(divId, options, config);
            deferredOut = mapObject.createWebMap(webMapId);
            return deferredOut;
          }
        },
        destroy: function(map) {
          function _disconnect(resizer) {
            if (resizer._handles) {
              var i = resizer._handles.length;
              while (i--) {
                resizer._handles[i].remove();
                resizer._handles.splice(i, 1);
              }
            }
          }

          if (map && map._mapObject) {
            _disconnect(map._mapObject);
          }
        },

        initTopics: function(map) {
          topic.subscribe('Map/AddCursorTooltip', lang.hitch(this, function(text) {
            // create node for the tooltip
            var self = this;
            var tip = text || 'Click to view location';
            this.tooltip = domConstruct.create('div', { 'class': 'tooltip', 'innerHTML': tip }, map.container);
            domStyle.set(this.tooltip, 'position', 'fixed');

            // update the tooltip as the mouse moves over the map
            this.tooltipMouseMoveEvt = on(map.root, 'mousemove', function(evt) {
              var px,
                  py;
              if (evt.clientX || evt.pageY) {
                px = evt.clientX;
                py = evt.clientY;
              } else {
                px = evt.clientX + win.body().scrollLeft - win.body().clientLeft;
                py = evt.clientY + win.body().scrollTop - win.body().clientTop;
              }

              domStyle.set(self.tooltip, { left: (px + 15) + 'px', top: (py) + 'px' });
              domClass.remove(self.tooltip, 'hidden');
            });

            // hide the tooltip the cursor isn't over the map
            this.tooltipMouseOutEvt = on(map.root, 'mouseout', function(evt) {
              domStyle.add(self.tooltip, 'hidden');
            });
          }));

          topic.subscribe('Map/RemoveCursorTooltip', lang.hitch(this, function() {
            domConstruct.destroy(this.tooltip);
            if (this.tooltipMouseMoveEvt) {
              this.tooltipMouseMoveEvt.remove();
            }

            if (this.tooltipMouseOutEvt) {
              this.tooltipMouseOutEvt.remove();
            }
          }));

          topic.subscribe('/map/zoom/extent', lang.hitch(this, function(sender, args) {
              console.debug('map zoom extent', args);
            var wkid = (args.wkid) ? parseInt(args.wkid, 10) : map.spatialReference.wkid;
            var extent = new Extent(parseFloat(args.xmin), parseFloat(args.ymin), parseFloat(args.xmax), parseFloat(args.ymax), new SpatialReference({ wkid: wkid }));
            map.setExtent(extent);
          }));

          topic.subscribe('/map/zoom/feature', lang.hitch(this, function(sender, args) {
            var geom = null;
            // if ("geometry" in args) {
            //     var convert = args.geometry;
            //     geom = new Geometry();
            //     geom.setSpatialReference(convert.spatialReference);
            //     geom.type = convert.type;
            //     geom.cache = convert.cache;
            //     // console.log(geom);
            //     // geom = webMercatorUtils.geographicToWebMercator(geom);
            //     // console.log(geom);
            //     // if (webMercatorUtils.canProject(geom, map)) {
            //     //     console.log('it can be projected web mecator');
            //     //    geom = webMercatorUtils.project(geom, map);
            //     //
            //     // }
            //     console.debug('converting geom', geom);
            // }
            if (args.feature.geometry.spatialReference.wkid === map.spatialReference.wkid) {
              geom = args.feature.geometry;
              console.debug('/map/zoom/feature', geom);
            } else {
              //geom = webMercatorUtils.geographicToWebMercator(args.feature.geometry);
              //geom = webMercatorUtils.webMercatorToGeographic(args.feature.geometry);
              //if (webMercatorUtils.canProject(args.feature.geometry, map)) {
                //geom = webMercatorUtils.project(args.feature.geometry, map);
              //}
            }

            if (geom && geom.type === 'polygon') {
              map.setExtent(geom.getExtent()); // geom.getCentroid();
            } else if (geom && geom.type === 'point') {
              var centerAndZoom = map.centerAndZoom(geom, map.getMaxZoom() - 2);
              if (args.zoomToFeature) {
                centerAndZoom.then(lang.hitch(this, function() {
                  if (args.showInfoWindow) {
                    this._zoomToFeature(args.feature);
                  }
                }));
              } else {
                map.infoWindow.hide();
              }
            }

            if (args.refreshLayers) {
              _.each(map.getLayersVisibleAtScale(), function(layer) {
                layer.refresh();
              });
            }
          }));

          topic.subscribe('/map/zoom/latlong', lang.hitch(this, function(sender, args) {
            var pt = new Point(args.longitude, args.latitude);
            //addGraphic(pt);
            map.centerAndZoom(pt, 12);
          }));

          topic.subscribe('/map/add/simplemarker', lang.hitch(this, function(sender, args) {
            map.graphics.clear();
            if (args.geometry) {
                // TODO use this for point style geometry
                if(args.geometry.type === 'point') {
                      var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 20,
                          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                          new Color([255, 0, 0]), 1),
                          new Color([255, 255, 255, 0.25]));
                } else if (args.geometry.type === 'polygon') {
                    var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                          new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                          new Color([255,0,0]), 2),new Color([255,255,255,0.25])
                        );
                }

              map.graphics.add(new Graphic(args.geometry, symbol));
            }
          }));

          topic.subscribe('/map/zoom/geometry', lang.hitch(this, function(sender, geometry) {
              console.debug('map zoom geom');
            var geom = null;
            if (geometry.spatialReference.wkid === 102100) {
              geom = geometry;
            } else {
              geom = webMercatorUtils.geographicToWebMercator(geometry);
            }

            if (geom.type === 'point') {
              map.centerAndZoom(geom, map.getMaxZoom() - 2);
              console.log('map zoomed to point geometry');
            } else {
              //var extent = new Extent(parseFloat(geom.xmin), parseFloat(geom.ymin), parseFloat(geom.xmax), parseFloat(geom.ymax), new SpatialReference({ wkid: geom.spatialReference.wkid }));
              map.setExtent(geom.getExtent());
              console.log('map zoomed to extent geometry');
            }
          }));

          topic.subscribe('/map/click/on', lang.hitch(this, function(sender, args) {
            if (map) {
              map.showZoomSlider();
              map._isClickEventOn = true;
            }
          }));

          topic.subscribe('/map/click/off', lang.hitch(this, function(sender, args) {
            if (map) {
              map.hideZoomSlider();
              map._mapObject._isClickEventOn = false;
            }
          }));
        },

        _zoomToPolygon: function(polygon) {
          this.addBoundaryGraphic(polygon, true);
          this.map.setExtent(polygon.getExtent().expand(1.5));
        },

        _zoomToFeature: function(feature) {
          topic.publish('/InfoWindow/Feature/show', this, {
            feature: feature
          });
        },

        // mapObject Class Functions
        _mapObject: declare(null, {
          constructor: function(mapDivId, options, config) {
            this._map = null;
            this._agsResponse = null;
            this._autoRecenterDelay =  50;
            this._popupRecenterDelayer = 150;
            this._popupPosition = 'top';
            this._popupBlocked = false;
            this._visible = true;
            this._visibilityTimer = null;
            this._mapDeferred = null;
            // Default bootstrap map options
            this._autoRecenter = options.autoRecenter || true;
            this._responsiveResize = options.responsiveResize || true;
            // Map properties
            this._mapDivId = mapDivId;
            this._mapDiv = dom.byId(mapDivId);
            this._mapStyle = domStyle.get(this._mapDiv);
            // Map options
            this._config = config;
            this._options = lang.mixin(options, {});
            // Events
            this._handles = [];
            this._isClickEventOn = true;
          },

          // Create a new map
          createMap: function() {
            this._setMapDiv(false);
            // Need to be false in responsive mode
            if (this._responsiveResize) {
              lang.mixin(this._options,
                            {
                              smartNavigation: false,
                              autoResize: false
                            });
            }

            if (!this._options.center && !this._options.zoom) {
                console.debug('mixin the extent', this._config.initialExtent);
              lang.mixin(this._options, {
                extent: new Extent(this._config.initialExtent)
              });
            }

            console.debug('making new map', this._options);
            this._map = new Map(this._mapDivId, this._options);
            //this._map.removeAllLayers();
            //this._map.setExtent(this._options.extent);
            // this._map.spatialReference.wkid = 102660;
            this._map.setInfoWindowOnClick(false);
            console.debug('brand new map', this._map);
            //this._setPopup();
            this._bindEvents();
            this._mapDiv.__map = this._map;

            // get the layers from the mapConfig

            this._addLayers(this._config.operationalLayers);

            this._initMapWidgets();

            // this._map.on('click', lang.hitch(this, function(e) {
            //     console.debug('the map was clicked yo!', e);
            // }));

            console.debug('new map', this._map);
            return this._map;
          },
          // Create the webmap for client
          createWebMap: function(webMapId) {
            var deferred,
                self,
                getDeferred;
            // Get DIV
            this._setMapDiv(false);
            // Get options and pass them on
            if (!this._options.hasOwnProperty('mapOptions')) {
              this._options.mapOptions = {};
            }
            // Need to be false in responsive mode
            if (this._responsiveResize) {
              lang.mixin(this._options.mapOptions, {
                smartNavigation: false,
                autoResize: false
              });
            }
            // Create the webmap
            deferred = EsriUtils.createMap(webMapId, this._mapDivId, this._options);
            this._mapDeferred = deferred;
            self = this;
            // Callback to get map
            getDeferred = function(response) {
              this._map = response.map;
              self._agsResponse = response;
              //this._setPopup();
              this._agsResponse = response;
              this._bindEvents();
              this._mapDiv.__map = this._map;
              this._mapObject = self;
              this._mapObject._setMapDiv(true);
              this._map._mapObject = this._mapObject;

              // get the layers from the response
              this._addLayers(response.itemInfo.itemData.operationalLayers);

              // initialize the map widgets
              this._initMapWidgets();
              //deferred.resolve(this._map);
            };

            this._mapDeferred.then(lang.hitch(this, getDeferred));
            return deferred;
          },

          _addLayers: function(layersDefs) {
            this._layersDefs = layersDefs;
            layerUtils.addLayersFromLayerDef(this._map, this._layersDefs);
          },

          _initMapWidgets: function() {
            // Overview Map
            if (this._config.overview && this._config.overview.isEnabled) {
              this.overviewMap = new OverviewMap({
                map: this._map,
                attachTo: this._config.overview.position,
                visible: this._config.overview.isVisibleOnStartup,
                maximizeButton: this._config.overview.hasMaximizeButton
              });
              this.overviewMap.startup();
            }

            // Scalebar
            if (this._config.scalebar && this._config.scalebar.isEnabled) {
              this.scalebar = new Scalebar({
                map: this._map,
                scalebarStyle: this._config.scalebar.style,
                scalebarUnit: this._config.scalebar.unit,
                attachTo: this._config.scalebar.position
              });
            }

            console.log(this._mapDivId + ': /map/loaded');

            topic.publish('/map/loaded', this, {});
          },

          _setPopup: function() {
            domClass.add(this._map.infoWindow.domNode, 'light');
          },

          // Avoid undesirable behaviors on touch devices
          _setTouchBehavior: function() {
            // Add desireable touch behaviors here
            if (this._options.hasOwnProperty('scrollWheelZoom')) {
              if (this._options.scrollWheelZoom) {
                this._map.enableScrollWheelZoom();
              } else {
                this._map.disableScrollWheelZoom();  // Prevent slippy map on scroll
              }
            } else {
              // Default
              this._map.disableScrollWheelZoom();
            }
            // Remove 300ms delay to close infoWindow on touch devices
            on(query('.esriPopup .titleButton.close'), touch.press, lang.hitch(this,
                        function() {
                          this._map.infoWindow.hide();
                        }));
          },

          // Set up listeners
          _bindEvents: function() {
            var setTouch,
                setInfoWin,
                debounce,
                timeout,
                resizeWin,
                recenter,
                showLoading,
                hideLoading,
                selectionChange,
                timer;
            if (!this._map) {
              console.error('BootstrapMap: Invalid map object. Please check map reference.');
              return;
            }
            // Touch behavior
            setTouch = function() {
              this._setTouchBehavior();
            };

            if (this._map.loaded) {
              lang.hitch(this, setTouch).call();
            } else {
              this._handles.push(on(this._map, 'load', lang.hitch(this, setTouch)));
            }
            // InfoWindow restyle and reposition
            setInfoWin = function() {
              this._map.infoWindow.anchor = this._popupPosition;
              var updatePopup = function(obj) {
                var pt = obj._map.infoWindow.location;
                if (pt && !obj._popupBlocked) {
                  obj._popupBlocked = true;
                  // Delay the map re-center
                  window.setTimeout(function() {
                    obj._repositionMapForInfoWin(pt);
                    obj._popupBlocked = false;
                  }, obj._popupRecenterDelayer);
                }
              };

              this.counter = 0;
              // When map is clicked (no feature or graphic)
              this._map.on('click', lang.hitch(this, function(evt) {
                if (this._map.infoWindow.isShowing) {
                  updatePopup(this);
                } else {
                  if (this._map._mapObject._isClickEventOn) {
                    topic.publish('/map/clicked', this, { event: evt });
                  }
                }
              }));
              // When graphics are clicked
              on(this._map.graphics, 'click', lang.hitch(this, function() {
                updatePopup(this);
              }));
              // When infowindow appears
              on(this._map.infoWindow, 'show', lang.hitch(this, function() {
                updatePopup(this);
              }));
              // FeatureLayers selection changed - No longer needed at 3.9
              // on(this._map.infoWindow, 'selection-change', lang.hitch(this, function (g) {
              //   updatePopup(this);
              // }));
            };
            // If the map is already loaded, eg. webmap, just hitch up
            if (this._map.loaded) {
              lang.hitch(this, setInfoWin).call();
            } else {
              this._handles.push(on(this._map, 'load', lang.hitch(this, setInfoWin)));
            }
            // Debounce window resize
            debounce = function(func, threshold, execAsap) {
              return function debounced() {
                var self = this,
                    args = arguments;
                function delayed() {
                  if (!execAsap) {
                    func.apply(self, args);
                  }

                  timeout = null;
                }

                if (timeout) {
                  clearTimeout(timeout);
                } else if (execAsap) {
                  func.apply(self, args);
                }

                timeout = setTimeout(delayed, threshold || 100);
              };
            };
            // Responsive resize
            resizeWin = debounce(this._setMapDiv, 100, false);
            this._handles.push(on(window, 'resize', lang.hitch(this, resizeWin)));
            // Auto-center map
            if (this._autoRecenter) {
              recenter = function() {
                this._map.__resizeCenter = this._map.extent.getCenter();
                timer = function() {
                  this._map.centerAt(this._map.__resizeCenter);
                };

                setTimeout(lang.hitch(this, timer), this._autoRecenterDelay);
              };
              // Listen for container resize
              this._handles.push(on(this._map, 'resize', lang.hitch(this, recenter)));
            }

            // If the map is already loaded, eg. webmap, just hitch up
            showLoading = function() {
              topic.publish('/MapLoading/show');
            };

            hideLoading = function() {
              topic.publish('/MapLoading/hide');
            };

            selectionChange = function(e) {
              topic.publish('/InfoWindow/selectionChanged', { target: e.target });
            };

            if (this._map.loaded) {
              lang.hitch(this, showLoading).call();
              lang.hitch(this, hideLoading).call();
              lang.hitch(this, selectionChange).call();
            } else {
              this._handles.push(on(this._map, 'update-start', lang.hitch(this, showLoading)));
              this._handles.push(on(this._map, 'update-end', lang.hitch(this, hideLoading)));
              this._handles.push(on(this._map.infoWindow, 'selection-change', lang.hitch(this, selectionChange)));
            }

          },
          // Check if the map is really visible
          _getMapDivVisibility: function() {
            return this._mapDiv.clientHeight > 0 || this._mapDiv.clientWidth > 0;
          },
          // Check map visiblity
          _checkVisibility: function() {
            var visible = this._getMapDivVisibility();
            if (this._visible !== visible) {
              if (visible) {
                this._setMapDiv(true);
              }
            }
          },
          // Ensure the map resizes if div is hidden
          _controlVisibilityTimer: function(runTimer) {
            if (runTimer) {
              // Start a visibility change timer
              this._visibilityTimer = setInterval(lang.hitch(this, function() {
                this._checkVisibility();
              }), 200);
            } else {
              // Stop timer we have checking for visibility change
              if (this._visibilityTimer) {
                clearInterval(this._visibilityTimer);
                this._visibilityTimer = null;
              }
            }
          },
          // Set new map height
          _setMapDiv: function(forceResize) {
            if (!this._mapDivId || !this._responsiveResize) {
              return;
            }

            var visible,
                windowH,
                bodyH,
                room,
                mapH,
                colH,
                mh1,
                mh2,
                inCol;
            // Get map visibility
            visible = this._getMapDivVisibility();
            if (this._visible !== visible) {
              this._visible = visible;
              this._controlVisibilityTimer(!visible);
            }
            // Fill page with the map or match row height
            if (this._visible) {
              //windowH = window.innerHeight;
              windowH = document.documentElement.clientHeight;
              bodyH = document.body.clientHeight;
              room = windowH - bodyH;
              mapH = this._calcMapHeight();
              colH = this._calcColumnHeight(mapH);
              mh1 = mapH + room;
              mh2 = 0;
              inCol = false;
              // Resize to neighboring column or fill page
              if (mapH < colH) {
                mh2 = (room > 0) ? colH + room : colH;
                inCol = true;
              } else {
                if (room >= 0) {
                  mh2 = (mh1 < colH) ? colH : mh1;
                } else {
                  mh2 = colH;
                }

                inCol = false;
              }
              // Expand map height
              domStyle.set(this._mapDivId, {
                'height': mh2 + 'px',
                'width': 'auto'
              });
              // Force resize and reposition
              if (this._map && forceResize && this._visible) {
                this._map.resize();
                this._map.reposition();
              }
              //console.log('Win:' + windowH + ' Body:' + bodyH + ' Room:' + room + '
              // OldMap:' + mapH + ' Map+Room:' + mh1 + ' NewMap:' + mh2 + ' ColH:' +
              // colH + ' inCol:' + inCol);
            }
          },
          // Current height of map
          _calcMapHeight: function() {
            //var s = domStyle.get(e);
            var s = this._mapStyle,
                p = parseInt(s.paddingTop, 10) + parseInt(s.paddingBottom, 10) || 0,
                g = parseInt(s.marginTop, 10) + parseInt(s.marginBottom, 10) || 0,
                bodyH = parseInt(s.borderTopWidth, 10) + parseInt(s.borderBottomWidth, 10) || 0,
                mapH = this._mapDiv.clientHeight;
            // Use map container if clientheight == 0
            if (mapH === 0) {
              mapH = this._mapDiv.parentNode.clientHeight;
            }

            var h = p + g + bodyH + mapH;
            return h;
          },

          // Get the column height around the map
          _calcColumnHeight: function(mapH) {
            var i,
                col,
                colH = 0,
                cols = query(this._mapDiv).closest('.row').children('[class*="col"]'),
                containsMap;
            if (cols.length) {
              for (i = 0; i < cols.length; i++) {
                col = cols[i];
                // Avoid the map in column calculations
                containsMap = query('#' + this._mapDivId, col).length > 0;
                if ((col.clientHeight > colH) && !containsMap) {
                  colH = col.clientHeight;
                }
              }
            }

            return colH;
          },
          // Reposition map to fix popup
          _repositionMapForInfoWin: function(graphicCenterPt) {
            // Determine the upper right, and center, coordinates of the map
            var maxPoint = new Point(this._map.extent.xmax, this._map.extent.ymax, this._map.spatialReference),
                centerPoint = new Point(this._map.extent.getCenter()),
                // Convert to screen coordinates
                maxPointScreen = this._map.toScreen(maxPoint),
                centerPointScreen = this._map.toScreen(centerPoint),
                graphicPointScreen = this._map.toScreen(graphicCenterPt), // Points only
                // Buffer
                marginLR = 10,
                marginTop = 3,
                infoWin = this._map.infoWindow.domNode.childNodes[0],
                infoWidth = infoWin.clientWidth,
                infoHeight = infoWin.clientHeight + this._map.infoWindow.marginTop,
                // X
                lOff = graphicPointScreen.x - infoWidth / 2,
                rOff = graphicPointScreen.x + infoWidth / 2,
                l = lOff - marginLR < 0,
                r = rOff > maxPointScreen.x - marginLR,
                // Y
                yOff = this._map.infoWindow.offsetY,
                tOff = graphicPointScreen.y - infoHeight - yOff,
                t = tOff - marginTop < 0;
            // X
            if (l) {
              centerPointScreen.x -= (Math.abs(lOff) + marginLR) < marginLR ? marginLR : Math.abs(lOff) + marginLR;
            } else if (r) {
              centerPointScreen.x += (rOff - maxPointScreen.x) + marginLR;
            }
            // Y
            if (t) {
              centerPointScreen.y += tOff - marginTop;
            }

            //Pan the ap to the new centerpoint
            if (r || l || t) {
              centerPoint = this._map.toMap(centerPointScreen);
              this._map.centerAt(centerPoint);
            }
          }
        }) // _mapObject
      }; // return
    }); // define function
