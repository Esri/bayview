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
    'dojo/topic',
    'dojo/dom-style',
    'dojo/dom-class',
    'dijit/registry',
    'esri/dijit/Print',
    'esri/tasks/PrintTemplate',
    'esri/tasks/LegendLayer',
    "esri/domUtils",

    'app/config/WidgetConfig',

    'dojo/text!./templates/Print.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, parser, query, on, topic, domStyle, domClass, registry, Print, PrintTemplate, LegendLayer, domUtils,
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
                      format: "PDF",
                      layout: "Letter ANSI A Landscape",
                      layoutOptions: {
                          titleText: "Bay County GIS"
                        //legendLayers: [legendLayer]
                      }
                    },
                    {
                      label: "Portrait",
                      format: "PDF",
                      layout: "Letter ANSI A Portrait",
                      layoutOptions: {
                          titleText: "Bay County GIS"
                        //legendLayers: [legendLayer]
                      }
                    }
                ]
            }, 'printContainer');
            this.print.startup();
        },

        startup: function() {
            //console.debug('Print started');
            // Start the tool hidden
            this.hide();
            this.own(on(this.closeBtn, 'click', lang.hitch(this, function() {
                this.hide();
            })));
        },

        show: function () {
            domUtils.show(this.domNode);
        },

        hide: function () {
            domUtils.hide(this.domNode);
            topic.publish('/ToolList/unselected', this, {
                type: null
            });
        }
    });
  });
