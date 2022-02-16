define([
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/Evented',

  'dojo/_base/declare',
  'dojo/_base/lang',

  'dojo/on',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/dom-attr',
  'dojo/dom-style',
  'dojo/mouse',

  'esri/graphic',
  'esri/geometry/Extent',
  'esri/geometry/Point',
  'esri/geometry/Polyline',
  'esri/symbols/PictureMarkerSymbol',
  'esri/symbols/SimpleMarkerSymbol',

  'dijit/form/Button',

  'core/graphicUtils',

  'dojo/text!./templates/ResultRow.html'
], function(
  _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented,
  declare, lang,
  on, domClass, domConstruct, domAttr, domStyle, mouse,
  Graphic, Extent, Point, Polyline, PictureMarkerSymbol, esriSMS,
  Button,
  graphicUtils,
  template
) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {

    templateString: template,

    // Properties to be sent into constructor
    constructor: function(options) {
      this.mapPin = null;
    },

    postCreate: function() {
      this.inherited(arguments);
      var inputValue = this.inputValue || '';
      var hasAction = this.hasAction || false;

      var regex = new RegExp('(' + this.inputValue + ')', 'gi');
      var formattedLabel = this.resultObj.label.replace(regex, '<strong>$1</strong>');

      if (this.resultObj && this.resultObj.obj && this.resultObj.obj.symbol) {
        var img = domConstruct.toDom('<img src="' + this.resultObj.obj.symbol.url + '">');
        domConstruct.place(img, this.resultIcon);
      } else {
        domClass.add(this.resultIcon, this.resultObj.iconClass);
      }
      this.resultLabel.innerHTML = formattedLabel;

      //var featureExtent = this._getExtent(this.resultObj.extent);
      var featureExtent = this.resultObj.extent;
      if (featureExtent !== null && featureExtent !== '') {
        
        //this.mapPin = new Graphic(featureExtent, pinSymbol);
      }
      this.graphicUtils = new graphicUtils(this.map);
      // hook up events
      this.own(on(this.resultIcon, 'click', lang.hitch(this, function() {
        this.emit('iconclicked', {
          'resultObj': this.resultObj,
          'feature': this.resultObj.obj
        });
      })));

      // event: result item click
      this.own(on(this.resultItem, 'click', lang.hitch(this, function() {
        this.emit('itemclicked', {
          'resultObj': this.resultObj
        });
      })));

      // event: add button click
      this.own(on(this.btnSubmit, 'click', lang.hitch(this, function() {
        this.emit('actionclicked', {
          'resultObj': this.resultObj
        });
      })));

      // MOUSE HOVER
      this.own(on(this.resultItem, mouse.enter, lang.hitch(this, function(event) {
        if (this.resultObj && this.resultObj.obj){
          var g;
          if (this.resultObj.obj.location){
            // results are from geocoder
            g = new Point({
              "x": this.resultObj.obj.location.x,
              "y": this.resultObj.obj.location.y,
              "spatialReference": {"wkid": this.resultObj.obj.location.spatialReference.wkid}
            }); 
          } else {
            g = this.resultObj.obj.geometry;
          }
          this.graphicUtils.drawGraphic(g);
        }
        
      })));
      this.own(on(this.resultItem, mouse.leave, lang.hitch(this, function(event) {
        if (this.resultObj && this.resultObj.obj){
          this.graphicUtils.removeGraphic(this.resultObj.obj.geometry);
        }
        
      })));

      this.toggleActionButton(hasAction);
    },

    getId: function() {
      return this.resultObj.oid;
    },

    getResultObj: function() {
      return this.resultObj;
    },

    getFeature: function() {
      return this.resultObj.obj;
    },

    showLoading: function() {
      domClass.remove(this.resultIcon);
      domClass.add(this.resultIcon, 'search-results-icon fa fa-refresh fa-spin');
    },

    hideLoading: function() {
      domClass.remove(this.resultIcon);
      domClass.add(this.resultIcon, 'search-results-icon ' + this.resultObj.iconClass);
    },

    toggleActionButton: function(hasAction) {
      if (hasAction) {
        domStyle.set(this.resultAction, 'display', 'block');
      } else {
        domStyle.set(this.resultAction, 'display', 'none');
      }
    }

  });
});