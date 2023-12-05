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

    'core/dateUtils',
    'core/formatUtils',

    'dojo/text!./templates/InfoRow.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, registry,
    dateUtils, formatUtils,
    template
  ) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

        templateString: template,
        widgetsInTemplate: true,

        constructor: function() {},

        postCreate: function() {
            this.inherited(arguments);
            this.txtLabel.innerHTML = this.label;
            var value = this.value;
            if (!_.isUndefined(this.format)) {
              if (this.format === 'date' && this.value !== null) {
                value = dateUtils.getDate(this.value, {
                  selector: "date",
                  formatLength: "short"
                });
              }
              if (this.format === 'number') {
                value = formatUtils.removeDecimals(this.value);
              }
            }
            if (!_.isUndefined(this.suffix)) {
              value += ' ' + this.suffix;
            }
            this.txtValue.innerHTML = value;
        },

        startup: function() {
        }

    });
  });
