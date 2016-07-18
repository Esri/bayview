define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',

  'dojo/dom-construct',
  'dojo/dom-class',

  'esri/dijit/Basemap',
  'esri/dijit/BasemapLayer',
  'esri/dijit/BasemapGallery',

  'dijit/form/DropDownButton',
  'dijit/TooltipDialog',

  'dojo/text!./BasemapGallery/templates/BasemapGallery.html',
  'dojo/i18n!./BasemapGallery/nls/Strings'
],

function(declare, lang, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  domConstruct, domClass,
  Basemap, BasemapLayer, BasemapGallery,
  DropDownButton, TooltipDialog,
  template, i18n
) {

  return declare('widget.gis.BasemapGallery', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: template,
    widgetsInTemplate: true,

    i18n_BasemapGallery_Label: i18n.BasemapGallery_Label,

    postCreate: function() {
      this.inherited(arguments);

      this.basemapGallery = new BasemapGallery({
        id: 'basemapGallery',
        'class': 'simple',
        showArcGISBasemaps: !this.basemapConfig.useCustomBasemaps,
        map: this.map,
        onSelectionChange: function() {
          var selectedBasemap = this.getSelected();
          if (selectedBasemap.id === 'satellite' || selectedBasemap.id === 'hybrid' || selectedBasemap.id === 'dark') {
            // for all dark basemaps add the 'dark attribute' style class so that ui elements render differently
            domClass.add(this.map.container, 'dark');
          } else {
            domClass.remove(this.map.container, 'dark');
          }
        }
      }, domConstruct.create('div'));

      if (this.basemapConfig.useCustomBasemaps) {
        this.basemapGallery.basemaps = this.getCustomBasemaps();
      }

      this.basemapGallery.on('error', function(evt) {
        console.log(evt.error);
      });
      this.basemapGallery.startup();

      var basemapGalleryDropDown = new TooltipDialog({
        'content': this.basemapGallery
      });

      this.dropDownButton.set('dropDown', basemapGalleryDropDown);

      /*
      var basemapGalleryButton = new DropDownButton({
        //label: "BasemapGallery Widget",
        "class": "basemaps-control",
        dropDownPosition: ['below-centered', 'above-centered'],
        dropDown: basemapGalleryDropDown
      }, this.dropDownButton);
      */
    },

    startup: function() {
      console.log('BasemapGallery started');
    },

    getCustomBasemaps: function() {
      var basemaps = [];
      if (this.basemapConfig.customBasemaps) {
        _.each(this.basemapConfig.customBasemaps, lang.hitch(this, function(basemap) {
          var bm = this._getBasemapObject(basemap);
          if (bm !== null) {
            basemaps.push(bm);
          }
        }));
      }

      return basemaps;
    },

    _getBasemapObject: function(basemap) {
      switch (basemap) {
        case 'streets':
          return Basemap({
            id: 'streets',
            layers: [new BasemapLayer({
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
            })],
            title: i18n.Basemap_Streets,
            thumbnailUrl: 'libs/widget/BasemapGallery/images/streets.jpg'
          });
        case 'satellite':
          return Basemap({
            id: 'satellite',
            layers: [new BasemapLayer({
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })],
            title: i18n.Basemap_Satellite,
            thumbnailUrl: 'libs/widget/BasemapGallery/images/satellite.jpg'
          });
        case 'hybrid':
          return Basemap({
            id: 'hybrid',
            layers: [new BasemapLayer({
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            }), new BasemapLayer({
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer',
              isReference: true,
              displayLevels: [0, 1, 2, 3, 4, 5, 6, 7]
            }), new BasemapLayer({
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer',
              isReference: true,
              displayLevels: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
            })],
            title: i18n.Basemap_Hybrid,
            thumbnailUrl: 'libs/widget/BasemapGallery/images/hybrid.jpg'
          });
        case 'gray':
          return Basemap({
            id: 'gray',
            layers: [new BasemapLayer({
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer'
            }), new BasemapLayer({
              url: 'http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer',
              isReference: true
            })
            ],
            title: i18n.Basemap_Gray,
            thumbnailUrl: 'libs/widget/BasemapGallery/images/gray.jpg'
          });
        case 'dark':
          return Basemap({
            id: 'dark',
            layers: [new BasemapLayer({
              url: 'http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer'
            })
            //, new BasemapLayer({
            //  url: "http://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/DGCM_2Msmaller_REF/MapServer",
            //  isReference: true
            //})
            ],
            title: i18n.Basemap_Dark,
            thumbnailUrl: 'libs/widget/BasemapGallery/images/dark.jpg'
          });
        default:
          return null;
        /*
        new Basemap({
          id: 'media',
          layers: [new BasemapLayer({
            url: 'http://tiles.arcgis.com/tiles/hRUr1F8lE8Jq2uJo/arcgis/rest/services/MediaBasemap/MapServer'
          })
          ],
          title: 'Media',
          thumbnailUrl: 'libs/widget/BasemapGallery/images/media.jpg'
          // feature service: http://services.arcgis.com/hRUr1F8lE8Jq2uJo/arcgis/rest/services/Media_State_Features/FeatureServer/0
        }),
        new Basemap({
          id: "toner",
          layers: [new BasemapLayer({
            url: "http://tiles.arcgis.com/tiles/hRUr1F8lE8Jq2uJo/arcgis/rest/services/MediaBasemap/MapServer"
          })
          ],
          title: "Toner",
          thumbnailUrl: "libs/widget/BasemapGallery/images/media.jpg"
          // feature service: http://services.arcgis.com/hRUr1F8lE8Jq2uJo/arcgis/rest/services/Media_State_Features/FeatureServer/0
        }),
        new Basemap({
          id: "watercolor",
          layers: [new BasemapLayer({
            url: "http://tiles.arcgis.com/tiles/hRUr1F8lE8Jq2uJo/arcgis/rest/services/MediaBasemap/MapServer"
          })
          ],
          title: "Watercolor",
          thumbnailUrl: "libs/widget/BasemapGallery/images/media.jpg"
          // feature service: http://services.arcgis.com/hRUr1F8lE8Jq2uJo/arcgis/rest/services/Media_State_Features/FeatureServer/0
        })*/
      }
    }

  });

});
