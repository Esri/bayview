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

  'widget/DrawTool',
  'widget/ExtractData/LayerItem',

  'core/layerUtils',

  'esri/tasks/Geoprocessor',
  'esri/tasks/FeatureSet',
  'esri/graphic',

  'dojo/text!./ExtractData/ExtractData.html'
],

function(
  declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
  Evented,
  lang, connect, topic, parser, query, on, domStyle, domClass, domAttr, domConstruct, registry,
  DrawTool, LayerItem,
  layerUtils,
  Geoprocessor, FeatureSet, Graphic,
  template
) {

  return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin, Evented], {

    templateString: template,
    widgetsInTemplate: true,

    constructor: function() {
      this.AOI = null;
      this.gp = null;
    },

    postCreate: function() {
      this.inherited(arguments);

      if (this.map) {
        // hookup the draw tools
        var drawConfig = lang.mixin(this.config.parameters.areaOfInterest.drawOptions, {
            container: 'none'
          });
        this.drawTool = new DrawTool({
          map: this.map,
          drawConfig: drawConfig
        }, this.drawToolContainer);
        this.drawTool.startup();
        this.own(on(this.drawTool, 'ended', lang.hitch(this, function(geometry) {
          this._updateAOI(geometry);
        })));

        // initialize the GP task
        this.gpTask = new Geoprocessor(this.config.taskUrl);
        this.gpTask.setOutSpatialReference(this.map.extent.spatialReference);

        // attach event listeners
        this.own(on(this.btnExtract, 'click', lang.hitch(this, this._btnExtractClicked)));

        // populate the layers
        this.own(on(this.map, 'layers-add-result', lang.hitch(this, this._populateLayers)));

        this._reset();
      } else {
        console.error('ExtractData widget: no map defined!');
      }
    },

    startup: function() {
      console.log('ExtractData tool loaded.');
    },

    _populateLayers: function(results) {
      this.layerItems = [];
      _.each(results.layers, lang.hitch(this, function(result) {
        var layerDef = layerUtils.getLayerInfo(this.map, result.layer.id);
        var lt = new LayerItem({
          map: this.map,
          layerDef: layerDef
        }).placeAt(this.layersContainer);
        this.own(on(lt, 'changed', lang.hitch(this, function(args) {
          // isChecked: checked,
          // layer: this.layer
          // TODO: do something (e.g. update the count)
        })));
        this.layerItems.push(lt);
      }));
      console.log('Layers: ', this.layerItems);
    },

    _updateAOI: function(geometry) {
      this.AOI = geometry;
    },

    _btnExtractClicked: function() {
      // LAYERS
      var clipLayers = ['addresses'];
      _.each(registry.findWidgets(this.layersContainer), lang.hitch(this, function(layerItem) {
        if (layerItem.isChecked()) {
          clipLayers.push(layerItem.getName());
        }
      }));

      // AOI
      var featureSet = new FeatureSet();
      var features = [];
      features.push(new Graphic(this.AOI));
      featureSet.features = features;

      // FORMAT
      var format = 'Shapefile - SHP - .shp';

      // define the GP task parameters
      var params = {
        'Layers_to_Clip': clipLayers,
        'Area_of_Interest': featureSet,
        'Feature_Format': format
      };

      // run the GP task
      this.gpTask.submitJob(params,
        lang.hitch(this, this._submitJobCompleted),
        lang.hitch(this, this._submitJobStatus),
        lang.hitch(this, this._submitJobError));

      this._showLoading();
    },

    _submitJobCompleted: function(jobInfo) {
      if (jobInfo.jobStatus !== 'esriJobFailed') {
        this.gpTask.getResultData(jobInfo.jobId, 'Output_Zip_File', lang.hitch(this, this._getResultDataSuccess));
      }
    },

    _submitJobStatus: function(jobInfo) {
      var status = jobInfo.jobStatus;
      if (status === 'esriJobFailed') {
        console.log('Error in GP task (status): ', status);
        // TODO: show status error msg
        this._hideLoading();
      } else if (status === 'esriJobSucceeded') {
        this._hideLoading();
      }
    },

    _submitJobError: function(error) {
      console.log('Error in GP task: ', error);
      // TODO: show status error msg
      this._hideLoading();
    },

    _getResultDataSuccess: function(outputFile) {
      // clear the graphics
      this.drawTool._clearGraphics();

      // set the download url
      var downloadUrl = outputFile.value.url;
      this.lnkDownload.href = downloadUrl;

      // show the download panel
      this._hideLoading();
      domClass.remove(this.resultPanelContainer, 'hidden');
    },

    _showLoading: function() {
      domClass.remove(this.loadingPanelContainer, 'hidden');
    },

    _hideLoading: function() {
      domClass.add(this.loadingPanelContainer, 'hidden');
    },

    _reset: function() {
      domClass.add(this.loadingPanelContainer, 'hidden');
      domClass.add(this.resultPanelContainer, 'hidden');
    }

  });
});
