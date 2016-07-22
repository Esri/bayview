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
    'dojo/parser',
    'dojo/query',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/NodeList-traverse',
    'dijit/registry',

    './LayerList',
    './BasemapToggle',
    'app/config/WidgetConfig',

    'dojo/text!./templates/Navigation.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, parser, query, on, domStyle, domClass, domNodeList, registry,
    LayerList, BasemapToggle,
    widgetConfig,
    template
  ) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {

        },

        postCreate: function() {
        this.inherited(arguments);
        this.basemapToggle = new BasemapToggle({
            config: widgetConfig.basemapToggle
        }, this.basemapWidgetContainer);
        this.basemapToggle.startup();

        this.layerList = new LayerList({
            config: widgetConfig.layerList
        }, this.layerWidgetContainer);
        this.layerList.startup();
        },

        startup: function() {
            this._attachEventListeners();
        },

        handleClose: function(evt) {
            // Get the nav container from index.html
            query('.js-nav-close').children('.is-visible').removeClass('is-visible');
        },

        _attachEventListeners: function() {
            // Get group click event
            query('.js-nav-close-btn').on('click', lang.hitch(this, this.handleClose));
        }

    });
  });
