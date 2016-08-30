define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/topic',
    'dojo/_base/lang',
    'dojo/on',

    'dijit/form/Button',

    './InfoWindowHeader',

    'dojo/text!./templates/DefaultInfoWindow.html'

  ],

  function(
    declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    topic, lang, on,
    Button,
    InfoWindowHeader,
    template) {

    //var deferred = new Deferred();
    var sampleInfoWindow = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
      widgetsInTemplate: true,
      templateString: template,

      postCreate: function() {
        this.inherited(arguments);
        // set the title, by default the title as specified in the mapConfig is used
        this._initHeader({
          config: this.selectedInfoWindowInfoConfig,
          feature: this.selectedFeature
        });

        this._setContent();

        this._attachEventHandlers();
      },

      startup: function() {
        console.log('DefaultInfoWindow started');
      },

      _initHeader: function(args) {
        this.header = new InfoWindowHeader(args, this.headerContainer);
      },

      _setContent: function() {
        var content = '';
        if (this.selectedInfoWindowInfoConfig) {
          if (this.selectedInfoWindowInfoConfig.contentFunction) {
            content = this.selectedInfoWindowInfoConfig.contentFunction(this.selectedFeature.attributes);
          } else if (this.selectedInfoWindowInfoConfig.fieldInfos) {
            _.each(this.selectedInfoWindowInfoConfig.fieldInfos, lang.hitch(this, function(fieldInfo) {
              content += '<p><span style="color: #999; font-size: 11px;">' + fieldInfo.label + '</span><br/>' + this.selectedFeature.attributes[fieldInfo.fieldName] + '</p>';
            }));
          } else {
            _.each(this.selectedFeature.attributes, lang.hitch(this, function(value, key) {
              content += '<p><span style="color: #999; font-size: 11px;">' + key + '</span><br/>' + value + '</p>';
            }));
          }
        } else {
          _.each(this.selectedFeature.attributes, lang.hitch(this, function(value, key) {
            content += '<p><span style="color: #999; font-size: 11px;">' + key + '</span><br/>' + value + '</p>';
          }));
        }

        this.content.innerHTML = content;
      },

      _attachEventHandlers: function() {
        // define the button actions
        this.own(on(this.btnZoomTo, 'click', lang.hitch(this, this._btnZoomToClicked)));
      },

      _btnZoomToClicked: function() {
          console.debug('zooming to the feature from window', this.selectedFeature);
        console.log('zoom to clicked');
        topic.publish('/map/zoom/feature', this, {
          feature: this.selectedFeature,
          showInfoWindow: true,
          refreshLayers: true
        });
      }

    });
    return sampleInfoWindow;
  });
