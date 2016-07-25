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

    'dojo/text!./templates/ToolList.html'
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

        constructor: function() {},

        postCreate: function() {
            this.inherited(arguments);
        },

        startup: function() {
            this._attachEventListeners();
        },

        handleToolSelect: function(evt) {
            // Clear prvious tool selection
            query('.js-tool-select').removeClass('is-selected');

            // Highlight tool
            domClass.toggle(evt.srcElement, 'is-selected');

            // Emit close event to the navigation
            this.emit('close', {});
        },

        _attachEventListeners: function() {
            this.own(
                // Get tool selection click event
                query('.js-tool-select').on('click', lang.hitch(this, this.handleToolSelect))
            );
        }

    });
  });
