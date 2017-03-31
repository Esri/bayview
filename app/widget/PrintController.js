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
    'dojo/dom-attr',
    'dijit/registry',
    'esri/dijit/Print',
    'esri/tasks/PrintTemplate',
    'esri/tasks/PrintParameters',
    'esri/tasks/PrintTask',

    'esri/tasks/LegendLayer',
    "esri/domUtils",

    'app/config/WidgetConfig',

    'dojo/text!./templates/Print.html'
  ],

  function(
    declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
    Evented,
    lang, connect, parser, query, on, topic, domStyle, domClass, domAttr, registry, Print, PrintTemplate, PrintParameters, PrintTask, LegendLayer, domUtils,
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

            var template = new PrintTemplate();
            template.format = "PDF";
            template.layout = "Letter ANSI A Landscape";
            template.layoutOptions = {
                titleText: ""
            }

            var url = 'http://gis.baycountyfl.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
            this.printTask = new PrintTask(url);
            this.printParams = new PrintParameters();
            this.printParams.map = this.map;
            this.printParams.template = template;

            this.own(
                on(this.printSubmit, 'click', lang.hitch(this, function(e) {
                    e.preventDefault();
                    domClass.add(this.printErrorContainer, 'is-hidden');
                    domClass.remove(this.printLoading, 'is-hidden');
                    this.printParams.template.layoutOptions.titleText = this.printTitle.value;
                    domClass.add(this.printResultContainer, 'is-hidden');

                    this.printTask.execute(this.printParams, lang.hitch(this, function(evt) {
                        domClass.add(this.printLoading, 'is-hidden');
                        domClass.remove(this.printResultContainer, 'is-hidden');
                        // console.debug(this, evt);
                        domAttr.set(this.printResult, 'href', evt.url);
                    }), lang.hitch(this, function(evt) {
                        domClass.add(this.printLoading, 'is-hidden');
                        domClass.remove(this.printErrorContainer, 'is-hidden');
                        console.error('Print ERROR');
                    }));
                })),
                on(this.portrait, 'click', lang.hitch(this, function() {
                    this.layoutLabel.innerHTML = "Portrait";
                    this.printParams.template.layout = "Letter ANSI A Portrait";
                })),
                on(this.landscape, 'click', lang.hitch(this, function() {
                    this.layoutLabel.innerHTML = "Landscape";
                    this.printParams.template.layout = "Letter ANSI A Landscape";
                }))
            );
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
            domClass.add(this.printResultContainer, 'is-hidden');
            this.printTitle.value = "";
            domClass.remove(this.printTitleLabel, 'is-dirty');
            topic.publish('/ToolList/unselected', this, {
                type: null
            });
        }
    });
  });
