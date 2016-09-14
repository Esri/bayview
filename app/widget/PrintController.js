/**
 * Esri © 2015
 **/
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
    'dijit/registry',
    'esri/dijit/Print',
    'esri/tasks/PrintTemplate',
    'esri/tasks/LegendLayer',

    'app/config/WidgetConfig',

    'dojo/text!./templates/Print.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, parser, query, on, domStyle, domClass, registry, Print, PrintTemplate, LegendLayer,
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
            console.debug('Print post create', this);

            var legendLayer = new LegendLayer();
            legendLayer.layerId = "futurelanduse";
            legendLayer.subLayerIds = [0, 5];

            // var template = new PrintTemplate();
            // template.layout = 'Letter ANSI A Landscape';
            // template.layoutOptions = {
            //     legendLayers: [legendLayer]
            // };

            this.print = new Print({
                map: this.map,
                url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export Web Map Task",
                templates: [
                    {
                      label: "Landscape",
                      format: "png32",
                      layout: "Letter ANSI A Landscape",
                      layoutOptions: {
                        legendLayers: [legendLayer]
                      }
                    },
                    {
                      label: "Portrait",
                      format: "png32",
                      layout: "Letter ANSI A Portrait",
                      layoutOptions: {
                        legendLayers: [legendLayer]
                      }
                    }
                ]
            }, 'printContainer');
            this.print.startup();
        },

        startup: function() {
            console.debug('Print started')

        }
    });
  });
