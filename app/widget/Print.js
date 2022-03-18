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
    'dojo/parser',
    'dojo/query',
    'dojo/on',
    'dojo/topic',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dijit/registry',
    'esri/dijit/Print',
    'esri/tasks/PrintTemplate',
    'esri/tasks/PrintParameters',
    'esri/tasks/PrintTask',

    'esri/domUtils',
    'core/queryUtils',
    'core/layerUtils',
    'core/formatUtils',
    'dojo/promise/all',

    'app/config/WidgetConfig',
    'app/config/AppConfig',

    'dojo/text!./templates/Print.html'
    ],

    function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, parser, query, on, topic, domStyle, domClass, domAttr, domConstruct, registry, Print, PrintTemplate, PrintParameters, PrintTask,
    domUtils, queryUtils, layerUtils, formatUtils, deferredAll,
    widgetConfig, appConfig,
    template
    ) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {
        },

        postCreate: function() {
            this.inherited(arguments);
            if (this.selectedFeature) {
                var lcadid = this.selectedFeature.attributes.LCADID;
                var owner = this.selectedFeature.attributes.OWNER_NAME || '';
                var street = this.selectedFeature.attributes.OWNER_ADDRESS || '';
                var city = this.selectedFeature.attributes.OWNER_CITY || '';
                var zip = this.selectedFeature.attributes.OWNER_ZIP || '';
                var state = this.selectedFeature.attributes.OWNER_ST || '';
                var description = this.selectedFeature.attributes.LEGAL_DESCRIPTION || '';
                var sqft = this.selectedFeature.attributes.SQUARE_FOOT || '';

                this.lcadid.innerHTML = lcadid;
                this.owner.innerHTML = owner;
                this.street.innerHTML = street;
                this.city.innerHTML = city + ' ' + state + ' ' + zip;
                this.description.innerHTML = description;
                this.sqft.innerHTML = formatUtils.removeDecimals(sqft) + ' sqft';


                if (this.selectedFeature.attributes.PIN) {
                    this.getAddresses(this.selectedFeature.attributes.PIN);
                    this.getLandInfo(this.selectedFeature.attributes.LCADID);
                    this.getStructures(this.selectedFeature.attributes.PIN);
                }
                this.printMap();
            }
        },

        getAddresses: function(pin) {
            var queryParams = {
                outFields: ["FULL_ADDRESS"],
                returnGeometry: false,
                where: "PIN = " + pin,
            };
            queryUtils.createAndRun({
                query: queryParams,
                url: "https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/0",
                self: this,
                callback: this.populateAddresses,
                callbackArgs: {
                    attribute: 'FULL_ADDRESS',
                    node: this.propertyaddress,
                },
            });
        },
        
        populateAddresses: function(params, response) {
            var address = '';
            _.each(response.features, lang.hitch(this, function(feature) {
                address += feature.attributes[params.attribute] + '<br/>';
            }));
            params.node.innerHTML = address;
        },

        getLandInfo: function(lcadid) {
            var layersObj = Object.create(null);
            var layers = [
              {
                'id': 'citycouncildistricts',
                'field': 'DISTRICT',
                'attachPoint': this.councildistrict,
              },
              {
                'id': 'futurelanduseplan',
                'field': 'FN_LandUse',
                'attachPoint': this.landuse,
              },
              {
                'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/ParcelViewerSearch/MapServer/4',
                'id': 'schooldistrict',
                'field': 'SCHOOL',
                'attachPoint': this.schooldistrict,
              },
              {
                'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/ParcelViewerSearch/MapServer/6',
                'id': 'block',
                'field': 'BLOCK_SECTION',
                'attachPoint': this.block,
              },
              {
                'url': 'https://pubgis.ci.lubbock.tx.us/server/rest/services/ParcelViewerSearch/MapServer/3',
                'id': 'censustract',
                'field': 'NAME10',
                'attachPoint': this.censustract,
              },
            ];
            _.each(layers, lang.hitch(this, function(layer) {
                var query = queryUtils.createQuery({
                  where: '1=1',
                  outFields: [layer.field],
                  outSpatialReference: this.map.spatialReference,
                  returnGeometry: false,
                  geometry: this.selectedFeature.geometry
                });
                var url;
                if (layer.url) {
                    url = layer.url;
                } else {
                    url = layerUtils.getLayerInfo(this.map, layer.id).url;
                }
                //console.debug('layer query id', layer.id, query);
                layersObj[layer.id] = queryUtils.createQueryTaskExecute(url, query);
            }));
            //console.debug('layer query obj', layersObj);
            deferredAll(layersObj).then(lang.hitch(this, function(results) {
                // TODO: remove the loading
                this.resultsObject = results;
                //console.log('analysis results', results);
                // get the config
                _.each(layers, lang.hitch(this, function(layer) {
                    var result = results[layer.id];

                    if (result && result.features && result.features.length > 0) {
                        // create the output
                        //this.resultsObject[layer] = result;
                        var values = [];
                        result.features.forEach(feature => {
                            values.push(feature.attributes[layer.field]);
                        });
                        layer.attachPoint.innerHTML = values.join();
                    }
                }));
            }), lang.hitch(this, function(results) {
            }));
        },

        getStructures: function(pin) {
            var queryParams = {
                outFields: ["STRUCTURE_NAME", "FIRST_FLOOR_AREA", "TOTAL_FLOOR_AREA", "GUC"],
                returnGeometry: false,
                where: "PIN = '" + pin + "'",
            };
            queryUtils.createAndRun({
                query: queryParams,
                url: "https://pubgis.ci.lubbock.tx.us/server/rest/services/PubViewer/Pub_ParcelsCommunity/MapServer/3",
                self: this,
                callback: this.populateStructures,
                callbackArgs: {
                    attributes: ["STRUCTURE_NAME", "FIRST_FLOOR_AREA", "TOTAL_FLOOR_AREA", "GUC"],
                    node: this.structuredRows,
                },
            });
        },

        populateStructures: function(params, response) {
            var structuredRows = '';
            _.each(response.features, lang.hitch(this, function(feature) {
                structuredRows += '<tr>';
                _.each(params.attributes, function(attribute) {
                    structuredRows += '<td>' + feature.attributes[attribute] + '</td>';
                });
                structuredRows += '</tr>';
            }));
            params.node.innerHTML = structuredRows;
        },

        printMap: function() {
            var template = new PrintTemplate();
            template.format = "JPG";
            template.layout = "MAP_ONLY";
            var printTask = new PrintTask(appConfig.services.print);
            var printParams = new PrintParameters();
            printParams.map = this.map;
            printParams.template = template;
            printTask.execute(printParams, lang.hitch(this, function(evt) {
                this.mapContainer.src = evt.url;
            }), lang.hitch(this, function(evt) {
                console.error('Print ERROR');
            }));
        },

        startup: function() {
            //console.debug('Print started');
        }
    });
});
    