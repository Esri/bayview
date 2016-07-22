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
    'dijit/registry',

    'dojo/text!./templates/BasemapToggle.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, topic, parser, query, on, domStyle, domClass, registry,
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
        _.each(this.config.basemaps, lang.hitch(this, function(basemap) {
          //console.log('Basemap: ' + basemap.name);
        }));

        this.own(on(this.btnTest, 'click', lang.hitch(this, function() {
          //console.log('test clicked');
        })));
      },

      startup: function() {
        //console.log('BasemapToggle started');
        topic.publish('/BasemapToggle/changed', this, {
          newBasemap: this.config.basemaps[0]
        });
      }

    });
  });
