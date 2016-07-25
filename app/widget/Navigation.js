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
    './ToolList',
    'app/config/WidgetConfig',

    'dojo/text!./templates/Navigation.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, parser, query, on, domStyle, domClass, domNodeList, registry,
    LayerList, BasemapToggle, ToolList,
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

            this.toolList = new ToolList({
                //config: widgetConfig.layerList
            }, this.toolsWidgetContainer);
            this.toolList.startup();
        },

        startup: function() {
            this._attachEventListeners();
        },

        handleClose: function(evt) {
            // Get the nav container from index.html
            query('.js-nav-close').children('.is-visible').removeClass('is-visible');
        },

        _attachEventListeners: function() {
            this.own(
                // Two cases the nav can be closed
                // Tool is selected
                this.toolList.on('close', this.handleClose),
                // Close button click event
                query('.js-nav-close-btn').on('click', lang.hitch(this, this.handleClose))
            );
        }

    });
  });
