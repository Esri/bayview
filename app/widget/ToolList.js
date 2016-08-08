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
            if (domClass.contains(evt.srcElement, 'is-selected')) {
                topic.publish('/ToolList/unselected', this, {
                    type: 'draw'
                });
            } else {
                // Hide Search bar
                topic.publish('/ToolList/selected', this);
                // Open tool
                topic.publish('/ToolList/tool', this, {
                    type: 'draw'
                });
                // Emit close event to the navigation
                this.emit('close', {});
            }

            // Highlight tool
            domClass.toggle(evt.srcElement, 'is-selected');
        },

        _attachEventListeners: function() {
            this.own(
                // Tool selection click event
                on(this.toolSelectDraw, 'click', lang.hitch(this, this.handleToolSelect))
            );
        },

        clearToolSelection: function() {
            _.each(this.toolSet.children, lang.hitch(this, function(tool, index) {
                domClass.remove(tool, 'is-selected');
            }));
        }

    });
  });
