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
      //console.log('Basemaps available: ' + this.config.basemaps.length);
      //_.each(this.config.basemaps, lang.hitch(this, function(basemap) {
      //console.log('Basemap: ' + basemap.name);
      //}));

      this._buildToggle();
    },

    startup: function() {
      topic.publish('/BasemapToggle/changed', this, {
        newBasemap: this.config.basemaps[0]
      });

      this._attachEventListeners();
    },

    _handleToggle: function(evt) {
      // Highlight toggle
      domClass.toggle(evt.srcElement, 'is-selected');
      // Update text
      if (domClass.contains(evt.srcElement, 'is-selected')) {
        this.map.setBasemap(this.config.basemaps[1].basemap);
        evt.srcElement.innerHTML = '<span class="w-basemap-toggle__icon fa fa-globe"></span> Toggle to ' + this.config.basemaps[1].name + ' view';
      } else {
        this.map.setBasemap(this.config.basemaps[0].basemap);
        evt.srcElement.innerHTML = '<span class="w-basemap-toggle__icon fa fa-globe"></span> Toggle to ' + this.config.basemaps[0].name + ' view';
      }
    },

    _attachEventListeners: function() {
      this.own(on(this.basemapContainer, 'click', lang.hitch(this, this._handleToggle)));
    },

    _buildToggle: function() {
      // Grab node
      //var node = query('.js-basemap-toggle')[0];
      // Place the dynamic string
      domConstruct.place('<span class="w-basemap-toggle__icon fa fa-globe"></span> Toggle to <span data-dojo-attach-point="basemapName">' + this.config.basemaps[1].name + '</span> view', this.basemapContainer);
      //this.basemapName.innerHTML = '';
      //this.basemapName = '';
    }

  });
});
