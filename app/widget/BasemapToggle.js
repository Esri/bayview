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
  'dojo/dom-construct',
  'dijit/registry',

  'esri/basemaps',
  'esri/dijit/BasemapLayer',
  'esri/dijit/Basemap',
  'esri/layers/ArcGISImageServiceLayer',
  'esri/layers/ImageServiceParameters',
  'esri/layers/MapImageLayer',

  'dojo/text!./templates/BasemapToggle.html'
  ],

function(
  declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
  Evented,
  lang, connect, topic, parser, query, on, domStyle, domClass, domConstruct, registry,
  esriBasemaps, BasemapLayer, Basemap, ArcGISImageServiceLayer, ImageServiceParameters, MapImageLayer,
  template
) {

  return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

    templateString: template,
    widgetsInTemplate: true,
    lubbockLayer: null,

    constructor: function() {
    },

    postCreate: function() {
      this.inherited(arguments);
    },

    startup: function() {
      _.each(this.config.basemaps, lang.hitch(this, function(basemap) {
        if (basemap.url) {
          // var customLayer = new BasemapLayer({
          //   url: basemap.url,
          // });
          // var waterBasemap = new Basemap({
          //   layers: [waterTemplateLayer],
          //   title: "Water Template",
          //   thumbnailUrl:"images/waterThumb.png"
          // });
          // add the custom basemap to the basemaplayers

          var params = new ImageServiceParameters();
          params.noData = 0;
          this.lubbockLayer = new ArcGISImageServiceLayer(basemap.url, {
            imageServiceParameters: params,
            opacity: 1
          });
          this.map.addLayer(this.lubbockLayer, 1);
          this.lubbockLayer.setVisibility(false);
          //this.lubbockLayer.visible = 0;
          // esriBasemaps.custom = {
          //   baseMapLayers: [{layer}],
          //   title: basemap.name,
          // };
        }
      }));
      topic.publish('/BasemapToggle/changed', this, {
        newBasemap: this.config.basemaps[0]
      });

      this._attachEventListeners();
    },

    _handleToggle: function() {
        // Highlight toggle
        domClass.toggle(this.basemapContainer, 'is-selected');
        // Update text
        if (domClass.contains(this.basemapContainer, 'is-selected')) {
            //this.map.setBasemap(this.config.basemaps[0].basemap);
            this.lubbockLayer.setVisibility(false);
            this.basemapName.innerHTML = 'Satellite View';
        } else {
            //this.map.setBasemap(this.config.basemaps[1].basemap);
            //this.map.setBasemap(null);
            this.lubbockLayer.setVisibility(true);
            this.basemapName.innerHTML = 'Streets View';
        }

        // Switch thumbnail image
        domClass.toggle(this.basemapStreetThumb, 'is-hidden');
        domClass.toggle(this.basemapSatThumb, 'is-hidden');
    },

    _attachEventListeners: function() {
      this.own(on(this.basemapContainer, 'click', lang.hitch(this, this._handleToggle)));
    }

  });
});
