define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',

  'dijit/form/Button',
  'dojo/_base/lang',
  'dojo/_base/Color',
  'dojo/_base/connect',
  'dojo/on',
  'dojo/dom-style',
  'dojo/dom-class',
  'dojo/topic',
  'dojo/Evented',

  'esri/toolbars/draw',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'dojo/text!./DrawTool/DrawTool_MDL.html'
],

function(
  declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  Button, lang, Color, connect, on, domStyle, domClass, topic, Evented,
  Draw, Graphic, GraphicsLayer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, drawTemplate) {

  // main draw dijit
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    widgetsInTemplate: true,
    templateString: drawTemplate,
    toolbar: null,
    graphics: null,

    postCreate: function() {
      this.inherited(arguments);

      this._initDrawTool();
    },

    startup: function() {
      console.log('DrawTool started');
    },

    _initDrawTool: function() {
      // attach button handlers
      this.own(on(this.btnDrawPoint, 'click', lang.hitch(this, this._drawPoint)));
      this.own(on(this.btnDrawLine, 'click', lang.hitch(this, this._drawLine)));
      this.own(on(this.btnDrawPolygon, 'click', lang.hitch(this, this._drawPolygon)));
      this.own(on(this.btnDrawRectangle, 'click', lang.hitch(this, this._drawRectangle)));
      this.own(on(this.btnDrawFreehandPolygon, 'click', lang.hitch(this, this._drawFreehandPolygon)));
      this.own(on(this.btnClearGraphics, 'click', lang.hitch(this, this._clearGraphics)));
      this.own(on(this.btnSaveGraphics, 'click', lang.hitch(this, this._saveGraphics)));
      this.own(on(this.btnCancel, 'click', lang.hitch(this, this._cancelDrawing)));

      // show tools that were enabled in the config
      domStyle.set(this.btnDrawPoint, 'display', this._display(this.drawConfig.tools, 'POINT'));
      domStyle.set(this.btnDrawLine, 'display', this._display(this.drawConfig.tools, 'POLYLINE'));
      domStyle.set(this.btnDrawPolygon, 'display', this._display(this.drawConfig.tools, 'POLYGON'));
      domStyle.set(this.btnDrawRectangle, 'display', this._display(this.drawConfig.tools, 'RECTANGLE'));
      domStyle.set(this.btnDrawFreehandPolygon, 'display', this._display(this.drawConfig.tools, 'FREEHAND_POLYGON'));
      domStyle.set(this.btnClearGraphics, 'display', (this.drawConfig.hasClearButton) ? 'block' : 'none');
      domStyle.set(this.btnSaveGraphics, 'display', (this.drawConfig.hasSaveButton) ? 'block' : 'none');

      // add draw widget
      this.toolbar = new Draw(this.map);

      // add graphics layer
      this.graphics = new GraphicsLayer({
        id: 'drawGraphics',
        title:'Draw Graphics'
      });
      this.map.addLayer(this.graphics);

      //on(this.toolbar, "onDrawEnd", this._toolbarDrawEnd);
      connect.connect(this.toolbar, 'onDrawEnd', this, this._stopDrawing);
      domClass.add(this.msgContainer, 'hidden');
    },

    _display: function(arr, value) {
      return (_.indexOf(arr, value) >= 0) ? 'block' : 'none';
    },

    _drawPoint: function() {
      this._startDrawing('POINT');
      this.toolbar.activate(Draw.POINT);
    },

    _drawLine: function() {
      this._startDrawing('POLYLINE');
      this.toolbar.activate(Draw.POLYLINE);
    },

    _drawPolygon: function() {
      this._startDrawing('POLYGON');
      this.toolbar.activate(Draw.POLYGON);
    },

    _drawRectangle: function() {
      this._startDrawing('RECTANGLE');
      this.toolbar.activate(Draw.RECTANGLE);
    },

    _drawFreehandPolygon: function() {
      this._startDrawing('FREEHAND_POLYGON');
      this.toolbar.activate(Draw.FREEHAND_POLYGON);
    },

    _cancelDrawing: function() {
      this._stopDrawing(null);
    },

    _startDrawing: function(tool) {
      this.emit('started', {
        tool: tool
      });
      topic.publish('/map/click/off');
      domClass.remove(this.msgContainer, 'hidden');
      domClass.add(this.drawContainer, 'hidden');
    },

    _stopDrawing: function(geometry) {
      this.emit('ended', {
        geometry: geometry
      });
      topic.publish('/map/click/on');
      this._toolbarDrawEnd(geometry);
      domClass.add(this.msgContainer, 'hidden');
      domClass.remove(this.drawContainer, 'hidden');
    },

    _toolbarDrawEnd: function(geometry) {
      this.toolbar.deactivate();
      this.btnSaveGraphics.setAttribute('disabled', false);

      // if has geometry then add it to the map
      if (geometry !== null) {
        var symbol;
        switch (geometry.type) {
          case 'point':
            symbol = new SimpleMarkerSymbol(this.drawConfig.symbology.point);
            break;
          case 'polyline':
            symbol = new SimpleLineSymbol(this.drawConfig.symbology.line);
            break;
          case 'polygon':
            symbol = new SimpleFillSymbol(this.drawConfig.symbology.fill);
            break;
          case 'rectangle':
            symbol = new SimpleFillSymbol(this.drawConfig.symbology.fill);
            break;
          default:
        }
        var graphic = new Graphic(geometry, symbol);
        this.graphics.add(graphic);
      }
    },

    _saveGraphics: function() {
      // save the current graphic
      //this.own(topic.publish('/' + this.id + '/DrawTool/Graphics/Save', this, { graphics: this.graphics }));
      this.emit('save', {
        graphics: this.graphics
      });
    },

    _clearGraphics: function() {
      //this.own(topic.publish('/' + this.id + '/DrawTool/Graphics/Clear', this, { graphics: this.graphics }));
      this.emit('clear', {
        graphics: this.graphics
      });
      this.graphics.clear();
      this.toolbar.deactivate();
      this.btnSaveGraphics.setAttribute('disabled', true);
    }
  });
});
