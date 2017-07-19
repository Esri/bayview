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
  'dojo/_base/lang',
  'dojo/_base/Color',

  'dojo/Deferred',
  'dojo/dom-construct',
  'dojo/topic',

  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/renderers/SimpleRenderer',

  'esri/layers/FeatureLayer',
  'esri/layers/ArcGISDynamicMapServiceLayer',
  'esri/layers/ArcGISTiledMapServiceLayer',
  'esri/layers/ArcGISImageServiceLayer',
  'esri/layers/WebTiledLayer',
  'esri/layers/WMSLayer',

  'esri/InfoTemplate',
  'esri/request',
  'esri/arcgis/utils'
],

  function(
    lang, Color,
    Deferred, domConstruct, topic,
    SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer,
    FeatureLayer, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, ArcGISImageServiceLayer, WebTiledLayer, WMSLayer,
    InfoTemplate, esriRequest, arcgisUtils
  ) {
    return {

      // TODO: update EsriLegend & LayerList who is using this function
      // instead create layerInfos dynamically
      getLayerInfos: function() {
        console.error('layerUtils::getLayerInfos returns empty array, has an open TODO');
        return [];
      },

      // TODO: update InfoWindowController to retrieve the needed info somehow differently
      getInfoWindowInfoByLayerId: function(/* layerId */) {
        console.error('layerUtils::getInfoWindowInfoByLayerId returns null, has an open TODO');
        return null;
        /*
        var infoWindow = arrayUtil.filter(this.infoWindows, lang.hitch(this, function(info) {
          return info.id === layerId;
        }));
        return (infoWindow.length === 1) ? infoWindow[0] : null;
        */
      },

      addLayersFromLayerDef: function(map, layerDefs) {
        if (!map) {
          console.error('layerUtils::addLayersFromLayerDef - Map not defined');
          return;
        }

        if (!layerDefs) {
          console.error('layerUtils::addLayersFromLayerDef - Layer Definitions not defined');
          return;
        }

        var layerObjects = [];

        _.each(layerDefs, lang.hitch(this, function(layerDef) {
          if (layerDef.layerObject) {
            //this.addLayer(map, layerDef.layerObject);
            layerObjects.push(layerDef.layerObject);
          } else {
            var layerObject = null;
            if (layerDef.type === 'dynamic') {
              layerObject = this._getDynamicLayerObject(layerDef);
              //this.addLayer(map, layerObject, layerDef.options);
              layerObjects.push(layerObject);
            } else if (layerDef.type === 'tiled') {
              layerObject = this._getTiledLayerObject(layerDef);
              //this.addLayer(map, layerObject, layerDef.options);
              layerObjects.push(layerObject);
            } else if (layerDef.type === 'Feature Layer') {
              layerObject = this._getFeatureLayerObject(layerDef);
              //this.addLayer(map, layerObject, layerDef.options);
              layerObjects.push(layerObject);
            } else if (layerDef.layerType === 'ArcGISMapServiceLayer') {
              //var layerInfos = this.esriMap.getFieldInfosByLayerId(layer.id);
              //var outFields = this.esriMap.getOutFieldsFromLayerId(layer.id);
              //var symbol = this.esriMap.getRendererFromLayerObject(layer.layerObject);
              if (layerDef.layerObject.layerDrawingOptions) {
                var tempLayerDef = this._createLayerDefinition(layerDef);
                //lang.mixin(oLayerDef, layerDef);
                layerObject = this._getFeatureLayerObject(tempLayerDef);
                // TODO: define the options instead of the layerDef
                //this.addLayer(map, layerObject, tempLayerDef);
                layerObjects.push(layerObject);
              } else {
                // grouped
                var baseUrl = layerDef.url;
                //var baseTitle = layerDef.title;
                //var visibility = layerDef.visibility;
                _.each(layerDef.layers, lang.hitch(this, function(l) {
                  var url = baseUrl + '/' + l.id;
                  //var id = '' + Math.floor(Math.random() * (1000000)) + 1;
                  //var title = baseTitle + ' ' + l.id;
                  this.addLayerFromURL(url);
                }));
              }
            } else {
              console.log('Layer type not supported: ', layerDef.type);
              layerObject = null;
            }
          }
        }));
        map.addLayers(layerObjects);
      },

      addLayersFromWebMap: function(map, webMapId, portalUrl) {
        if (!map) {
          console.error('layerUtils::addLayersFromWebMap - map not defined');
          return;
        }

        if (!webMapId) {
          console.error('layerUtils::addLayersFromWebMap - webMapId not defined');
          return;
        }

        if (!portalUrl) {
          console.error('layerUtils::addLayersFromWebMap - portalUrl not defined');
          return;
        }

        //get Web Map JSON
        arcgisUtils.arcgisUrl = portalUrl + 'content/items'; // portalUrl already contains 'sharing/rest/'

        // create a temporary (hidden) node
        domConstruct.place('<div id=\'tempMapDiv\' style=\'display: none;\' ></div>', 'map', 'after');

        //create web map in hidden node
        arcgisUtils.createMap(webMapId, 'tempMapDiv').then(lang.hitch(this, function(response) {

          // temporary map object
          var tempMap = response.map;

          //var webMapExtent = tempMap.extent;
          var layers = [];

          // loop through all the layers, clone them and keep them in the layers array
          _.forEach(response.itemInfo.itemData.operationalLayers, lang.hitch(this, function(oLayer) {
            var layer = oLayer.layerObject;
            // var selectable = false;
            // if (layer.declaredClass === 'esri.layers.FeatureLayer') {
            //   selectable = (layer.geometryType === 'esriGeometryPolygon');
            // }

            if (layer) {
              tempMap.removeLayer(layer);
              var clonedLayer = this.cloneLayer(layer);
              if (clonedLayer) {
                //add the Web Map Title to layer (custom property)
                clonedLayer.title = oLayer.title;
                layers.push(clonedLayer);
              }
            } else {
              //check for map notes
              if (oLayer.id && oLayer.id.indexOf('mapNotes') !== -1) {
                var labels = ['Areas', 'Lines', 'Text', 'Points'];
                var mapNoteLayers = [];
                mapNoteLayers.push(tempMap.getLayer(oLayer.id + '_0'));
                mapNoteLayers.push(tempMap.getLayer(oLayer.id + '_1'));
                mapNoteLayers.push(tempMap.getLayer(oLayer.id + '_2'));
                mapNoteLayers.push(tempMap.getLayer(oLayer.id + '_3'));

                _.forEach(mapNoteLayers, lang.hitch(this, function(mapLayer, index) {
                  if (mapLayer) {
                    tempMap.removeLayer(mapLayer);
                    var clonedMapLayer = this.cloneLayer(mapLayer);
                    if (clonedMapLayer) {
                      clonedMapLayer.title = oLayer.title + ' ' + labels[index];
                      if (clonedMapLayer.graphics && clonedMapLayer.graphics.length > 0) {
                        layers.push(clonedMapLayer);
                      }
                    }
                  }
                }));
              }
            }
          }));

          // now add the layers to the current map
          map.addLayers(layers);

          // remove all the temp elements
          tempMap.removeAllLayers();
          tempMap.destroy();
          domConstruct.destroy('tempMapDiv');
        }));
      },

      removeLayersFromWebMap: function(map, webMapId, portalUrl) {
        if (!map) {
          console.error('layerUtils::addLayersFromWebMap - map not defined');
          return;
        }

        if (!webMapId) {
          console.error('layerUtils::addLayersFromWebMap - webMapId not defined');
          return;
        }

        if (!portalUrl) {
          console.error('layerUtils::addLayersFromWebMap - portalUrl not defined');
          return;
        }

        //get Web Map JSON
        arcgisUtils.arcgisUrl = portalUrl + 'content/items'; // portalUrl already contains 'sharing/rest/'

        // create a temporary (hidden) node
        domConstruct.place('<div id=\'tempMapDiv\' style=\'display: none;\' ></div>', 'map', 'after');

        //create web map in hidden node
        arcgisUtils.createMap(webMapId, 'tempMapDiv').then(lang.hitch(this, function(response) {

          // temporary map object
          var tempMap = response.map;

          // loop through all the layers, clone them and keep them in the layers array
          _.forEach(response.itemInfo.itemData.operationalLayers, lang.hitch(this, function(oLayer) {
            var layer = map.getLayer(oLayer.layerObject.id);
            map.removeLayer(layer);
          }));

          // remove all the temp elements
          tempMap.removeAllLayers();
          tempMap.destroy();
          domConstruct.destroy('tempMapDiv');
        }));
      },

      addLayer: function(map, layerObject, layerDef) {
        if (layerObject !== null) {
          //if options has custom renderer, apply it to the layer
          if (layerDef && layerDef.customRenderer) {
            layerObject.renderer = new SimpleRenderer(new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
              new SimpleLineSymbol(SimpleLineSymbol[layerDef.customRenderer.style], new Color(layerDef.customRenderer.color, 1),
                layerDef.customRenderer.width), new Color([0, 0, 0])));
          }

          // add the layer to the map
          map.addLayer(layerObject);

          //-------------------------
          // TODO: is this layerInfo still needed?? Only EsriLegend & LayerList are using it
          /*
          var layerInfo = {
            layer: layerObject,
            url: layerObject.url,
            title: options.title || null,
            id: options.id,
            options: options,
          };
          // keep a reference to the layer
          this._layerInfos.push(layerInfo);
          */
          //-------------------------
        }

        console.log('Layer added: ', layerObject);
      },

      removeLayer: function(map, layer) {
        map.removeLayer(layer);
      },

      // TODO: fix this
      // currently used in LayerList
      addFeatureLayer: function(/* url , options */) {
        // used by LayerList after adding a shape file
        // TODO: _getFeatureLayerObject has changed, it requires now an operationalLayerDefinition
        console.error('LayerController::addFeatureLayer not implemented');
        //var layerObject = this._getFeatureLayerObject(url, options);
        //this.addLayer(layerObject, options);
      },

      // TODO: fix this
      // currently used in LayerList
      addLayerFromURL: function(url) {
        var deferred = new Deferred();
        if (url) {
          return esriRequest({
            'url': url,
            'content': {
              'f': 'json'
            },
            'callbackParamName': 'callback'
          }).then(lang.hitch(this, function(response) {
            var layerDef;
            var options;
            var layerObject;
            if (response.type === 'Feature Layer') { // layer (feature layer)
              options = {
                id: response.id,
                title: response.name,
                mode: FeatureLayer.MODE_ONDEMAND,
                opacity: 1,
                visible: response.visible
              };
              layerDef = {
                type: 'Feature Layer',
                url: url,
                options: options,
                customRenderer: response.drawingInfo.renderer.symbol,
                infoWindow: {
                  isEnabled: true,
                  outFields: ['*'],
                  title: response.name
                    // TODO: this is important for WebMaps (currently missing)
                    //fieldInfos: this.esriMap.getFieldInfos(layer),
                }
              };
              layerObject = this._getFeatureLayerObject(layerDef);
            } else if (response.tileInfo) {
              options = {
                opacity: 1,
                name: response.name,
                id: response.id,
                visible: response.visible
              };
              layerDef = {
                url: url,
                type: 'tiled',
                options: options
              };
              layerObject = this._getTiledLayerObject(layerDef);
            } else { //if (response.layers.length > 0) { //map service
              options = {
                opacity: 1,
                name: response.name,
                id: response.id,
                visible: response.visible
              };
              layerDef = {
                url: url,
                type: 'dynamic',
                options: options
              };
              layerObject = this._getDynamicLayerObject(layerDef);
            }

            this.addLayer(layerObject, options);

            deferred.resolve(layerObject);
            return deferred.promise;
          }), function(error) {
            console.error(error);
            //exceptionDialog.show('SpotOn!ine could not add the online layer to the map. \'<span class='bold italic'>' + layer.name + '</span>\': Service may be stopped or ArcGIS Server may not be running. Please contact the SPOT office for assistance.');
          });
        } else {
          //exceptionDialog.show('Failed to add Layer \'<span class='bold italic'>' + layer.name + '</span>\': URL is missing.');
          console.error('Failed to add Layer: URL is missing.');
          deferred.resolve(false);
          return deferred.promise;
        }
      },

      cloneLayer: function(layer) {
        if (layer) {
          switch (layer.declaredClass) {
            case 'esri.layers.ArcGISDynamicMapServiceLayer':
              return this._cloneArcGISDynamicMapServiceLayer(layer);
            case 'esri.layers.ArcGISImageServiceLayer':
              return this._cloneArcGISImageServiceLayer(layer);
            case 'esri.layers.ArcGISTiledMapServiceLayer':
              return this._cloneArcGISTiledMapServiceLayer(layer);
            case 'esri.layers.DataAdapterFeatureLayer':
              break;
            case 'esri.layers.FeatureLayer':
              return this._cloneFeatureLayer(layer);
            case 'esri.layers.WebTiledLayer':
              return this._cloneWebTiledLayer(layer);
            case 'esri.layers.WMSLayer':
              return this._cloneWMSLayer(layer);
            default:
              console.warn('Layer Type of ' + layer.declaredClass + ' is not suppored by cloneLayer');
              return null;
          }
        }

        return null;
      },

      getLayerInfo: function(map, layerId) {
        var layerObject = map.getLayer(layerId);
        var layerInfo = null;
        if (layerObject) {
          layerInfo = {
            layer: layerObject,
            url: layerObject.url,
            id: layerObject.id
          };
          if (!_.isUndefined(layerObject._params.title)) {
            layerInfo.title = layerObject._params.title;
          }
        }

        return layerInfo;
      },

      getLayerInfosVisibleAtScale: function(map) {
        var layerInfos = [];
        if (map.loaded) {
          _.each(map.getLayersVisibleAtScale(), lang.hitch(this, function(layer) {
            var layerInfo = this.getLayerInfo(map, layer.id);
            if (layerInfo) {
              layerInfos.push(layerInfo);
            }
          }));
        }
        return layerInfos;
      },

      // TODO: getOutFields & getFieldInfos require agsResponse;
      // figure out how to get this response
      _createLayerDefinition: function(layer) {
        var layerDef;
        if (layer && layer.url) {
          var id = layer.id || '' + Math.floor(Math.random() * (1000000)) + 1;
          layerDef = {
            url: layer.url + '/0',
            options: {
              id: id,
              title: layer.title || 'No title',
              opacity: layer.opacity || 1,
              visible: layer.visibility || false,
              infoWindow: {
                isEnabled: true,
                //outFields: ['*'],
                title: layer.title || 'No title',
                // TODO:
                outFields: this.esriMap.getOutFieldsFromLayerId(id),
                fieldInfos: this.esriMap.getFieldInfosByLayerId(id),
                //headerFunction: function(attrs) {
                //    return '';
                //},
                //contentFunction: function(attrs) {
                //    return '';
                //},
                iconClass: '',
                widget: ''
              }
            }
          };
          if (layer.layerObject && layer.layerObject.layerDrawingOptions) {
            layerDef.symbol = layer.layerObject.layerDrawingOptions[0].renderer.getSymbol();
          }
        } else {
          layerDef = {};
          console.error('layerUtils::_createLayerDefinition: Layer definition is missing url');
        }

        return layerDef;
      },

      _getDynamicLayerObject: function(layerDef) {
        var layerObject = new ArcGISDynamicMapServiceLayer(layerDef.url, layerDef.options);
        return layerObject;
      },

      _getFeatureLayerObject: function(layerDef) {
        // TODO: fix references to this.infoWindows
        if (layerDef.options.infoWindow && layerDef.options.infoWindow.isEnabled) {
          lang.mixin(layerDef.options, {
            'infoTemplate': new InfoTemplate(),
            'outFields': layerDef.options.infoWindow.outFields
          });
        }

        var layerObject = new FeatureLayer(layerDef.url, layerDef.options);
        layerObject.on('click', function(evt) {
          topic.publish('FeatureLayer/Clicked', {
            evt: evt
          });
        });
        return layerObject;
      },

      _getTiledLayerObject: function(layerDef) {
        var layerObject = new ArcGISTiledMapServiceLayer(layerDef.url, layerDef.options);
        return layerObject;
      },

      _cloneArcGISImageServiceLayer: function(layer) {
        try {
          var options = {};
          //this._addProperty('id', layer, options);
          this._addProperty('infoTemplate', layer, options);
          this._addProperty('opacity', layer, options);
          this._addProperty('resourceInfo', layer, options);
          this._addProperty('useMapImage', layer, options);
          this._addProperty('useMapTime', layer, options);
          this._addProperty('visible', layer, options);

          var imageServiceParameters = {};
          this._addProperty('bandIds', layer, imageServiceParameters);
          this._addProperty('compressionQuality', layer, imageServiceParameters);
          this._addProperty('format', layer, imageServiceParameters);
          this._addProperty('height', layer, imageServiceParameters);
          this._addProperty('interpolation', layer, imageServiceParameters);
          this._addProperty('mosaicRule', layer, imageServiceParameters);
          this._addProperty('renderingRule', layer, imageServiceParameters);
          this._addProperty('timeExtent', layer.timeInfo, imageServiceParameters);
          this._addProperty('width', layer, imageServiceParameters);
          //noData: TODO: extract noData property from image service layer
          options.imageServiceParameters = imageServiceParameters;

          var ims = new ArcGISImageServiceLayer(layer.url, options);
          ims.setScaleRange(layer.minScale, layer.maxScale);

          return ims;
        } catch (error) {
          console.error('Error cloning Feature Layer with ID ' + layer.id + ' URL: ' + layer.url);
          return null;
        }
      },

      _cloneArcGISTiledMapServiceLayer: function(layer) {
        try {
          var options = {};
          this._addProperty('className', layer, options);
          this._addProperty('displayLevels', layer, options);
          this._addProperty('exclusionAreas', layer, options);
          //this._addProperty('id', layer, options);
          this._addProperty('infoTemplate', layer, options);
          this._addProperty('opacity', layer, options);
          this._addProperty('refreshInterval', layer, options);
          this._addProperty('resampling', layer, options);
          this._addProperty('resamplingTolerance', layer, options);
          // this causes error with hosted tiled service:
          //this._addProperty('resourceInfo', layer, options);
          this._addProperty('showAttribution', layer, options);
          this._addProperty('tileServers', layer, options);
          this._addProperty('visible', layer, options);

          var tmsl = new ArcGISTiledMapServiceLayer(layer.url, options);
          tmsl.setScaleRange(layer.minScale, layer.maxScale);

          return tmsl;
        } catch (error) {
          console.error('Error cloning ArcGISTiledMapServiceLayer layer:' + layer);
          return null;
        }
      },

      _cloneFeatureLayer: function(layer) {
        try {
          var options = {};
          this._addProperty('autoGeneralize', layer, options);
          this._addProperty('className', layer, options);
          if (layer.getDefinitionExpression()) {
            options.definitionExpression = layer.getDefinitionExpression();
          }

          this._addProperty('displayOnPan', layer, options);
          this._addProperty('gdbVersion', layer, options);
          //this._addProperty('id', layer, options);
          this._addProperty('infoTemplate', layer, options);
          this._addProperty('maxAllowableOffset', layer, options);
          this._addProperty('mode', layer, options);
          this._addProperty('opacity', layer, options);
          if (layer.getOrderByFields()) {
            options.orderByFields = layer.getOrderByFields();
          }

          options.outFields = ['*']; //no way to get out fields without accessing private layer properties
          this._addProperty('refreshInterval', layer, options);
          this._addProperty('resourceInfo', layer, options);
          this._addProperty('showAttribution', layer, options);
          this._addProperty('showLabels', layer, options);
          this._addProperty('source', layer, options);
          this._addProperty('tileHeight', layer, options);
          this._addProperty('tileWidth', layer, options);
          this._addProperty('trackIdField', layer, options);
          this._addProperty('useMapTime', layer, options);
          this._addProperty('visible', layer, options);
          this._addProperty('id', layer, options);

          var fl = null;
          if (layer.url) {
            fl = new FeatureLayer(layer.url, options);
          } else {
            var featureCollection = {
              layerDefinition: {
                geometryType: layer.geometryType,
                fields: layer.fields
              }
            };

            options.mode = FeatureLayer.MODE_SNAPSHOT;

            fl = new FeatureLayer(featureCollection, options);
            fl.graphics = layer.graphics;
          }

          fl.setRenderer(layer.renderer);
          fl.setLabelingInfo(layer.labelingInfo);
          fl.setSelectionSymbol(layer.getSelectionSymbol());

          fl.setScaleRange(layer.minScale, layer.maxScale);

          fl.geometryType = layer.geometryType;
          fl.fields = layer.fields;
          fl.on('query-limit-exceeded', function(event) {
            var layerTitle = event.target.title;
            console.log('query-limit-exceeded');

            topic.publish('toaster/general', {
              message: '<p><strong>Warning:</strong> Layer ' + layerTitle + ' did not draw completely because there are too many features to display in this area of the map. Try zooming in.</p>',
              type: 'warning' //Accepts 'message', 'warning', 'error'
            });
          });

          return fl;
        } catch (error) {
          console.error('Error cloning FeatureLayer layer:' + layer);
          return null;
        }
      },

      _cloneArcGISDynamicMapServiceLayer: function(layer) {
        try {
          var options = {};
          this._addProperty('className', layer, options);
          this._addProperty('gdbVersion', layer, options);
          //this._addProperty('id', layer, options);
          this._addProperty('infoTemplate', layer, options);
          this._addProperty('opacity', layer, options);
          this._addProperty('refreshInterval', layer, options);
          this._addProperty('resourceInfo', layer, options);
          this._addProperty('showAttribution', layer, options);
          this._addProperty('useMapImage', layer, options);
          this._addProperty('useMapTime', layer, options);
          this._addProperty('visible', layer, options);

          var dl = new ArcGISDynamicMapServiceLayer(layer.url, options);
          dl.setDynamicLayerInfos(layer.dynamicLayerInfos);
          dl.setLayerDefinitions(layer.layerDefinitions);
          dl.setLayerDrawingOptions(layer.layerDrawingOptions);
          dl.setLayerTimeOptions(layer.layerTimeOptions);

          dl.setScaleRange(layer.minScale, layer.maxScale);

          return dl;
        } catch (error) {
          console.error('Error cloning ArcGISDynamicMapServiceLayer layer:' + layer);
          return null;
        }
      },

      _cloneWebTiledLayer: function(layer) {
        try {
          var options = {};
          this._addProperty('copyright', layer, options);
          this._addProperty('fullExtent', layer, options);
          //this._addProperty('id', layer, options);
          this._addProperty('initialExtent', layer, options);
          this._addProperty('resampling', layer, options);
          this._addProperty('resamplingTolerance', layer, options);
          this._addProperty('subDomains', layer, options);
          this._addProperty('tileInfo', layer, options);
          this._addProperty('tileServers', layer, options);

          var wtl = new WebTiledLayer(layer.url, options);
          wtl.setOpacity(layer.opacity);
          wtl.setRefreshInterval(layer.refreshInterval);
          wtl.setVisibility(layer.visible);

          wtl.setScaleRange(layer.minScale, layer.maxScale);

          return wtl;
        } catch (error) {
          console.error('Error cloning WebTiledLayer layer:' + layer);
          return null;
        }
      },

      _cloneWMSLayer: function(layer) {
        try {
          var options = {};
          this._addProperty('format', layer, options);
          this._addProperty('resourceInfo', layer, options);
          this._addProperty('transparent', layer, options);
          this._addProperty('version', layer, options);
          this._addProperty('visibleLayers', layer, options);

          var wmsLayer = new WMSLayer(layer.url, options);
          wmsLayer.setOpacity(layer.opacity);
          wmsLayer.setRefreshInterval(layer.refreshInterval);
          wmsLayer.copyright = layer.copyright;
          //wmsLayer.id = layer.id;

          return wmsLayer;
        } catch (error) {
          console.error('Error cloning WebTiledLayer layer:' + layer);
          return null;
        }
      },

      _addProperty: function(propName, source, destination) {
        if (source && typeof source[propName] !== 'undefined') {
          destination[propName] = source[propName];
        }
      }

    };
  });
