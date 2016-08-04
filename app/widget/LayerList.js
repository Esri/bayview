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
    },

    _buildList: function() {

        _.each(this.config.groups, lang.hitch(this, function(group, index) {

        new LayerGroup({
            map: this.map,
            group: group
        }).placeAt(this.parentListNode);

        }));
    }

  });
});
