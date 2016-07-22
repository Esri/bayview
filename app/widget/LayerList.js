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

    'dojo/text!./templates/LayerList.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, registry,
    template
  ) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {

        },

        postCreate: function() {
            this.inherited(arguments);
            console.log('Layers available: ' + this.config.groups.length);
            // _.each(this.config.basemaps, lang.hitch(this, function(basemap) {
            //   //console.log('Basemap: ' + basemap.name);
            // }));

            // this.own(on(this.btnTest, 'click', lang.hitch(this, function() {
            //   //console.log('test clicked');
            // })));
            this._buildList();

        },

        startup: function() {
            //console.log('BasemapToggle started');
            // topic.publish('/BasemapToggle/changed', this, {
            //   newBasemap: this.config.basemaps[0]
            // });
            this._attachEventListeners();
        },

        handleGroupToggle: function(evt) {
            // Get the group index/id to open the correct list
            var groupIndex = domAttr.get(evt.srcElement, 'data-group');
            query('.js-layer-group-' + groupIndex).toggleClass('is-hidden');
        },

        _attachEventListeners: function() {
            // Get group click event
            query('.js-group-list').on('click', lang.hitch(this, this.handleGroupToggle));
        },

        _buildList: function() {

            _.each(this.config.groups, lang.hitch(this, function(group, index) {

                // Set layer group header
                var groupHeader = domConstruct.create('div', {
                    'class': 'w-layer-list__group-header js-group-list',
                    'data-group': index,
                    innerHTML:  '<span class="w-layer-list__icon ' + group.icon + '"></span> ' + group.name
                });

                // Create the group list
                var groupItem = domConstruct.create('ul', {
                    'class': 'w-layer-list__group-item is-hidden js-layer-group-' + index
                });

                // Add the layer items to group list
                _.each(group.layers, lang.hitch(this, function(layer) {
                    domConstruct.create('li', {
                        'class': 'w-layer-list__layer-item',
                        innerHTML:  '<span class="w-layer-list__check-box fa fa-square-o"></span> ' + layer.name
                    }, groupItem);
                }));

                domConstruct.place(groupHeader, this.parentListNode);
                domConstruct.place(groupItem, this.parentListNode);

            }));
        }

    });
  });
