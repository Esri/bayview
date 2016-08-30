define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/Evented',

    'dojo/_base/lang',
    'dojo/_base/connect',
    'dojo/topic',
    'dojo/parser',
    'dojo/query',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/promise/all',
    'dijit/registry',

    'core/queryUtils',
    'core/layerUtils',

    'esri/tasks/query',
    'esri/geometry/Circle',

    './InfoRow',
    './InfoBox',

    'dojo/text!./templates/InfoPanel.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented,
    lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, deferredAll, registry,
    queryUtils, layerUtils,
    Query, Circle,
    InfoRow, InfoBox,
    template
  ) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {},

        postCreate: function() {
            this.inherited(arguments);
            this.clear();

            this.own(on(this.btnDetails, 'click', lang.hitch(this, this._btnDetailsClicked)));
            this.own(on(this.btnAnalyze, 'click', lang.hitch(this, this._btnAnalyzeClicked, 1)));
            this.own(on(this.btnPrint, 'click', lang.hitch(this, this._btnPrintClicked)));
            this.own(on(this.btnExport, 'click', lang.hitch(this, this._btnExportClicked)));

            this.own(on(this.oneMBufferBtn, 'click', lang.hitch(this, this._btnAnalyzeClicked, 1)));
            this.own(on(this.threeMBufferBtn, 'click', lang.hitch(this, this._btnAnalyzeClicked, 3)));
            this.own(on(this.fiveMBufferBtn, 'click', lang.hitch(this, this._btnAnalyzeClicked, 5)));

        },

        startup: function() {
        },

        showDetails: function(layerId, selectedFeature) {
            // from the layerId get the infos
            this.layerConfig = this.config[layerId];
            this.selectedFeature = selectedFeature;
            console.debug('selected feature info',this.selectedFeature);
            if (this.layerConfig) {
                _.each(this.layerConfig.infos, lang.hitch(this, function(info) {
                    // create a new row
                    // label: info.label
                    // value: selectedFeature[info.field]
                    //console.log(info.label + ': ' + selectedFeature.attributes[info.field]);
                    InfoRow({
                        label: info.label,
                        value: this.selectedFeature.attributes[info.field]
                    }).placeAt(this.detailsContainer);
                }));
                this._initButtons(this.layerConfig);
            }
        },

        showPanel: function() {
            query('#infoPanelWrapper').removeClass('is-hidden');
        },

        hidePanel: function() {
            query('#infoPanelWrapper').addClass('is-hidden');
            dojo.empty(this.detailsContainer);
            dojo.empty(this.bufferContainer);
            dojo.empty(this.analysisContainer);
            domClass.add(this.analysisContainer, 'is-hidden');
            domClass.add(this.bufferContainer, 'is-hidden');
            domClass.add(this.bufferOptions, 'is-hidden');
            domClass.add(this.btnPrint, 'is-hidden');
            domClass.add(this.btnExport, 'is-hidden');
        },

        clear: function() {
            this.layerConfig = null;
            this.selectedFeature = null;
            domConstruct.empty(this.detailsContainer);
            domConstruct.empty(this.bufferContainer);
            domConstruct.empty(this.analysisContainer);
        },

        _btnDetailsClicked: function() {
            //console.log('details clicked');
        },

        _btnAnalyzeClicked: function(radius) {
            // TODO: show loading
            //console.log('analyze clicked');
            //console.debug('evt', evt);
            this._startLoader();

            domConstruct.empty(this.bufferContainer);
            domConstruct.empty(this.analysisContainer);

            // Check if buffer is valid
            var bufferStatus = this.layerConfig.analysis.buffer;
            if (bufferStatus) {

                // Check if the geometry is a POLYGON
                console.debug('Analyzing...', this.selectedFeature);
                var centerPoint = this.selectedFeature.geometry;
                if (this.selectedFeature.geometry.type === 'polygon') {
                    centerPoint = centerPoint.getCentroid();
                }

                // Buffer
                var circle = new Circle({
                    //center: this.selectedFeature.geometry,
                    center: centerPoint,
                    //radius: this.layerConfig.analysis.buffer.radius[0],
                    radius: radius,
                    radiusUnit: this.layerConfig.analysis.buffer.radiusUnit
                });
                var bufferObj = Object.create(null);
                _.each(this.layerConfig.analysis.buffer.layers, lang.hitch(this, function(layer) {
                    var query = queryUtils.createQuery({
                      //outFields: [layer.field],
                      returnGeometry: false,
                      geometry: circle
                    });
                    var layerInfo = layerUtils.getLayerInfo(this.map, layer.id);
                    bufferObj[layer.id] = queryUtils.createQueryTaskExecuteForCount(layerInfo.url, query);
                }));
                deferredAll(bufferObj).then(lang.hitch(this, function(results) {
                    //console.log('buffer results', results);
                    // get the config
                    _.each(this.layerConfig.analysis.buffer.layers, lang.hitch(this, function(layer) {
                        // create the output
                        InfoBox({
                            label: layer.label,
                            value: results[layer.id]
                        }).placeAt(this.bufferContainer);
                    }));
                }), function(error) {

                    // TODO: remove the loading & show some sort of error message
                    //this._stopLoader();
                    //console.debug('error in buffer', bufferObj)
                });
                /*
                // THIS ONLY WORKS IF FEATURELAYER IS VISIBLE
                var query = new Query();
                query.geometry = circle.getExtent();
                var layerInfo = layerUtils.getLayerInfo(this.map, this.layerConfig.analysis.buffer[0].id);
                layerInfo.layer.queryFeatures(query, lang.hitch(this, function(results) {
                    var inBuffer = [];
                    _.each(results.features, lang.hitch(this, function(feature) {
                        if (circle.contains(feature.geometry)){
                          inBuffer.push(feature);
                        }
                    }));
                    console.log('buffer results', results);
                    console.log('features in circle count: ' + inBuffer.length);
                }));
                */
            } else {
                console.debug('buffer is false');
            }

            // Layers
            var layersObj = Object.create(null);
            _.each(this.layerConfig.analysis.layers, lang.hitch(this, function(layer) {
                var query = queryUtils.createQuery({
                  outFields: [layer.field],
                  outSpatialReference: this.map.spatialReference,
                  returnGeometry: false,
                  geometry: this.selectedFeature.geometry
                });
                var layerInfo = layerUtils.getLayerInfo(this.map, layer.id);
                layersObj[layer.id] = queryUtils.createQueryTaskExecute(layerInfo.url, query);
            }));
            deferredAll(layersObj).then(lang.hitch(this, function(results) {
                // TODO: remove the loading
                //console.log('analysis results', results);
                this._stopLoader(bufferStatus);
                // Show buffer options and buffer results panel
                //domClass.remove(this.bufferContainer, 'is-hidden');
                //domClass.remove(this.bufferOptions, 'is-hidden');
                // get the config
                _.each(this.layerConfig.analysis.layers, lang.hitch(this, function(layer) {
                    var result = results[layer.id];

                    if (result && result.features && result.features.length > 0) {
                        // create the output
                        InfoRow({
                            label: layer.label,
                            value: result.features[0].attributes[layer.field]
                        }).placeAt(this.analysisContainer);
                    }
                }));
            }), function(error) {
                // TODO: remove the loading & show some sort of error message
                console.log('error in analysis')
            });

            // Switch the button visability
            this._toggleButtons(this.layerConfig, radius);

        },

        _btnPrintClicked: function() {
            //console.log('print clicked');
        },

        _btnExportClicked: function() {
            //console.log('export clicked');
        },

        _initButtons: function(layerConfig) {
            //console.debug('init buttons', layerConfig);
            (this.layerConfig && this.layerConfig.hasDetails) ? domClass.remove(this.btnDetails, 'is-hidden') : domClass.add(this.btnDetails, 'is-hidden');
            (this.layerConfig && this.layerConfig.hasAnalyzeButton) ? domClass.remove(this.btnAnalyze, 'is-hidden') : domClass.add(this.btnAnalyze, 'is-hidden');
        },

        _toggleButtons: function(layerConfig, radius) {
            //console.debug('toggle buttons', layerConfig);
            domClass.add(this.btnAnalyze, 'is-hidden');
            (this.layerConfig && this.layerConfig.hasPrint) ? domClass.remove(this.btnPrint, 'is-hidden') : domClass.add(this.btnPrint, 'is-hidden');
            (this.layerConfig && this.layerConfig.hasExportData) ? domClass.remove(this.btnExport, 'is-hidden') : domClass.add(this.btnExport, 'is-hidden');

            (radius === 1) ? domClass.add(this.oneMBufferBtn, 'is-selected') : domClass.remove(this.oneMBufferBtn, 'is-selected');
            (radius === 3) ? domClass.add(this.threeMBufferBtn, 'is-selected') : domClass.remove(this.threeMBufferBtn, 'is-selected');
            (radius === 5) ? domClass.add(this.fiveMBufferBtn, 'is-selected') : domClass.remove(this.fiveMBufferBtn, 'is-selected');

        },

        _startLoader: function() {
            domClass.remove(this.loader, 'is-hidden');
            domClass.add(this.analysisContainer, 'is-hidden');
            domClass.add(this.btnContainer, 'is-hidden');
            domClass.add(this.bufferContainer, 'is-hidden');
            domClass.add(this.bufferOptions, 'is-hidden');
        },

        _stopLoader: function(bufferIsActive) {
            domClass.add(this.loader, 'is-hidden');
            domClass.remove(this.analysisContainer, 'is-hidden');
            domClass.remove(this.btnContainer, 'is-hidden');

            if (bufferIsActive) {
                console.debug('buffer is active', this.btnContainer);
                domClass.remove(this.bufferContainer, 'is-hidden');
                domClass.remove(this.bufferOptions, 'is-hidden');
            }
        }

    });
  });
