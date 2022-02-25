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
        'core/graphicUtils',
    
        'esri/tasks/query',
        'esri/geometry/Circle',
        'esri/geometry/Point',
    
        './InfoRow',
        './InfoBox',
    
        'dojo/text!./templates/InfoPanel.html'
      ],
    
      function(
        declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented,
        lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, 
        deferredAll, registry, queryUtils, layerUtils, graphicUtils, Query, Circle, Point, InfoRow, InfoBox,
        template
      ) {
    
        return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {
    
            templateString: template,
            widgetsInTemplate: true,
            detailsLink: 'https://qpublic.schneidercorp.com/Application.aspx?AppID=834&PageTypeID=4&KeyValue=',
    
            constructor: function() {
                this.resultsObject = null;
                this.delimiter = ','; // Delimiter between fields; default is a comma.
                this.newline = '\r\n'; // Character sequence to consider a newline. Defaults to "\r\n" (CRLF) as per RFC 4180.
                this.trim = false; // If true, leading/trailing space will be trimmed from any unquoted values.
                this.fieldNames = null; //["Name"], // If specified, indicates names of fields in the order they appear in CSV records.  If unspecified, the first line of the CSV will be treated as a header row, and field names will be populated from there.
    
            },
    
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
                
                this.graphicUtils = new graphicUtils(this.map);
            },
    
            startup: function() {
    
            },
    
            showDetails: function(layerId, selectedFeature) {
                // from the layerId get the infos
                this.layerConfig = this.config[layerId];
                this.analysisConfig = this.config.analysis;
                // console.debug('analysis config', this.analysisConfig);
                this.selectedFeature = selectedFeature;
                //console.debug('selected feature info', this.layerConfig.infos);
                if (this.layerConfig) {
                    _.each(this.layerConfig.infos, lang.hitch(this, function(info) {
                        // create a new row
                        // label: info.label
                        // value: selectedFeature[info.field]
                        //console.log(info.label + ': ' + selectedFeature.attributes[info.field]);
                        // Add the details link to the details button (Parcels only)
                        if (info.field === 'A1RENUM') {
                            //console.debug('found Parecel ID', this.selectedFeature.attributes[info.field]);
                            domAttr.set(this.btnDetailsLink, 'href', this.detailsLink + this.selectedFeature.attributes[info.field]);
                        }
                        if (info.field === 'E_LINK') {
                            domAttr.set(this.btnDetailsLink, 'href', this.selectedFeature.attributes[info.field]);
                        }
                        //value for InfoRow defaults to attribute value
                        value = this.selectedFeature.attributes[info.field]
                        var fieldDef = this.selectedFeature._layer.fields.filter(function(obj){
                            return obj.name == info.field;
                        })[0];
                        //check if field has a domain and use coded values
                        if (fieldDef.hasOwnProperty('domain')){
                            var domain = fieldDef.domain.codedValues.filter(lang.hitch(this, function(obj){
                                return obj.code == this.selectedFeature.attributes[info.field];
                            }))[0];
                            if (domain){
                                value = domain.name;
                            }
                        };
                        //check if layer has subtype
                        if (this.selectedFeature._layer.typeIdField !== null) {
                            var subtype = this.selectedFeature._layer.types.filter(lang.hitch(this, function(obj){
                                return obj.id == this.selectedFeature.attributes[this.selectedFeature._layer.typeIdField];
                            }))[0];
                            //use subtype value if this is subtype field
                            if (subtype){
                                if (this.selectedFeature._layer.typeIdField == info.field){
                                    value = subtype.name;
                                }
                                //use domain values for subtype is this field has a corresponding domain
                                if (subtype.domains && subtype.domains.hasOwnProperty(info.field) && subtype.domains[info.field] && subtype.domains[info.field].codedValues) {
                                    var domain = subtype.domains[info.field].codedValues.filter(lang.hitch(this, function(obj){
                                        return obj.code == this.selectedFeature.attributes[info.field];
                                    }))[0];
                                    if (domain){
                                        value = domain.name;
                                    }
                                }
                            }
                        };
                        if (info.field != 'E_LINK') {
                            InfoRow({
                                label: info.label,
                                value: value,
                                format: info.format,
                                suffix: info.suffix,
                            }).placeAt(this.detailsContainer);
                        }
                    }));
                    this._initButtons(this.layerConfig);
                }
            },
    
            showPanel: function() {
                query('#infoPanelWrapper').removeClass('is-hidden');
                this.graphicUtils.drawGraphic(this.getSelectedGraphic());
            },
    
            getSelectedGraphic: function () {
                var g;
                if (this.selectedFeature && this.selectedFeature.location){
                    // results are from geocoder
                    g = new Point({
                      "x": this.selectedFeature.location.x,
                      "y": this.selectedFeature.location.y,
                      "spatialReference": {"wkid": this.selectedFeature.location.spatialReference.wkid}
                    }); 
                  } else {
                    g = this.selectedFeature.geometry;
                  }
                  return g;
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
    
                if (this.selectedFeature && this.selectedFeature.geometry){
                    this.graphicUtils.removeGraphic(this.getSelectedGraphic());
                }
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
                var bufferStatus = this.analysisConfig.buffer;
                if (bufferStatus) {
    
                    // Check if the geometry is a POLYGON
                    //console.debug('Analyzing...', this.selectedFeature);
                    var centerPoint = this.selectedFeature.geometry;
                    if (this.selectedFeature.geometry.type === 'polygon') {
                        centerPoint = centerPoint.getCentroid();
                    }
    
                    // Buffer
                    var circle = new Circle({
                        //center: this.selectedFeature.geometry,
                        center: centerPoint,
                        //radius: this.analysisConfig.buffer.radius[0],
                        radius: radius,
                        radiusUnit: this.analysisConfig.buffer.radiusUnit
                    });
                    var bufferObj = Object.create(null);
                    _.each(this.analysisConfig.buffer.layers, lang.hitch(this, function(layer) {
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
                        _.each(this.analysisConfig.buffer.layers, lang.hitch(this, function(layer) {
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
                    var layerInfo = layerUtils.getLayerInfo(this.map, this.analysisConfig.buffer[0].id);
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
                _.each(this.analysisConfig.layers, lang.hitch(this, function(layer) {
                    var query = queryUtils.createQuery({
                      where: '1=1',
                      outFields: [layer.field],
                      outSpatialReference: this.map.spatialReference,
                      returnGeometry: false,
                      geometry: this.selectedFeature.geometry
                    });
                    var layerInfo = layerUtils.getLayerInfo(this.map, layer.id);
                    //console.debug('layer query id', layer.id, query);
                    layersObj[layer.id] = queryUtils.createQueryTaskExecute(layerInfo.url, query);
                }));
                //console.debug('layer query obj', layersObj);
                deferredAll(layersObj).then(lang.hitch(this, function(results) {
                    // TODO: remove the loading
                    this.resultsObject = results;
                    //console.log('analysis results', results);
                    this._stopLoader(bufferStatus);
                    // Show buffer options and buffer results panel
                    //domClass.remove(this.bufferContainer, 'is-hidden');
                    //domClass.remove(this.bufferOptions, 'is-hidden');
                    // get the config
                    _.each(this.analysisConfig.layers, lang.hitch(this, function(layer) {
                        var result = results[layer.id];
    
                        if (result && result.features && result.features.length > 0) {
                            // create the output
                            InfoRow({
                                label: layer.label,
                                value: result.features[0].attributes[layer.field],
                            }).placeAt(this.analysisContainer);
                        }
                    }));
                    this._toggleButtons(this.layerConfig, radius);
                }), lang.hitch(this, function(results) {
                    // TODO: remove the loading & show some sort of error message
                    //console.log('error in analysis');
                    this._stopLoader(bufferStatus);
                    // this.resultsObject = null;
                    // this._toggleButtons(this.layerConfig, radius);
                }));
            },
    
            _btnPrintClicked: function() {
                //console.log('print clicked');
                topic.publish('/InfoPanel/print', this, {
                    type: 'print'
                });
            },
    
            _btnExportClicked: function() {
                //console.log('export clicked');
                if (this.resultsObject !== null) {
                    var csv = this.exportToCsv({
                        alwaysQuote: false,
                        trailingNewline: false
                    });
    
                    if (window.navigator.msSaveBlob) {
                        //Download in IE.
                        var blob = new Blob([csv], { type: "application/csv;charset=utf-8;"});
                        navigator.msSaveBlob(blob, "export.csv");
                    } else {
                        //Download in anything else.
                        var downloadCsvLink = document.createElement("a");
                        var csvBlob = new Blob(["\ufeff", csv]);
                        var url = URL.createObjectURL(csvBlob);
                        downloadCsvLink.href = url;
                        downloadCsvLink.download = "export.csv";
                        document.body.appendChild(downloadCsvLink);
                        downloadCsvLink.click();
                        document.body.removeChild(downloadCsvLink);
                    }
                } else {
                    // TODO: show some sort of error message
                    console.log('no results defined');
                }
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
                domAttr.set(this.btnExport, 'disabled', (this.resultsObject === null));
    
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
            },
    
            exportToCsv: function (options) {
                options = options || {};
    
                var alwaysQuote = options.alwaysQuote;
                var delimiter = this.delimiter;
                var newline = this.newline;
                var output = "";
    
                var quoteRx = /^\s*"([\S\s]*)"\s*$/;
                var doubleQuoteRx = /""/g;
                var singleQuoteRx = /"/g;
    
                _.each(this.layerConfig.infos, lang.hitch(this, function(info, index) {
                    output +=   this.getOutputString(info.label, alwaysQuote, delimiter, singleQuoteRx) +
                                delimiter +
                                this.getOutputString(this.selectedFeature.attributes[info.field], alwaysQuote, delimiter, singleQuoteRx) +
                                newline;
                }));
    
                _.each(this.analysisConfig.layers, lang.hitch(this, function(layer, index) {
                    var result = this.resultsObject[layer.id];
    
                    if (result && result.features && result.features.length > 0) {
                        // create the output
                        output +=   this.getOutputString(layer.label, alwaysQuote, delimiter, singleQuoteRx) +
                                    delimiter +
                                    this.getOutputString(result.features[0].attributes[layer.field], alwaysQuote, delimiter, singleQuoteRx) +
                                    newline;
                    }
                }));
                return output;
            },
    
            getOutputString: function(value, alwaysQuote, delimiter, singleQuoteRx) {
                if (value === null) {
                    return "";
                }
                var needsQuotes = this.isString(value) && (alwaysQuote || value.indexOf('"') >= 0 || value.indexOf(delimiter) >= 0);
                return (needsQuotes ? '"' + value.replace(singleQuoteRx, '""') + '"' : value);
            },
    
            isString: function(value) {
                return (typeof value == 'string' || value instanceof String);
            }
    
        });
      });
    