 define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/dom-class',

    'dijit/form/Button',

    'dojo/text!./templates/InfoWindowHeader.html'

  ],

  function(
    declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domClass,
    Button,
    template) {

    // main HomeButton dijit
    //var deferred = new Deferred();
    var header = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      widgetsInTemplate: true,
      templateString: template,

      postCreate: function() {
        this.inherited(arguments);

        // populate the header row
        this.setTitle();
        this.setIcon();
        //this.startup();
      },

      startup: function() {
        console.log('InfoWindowHeader started');
      },

      setTitle: function(txtTitle) {
        this.titleText.innerHTML = (txtTitle) ? txtTitle : this.config.headerFunction(this.feature.attributes);
      },

      setIcon: function(txtIcon) {
        domClass.add(this.titleIcon, (txtIcon) ? txtIcon : this.config.iconClass);
      }

    });
    return header;
  });
