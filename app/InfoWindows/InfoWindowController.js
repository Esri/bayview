define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/mouse',
    'dojo/query',
    'dojo/dom',

    'dojo/Deferred',

    'core/layerUtils',

    // include all the app specific info windows
    './LocationsInfoWindow',
    './DefaultInfoWindow'
  ],

  function(
    declare, lang, domClass, domConstruct, on, mouse, query, dom,
    Deferred,
    layerUtils,
    LocationsInfoWindow, DefaultInfoWindow) {

    // main HomeButton dijit
    return declare([], {

      constructor: function(options) {
        this.inherited(arguments);
        this.postCreate(options);
      },

      postCreate: function(options) {
        this.map = options.map;
        this.infoWindowConfig = options.infoWindowConfig;

        /*
        on(query('.esriPopupWrapper'), mouse.enter, lang.hitch(this, function() {
          domClass.add(dom.byId('map_container'), 'blur-out');
        }));

        on(query('.esriPopupWrapper'), mouse.leave, lang.hitch(this, function() {
          domClass.remove(dom.byId('map_container'), 'blur-out');
        }));
        */
      },

      startup: function() {
        this.inherited(arguments);
        console.log('InfoWindowController started');
      },

      show: function(target, controller) {
        console.log('InfoWindowController show');

        if (target.features) {
          console.log(target.features.length + ' features');
          var selectedFeature = target.getSelectedFeature();
          var allFeatures = target.features;
          this.showFeature(selectedFeature, controller, allFeatures);
        } else {
          console.log('No features');
        }
      },

      showFeature: function(selectedFeature, controller, allFeatures) {
        var layerId = selectedFeature._layer.id;
        var selectedInfoWindowInfoConfig = this.map.getLayer(layerId)._params.infoWindow;

        if (this.infoWindowConfig.blurMapOnHover) {
          domClass.add(dom.byId('map_container'), 'blur-map');
        }

        var args = {
          selectedFeature: selectedFeature,
          allFeatures: allFeatures || null,
          selectedInfoWindowInfoConfig: selectedInfoWindowInfoConfig,
          controller: controller
        };
        console.log('Current feature ', selectedFeature);

        this._showLoading(selectedFeature.geometry);
        this._getInfoWindowContent(args).then(lang.hitch(this, function(content) {
          this.map.infoWindow.setContent(content);
        }));
      },

      _getInfoWindowContent: function(args) {
        var deferred = new Deferred();

        deferred.resolve(this._createInfoWindow(args));

        return deferred;
      },

      _showLoading: function(geometry) {
        this.map.infoWindow.setContent('<div class="info-window-loading-wrapper"><i class="fa fa-circle-o-notch fa-spin"></i> Loading...</div>');
        if (geometry) {
          this.map.infoWindow.show(this._getMapPoint(geometry));
        }
      },

      _createInfoWindow: function(args) {

        /*
			selectedInfoWindowInfoConfig: {
				id: 'PointsOfInterest'
				info: {
					iconClass: 'fa fa-map-marker'
					isEnabled: true
					outFields: Array[1]
					title: 'Locations'
					widget: 'LocationsInfoWindow'
				}
			}
			*/

        switch (args.selectedInfoWindowInfoConfig.widget) {
          case 'LocationsInfoWindow':
            console.log('Showing: Location InfoWindow');
            this.content = new LocationsInfoWindow(args, domConstruct.create('div'));
            break;
          default:
            console.log('Showing: Default InfoWindow');
            this.content = new DefaultInfoWindow(args, domConstruct.create('div'));
            break;
        }

        on(this.content.header.btnClose, 'click', lang.hitch(this, this._btnCloseClicked));
        return this.content.domNode;
      },

      _btnCloseClicked: function() {
        if (this.infoWindowConfig.blurMapOnHover) {
          domClass.remove(dom.byId('map_container'), 'blur-map');
        }

        this.map.infoWindow.hide();
      },

      _getMapPoint: function(geometry) {
        var pt;
        if (this.extent) {
          pt = this.extent.getCenter();
        } else if (geometry.type === 'point') {
          pt = geometry;
        } else {
          /*
          var mapExtent = this.map.extent;
          var extent = this.intersectExtents(mapExtent, graphicExtent);
          if (!extent) {
              extent = graphicExtent;
          }
          */
          pt = geometry.getExtent().getCenter();
        }

        return pt;
      }

      /*
        _showInfoWindow: function(title, content, screenPoint) {
            this.map.infoWindow.setTitle(title);
            this.map.infoWindow.setContent(content);
            this.showMapInfoWindowUsingPoint(screenPoint);
            parser.parse(this.map.infoWindow.domNode);
		},


        showMapInfoWindowUsingPoint: function(pt) {
            var map = this.map;
            var mapExtent = map.extent;

            var screenPoint = screenUtils.toScreenGeometry(map.extent, map.width, map.height, pt);
            this.map.infoWindow.show(pt, map.getInfoWindowAnchor(screenPoint));
        }
        */

    });
  });
