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

    'dijit/form/CheckBox',

    'dojo/text!./templates/LayerItem.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, registry,
    CheckBox,
    template
  ) {

    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

      templateString: template,
      widgetsInTemplate: true,

      constructor: function() {},

      postCreate: function() {
        this.inherited(arguments);

        this.label.innerHTML = this.layer.name;
        this.layer = this.map.getLayer(this.layer.id);

        this.own(
          on(this.checkbox, 'change', lang.hitch(this, function(isChecked) {
            topic.publish('/layerlist/layer/clicked', this, {
              layerId: this.layer.id,
              isChecked: isChecked
            });
            if (isChecked) {
              this.layer.setVisibility(true);
              this.emit('layer-click', {
                active: true
              });
            } else {
              this.layer.setVisibility(false);
              this.emit('layer-click', {
                active: false
              });
            }
          }))
        );

        this.layer.setVisibility(false);
      },

      startup: function() {},

      setVisibility: function(isVisible) {
        // TODO: only turn on when checkbox is checked
        this.layer.setVisibility(isVisible);
      }

    });
  });
