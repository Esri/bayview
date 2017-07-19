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

  'dojo/topic',
  'dojo/dom',
  'dojo/dom-style',
  'dojo/dom-construct',
  'dojo/dom-class',
  'dojo/string',
  'dojo/aspect',
  'dojo/on',
  'dojo/query',
  'dojo/window',

  'dojo/_base/lang',

  'core/layerUtils',

  'esri/dijit/Legend',
  'esri/arcgis/utils',

  'dijit/form/DropDownButton',
  'dijit/TooltipDialog',
  'dijit/TitlePane',

  'dojo/text!./Legend/Legend.html'
],

function(
  declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  topic, dom, domStyle, domConstruct, domClass, string, aspect, on, query, window,
  lang,
  layerUtils,
  Legend, arcgisUtils,
  DropDownButton, TooltipDialog, TitlePane,
  template
) {

  return declare('', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: template,
    widgetsInTemplate: true,
    mobileBreak: 768,

    postCreate: function() {
      this.inherited(arguments);

      // TODO: what is the agsResponse??
      if (this.map.agsResponse) {

        // Portal
        var legendLayers = arcgisUtils.getLegendLayers(this.map.agsResponse);
        this.legend = new Legend({
          map: this.map,
          layerInfos: legendLayers
        }, this.lContainer);
        this.legend.startup();

      } else {
          //console.log('legend is doing AGS load...?')
        // AGS
        var includedLayerInfos = _.map(this.legendConfig.includeLayerIds, lang.hitch(this, function(layerId) {
            //console.debug(layerId);
          return layerUtils.getLayerInfo(this.map, layerId);
        }));

        this.legend = new Legend({
          map: this.map,
          autoUpdate: this.legendConfig.autoUpdate,
          respectCurrentMapScale: this.legendConfig.respectCurrentMapScale,
          layerInfos: includedLayerInfos
        }, this.lContainer);

        topic.subscribe('Legend/refresh', lang.hitch(this, function() {
          //this.legend.refresh();
          this.updateLegend();
        }));

      }

      switch (this.legendConfig.container) {
        case 'dropdown':
            //console.log('case dropdown');
        //   this.dropDownButton.set('label', this.legendConfig.title);
          var legendDropDown = new TooltipDialog({
            'content': this.legend,
            'class': 'legend-dropdown-dialog'
          });
        //   this.dropDownButton.set('dropDown', legendDropDown);
        //   this.dropDownButton.startup();
          break;
        case 'titlepane':
        //console.log('case title pane');
        //   domStyle.set(this.dropDownButton.domNode, 'display', 'none');
          this.tp = new TitlePane({
            'title': this.legendConfig.title,
            'content': this.legend,
            'open': false
          });
          this.legendContainer.appendChild(this.tp.domNode);
          this.tp.startup();
          break;
        case 'none':
        //console.log('case none');
        //   domStyle.set(this.dropDownButton.domNode, 'display', 'none');
          this.legend.startup();
          break;
      }

      on(this.legendContainer, 'click', lang.hitch(this, function() {
          if (window.getBox().w <= this.mobileBreak) {
              query('.js-legend-wrap').style('display', 'none');
          }

          domClass.toggle(this.mdlDownBtn, 'is-hidden');
          domClass.toggle(this.mdlUpBtn, 'is-hidden');

        //   console.debug('from the layer panel', this.map);
          query('.dijitTitlePaneContentOuter', this.domNode).style('height', (this.map.height - 100) + 'px');
      }));

    },

    startup: function() {
    //   console.log('EsriLegend started');
    },

    updateLegend: function() {
    //   console.log('updateLegend');
      //Get the map layers
      var mapLayers = this.esriMap.map.getLayersVisibleAtScale();

      //Loop through returned layers, exclude basemap layers
      var legendLayersArray = [];
      _.each(mapLayers, lang.hitch(this, function(item, index) {
        if (typeof item.capabilities === 'undefined' || item.capabilities !== 'Map') {
          var manualLayerInfo = {};
          manualLayerInfo.defaultSymbol = true;
          manualLayerInfo.hideLayers = 0;
          manualLayerInfo.layer = item;
          var title = item._params.title;
          if (this.legendConfig.titleLookup != null) {
            _.each(this.legendConfig.titleLookup, function(titleItem) {
              if (titleItem.Key === item._params.title) {
                title = titleItem.Value;
              }
            });
          }

          manualLayerInfo.title = title;
          legendLayersArray.push(manualLayerInfo);
        }
      }));

      //Call legend.refresh(layerInfosArray)
      if (legendLayersArray.length > 0) {
        this.legend.refresh(legendLayersArray);
      }
    },

    showAndOpen: function() {
        console.debug(this.tp);
        if (this.tp.open === false) {
            this.tp.toggle();
        }
        //domStyle.set(this.legendWrapper, 'display', 'block');
        query('.js-legend-wrap').style('display', 'block');
        query('.dijitTitlePaneContentOuter', this.domNode).style('height', (this.map.height - 100) + 'px');
    }

  });

});
