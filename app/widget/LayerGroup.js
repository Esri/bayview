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
  'dojo/mouse',
  'dijit/registry',

  './LayerItem',

  'dojo/text!./templates/LayerGroup.html'
],

function(
  declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
  Evented,
  lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, mouse, registry,
  LayerItem,
  template
) {

  return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

    templateString: template,
    widgetsInTemplate: true,

    constructor: function() {
      this.layerCount = 0;
      this.activeLayers = 0;
    },

    postCreate: function() {
      this.inherited(arguments);

      this._buildLayerGroup();
      this._attachEventListeners();
    },

    startup: function() {

    },

    _buildLayerGroup: function() {
      this.layerCount = this.group.layers.length;

      this.groupText.innerHTML = this.group.name;
      this.groupIcon.innerHTML = this.group.icon;
      this.layerItems = [];

      _.each(this.group.layers, lang.hitch(this, function(layer) {
        var lt = new LayerItem({
          'map': this.map,
          'layer': layer
        }).placeAt(this.layersContainer);
        this.layerItems.push(lt);
      }));
    },

    _attachEventListeners: function() {
      this.own(
        // Attach links to select/unselect all layers
        on(this.selectAll, 'click', lang.hitch(this, this._toggleAllLayersOn)),
        on(this.unselectAll, 'click', lang.hitch(this, this._toggleAllLayersOff)),
        // Expand Layer List click event
        on(this.groupContainer, 'click', lang.hitch(this, this._toggleLayerList)),
        // Single Layer Item click event
        _.each(this.layerItems, lang.hitch(this, function(layer) {
          on(layer, 'layer-click', lang.hitch(this, this._checkActiveLayers));
        }))
      );
    },

    _toggleAllLayersOn: function() {
      _.each(registry.findWidgets(this.layersContainer), lang.hitch(this, function(layerItem) {
        layerItem.checkbox.set('checked', true);
      }));
    },

    _toggleAllLayersOff: function() {
      _.each(registry.findWidgets(this.layersContainer), lang.hitch(this, function(layerItem) {
        layerItem.checkbox.set('checked', false);
      }));
    },

    _toggleLayerList: function() {
      if (domClass.contains(this.layersContainer, 'is-hidden')) {
        domClass.add(this.groupContainer, 'is-open');
        domClass.remove(this.layersContainer, 'is-hidden');
      } else {
        domClass.remove(this.groupContainer, 'is-open');
        domClass.add(this.layersContainer, 'is-hidden');
      }
    },

    _checkActiveLayers: function(evt) {
      if (evt.active) {
        this.activeLayers++;
      } else {
        this.activeLayers--;
      }

      if (this.activeLayers > 0) {
        domClass.remove(this.tuneIcon, 'is-hidden');
      } else {
        domClass.add(this.tuneIcon, 'is-hidden');
      }
    }

  });
});
