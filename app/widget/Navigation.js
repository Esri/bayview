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
                map: this.map,
                config: widgetConfig.basemapToggle
            }, this.basemapWidgetContainer);
            this.basemapToggle.startup();

            this.layerList = new LayerList({
                map: this.map,
                config: widgetConfig.layerList
            }, this.layerWidgetContainer);
            this.layerList.startup();

            this.toolList = new ToolList({
                //config: widgetConfig.layerList
            }, this.toolsWidgetContainer);
            this.toolList.startup();

            var dialogButton = document.querySelector('.mdl-dialog-button');
            var dialog = document.querySelector('#dialog');
            if (! dialog.showModal) {
              dialogPolyfill.registerDialog(dialog);
            }
            dialogButton.addEventListener('click', function() {
               dialog.showModal();
            });
            dialog.querySelector('button:not([disabled])')
            .addEventListener('click', function() {
              dialog.close();
            });
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
                // Two cases in which the nav is closed
                // Tool is selected
                this.toolList.on('close', this.handleClose),
                // Close button click event
                on(this.navCloseBtn, 'click', lang.hitch(this, this.handleClose))
            );
        },

        clearToolList: function() {
            this.toolList.clearToolSelection();
            this.toolList.activeTool = null;
        }

    });
  });
