define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/on',

    'dijit/form/Button',

    './InfoWindowHeader',

    'dojo/text!./templates/LocationsInfoWindow.html'

  ],

  function(
    declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, on,
    Button,
    InfoWindowHeader,
    template) {

    //var deferred = new Deferred();
    var sampleInfoWindow = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      widgetsInTemplate: true,
      templateString: template,
      infoTemplate: null,

      postCreate: function() {
        this.inherited(arguments);
        // set the title, by default the title as specified in the mapConfig is used
        var txtTitle = this.selectedFeature.attributes.DEALER_LOCATION_NAME + ' (' + this.selectedFeature.attributes.DEALER_CODE + ')';
        this._initHeader({
          title: txtTitle,
          selectedInfoWindowInfoConfig: this.selectedInfoWindowInfoConfig
        });

        // content
        // gets the following objects: selectedFeature, selectedInfoWindowInfoConfig
        // this.selectedFeature.attributes
        /*
			DEALER_LOCATION_ID	745
			DEALER_LOCATION_NAME	Juba
			DEALER_LOCATION_DESC
			DEALER_SUB_DEALER_ID
			SITE_CITY	Juba
			SITE_STATE	Central Equatoria
			SITE_COUNTRY	South Sudan
			SITE_POSTAL_CODE
			LOCATION_PHONE	249(8) 11 823 266
			LOCATION_EMAIL	sales@ezentus.com
			MAILING_CITY	Juba
			MAILING_STATE	Central Equatoria
			MAILING_COUNTRY	South Sudan
			MAILING_POSTAL_CODE
			LATITUDE	4.87
			LONGITUDE	31.60
			DEALER_CODE	K492
			SITE_ADDRESS	PLOT 1 INDUSTRIAL JUDA NORTH
			MAILING_ADDRESS	P.O. BOX 198
			LOCATION_WEBSITE
			TYPE
			BRAND_ID	1
			DEALER_ID	61
			EDIT_PENDING	N
			 */
        //this.txtFeatures.innerHTML = this.selectedFeature.attributes.STATE_NAME;

        // define the button actions
        this.own(on(this.btnEdit, 'click', lang.hitch(this, this._btnEditClicked)));
      },

      startup: function() {
        console.log('LocationsInfoWindow started');
      },

      _initHeader: function(params) {
        this.header = new InfoWindowHeader(params, this.headerContainer);
      },

      _btnEditClicked: function() {
        // hook up custom logic
        console.log('edit button clicked');
      }

    });
    return sampleInfoWindow;
  });
