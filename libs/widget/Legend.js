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
  topic, dom, domStyle, domConstruct, domClass, string, aspect,
  lang,
  layerUtils,
  Legend, arcgisUtils,
  DropDownButton, TooltipDialog, TitlePane,
  template
) {

  return declare('', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: template,
    widgetsInTemplate: true,

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

        // AGS
        var includedLayerInfos = _.map(this.legendConfig.includeLayerIds, lang.hitch(this, function(layerId) {
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
          this.dropDownButton.set('label', this.legendConfig.title);
          var legendDropDown = new TooltipDialog({
            'content': this.legend,
            'class': 'legend-dropdown-dialog'
          });
          this.dropDownButton.set('dropDown', legendDropDown);
          this.dropDownButton.startup();
          break;
        case 'titlepane':
          domStyle.set(this.dropDownButton.domNode, 'display', 'none');
          var tp = new TitlePane({
            'title': this.legendConfig.title,
            'content': this.legend
          });
          this.legendContainer.appendChild(tp.domNode);
          tp.startup();
          break;
        case 'none':
          domStyle.set(this.dropDownButton.domNode, 'display', 'none');
          this.legend.startup();
          break;
      }

    },

    startup: function() {
      console.log('EsriLegend started');
    },

    updateLegend: function() {
      console.log('updateLegend');
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
    }

  });

});
