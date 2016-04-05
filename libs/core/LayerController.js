define([

    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",

    "dojo/Deferred",
    "dojo/topic",
    "dojo/on",

    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/renderers/SimpleRenderer",
    "dojo/_base/Color",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/request",
    "esri/InfoTemplate"
],

function (
    declare, lang, arrayUtil,
    Deferred, topic, on,
    SimpleLineSymbol, SimpleFillSymbol, SimpleRenderer, Color, FeatureLayer, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, esriRequest, InfoTemplate
) {
    return declare([], {

        layerInfos: [],
        infoWindows: [],

        constructor: function(args){
            lang.mixin(this, args);
        },

        setMap: function(map) {
            this.map = map;
        },

        addLayerInfo: function(layerInfo) {
            this.layerInfos.push(layerInfo);
        },

        getLayerInfos: function() {
            return this.layerInfos;
        },

        getLayerInfoByLayerId: function(layerId) {
            var layer = arrayUtil.filter(this.layerInfos, lang.hitch(this, function(l) {
                return l.id == layerId;
            }));
            return (layer.length == 1) ? layer[0] : null;
        },

        getInfoWindowInfoByLayerId: function(layerId) {
            var infoWindow = arrayUtil.filter(this.infoWindows, lang.hitch(this, function(info) {
                return info.id == layerId;
            }));
            return (infoWindow.length == 1) ? infoWindow[0] : null;
        },

        addOperationalLayers: function(operationalLayers) {
            // console.groupCollapsed("Adding "+ operationalLayers.length +" layers");
            arrayUtil.forEach(operationalLayers, lang.hitch(this, function(layer) {
                var layerObject = null;
                if (layer.type == "dynamic") {
                    layerObject = this._getDynamicLayerObject(layer.url, layer.options, layer);
                } else if (layer.type == "tiled") {
                    layerObject = this._getTiledLayerObject(layer.url, layer.options, layer);
                } else if (layer.type == "feature") {
                    layerObject = this._getFeatureLayerObject(layer.url, layer.options, layer);
                } else {
                    console.log("Layer type not supported: ", layer.type);
                    layerObject = null;
                }  
                this.addLayer(layerObject, layer.options);
            }));
            console.log();
        },

        addLayer: function(layerObject, options) {
            if (layerObject !== null) {
                //if options has custom renderer, apply it to the layer
                if (options.customRenderer) {
                    layerObject.renderer = new SimpleRenderer(new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                        new SimpleLineSymbol(SimpleLineSymbol[options.customRenderer.style], new Color(options.customRenderer.color, 1),
                        options.customRenderer.width), new Color([0, 0, 0])));
                }

                // add the layer to the map
                this.map.addLayer(layerObject);

                var layerInfo = {
                    layer: layerObject,
                    url: layerObject.url,
                    title: options.title || null,
                    id: options.id,
                    options: options
                };
                // keep a reference to the layer
                this.layerInfos.push(layerInfo);
            }
            console.log("Layer added: ",layerObject);
        },

        removeLayer: function(layer) {
            this.map.removeLayer(layer);
        },

        addFeatureLayer: function(url, options) {
            var layerObject = this._getFeatureLayerObject(url, options);
            this.addLayer(layerObject, options);
        },

        addLayerFromURL: function (layer, useToken) {
            var deferred = new Deferred();
            var options;
            if (layer.layerUrl) {
                var layerUrl = useToken ? layer.layerUrl + "?token=" + this.token : layer.layerUrl;
                return esriRequest({
                    "url": layerUrl,
                    "content": {
                        "f": "json"
                    },
                    "callbackParamName": "callback"
                }).then(lang.hitch(this, function (response) {
                    var layerObject;
                    if (response.type == "Feature Layer") { // layer (feature layer)
                        options = {
                            mode: FeatureLayer.MODE_ONDEMAND,
                            name: layer.name,
                            id: layer.id,
                            opacity: 1,
                            visible: layer.visible
                        };
                        layerObject = this._getFeatureLayerObject(layerUrl, options);
                    } else if (response.tileInfo) {
                        options = {
                            opacity: 1,
                            name: layer.name,
                            id: layer.id,
                            visible: layer.visible
                        };
                        layerObject = this._getTiledLayerObject(layerUrl, options);
                    } else { //if (response.layers.length > 0) { //map service
                        options = {
                            opacity: 1,
                            name: layer.name,
                            id: layer.id,
                            visible: layer.visible
                        };
                        layerObject = this._getDynamicLayerObject(layerUrl, options);
                    }

                    this.addLayer(layerObject, options);

                    deferred.resolve(layerObject);
                    return deferred.promise;
                }), lang.hitch(layer,
                function (error) {
                    console.error(error);
                    //exceptionDialog.show("SpotOn!ine could not add the online layer to the map. \"<span class='bold italic'>" + layer.name + "</span>\": Service may be stopped or ArcGIS Server may not be running. Please contact the SPOT office for assistance.");
                }));
            } else {
                //exceptionDialog.show("Failed to add Layer \"<span class='bold italic'>" + layer.name + "</span>\": URL is missing.");
                console.error("Failed to add Layer " + layer.name + ": URL is missing.");
                deferred.resolve(false);
                return deferred.promise;
            }
        },

        _getDynamicLayerObject: function (url, options, layer) {
            var layerObject = new ArcGISDynamicMapServiceLayer(url, options);
            return layerObject;
        },

        _getFeatureLayerObject: function (url, options, layer) {
            if (layer.infoWindow && layer.infoWindow.isEnabled) {
                lang.mixin(options, {
                    "infoTemplate": new InfoTemplate(),
                    "outFields": layer.infoWindow.outFields
                });
                this.infoWindows.push({
                    id: layer.options.id,
                    info: layer.infoWindow
                });
            }
            var layerObject = new FeatureLayer(url, options);
            layerObject.on("click", function(evt) { 
                topic.publish("FeatureLayer/Clicked", { evt: evt });
            });
            return layerObject;
        },

        _getTiledLayerObject: function (url, options, layer) {
            var layerObject = new ArcGISTiledMapServiceLayer(url, options);
            return layerObject;
        }

    });
});