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
  Button, lang, Color, connect, on, domStyle, topic, Evented,
  Draw, Graphic, GraphicsLayer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, drawTemplate) {

  // main draw dijit
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
    widgetsInTemplate: true,
    templateString: drawTemplate,
    toolbar: null,
    graphics: null,

    postCreate: function() {
      this.inherited(arguments);

      this.own(on(this.btnDrawPoint, 'click', lang.hitch(this, this.drawPoint)));
      this.own(on(this.btnDrawLine, 'click', lang.hitch(this, this.drawLine)));
      this.own(on(this.btnDrawPolygon, 'click', lang.hitch(this, this.drawPolygon)));
      this.own(on(this.btnDrawRectangle, 'click', lang.hitch(this, this.drawRectangle)));
      this.own(on(this.btnDrawFreehandPolygon, 'click', lang.hitch(this, this.drawFreehandPolygon)));
      this.own(on(this.btnClearGraphics, 'click', lang.hitch(this, this.clearGraphics)));
      this.own(on(this.btnSaveGraphics, 'click', lang.hitch(this, this.saveGraphics)));

      domStyle.set(this.btnDrawPoint, 'display', this.display(this.drawConfig.tools, 'POINT'));
      domStyle.set(this.btnDrawLine, 'display', this.display(this.drawConfig.tools, 'POLYLINE'));
      domStyle.set(this.btnDrawPolygon, 'display', this.display(this.drawConfig.tools, 'POLYGON'));
      domStyle.set(this.btnDrawRectangle, 'display', this.display(this.drawConfig.tools, 'RECTANGLE'));
      domStyle.set(this.btnDrawFreehandPolygon, 'display', this.display(this.drawConfig.tools, 'FREEHAND_POLYGON'));
      domStyle.set(this.btnClearGraphics, 'display', (this.drawConfig.hasClearButton) ? 'block' : 'none');
      domStyle.set(this.btnSaveGraphics, 'display', (this.drawConfig.hasSaveButton) ? 'block' : 'none');

      this.toolbar = new Draw(this.map);
      this.graphics = new GraphicsLayer({
        id: 'drawGraphics',
        title:'Draw Graphics'
      });
      this.map.addLayer(this.graphics);
      //on(this.toolbar, "onDrawEnd", this.toolbarDrawEnd);
      connect.connect(this.toolbar, 'onDrawEnd', this, this.toolbarDrawEnd);
    },

    display: function(arr, value) {
      return (_.indexOf(arr, value) >= 0) ? 'block' : 'none';
    },

    startup: function() {
      console.log('DrawTool started');
    },

    drawPoint: function() {
      this.own(topic.publish('/' + this.id + '/DrawTool/Tool/Start', this, { tool: 'POINT' }));
      this.map.hideZoomSlider();
      this.toolbar.activate(Draw.POINT);
    },

    drawLine: function() {
      this.own(topic.publish('/' + this.id + '/DrawTool/Tool/Start', this, { tool: 'POLYLINE' }));
      this.map.hideZoomSlider();
      this.toolbar.activate(Draw.POLYLINE);
    },

    drawPolygon: function() {
      this.own(topic.publish('/' + this.id + '/DrawTool/Tool/Start', this, { tool: 'POLYGON' }));
      this.map.hideZoomSlider();
      this.toolbar.activate(Draw.POLYGON);
    },

    drawRectangle: function() {
      this.own(topic.publish('/' + this.id + '/DrawTool/Tool/Start', this, { tool: 'RECTANGLE' }));
      this.map.hideZoomSlider();
      this.toolbar.activate(Draw.RECTANGLE);
    },

    drawFreehandPolygon: function() {
      this.own(topic.publish('/' + this.id + '/DrawTool/Tool/Start', this, { tool: 'FREEHAND_POLYGON' }));
      this.map.hideZoomSlider();
      this.toolbar.activate(Draw.FREEHAND_POLYGON);
    },

    toolbarDrawEnd: function(geometry) {
      this.own(topic.publish('/' + this.id + '/DrawTool/Tool/End', this, { geometry: geometry }));
      this.map.showZoomSlider();
      this.toolbar.deactivate();
      var symbol;
      switch (geometry.type) {
        case 'point':
          symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([255, 0, 0, 1.0]));
          break;
        case 'polyline':
          symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
          break;
        case 'polygon':
          symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.0]));
          break;
        case 'rectangle':
          symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.0]));
          break;
        default:
      }
      var graphic = new Graphic(geometry, symbol);
      this.graphics.add(graphic);
      this.btnSaveGraphics.setAttribute('disabled', false);
    },

    saveGraphics: function() {
      // save the current graphic
      this.own(topic.publish('/' + this.id + '/DrawTool/Graphics/Save', this, { graphics: this.graphics }));
    },

    clearGraphics: function() {
      this.own(topic.publish('/' + this.id + '/DrawTool/Graphics/Clear', this, { graphics: this.graphics }));
      this.graphics.clear();
      this.toolbar.deactivate();
      this.btnSaveGraphics.setAttribute('disabled', true);
    }
  });
});
