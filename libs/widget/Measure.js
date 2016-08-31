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
  'dojo/_base/lang',

  'esri/dijit/Measurement',

  'dojo/text!./Measure/Measure.html'
],

function(
  declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  topic, dom, domStyle, domConstruct, domClass, string, lang,
  Measurement,
  template
) {

  return declare('', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Measurement], {
    templateString: template,
    widgetsInTemplate: true,

    postCreate: function() {
      this.inherited(arguments);

    },

    startup: function() {
      console.log('Measure started');
    }

  });
});