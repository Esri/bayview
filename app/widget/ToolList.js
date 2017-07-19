/*    Copyright 2017 Esri

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License. */
    
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

        activeTool: null,

        constructor: function() {},

        postCreate: function() {
            this.inherited(arguments);
        },

        startup: function() {
            this._attachEventListeners();
        },

        handleToolSelect: function(tool, evt) {
            //console.debug('selecting tool', tool, this.activeTool);
            topic.publish('/ToolList/unselectTool', this, {
                type: this.activeTool
            });
            this.clearToolSelection();

            if (this.activeTool === tool) {
                this.activeTool = null;
            } else {
                // Hide Search bar
                topic.publish('/ToolList/selected', this);
                // Open tool
                topic.publish('/ToolList/tool', this, {
                    type: tool
                });
                // Emit close event to the navigation
                this.emit('close', {});

                this.activeTool = tool;

                // Highlight tool
                domClass.add(evt.srcElement, 'is-selected');
            }

        },

        handleLegend: function() {
            topic.publish('/Legend/show', this);
        },

        _attachEventListeners: function() {
            this.own(
                // Tool selection click event
                on(this.toolSelectDraw, 'click', lang.hitch(this, this.handleToolSelect, 'draw')),
                on(this.toolSelectMeasure, 'click', lang.hitch(this, this.handleToolSelect, 'measure')),
                on(this.toolSelectExtract, 'click', lang.hitch(this, this.handleToolSelect, 'extract')),
                on(this.toolSelectPrint, 'click', lang.hitch(this, this.handleToolSelect, 'print')),
                on(this.toolSelectLegend, 'click', lang.hitch(this, this.handleLegend))
            );
        },

        clearToolSelection: function() {
            _.each(this.toolSet.children, lang.hitch(this, function(tool, index) {
                domClass.remove(tool, 'is-selected');
            }));
        }

    });
  });
