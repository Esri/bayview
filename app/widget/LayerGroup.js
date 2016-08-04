/**
 * Esri © 2015
 **/
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
                    map: this.map,
                    layer: layer
                }).placeAt(this.layersContainer);

                this.layerItems.push(lt);
            }));
        },

        _attachEventListeners: function() {
            this.own(
                // Layer Group click event
                on(this.groupContainer, 'click', lang.hitch(this, this._toggleAllLayers)),
                // Expand Layer List click event
                on(this.tuneIcon, 'click', lang.hitch(this, this._toggleLayerList)),
                // Single Layer Item click event
                _.each(this.layerItems, lang.hitch(this, function(layer) {
                    on(layer, 'layer-click', lang.hitch(this, this._checkActiveLayers));
                }))
            );
        },

        _toggleAllLayers: function() {
            // Set the header to the active/inactive color
            // Activate/Deactivate each layer in list by checking the checkbox
            if (domClass.contains(this.groupContainer, 'is-selected')) {
                domClass.remove(this.groupContainer, 'is-selected');
                _.each(registry.findWidgets(this.layersContainer), lang.hitch(this, function(layerItem) {
                    layerItem.checkbox.set('checked', false);
                }));
            } else {
                domClass.add(this.groupContainer, 'is-selected');
                _.each(registry.findWidgets(this.layersContainer), lang.hitch(this, function(layerItem) {
                    layerItem.checkbox.set('checked', true);
                }));
            }
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

            if (this.activeLayers === this.layerCount) {
                domClass.remove(this.allIcon, 'is-hidden');
            } else {
                domClass.add(this.allIcon, 'is-hidden');
            }
        }

    });
  });
