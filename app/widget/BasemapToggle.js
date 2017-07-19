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

  'dojo/text!./templates/BasemapToggle.html'
  ],

function(
  declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
  Evented,
  lang, connect, topic, parser, query, on, domStyle, domClass, domConstruct, registry,
  template
) {

  return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

    templateString: template,
    widgetsInTemplate: true,

    constructor: function() {
    },

    postCreate: function() {
      this.inherited(arguments);
    },

    startup: function() {
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
            this.map.setBasemap(this.config.basemaps[0].basemap);
            this.basemapName.innerHTML = 'Satellite View';
        } else {
            this.map.setBasemap(this.config.basemaps[1].basemap);
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
