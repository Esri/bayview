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
    'dijit/registry',

    './LayerItem',

    'dojo/text!./templates/LayerGroup.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, registry,
    LayerItem,
    template
  ) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {},

        postCreate: function() {
            this.inherited(arguments);

            this.headerContainer.innerHTML = this.group.name;

            _.each(this.group.layers, lang.hitch(this, function(layer) {
                new LayerItem({
                    map: this.map,
                    layer: layer
                }).placeAt(this.layersContainer);
                /*
              domConstruct.create('li', {
                'class': 'w-layer-list__layer-item js-layer-item',
                innerHTML:  '<span class="w-layer-list__check-box fa fa-square-o js-layer-uncheck"></span><span class="w-layer-list__check is-hidden fa fa-check-square-o js-layer-check"></span> ' + layer.name
              }, groupItem);
              */
            }));
        },

        startup: function() {
            //this._attachEventListeners();
        },

        toggleVisibility: function() {
            _.each(registry.findWidgets(this.layersContainer), lang.hitch(this, function(layerItem) {
                layerItem.setVisibility();
            }));
        }

    });
  });
