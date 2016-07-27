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

  './LayerGroup',

  'dojo/text!./templates/LayerList.html'
],

function(
  declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
  Evented,
  lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, registry,
  LayerGroup,
  template
) {

  return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

    templateString: template,
    widgetsInTemplate: true,

    constructor: function() {},

    postCreate: function() {
      this.inherited(arguments);
      this._buildList();
    },

    startup: function() {
      this._attachEventListeners();
    },

    handleGroupToggle: function(evt) {
      // Highlight group
      domClass.toggle(evt.srcElement, 'is-selected');

      // Get the group index/id to open the correct list
      var groupIndex = domAttr.get(evt.srcElement, 'data-group');
      query('.js-layer-group-' + groupIndex).toggleClass('is-hidden');
    },

    handleLayerSelect: function(evt) {
      // Highlight layer
      var groupHeader = evt.srcElement.parentElement.previousElementSibling;
      var currentLayers = domAttr.get(groupHeader, 'data-set-items');

      _.each(evt.srcElement.children, lang.hitch(this, function(item, index) {
        // Switch the checkbox icons
        domClass.toggle(item, 'is-hidden');

        //console.log('current layers selected ' + currentLayers);
        // Indicate in the group header that there are/are not selected layers
        // Keep a running count of selected layers
        if (domClass.contains(item, 'js-layer-uncheck') && domClass.contains(item, 'is-hidden')) {
          //console.log('this layer is selected');
          domAttr.set(groupHeader, 'data-set-items', currentLayers++);
        } else {
          domAttr.set(groupHeader, 'data-set-items', currentLayers--);
        }
      }));

      // Place setting adjustment icon on group if there are selected layers
      // grab the settings icon node
      var settingIcon = query('.js-group-set', groupHeader)[0];
      // update the current layer variable
      currentLayers = domAttr.get(groupHeader, 'data-set-items');
      // set class to reveal icon
      if (currentLayers > 0) {
        domClass.remove(settingIcon, 'is-hidden');
      } else {
        domClass.add(settingIcon, 'is-hidden');
      }

    },

    _attachEventListeners: function() {
      this.own(
          // Get group click event
          query('.js-group-list').on('click', lang.hitch(this, this.handleGroupToggle)),
          // Get layer selection click event
          query('.js-layer-item').on('click', lang.hitch(this, this.handleLayerSelect))
      );
    },

    _buildList: function() {

      _.each(this.config.groups, lang.hitch(this, function(group, index) {

        new LayerGroup({
          map: this.map,
          group: group
        }).placeAt(this.parentListNode);

        /*
        // Set layer group header
        var groupHeader = domConstruct.create('div', {
          'class': 'w-layer-list__group-header js-group-list',
          'data-group': index,
          'data-set-items': 0,
          innerHTML:  '<span class="w-layer-list__group-icon ' + group.icon + '"></span> ' + group.name + '<span class="w-layer-list__group-set-icon is-hidden fa fa-sliders js-group-set"></span>'
        });

        // Create the group list
        var groupItem = domConstruct.create('ul', {
          'class': 'w-layer-list__group-item is-hidden js-layer-group-' + index
        });

        // Add the layer items to group list
        _.each(group.layers, lang.hitch(this, function(layer) {
          domConstruct.create('li', {
            'class': 'w-layer-list__layer-item js-layer-item',
            innerHTML:  '<span class="w-layer-list__check-box fa fa-square-o js-layer-uncheck"></span><span class="w-layer-list__check is-hidden fa fa-check-square-o js-layer-check"></span> ' + layer.name
          }, groupItem);
        }));

        domConstruct.place(groupHeader, this.parentListNode);
        domConstruct.place(groupItem, this.parentListNode);
        */

      }));
    }

  });
});
