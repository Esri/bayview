/*    Copyright 2017 Esri

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License. */
    
 define([
  "require",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/_base/connect",
  "dojo/_base/Color",

  "dojo/debounce",
  "dojo/sniff",
  "dojo/dom-style",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/topic",
  "dojo/on",
  "dojox/gfx",

  "dijit/_Widget",
  "dijit/registry",
  "dijit/Menu",
  "dijit/MenuItem",
  'dijit/Tooltip',

  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/jsonUtils",

  "esri/geometry/geodesicUtils",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/graphic",

  "esri/tasks/AreasAndLengthsParameters",
  "esri/tasks/LengthsParameters",
  "esri/tasks/GeometryService",

  "esri/kernel",
  "esri/config",
  "esri/domUtils",
  "esri/numberUtils",
  "esri/lang",
  "esri/units",
  "esri/WKIDUnitConversion",
  "esri/SpatialReference",

  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",

  "esri/dijit/_EventedWidget", // will change to esri/widgets/Widget (#1760)
  //"dojo/text!./templates/Measurement.html",
  'dojo/text!./Measure/Measure.html',
  //'dojo/text!./Measure/measurement.html',
  "dojo/i18n!esri/nls/jsapi",

  // dijits in widget template
  "dijit/form/ToggleButton",
  "dijit/form/DropDownButton",
  "dijit/layout/ContentPane"
], function (
  require, declare, lang, array, connect, Color,
  debounce, has, domStyle, domClass, domConstruct, topic, on, gfx,
  _Widget, registry, Menu, MenuItem, Tooltip,
  PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, symbolJsonUtils,
  geodesicUtils, webMercatorUtils, Point, Polyline, Polygon, Graphic,
  AreasAndLengthsParameters, LengthsParameters, GeometryService,
  esriNS, esriConfig, domUtils, numberUtils, esriLang, esriUnits, wkidConverter,SpatialReference,
  _TemplatedMixin, _WidgetsInTemplateMixin,
  _EventedWidget, widgetTemplate, jsapiBundle
) {
  /**
   * This is the description for the constructor.
   * @extend module:dijit/_Widget
   * @constructor module:esri/widgets/Measurement
   * @param {Object} properties - properties for Measurement
   */
  var Measurement = declare([ _EventedWidget, _Widget,  _TemplatedMixin, _WidgetsInTemplateMixin], {
    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------
    /**
     * declaredClass Description
     * @type {string}
     * @private
     */
    declaredClass: "esri.dijit.Measurement",

    // Widget Props
    widgetsInTemplate: true,
    templateString: widgetTemplate,

    // Map Props
    _map: null,
    _geometryService: null,
    _interpolatedMap: null,

    // External Image Resources
    _mouseImgURL : null,
    _defaultPinURL : null,

    //---------------
    // Graphic Related
    _measureGraphics: [],
    _measureGraphic: null,
    _locationGraphic: null,
    _tempGraphic: null,
    _polylineGraphics: null,
    _polygonGraphic: null,
    _pointSymbol: null,
    _useDefaultPointSymbol : true,
    _defaultLineSymbol: null,
    _lineSymbol: null,
    _areaLineSymbol: null,
    _defaultFillSymbol: null,
    _fillSymbol: null,
    _borderlessFillSymbol: null,

    //---------------
    // Data - Strings & Numbers
    _inputPoints: [],
    _unitDictionary: [],

    /**
     * Number pattern for measurement results
     * @type {string}
     */
    numberPattern: "#,###,###,##0.0",

		/**
     * Result of the measurement operation
     * @type {(string|number)}
     */
    result: null,

    _defaultDistanceUnit: null,
    _defaultAreaUnit: null,
    _defaultLocationUnit: null,

		/**
     * String indicating the current distance unit
     * @type {string}
     */
    currentDistanceUnit: null,

		/**
     * String indicating the current area unit
     * @type {string}
     */
    currentAreaUnit: null,

    /**
     * String indicating the current location (point) unit
     * @type {string}
     */
    currentLocationUnit: null,

    _unitStrings: {},
    _locationUnitStrings: [],
    _locationUnitStringsLong: [],

    _distanceUnitStrings: [],
    _distanceUnitStringsLong: [],

    _areaUnitStrings: [],
    _areaUnitStringsLong: [],

    _calculatingMsg: null,
    _gsErrorMsg: null,

    // --Template Variable Strings
    _NLS_Lat: null,
    _NLS_Lon: null,

    //---------------
    // Handlers
    _mouseMoveMapHandler : null,
    _mouseClickMapHandler: null,
    _doubleClickMapHandler: null,
    _mouseDragMapHandler: null,
    _clickMapHandler: null,
    _mapExtentChangeHandler: null,
    _geometryAreaHandler: null,
    _snappingCallback: null,

    //---------------
    // User Interface
    _calcTimer: null,
    _buttonDijits: {},

    /**
     * String indicating the widgets previous active tool (if applicable)
     * @type {string}
     */
    previousTool: null,
    /**
     * String indicating the widgets active tool
     * @type {string}
     */
    activeTool: null,

    /**
     * Current longitude of the green marker symbol
     * @type {number}
     */
    markerLongitude: null,

		/**
     * Current latitude of the green marker symbol
     * @type {number}
     */
    markerLatitude: null,

    /**
     * Current longitude of the mouse
     * @type {number}
     */
    mouseLongitude: null,

    /**
     * Current latitude of the mouse
     * @type {number}
     */
    mouseLatitude: null,

    //---------------
    // Event Property Declaration (Legacy Style)
    //---------------
    _eventMap: {
      "measure-start": ["toolName", "unitName"],
      "measure": ["toolName", "geometry", "values", "unitName", "segmentLength"],
      "measure-end": ["toolName", "geometry", "values", "unitName"],
      "tool-change" : ["toolName", "unitName", "previousToolName"],
      "unit-change" : ["unitName", "toolName"]
    },
    //--------------------------------------------------------------------------
    //
    //  Lifecycle
    //
    //--------------------------------------------------------------------------

    /**
     * This is the description for the constructor.
     */
    constructor: function (params, srcNodeRef) {
      params = params || {};

      // Require a Map
      if (!params.map) {
        console.log("Unable to find the required 'map' property in widget parameters");
        return;
      }
      this._map = params.map;

      // Load Event
      // -- SpatialReference Check
      if (this._map.loaded) {
        // Update Spatial Reference and interpolation
        this._map.cs = this._checkCS(this._map.spatialReference);
        this._interpolatedMap = !(this._map.cs === "Web Mercator" || this._map.cs === "PCS");
      } else {
        var loadHandle = connect.connect(this._map, "onLoad", this, function () {
          // Disconnect Temporary Handler
          connect.disconnect(loadHandle);
          loadHandle = null;
          // Update Spatial Reference and interpolation
          this._map.cs = this._checkCS(this._map.spatialReference);
          this._interpolatedMap = !(this._map.cs === "Web Mercator" || this._map.cs === "PCS");
        });
      }

      // Geometry Service Default
      this._geometryService = esriConfig.defaults.geometryService;

      // Location Table Mouse Image Reference
      // -- Used by the Symbols for drawing and in the Location Result Table
      this._mouseImgURL = require.toUrl("./Measure/images/cursor16x24.png");
      this._defaultPinURL = require.toUrl("./Measure/images/esriGreenPin16x26.png");

      // Symbol Declaration for Line & Fill (Point handled separately below)
      // -- These are used by default if there are no constructor options for Line and Fill
      this._defaultLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 128, 255]), 3);
      this._defaultFillSymbol = new SimpleFillSymbol( SimpleLineSymbol.STYLE_SOLID,  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 128, 255]), 3), new Color([0,0,0, 0.5]));

      // If constructor object contains a Point symbol (Object), update widget to use it as default when drawing
      if (params.pointSymbol) {
        // Custom Point Symbol
        this._pointSymbol = params.pointSymbol;
        this._useDefaultPointSymbol = false;
      } else {
        this._pointSymbol = new PictureMarkerSymbol(this._defaultPinURL, 16, 26);
        this._pointSymbol.setOffset(0, 12);
      }

      // Fill Symbol Only Applies to Area Tool
      var fillSymbol = params.fillSymbol || this._defaultFillSymbol;
      this._fillSymbol = fillSymbol;

      // Fallback to _defaultLineSymbol to ensure area line is always available
      this._areaLineSymbol = fillSymbol.outline || this._defaultLineSymbol;

      // Borderless fill symbol should be derived from this._fillSymbol
      this._borderlessFillSymbol =  symbolJsonUtils.fromJson(fillSymbol.toJson());
      this._borderlessFillSymbol.setOutline(null);

      // Line Symbol for Distance Tool
      if (params.lineSymbol) {
        this._lineSymbol = params.lineSymbol;
      } else {
        this._lineSymbol = this._defaultLineSymbol;
      }

      // If Applicable, Override the Default Length Unit
      if (params.defaultLengthUnit) {
        this._defaultDistanceUnit = params.defaultLengthUnit;
      } else {
        this._defaultDistanceUnit = esriUnits.MILES;
      }
      // If Applicable, Override the Default Area Unit
      if (params.defaultAreaUnit) {
        this._defaultAreaUnit = params.defaultAreaUnit;
      } else {
        this._defaultAreaUnit = esriUnits.ACRES;
      }
      // If Applicable, Override the Default Location Unit
      if (params.defaultLocationUnit) {
        this._defaultLocationUnit = params.defaultLocationUnit;
      } else {
        this._defaultLocationUnit = esriUnits.DECIMAL_DEGREES;
      }

      // Snapping Manager Callback
      this._snappingCallback = lang.hitch(this, this._snappingCallback);

      // (Optional) Geometryfrom the Constructor
      if (params.geometry) {
        this._userGeometry = params.geometry;
      }

      // Timer used to show 'Calculating...' message when making call to GeometryService
      this._calcTimer  =  null;

      // Advanced Location Units
      // -- 10.3 Server Required for Proper Functionality
      this.advancedLocationUnits = params.advancedLocationUnits || false;

      // Internationalization Strings
      this._NLS_Lon = jsapiBundle.widgets.measurement.NLS_longitude;
      this._NLS_Lat = jsapiBundle.widgets.measurement.NLS_latitude;
      this._gsErrorMsg = jsapiBundle.widgets.measurement.NLS_geometry_service_error;
      this._calculatingMsg = jsapiBundle.widgets.measurement.NLS_calculating;

      // Used to prevent multiple length requests to the geometry service (on double-click)
      this._geometryServiceLength = debounce(this._geometryServiceLength, 250);

    },

    //--------------------------------------------------------------------------
    //
    //  Public Methods
    //
    //--------------------------------------------------------------------------

    startup: function () {

      // Moved data structure creation to outside function
      this._setupDictionaries();

      // Mouse image for Location Result Table
      domConstruct.create("img", {"src" : this._mouseImgURL, "style" : "vertical-align:middle"}, this.mouseCell);

      // Pin image for location result table
      if (this._useDefaultPointSymbol) {
        domConstruct.create("img", {"src" : this._defaultPinURL , "style" : "vertical-align:middle"}, this.pinCell);
      }else{
        this._drawPointGraphics(this.pinCell);
      }

      // Custom Measurement via constructor
      if (this._userGeometry) {
        if (this._map.loaded) {
           this._measureCustomGeometry();
        }else{
          // Wait for the map...
          var loadHandle = connect.connect(this._map, "onLoad", this, function () {
            connect.disconnect(loadHandle);
            loadHandle = null;
            this._measureCustomGeometry();
          });
        }
      }

      this._addTooltips();

      // Start the tool hidden
      this.hide();
      this.own(on(this.closeBtn, 'click', lang.hitch(this, function() {
          this.setTool(null);
          this.hide();
      })));

      this.own(on(this.btnClear, 'click', lang.hitch(this, function() {
        this.clearResult();
      })));
    },

    // Purpose:
    // -- Destroy the widget
    // -- Disconnects all events and remove children
    destroy: function () {
      this._resetToolState();
      this.clearResult();
      this.inherited(arguments);
      this._map = this._geometryService = this._measureGraphics = this._measureGraphic = this._tempGraphic = null;
    },

    // Purpose:
    // -- Public Method for enabling, disabling or changing the active tool
    // Params:
    // -- toolName (String) (location, distance or area)
    // -- activate/checked (boolean) (activate in the documentation)
    setTool: function (toolName, checked) {
      // Tool State Maintenance
      this.previousTool = this.activeTool || null;
      this._polylineGraphics = [];
      // Reset App State
      this._resetToolState();
      // Remove graphic representing area shadow
      if (this._polygonGraphic) {
        this._map.graphics.remove(this._polygonGraphic);
        this._polygonGraphic = null;
      }
      //var toggled = registry.byNode(this._buttonDijits[toolName].domNode).checked;
      //var toggled = true;
      domStyle.set(this._unitDropDown.domNode, "visibility", "visible");
      // Hide by Default
      // _buttonDijits is an Object
      //registry.byNode(this._buttonDijits.area.domNode).set("checked", false);
      //registry.byNode(this._buttonDijits.distance.domNode).set("checked", false);
      //registry.byNode(this._buttonDijits.location.domNode).set("checked", false);

      // Get Update State for Tool
    //   if (checked === true || checked === false) {
    //     toggled = checked;
    //   }
        var toggled;
        if (toolName === this.activeTool && domClass.contains(this._areaButton, 'is-active')) {
            toggled = false;
        } else {
            toggled = true;
        }
      // Update Tool State
      //registry.byNode(this._buttonDijits[toolName].domNode).set("checked", toggled);
      // Hide Location Results Table by default
      this._toggleLocationResultsTable(false, true);
      // If tool is being shown...
      if (toggled) {
        // Change the activeTool property to reflect user choice
        this.activeTool = toolName;
        // Capture current map state before disabling double-click zoom.
        // We'll re-enable it in _resetToolState below -Jian
        this._dblClickZoom = this._map.isDoubleClickZoom;
        if (this._dblClickZoom) {
          this._map.disableDoubleClickZoom();
        }
        // Enable tool via toolName function param
        if (toolName === "area") {
          this._setupAreaTool();
        }
        else if (toolName === "distance") {
          this._setupDistanceTool();
        }
        else if (toolName === "location") {
          this._setupLocationTool();
        }
        // Set up Snapping Manager
        if (this._map.snappingManager) {
          this._map.snappingManager._startSelectionLayerQuery();
          this._map.snappingManager._setUpSnapping();
        }
      }else{
        // Hiding tool; disable button in UI
        this.activeTool = null;
        // Hide the Drop-down Menu
        domStyle.set(this._unitDropDown.domNode, "visibility", "hidden");
        this._clearActiveTool();

        // this._clearSelectedTool();
      }
      // Emit tool-change event with applicable data
      if (this.activeTool !==  this.previousTool) {
        this.onToolChange(this.activeTool, this.getUnit(), this.previousTool);
      }
    },

    // Purpose:
    // -- public entry point function for manual measurement, will trigger measure-end upon completion
    // Params:
    // -- shape.geometry(Point, Polyline or Polygon Object)
    measure: function (geometry) {
      if (!geometry) { return; }
      this._userGeometry = geometry;
      this._measureCustomGeometry();
    },

    // _clearSelectedTool: function() {
    //     this.activeTool = null;
    //     this.setTool(null);
    //     domClass.remove(this._areaButton, 'is-active');
    // },

    // Purpose:
    // -- Clears application state variables relating to measurement result
    clearResult: function () {
      var map = this._map, i;

      this.result = 0;
      this.resultValue.setContent("&nbsp");

      for (i = 0; i < this._measureGraphics.length; i++) {
        map.graphics.remove(this._measureGraphics[i]);
      }

      this._measureGraphic = null;
      this._measureGraphics = [];
      map.graphics.remove(this._tempGraphic);

      connect.disconnect(this._mouseMoveMapHandler);
      this._mouseMoveMapHandler = null;
    },

    // Purpose:
    // -- Shows the Widget
    show: function () {
      domUtils.show(this.domNode);
    },

    // Purpose:
    // -- Hides the Widget
    hide: function () {
      domUtils.hide(this.domNode);
      topic.publish('/ToolList/unselected', this, {
          type: null
      });
    },

    // Purpose:
    // -- shows a tool's button, specified by a single parameter
    // Parameters:
    // -- toolname (String)
    showTool: function (toolName) {
      domStyle.set(this._buttonDijits[toolName].domNode, "display", "inline-block");
    },

    // Purpose:
    // -- hides a tool's button, specified by a single parameter
    // Parameters:
    // -- toolname (String)
    hideTool: function (toolName) {
      domStyle.set(this._buttonDijits[toolName].domNode, "display", "none");
    },

    // Purpose:
    // -- returns the currently active tool and unit associated with that tool
    // Returns:
    // -- Object { toolName (String), unitName (String) }
    getTool: function () {
      if (this.activeTool) {
        return {"toolName": this.activeTool, "unitName" : this.getUnit()};
      }
    },

    isActiveTool: function() {
        return this.activeTool ? true : false;
    },

    // Purpose:
    // -- returns the unit associated with the current tool
    // Returns:
    // -- unitName (String)
    getUnit: function () {
      if (this._unitDropDown.label !== "unit") {
        return this._unitDropDown.label;
      }
    },


    //--------------------------------------------------------------------------
    //
    //  Private Methods
    //
    //--------------------------------------------------------------------------
    _addTooltips: function() {
      new Tooltip({
        connectId: [this._areaButton],
        label: 'Area',
        position: ['below'],
        showDelay: 0
      });
      new Tooltip({
        connectId: [this._distanceButton],
        label: 'Distance',
        position: ['below'],
        showDelay: 0
      });
      new Tooltip({
        connectId: [this._locationButton],
        label: 'Location',
        position: ['below'],
        showDelay: 0
      });
    },

    //--------------------------------------------------------------------------
    //
    //  Location Methods
    //
    //--------------------------------------------------------------------------

    // Purpose:
    // -- Used internally by setTool()
    // -- Connects event-handlers and creates unit drop-down for the Location Tool
    _setupLocationTool: function () {

      this._map.navigationManager.setImmediateClick(true);

      // Manage previous graphic
      this._measureGraphics = [];
      this._map.graphics.remove(this._locationGraphic);

      // Generate the Drop-down
      this._createLocationUnitList();

      // Calculate the result
      if (this._map.cs === "PCS") {
        this._projectMapExtent(this._map.extent);
        this._mapExtentChangeHandler = connect.connect(this._map, "onExtentChange", lang.hitch(this, this._projectMapExtent));
      }

      // Connect Events
      this._clickMapHandler = connect.connect(this._map, "onClick", this, "_locationClickHandler");

      var isAdvUnit = !(
          this.currentLocationUnit === "esriDegreeMinuteSeconds" ||
          this.currentLocationUnit === "esriDecimalDegrees"
      );

      if (!isAdvUnit) {
        this._mouseMoveMapHandler = connect.connect(this._map, "onMouseMove", this, "_locationMoveHandler");
      }

    },

    // Purpose:
    // -- onClick event for Location Tool Button in Template
    _locationButtonToggle: function () {
    //   this.clearResult();
    //   this.setTool("location");

      this.clearResult();
      if (this.activeTool === "location") {
          domClass.remove(this._locationButton, 'is-active');
          this.setTool(null);
      } else {
          this._clearActiveTool();
          domClass.add(this._locationButton, 'is-active');
          this.setTool("location");
      }
    },

    _clearActiveTool: function() {
        domClass.remove(this._areaButton, 'is-active');
        domClass.remove(this._locationButton, 'is-active');
        domClass.remove(this._distanceButton, 'is-active');
    },

    // Purpose:
    // -- Handler used to trigger measurement of a Location(Point) from the widget constructor
    // -- Added in 3.11
    _measureCustomPoint: function () {
      this.setTool("location", true);
      // Coordinate System Conversion Check
      if (this._map.cs === "Web Mercator" && this._userGeometry.spatialReference !== this._map.spatialReference) {
        this._userGeometry = webMercatorUtils.geographicToWebMercator(this._userGeometry);
      }
      // Create the Graphic
      this._measureGraphic = new Graphic();
      this._measureGraphic.setSymbol(this._pointSymbol);
      this._measureGraphic.setGeometry(this._userGeometry);
      // Save Reference to Graphic
      this._measureGraphics.push(this._measureGraphic);
      // Add Graphic to the Map
      this._map.graphics.add(this._measureGraphic);
      // Trigger Measurement
      // -- Treat as click and don't show as mouse coords
      this._calculateLocation(this._userGeometry, true);
    },

    // Purpose:
    // -- Callback for location measurement
    // Params:
    // -- point<Object>, showClick (not drag or double-click)
    _calculateLocation:function (point, showClick) {
      // 3.11/3.12 Enhancement for Advanced Location Units
      var isAdvUnit = !(
          this.currentLocationUnit === "esriDegreeMinuteSeconds" ||
          this.currentLocationUnit === "esriDecimalDegrees"
      );
      // Last minute check to make sure the move event is disabled...
      if (isAdvUnit && this._mouseMoveMapHandler) {
        connect.disconnect(this._mouseMoveMapHandler);
        this._mouseMoveMapHandler = null;
      }
      // Reference Issue
      var mapPoint = lang.clone(point);
      // Geometry Service required for accurate projection
      if (showClick) {
        // 3.16 - Added additional wkid check when map.cs is GCS
        if (this.map.cs !== "Web Mercator" && (this.map.spatialReference && this.map.spatialReference.wkid !== 4326)) {
          this._projectLocation(mapPoint, isAdvUnit);
          return;
        }else{
          this._updateMarkerLocation(mapPoint.x, mapPoint.y);
        }
      }
      // Update the Point
      mapPoint = this._getGCSLocation(mapPoint);
      this._advancedLocationDisplayHandler(mapPoint, isAdvUnit, showClick);
    },

    // Purpose:
    // -- Handles geometry service projection call
    // Params:
    // -- point<Object>, isAdvUnit<Boolean>
    _projectLocation: function (point, isAdvUnit) {
      // Takes a point and uses the geometry service to project to Web-Mercator
      this._geometryService.project([point], new SpatialReference({wkid: 4326}),
        lang.hitch(this, function (features) {
          this._advancedLocationDisplayHandler(features[0], isAdvUnit, true);
        }),
        lang.hitch(this, function (err) {
          console.log(this._gsErrorMsg, err);
        })
      );
    },

    // Purpose:
    // --
    // Params:
    // --
    _advancedLocationDisplayHandler: function (point, isAdvUnit, showClick) {
      var displayValues;
      // Simple Conversion for Degrees or DMS
      if (!isAdvUnit) {
        // CalculateXY is for points already converted to Web-Mercator
        displayValues = this._calculateXY(point.x, point.y);
        // Update UI depending on click vs move/drag
        // -- Mouse location will always equal static location if the event was a click
        if (showClick) {
          this._updateClickLocation(displayValues[0], displayValues[1]);
          this.onMeasureEnd(this.activeTool, point, [displayValues[0], displayValues[1]], this.getUnit());
        }
        else {
          this._updateMouseLocation(displayValues[0], displayValues[1]);
        }
      }
      else {
        // MGRS, USNG, UTM, Georef, and GARS calculations require a 10.3+ geometry service
        this._updateGeocoordinateStringLocation({
          coordinates: [[point.x, point.y]],
          sr: { wkid: 4326 },
          conversionType: this._unitStrings[this.currentLocationUnit]
        }, point);
      }
    },

    // Purpose:
    // -- For Application State, used internally on unit-change for re-calculation of values
    // Params:
    // -- x (String | Integer) and y (String | Integer)
    _updateMarkerLocation: function (x, y) {
      this.markerLocationX = x;
      this.markerLocationY = y;
    },

    // Purpose:
    // -- Replacement Function for _outputLocationResult()
    // -- Updates Mouse Cells
    // Params:
    // -- x,y
    _updateMouseLocation: function (x, y) {
      this.mouseLongitude.innerHTML = x;
      this.mouseLatitude.innerHTML= y;
    },

    // Purpose:
    // -- Updates Marker Cells (click)
    // Params:
    // -- x,y
    _updateClickLocation: function (x, y) {
      // Static Location will always update/reflect the Mouse Location on click
      this._updateMouseLocation(x, y);
      this.markerLongitude.innerHTML = x;
      this.markerLatitude.innerHTML =  y;
    },

    // Purpose:
    // -- Handles toGeoCoordinateString() server call for location measurement
    // Params:
    // -- params<Object>, geometry<Object>
    // -- params{coordinates, sr, conversionType}
    _updateGeocoordinateStringLocation: function (params, geometry) {
      //this.resultValue.domNode.innerHTML = "&nbsp";
      this.resultValue.setContent("&nbsp");
      // Server Conversion
      this._geometryService.toGeoCoordinateString(params, lang.hitch(this, function (results) {
        // Timer for Calculating Message
        clearTimeout(this._calcTimer);
        // Check if results were returned
        // Update the UI with the result
        // Measurement complete
        if (results) {
          this.resultValue.setContent(results[0]);
          this.onMeasureEnd(this.activeTool, geometry, results, this.getUnit());
        }
        else {
          this.resultValue.setContent(this._gsErrorMsg);
          this.onMeasureEnd(this.activeTool, null, null, this.getUnit());
        }
      }));
      // Reset Timer
      clearTimeout(this._calcTimer);
      // Only show Calculating message if response takes longer than one second.
      this._calcTimer = setTimeout(lang.hitch(this, function () {
        this.resultValue.setContent(this._calculatingMsg);
      }, 1000));
    },

    // Purpose:
    // --
    // Params:
    // --
    // Returns:
    // --

    // Used when unit used to measure a location is changed
    // Re-factored at 3.11
    // Cleaned up at 3.12
    _switchLocationUnit: function (unit) {
      // Update Unit Label
      registry.byNode(this._unitDropDown.domNode).set("label", this._unitStrings[unit]);
      // Update App State
      this.currentLocationUnit = unit;
      // Disconnect the Mouse
      connect.disconnect(this._mouseMoveMapHandler);
      this._mouseMoveMapHandler = null;
      // 3.11 Event
      this.onUnitChange(this._unitStrings[unit], this.activeTool);
      // this.emit("unit-change", ) // TODO
      // Check if Geometry Service Required
      if (unit === "esriDegreeMinuteSeconds" || unit === "esriDecimalDegrees") {
        // Reconnect MouseMove Event
        this._mouseMoveMapHandler = connect.connect(this._map, "onMouseMove", this, "_locationMoveHandler");
        // Show the Table
        this._toggleLocationResultsTable(true, false);

        if (this._locationGraphic) {
          // If a location graphic exists, use it for calculation process
          this._calculateLocation(this._locationGraphic.geometry, true);
        }
      }
      else {
        this._toggleLocationResultsTable(false, false);

        if (this.resultValue === null || (this.markerLocationX === null && this.markerLocationY === null)) {
          return;
        }

        if (this._locationGraphic) {
          // Convert point for proper service call
          var point = this._getGCSLocation(this._locationGraphic.geometry);

          this._updateGeocoordinateStringLocation({
            coordinates: [[point.x, point.y]],
            sr: { wkid: 4326 },
            conversionType: this._unitStrings[unit]
          }, this._locationGraphic.geometry);
        }
      }
    },

    // Purpose:
    // -- Handles state of the results table for location measurements
    // Params:
    // -- showTable<Boolean>, resetValues<Boolean>
    _toggleLocationResultsTable: function (showTable, resetValues) {
      // Clear Results Fields
      if (resetValues) {
        this.resultValue.setContent("&nbsp");
        this.markerLongitude.innerHTML = "---";
        this.markerLatitude.innerHTML = "---";
        this.mouseLongitude.innerHTML = "---";
        this.mouseLatitude.innerHTML = "---";
      }

      // Toggle Table
      if (showTable) {
        domUtils.show(this.resultTable.domNode);
        domUtils.hide(this.resultValueContainer.domNode);
      }
      else {
        domUtils.hide(this.resultTable.domNode);
        domUtils.show(this.resultValueContainer.domNode);
        connect.disconnect(this._mouseMoveMapHandler);
      }
      // Toggle Mouse Movement Result Cells
      if (this._map.cs === "PCS") {
        domUtils.hide(this._mouseRow);
      }
    },

    //--------------------------------------------------------------------------
    //
    //  Distance Methods
    //
    //--------------------------------------------------------------------------

    // Purpose:
    // -- Used internally by setTool()
    // -- Connects event-handlers and creates unit drop-down for the Distance Tool
    _setupDistanceTool: function () {

      this._map.navigationManager.setImmediateClick(true);
      // Projection Test
      if (this._map.cs === "PCS") {
        this._projectMapExtent(this._map.extent);
        this._mapExtentChangeHandler = connect.connect(this._map, "onExtentChange", this, "_projectMapExtent");
      }
      // Generate the Drop-down
      this._inputPoints = [];
      this._createDistanceUnitList();
      // Connect Events
      this._mouseClickMapHandler = connect.connect(this._map, "onClick", this, "_measureDistanceMouseClickHandler");
      this._doubleClickMapHandler = connect.connect(this._map, "onDblClick", this, "_measureDistanceDblClickHandler");
    },

    // Purpose:
    //  -- onClick event for Distance Tool Button in Template
    _distanceButtonToggle: function () {
    //   this.clearResult();
    //   this.setTool("distance");

      this.clearResult();
      if (this.activeTool === "distance") {
          domClass.remove(this._distanceButton, 'is-active');
          this.setTool(null);
      } else {
          this._clearActiveTool();
          domClass.add(this._distanceButton, 'is-active');
          this.setTool("distance");
      }
    },

    // Purpose:
    // -- Handler used to trigger measurement of an Distance(Polyline) from the widget constructor
    // -- Added in 3.11
    _measureCustomDistance: function () {
      // Geometry must have more than one path
      if (this._userGeometry.paths[0].length > 1) {
        // App State
        this.setTool("distance", true);
        this._inputPoints = [];
        // Loop through the Paths to get Point data
        array.forEach(this._userGeometry.paths[0], lang.hitch(this, function (p, idx) {
          // Get Points
          this._inputPoints.push(p);
          // Create Point Graphics
          var pointGraphic = new Graphic(new Point(p[0], p[1],  this._userGeometry.spatialReference), this._pointSymbol);
          // Save for generic removal on tool re-use
          this._measureGraphics.push(pointGraphic);
          this._map.graphics.add(pointGraphic);
          // If first point, return so result isn't calculated ( 0 minus 1)
          if (idx === 0) { return; }
          this.result += this._geodesicDistance(p,  this._userGeometry.paths[0][idx-1]);
        }));
        // Create the Graphic
        this._measureGraphic = new Graphic();
        this._measureGraphic.setSymbol(this._lineSymbol);
        this._measureGraphics.push(this._measureGraphic);
        // Geodesic Densify, update and add to the map's graphics layer
        this._userGeometry = this._densifyGeometry(this._userGeometry);
        this._measureGraphic.setGeometry( this._userGeometry );
        this._map.graphics.add(this._measureGraphic);
        // App State
        this._inputPoints = [];
        var finalResult = this._outputResult(this.result, this.getUnit());
        this.onMeasureEnd(this.activeTool, this._userGeometry, finalResult, this.getUnit());
      }
    },

    // Purpose:
    // -- Displays the distance result
    // Params:
    // -- distance<String|Number>
    _showDistance: function (distance) {
      if (distance) {
        this._outputResult(distance, registry.byNode(this._unitDropDown.domNode).label);
      }
    },

    //--------------------------------------------------------------------------
    //
    //  Area Methods
    //
    //--------------------------------------------------------------------------

    // Purpose:
    // -- Used internally by setTool()
    // -- Connects event-handlers and creates unit drop-down for the Area Tool
    _setupAreaTool: function () {

      this._map.navigationManager.setImmediateClick(true);
      // Generate the Dropdown
      this._inputPoints = [];
      this._createAreaUnitList();
      // Add Graphic to the Map
      this._tempGraphic = new Graphic();
      this._tempGraphic.setSymbol(this._areaLineSymbol);
      this._tempGraphic.setGeometry(new Polyline(this._map.spatialReference));
      this._map.graphics.add(this._tempGraphic);
      // Calculate the result
      if (this._map.cs === "PCS") {
        this._geometryAreaHandler = connect.connect(this._geometryService, "onAreasAndLengthsComplete", this, "_outputArea");
      }
      // Connect Mouse Events
      this._mouseClickMapHandler = connect.connect(this._map, "onClick", this, "_measureAreaMouseClickHandler");
      this._doubleClickMapHandler = connect.connect(this._map, "onDblClick", this, "_measureAreaDblClickHandler");
    },

    // Purpose:
    // -- onClick event for Area Tool Button in Template
    _areaButtonToggle: function () {
        //console.debug('Measure: Area Button - CLICK', this._buttonDijits.area);

      this.clearResult();
      if (this.activeTool === "area") {
          domClass.remove(this._areaButton, 'is-active');
          this.setTool(null);
      } else {
          this._clearActiveTool();
          domClass.add(this._areaButton, 'is-active');
          this.setTool("area");
      }
    },

    // Purpose:
    // -- Creates a polygon object from connecting paths (lines)
    // Returns:
    // -- Polygon (Object)
    _generatePolygonFromPaths: function () {
      var pathsArr = [];
      // Get all paths into a flat array
      array.forEach(this._polylineGraphics, lang.hitch(this, function (g) {
        array.forEach(g.geometry.paths, lang.hitch(this, function (p) {
          array.forEach(p, lang.hitch(this, function (c) {
            pathsArr.push(c);
          }));
        }));
      }));
      pathsArr.push(pathsArr[0]);
      // Generate the polygon from polyline paths
      var polygon = new Polygon(this._map.spatialReference);
      polygon.addRing(pathsArr);
      // Create the Graphic
      var pGeometry = this._densifyGeometry(polygon);
      var pGraphic = new Graphic();
      pGraphic.setGeometry(pGeometry);
      //pGraphic.setSymbol(this._defaultFillSymbol);
      pGraphic.setSymbol(this._borderlessFillSymbol);
      this._measureGraphic = pGraphic;
      this._measureGraphics.push(pGraphic);
      return pGraphic;
    },

    // Purpose:
    // --
    // Params:
    // -- shape.geometry (Object)
    _getArea: function (geometry) {
      var geographicGeometries = [];
      var areasAndLengthParams = new AreasAndLengthsParameters();
      areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;
      //"geodesic" is only available for 10.1 and above geometry service.
      //If users provide prior 10.1 service, it will use planar.
      areasAndLengthParams.calculationType = "geodesic";
      //if self intersecting, simplify using geometry service
      if (Polygon.prototype.isSelfIntersecting(geometry)) {
        //if self intersecting, simplify using geometry service
        this._geometryService.simplify([geometry], lang.hitch(this, function (simplifiedGeometries) {
          array.forEach(simplifiedGeometries, lang.hitch(this, function (simplifiedGeometry) {
            if (this._map.cs === "PCS") {
              areasAndLengthParams.polygons = simplifiedGeometries;
              this._geometryService.areasAndLengths(areasAndLengthParams);
              return;
            } else if (this._map.cs === "Web Mercator") {
              simplifiedGeometry = webMercatorUtils.webMercatorToGeographic(simplifiedGeometry);
            }
            geographicGeometries.push(simplifiedGeometry);
          }));
          var areas = geodesicUtils.geodesicAreas(geographicGeometries, esriUnits.SQUARE_METERS);
          this._showArea(areas[0]);
        }));
      } else {
        if (this._map.cs === "Web Mercator") {
          geometry = webMercatorUtils.webMercatorToGeographic(geometry);
        }
        geographicGeometries.push(geometry);
        if (this._map.cs === "PCS") {
          areasAndLengthParams.polygons = geographicGeometries;
          this._geometryService.areasAndLengths(areasAndLengthParams);
          return;
        }
        var areas = geodesicUtils.geodesicAreas(geographicGeometries, esriUnits.SQUARE_METERS);
        this._showArea(Math.abs(areas[0]));
      }
    },

    // Purpose:
    // -- Handler for showing Measurement result for an Area
    // -- Positive (Absolute) Value of the Area is Assumed/Forced
    // Params:
    // --  _geometryService.areasAndLengths() result object
    _outputArea: function (result) {
      this._showArea(Math.abs(result.areas[0]));
    },

    // Purpose:
    // -- Displays area result and fires measure related events
    // Params:
    // --
    _showArea: function (area) {
      if (area) {
        this.result = area;
        var unit = registry.byNode(this._unitDropDown.domNode).label;
        var finalResult = this._outputResult(this.result, unit);
        // Measurement End Check
        if (this._mouseMoveMapHandler) {
          this.onMeasure(this.activeTool, this._measureGraphic.geometry, finalResult, this.getUnit(), null);
          //this.emit("measure", "TODO");
        }else{
          this.onMeasureEnd(this.activeTool, this._measureGraphic.geometry, finalResult, this.getUnit());
          //this.emit("measure-end", "TODO");
        }
      }
    },

    // Purpose:
    // -- Handler used to trigger measurement of an Area(Polygon) from the widget constructor
    // -- Added in 3.11
    _measureCustomArea: function () {

      // App State
      this.setTool("area", true);
      this._inputPoints = [];
      // Geodesic Densify
      var pGeometry = this._densifyGeometry(this._userGeometry);
      // Create the Graphic
      this._measureGraphic = new Graphic();
      this._measureGraphic.setGeometry(pGeometry);
      this._measureGraphic.setSymbol(this._fillSymbol);
      // Save Reference to Graphic
      this._measureGraphics.push(this._measureGraphic);
      // Add Graphic to the Map
      this._map.graphics.add(this._measureGraphic);
      // Start Area Measurement Logical Process
      this._getArea(pGeometry);
      // App State
      this._inputPoints = [];
    },

    //--------------------------------------------------------------------------
    //
    //  Helper Methods
    //
    //--------------------------------------------------------------------------

    // Purpose:
    // -- Disconnects tool specific events
    // -- Also handles resetting Snapping Manager connections
    _resetToolState: function () {

      var map = this._map;
      map.navigationManager.setImmediateClick(false);

      // Hook up Zoom
      if (this._dblClickZoom) {
        map.enableDoubleClickZoom();
      }

      // Clear out unit drop-down
      this._inputPoints = [];

      // TODO - replace connect.disconnect
      // Disconnect Mouse Handlers
      connect.disconnect(this._mouseClickMapHandler);
      connect.disconnect(this._mouseMoveMapHandler);
      connect.disconnect(this._doubleClickMapHandler);
      connect.disconnect(this._mouseDragMapHandler);
      connect.disconnect(this._clickMapHandler);
      connect.disconnect(this._mapExtentChangeHandler);
      connect.disconnect(this._geometryAreaHandler);

      // Nullify Handlers in case of full destroy()
      this._mouseClickMapHandler = this._mouseMoveMapHandler = this._doubleClickMapHandler =
      this._mouseDragMapHandler = this._clickMapHandler = this._mapExtentChangeHandler =
      this._geometryAreaHandler = null;

      // Remove Snapped Graphic
      // -- Required before disconnecting Snapping Manager
      if (map.snappingManager && map.snappingManager._snappingGraphic) {
        map.graphics.remove(map.snappingManager._snappingGraphic);
      }

      // Disconnect the Snapping Manager
      if (this._map.snappingManager) {
        this._map.snappingManager._stopSelectionLayerQuery();
        this._map.snappingManager._killOffSnapping();
      }

      // IE10 Fix
      if (this._unitDropDown._opened) {
        this._unitDropDown.closeDropDown();
      }
    },

    // Purpose:
    // -- Handler for manual/custom measurement workflow
    // Used when geometry is passed in via the widget constructor or public measure() function
    // Added in 3.11
    _measureCustomGeometry: function () {
      this.clearResult();
      switch(this._userGeometry.type) {
        case "point":
          this._measureCustomPoint();
          break;
        case "polyline":
          this._measureCustomDistance();
          break;
        case "polygon":
          this._measureCustomArea();
          break;
        default:
          break;
      }
    },

    // Purpose:
    // -- Densifies geometry based on coordinate system
    // -- TODO ... replace in 4x
    // Params:
    // -- shape.geometry (Object)
    // Returns:
    // -- densifiedLine
    _densifyGeometry: function (geom) {
      if (this._map.cs === "Web Mercator") {
        geom = webMercatorUtils.webMercatorToGeographic(geom);
      }
      var densifiedLine;
      if (this._map.cs === "PCS") {
        densifiedLine = geom;
      } else {
        densifiedLine = geodesicUtils.geodesicDensify(geom, 500000);
      }
      if (this._map.cs === "Web Mercator") {
        densifiedLine = webMercatorUtils.geographicToWebMercator(densifiedLine);
      }
      return densifiedLine;
    },

    // Purpose:
    // -- Calculates the geodesic distance between two points
    // Params:
    // -- Point<Object>, Point<Object>
    // Returns:
    // -- distance<Number>
    _geodesicDistance: function (pt1, pt2) {
      //if there are two input points call the geometry service and perform the distance operation
      var polyline = new Polyline(this._map.spatialReference);
      if (this._map.cs === "PCS") {
        pt1 = this._getGCSLocation(pt1);
        pt2 = this._getGCSLocation(pt2);
      }
      polyline.addPath([pt1, pt2]);
      if (this._map.cs === "Web Mercator") {
        polyline = webMercatorUtils.webMercatorToGeographic(polyline);
      }
      return geodesicUtils.geodesicLengths([polyline], esriUnits.METERS)[0];
    },

    // Purpose:
    // -- Replacement Function for calculateValueToDisplay()
    // Params:
    // -- x,y
    // Returns:
    // --  Array[longitude, latitude]
    _calculateXY: function (x, y) {
      var localeStrings = jsapiBundle.widgets.measurement,
        scale = this._map.getScale(),
        lon, lat, precision;

      // Check if Degrees or DMS
      if (this.getUnit() === localeStrings.NLS_decimal_degrees) {
        // #3192 - Implement dynamic rounding
        if (scale >= 500) {
          precision = 6;
        }
        else if (scale < 500 && scale >= 50) {
          precision = 7;
        }
        else if (scale < 50 && scale >= 5) {
          precision = 8;
        }
        else {
          precision = 9;
        }

        lon = x.toFixed(precision);
        // Round to 180/-180 for non-wrappable
        if (!this._map.spatialReference._isWrappable()) {
          lon = this._roundX(lon);
        }

        lon = numberUtils.format(lon);
        lat = numberUtils.format(this._roundY(y.toFixed(precision)));

      }
      else if (this.getUnit() === localeStrings.NLS_deg_min_sec) {
        var negativeX = false,
          negativeY = false,
          degreesLat,
          degreesLon,
          minutesLat,
          minutesLon,
          secondsLat,
          secondsLon;

        // #3359 - Implement dynamic rounding
        if (scale >= 90000) {
          precision = 0;
        }
        else if (scale < 90000 && scale >= 9000) {
          precision = 1;
        }
        else if (scale < 9000 && scale >= 900) {
          precision = 2;
        }
        else if (scale < 900 && scale > 90) {
          precision = 3;
        }
        else {
          precision = 4;
        }

        // Convert for formula below, save Number State
        if (x < 0) {
          negativeX = true;
          x = Math.abs(x);
        }
        if (y < 0) {
          negativeY = true;
          y = Math.abs(y);
        }

        y = this._roundY(y);
        // Round to 180/-180 for non-wrappable
        if (!this._map.spatialReference._isWrappable()) {
          x = this._roundX(x);
        }

        //String Conversion for Degrees
        degreesLat = Math.floor(y) + "\u00B0";
        degreesLon = Math.floor(x) + "\u00B0";

        minutesLat = Math.floor(this._getDegreeMinutes(y)) + "'";
        minutesLon = Math.floor(this._getDegreeMinutes(x)) + "'";

        secondsLat = numberUtils.format(this._getDegreeSeconds(y).toFixed(precision)) + '"';
        secondsLon = numberUtils.format(this._getDegreeSeconds(x).toFixed(precision)) + '"';

        // Combine the Strings for Display
        lat = degreesLat + minutesLat + secondsLat;
        lon = degreesLon + minutesLon + secondsLon;

        // Conversion Fix
        if (negativeX) { lon = "-" + lon; }
        if (negativeY) { lat = "-" + lat; }
      }
      return [lon, lat];
    },

    _getDegreeMinutes: function (value) {
      return (value - Math.floor(value)) * 60;
    },

    _getDegreeSeconds: function (value) {
      return ((value - Math.floor(value)) * 60 - Math.floor((value - Math.floor(value)) * 60)) * 60;
    },

    // Purpose:
    // -- Rounds latitude to expected bounds
    // Params:
    // -- y value
    // Returns:
    // -- rounded y value
    // Rounds Latitude to remain within 90/-90 vertical boundary
    _roundY: function (latY) {
      if ( latY > 90 )
      { latY = 90;}
      else if ( latY < -90 )
      { latY = -90; }
      return latY;
    },

    // Purpose:
    // -- Rounds longitude to expected bounds
    // Params:
    // -- x value
    // Returns:
    // -- rounded x value
    // Rounds Longitude to remain within 180/-180 horizontal boundary
    _roundX: function (lonX) {
      if ( lonX > 180 )
      { lonX = 180; }
      else if ( lonX < -180 )
      { lonX = -180; }
      return lonX;
    },

    // Purpose:
    // -- Attempts to calculate the GCS location of a point based on the maps current extent
    // Params:
    // -- Point<Object>
    // Returns:
    // -- Point<Object>
    _getGCSLocation: function (pt) {
      var mapPt = lang.clone(pt);
      if (this._map.cs === "Web Mercator") {
        mapPt = webMercatorUtils.webMercatorToGeographic(mapPt);
      } else if (this._map.cs === "PCS") {
        if (this._map._newExtent) {
          var ratioX = Math.abs((this._map._newExtent.xmax - this._map._newExtent.xmin) / (this._map.extent.xmax - this._map.extent.xmin));
          var ratioY = Math.abs((this._map._newExtent.ymax - this._map._newExtent.ymin) / (this._map.extent.ymax - this._map.extent.ymin));
          var newX = (mapPt.x - this._map.extent.xmin) * ratioX + this._map._newExtent.xmin;
          var newY = (mapPt.y - this._map.extent.ymin) * ratioY + this._map._newExtent.ymin;
          mapPt = new Point(newX, newY, this._map.spatialReference);
        }else{
          // do nothing
        }
      }else{
        mapPt = mapPt.normalize();
      }
      return mapPt;
    },

    // Purpose:
    // -- Broken...
    // -- CLEAN UP
    // Params:
    // -- extent<Object>
    _projectMapExtent: function (extent) {
      // the mouse move and drag events will be associated only when projection process finishes
      // - Jian from pre 3.10
      var graphic = new Graphic(extent);
      var outSR = new SpatialReference({
        wkid: 4326
      });

      this._geometryService.project([graphic.geometry], outSR, lang.hitch(this, function (features) {
        //after projection, reconnect mouse move/drag events
        if (!this._mouseMoveMapHandler && this.activeTool === "location") {
          // Only reconnect if unit supports mousemove calculation
          if (this.currentLocationUnit === "esriDegreeMinuteSeconds" || this.currentLocationUnit === "esriDecimalDegrees") {
            this._mouseMoveMapHandler = connect.connect(this._map, "onMouseMove", lang.hitch(this, this._locationMoveHandler));
          }
          this._mouseMoveMapHandler = connect.connect(this._map, "onMouseMove", lang.hitch(this, this._locationMoveHandler));
        }
        this._map._newExtent = features[0];
      }));
    },

    // Purpose:
    // -- Determines the map's coordinate system
    // Params:
    // -- SpatialReference {Object}
    // Returns:
    // -- String
    // Returns coordinate system of given spatial reference, represented as a string
    _checkCS: function (spatialReference) {
      if (spatialReference.wkid) {
        if (spatialReference.wkid === 3857 || spatialReference.wkid === 102100 || spatialReference.wkid === 102113) {
          return "Web Mercator";
        }
        if (esriLang.isDefined(wkidConverter[spatialReference.wkid])) {
          return "PCS";
        }
        return "GCS";
      }
      if (spatialReference.wkt) {
        if (spatialReference.wkt.indexOf("WGS_1984_Web_Mercator") !== -1) {
          return "Web Mercator";
        }
        if (spatialReference.wkt.indexOf("PROJCS") === 0) {
          return "PCS";
        }
        return "GCS";
      }
    },

    // Purpose:
    // -- Used to activate a tool switch for distance and area
    // -- Location tool uses its own switch function _switchLocationUnit
    // -- Would like to Refactor for 4.x
    // Params:
    // -- unit<String>
    _switchUnit: function (unit) {
      // Update Unit Reference
      if (this.activeTool === "distance") {
        this.currentDistanceUnit = unit;
      }else if (this.activeTool === "area") {
        this.currentAreaUnit = unit;
      }else if (this.activeTool === "location") {
        this.currentLocationUnit = unit;
      }
      // Output result to UI
      registry.byNode(this._unitDropDown.domNode).set("label", this._unitStrings[unit]);
      if (this.result === null) { return; }
      var finalResult = this._outputResult(this.result, this._unitStrings[unit]);
      // Trigger Events
      this.onUnitChange(this._unitStrings[unit], this.activeTool);
      if (this._measureGraphic !== null) {
        if (this._mouseMoveMapHandler) {
          this.onMeasure(this.activeTool, this._measureGraphic.geometry, finalResult, this.getUnit(), null);
        }else{
          this.onMeasureEnd(this.activeTool, this._measureGraphic.geometry, finalResult, this.getUnit());
        }
      }
    },

    // Purpose:
    // -- Creates dictionaries for NLS and unit conversion
    // -- Will be replaced in 4x
    _setupDictionaries: function () {
      var localeStrings = jsapiBundle.widgets.measurement;

      // Length units:
      // Each entry in the dictionary holds value in "meters" for the corresponding unit.
      this._unitDictionary[localeStrings.NLS_length_meters] = 1;
      this._unitDictionary[localeStrings.NLS_length_kilometers] = 1000.0;
      this._unitDictionary[localeStrings.NLS_length_feet] = 0.3048;
      this._unitDictionary[localeStrings.NLS_length_miles] = 1609.344;
      this._unitDictionary[localeStrings.NLS_length_yards] = 0.9144;
      this._unitDictionary[localeStrings.NLS_length_nautical_miles] = 1852.0;
      this._unitDictionary[localeStrings.NLS_length_miles_us] = 1609.347218694438;
      this._unitDictionary[localeStrings.NLS_length_feet_us] = 0.3048006096012192;
      this._unitDictionary[localeStrings.NLS_length_yards_us] = 0.9144018288036576;

      // Areal units:
      // Each entry in the dictionary holds value in "square meters" for the corresponding unit.
      this._unitDictionary[localeStrings.NLS_area_sq_meters] = 1;
      this._unitDictionary[localeStrings.NLS_area_sq_kilometers] = 1000000.0;
      this._unitDictionary[localeStrings.NLS_area_sq_feet] = 0.09290304;
      this._unitDictionary[localeStrings.NLS_area_acres] = 4046.8564224;
      this._unitDictionary[localeStrings.NLS_area_sq_miles] = 2589988.110336;
      this._unitDictionary[localeStrings.NLS_area_hectares] = 10000.0;
      this._unitDictionary[localeStrings.NLS_area_sq_yards] = 0.83612736;
      this._unitDictionary[localeStrings.NLS_area_sq_nautical_miles] = 3429904.0;
      this._unitDictionary[localeStrings.NLS_area_acres_us] = 4046.872609874252;
      this._unitDictionary[localeStrings.NLS_area_sq_miles_us] = 2589998.470319522;
      this._unitDictionary[localeStrings.NLS_area_sq_feet_us] = 0.09290341161327487;
      this._unitDictionary[localeStrings.NLS_area_sq_yards_us] = 0.8361307045194736;

      this._unitStrings = {
        // Distance - Unit Conversion from Meters
        "esriMiles": localeStrings.NLS_length_miles,
        "esriKilometers": localeStrings.NLS_length_kilometers,
        "esriFeet": localeStrings.NLS_length_feet,
        "esriFeetUS": localeStrings.NLS_length_feet_us,
        "esriMeters": localeStrings.NLS_length_meters,
        "esriYards": localeStrings.NLS_length_yards,
        "esriNauticalMiles": localeStrings.NLS_length_nautical_miles,
        // Not shown in unit change dropdown
        "esriMilesUS": localeStrings.NLS_length_miles_us,
        "esriYardsUS": localeStrings.NLS_length_yards_us,

        //Area - Unit Conversion from Square Meters
        "esriAcres": localeStrings.NLS_area_acres,
        "esriSquareMiles": localeStrings.NLS_area_sq_miles,
        "esriSquareKilometers": localeStrings.NLS_area_sq_kilometers,
        "esriHectares": localeStrings.NLS_area_hectares,
        "esriSquareYards": localeStrings.NLS_area_sq_yards,
        "esriSquareFeet": localeStrings.NLS_area_sq_feet,
        "esriSquareFeetUS": localeStrings.NLS_area_sq_feet_us,
        "esriSquareMeters": localeStrings.NLS_area_sq_meters,
        // Not shown in unit change dropdown
        "esriAcresUS": localeStrings.NLS_area_acres_us,
        "esriSquareMilesUS": localeStrings.NLS_area_sq_miles_us,
        "esriSquareYardsUS": localeStrings.NLS_area_sq_yards_us,
        // Not supported
        "esriSquareNauticalMiles": localeStrings.NLS_area_sq_nautical_miles,

        // Location - Unit Identification
        "esriDecimalDegrees": localeStrings.NLS_decimal_degrees,
        "esriDegreeMinuteSeconds": localeStrings.NLS_deg_min_sec,
        // Advanced units
        "esriMGRS": localeStrings.NLS_MGRS,
        "esriUSNG": localeStrings.NLS_USNG,
        "esriUTM": localeStrings.NLS_UTM,
        "esriGARS": localeStrings.NLS_GARS,
        "esriGeoRef": localeStrings.NLS_GeoRef,
        // Not supported
        "esriDDM": localeStrings.NLS_DDM,
        "esriDD": localeStrings.NLS_DD
      };

      // Drop-down Labels (Units) for Location Tool
      this._locationUnitStrings = [
        localeStrings.NLS_decimal_degrees,
        localeStrings.NLS_deg_min_sec,
        localeStrings.NLS_MGRS,
        localeStrings.NLS_USNG,
        localeStrings.NLS_UTM,
        localeStrings.NLS_GeoRef,
        localeStrings.NLS_GARS
      ];

      this._locationUnitStringsLong = [
        "esriDecimalDegrees",
        "esriDegreeMinuteSeconds",
        "esriMGRS",
        "esriUSNG",
        "esriUTM",
        "esriGeoRef",
        "esriGARS"
      ];

      this._distanceUnitStrings = [
        localeStrings.NLS_length_miles,
        localeStrings.NLS_length_kilometers,
        localeStrings.NLS_length_feet,
        localeStrings.NLS_length_feet_us,
        localeStrings.NLS_length_meters,
        localeStrings.NLS_length_yards,
        localeStrings.NLS_length_nautical_miles
      ];

      this._distanceUnitStringsLong = [
        "esriMiles",
        "esriKilometers",
        "esriFeet",
        "esriFeetUS",
        "esriMeters",
        "esriYards",
        "esriNauticalMiles"
      ];

      this._areaUnitStrings = [
        localeStrings.NLS_area_acres,
        localeStrings.NLS_area_sq_miles,
        localeStrings.NLS_area_sq_kilometers,
        localeStrings.NLS_area_hectares,
        localeStrings.NLS_area_sq_yards,
        localeStrings.NLS_area_sq_feet,
        localeStrings.NLS_area_sq_feet_us,
        localeStrings.NLS_area_sq_meters
      ];

      this._areaUnitStringsLong = [
        "esriAcres",
        "esriSquareMiles",
        "esriSquareKilometers",
        "esriHectares",
        "esriSquareYards",
        "esriSquareFeet",
        "esriSquareFeetUS",
        "esriSquareMeters"
      ];

      this._buttonDijits = {
        "area" : this._areaButton,
        "distance" : this._distanceButton,
        "location" : this._locationButton
      };

      // Update the Button Tooltips
    //   registry.byNode(this._distanceButton.domNode).setLabel(localeStrings.NLS_distance);
      //registry.byNode(this._areaButton.domNode).setLabel(localeStrings.NLS_area);
    //   registry.byNode(this._locationButton.domNode).setLabel(localeStrings.NLS_location);
      registry.byNode(this.resultLabel.domNode).setContent(localeStrings.NLS_resultLabel);

    },

		//--------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    //--------------------------------------------------------------------------

    // Widget Events
    // See Documentation or this._eventMap object for specific event properties
    onToolChange: function () {},
    onUnitChange: function () {},
    onMeasureStart: function () {},
    onMeasure: function () {},
    onMeasureEnd: function () {},
    //TODO REMOVE

    // Purpose:
    // -- Measures the area of the polygon when map is clicked
    // Params:
    // -- Mouse Event (click)
    _measureAreaMouseClickHandler: function (evt) {
      var snappingPoint, i;
      if (this._map.snappingManager) {
        snappingPoint = this._map.snappingManager._snappingPoint;
      }
      var mapPoint = snappingPoint || evt.mapPoint;
      this._inputPoints.push(mapPoint);
      this._currentStartPt = mapPoint;
      if (this._inputPoints.length === 1) {
        this._tempGraphic.setGeometry(new Polyline(this._map.spatialReference));
        for (i = 0; i < this._measureGraphics.length; i++) {
          this._map.graphics.remove(this._measureGraphics[i]);
        }
        this._measureGraphics = [];
        this.result = 0;
        this._outputResult(this.result, jsapiBundle.widgets.measurement.NLS_area_sq_meters);
        this._mouseMoveMapHandler = connect.connect(this._map, "onMouseMove", this, "_measureAreaMouseMoveHandler");

        // 3.11 Event
        this.onMeasureStart(this.activeTool, this.getUnit());
      }
      this._measureGraphic = new Graphic();
      this._measureGraphic.setSymbol(this._areaLineSymbol);
      this._measureGraphics.push(this._measureGraphic);

      //
      if (this._inputPoints.length > 1) {

        var line = new Polyline(this._map.spatialReference);
        line.addPath([this._inputPoints[this._inputPoints.length - 2], mapPoint]);

        var closeLine = new Polyline(this._map.spatialReference);
        closeLine.addPath([this._inputPoints[0], mapPoint]);
        var densifiedLine = this._densifyGeometry(line);
        var densifiedCloseLine = this._densifyGeometry(closeLine);

        this._tempGraphic.setGeometry(densifiedCloseLine);
        this._measureGraphic.setGeometry(densifiedLine);
        this._polylineGraphics.push(this._measureGraphic);
        this._map.graphics.add(this._measureGraphic);

        // Generate the fill Polygon
        if (this._inputPoints.length > 2) {
          var polygon = new Polygon(this._map.spatialReference);
          var ring = [];
          for (i = 0; i < this._inputPoints.length; i++) {
            ring.push([this._inputPoints[i].x, this._inputPoints[i].y]);
          }
          ring.push([this._inputPoints[0].x, this._inputPoints[0].y]);
          polygon.addRing(ring);

          //this._getArea(polygon);
          // Update the Polygon Fill
          if (this._polygonGraphic) {
            this._map.graphics.remove(this._polygonGraphic);
            this._polylineGraphics.push(this._tempGraphic);
            this._polygonGraphic = this._generatePolygonFromPaths();
            this._map.graphics.add(this._polygonGraphic);
            this._measureGraphic = this._polygonGraphic;
            // Remove the temporary polyline geometry
            this._polylineGraphics.pop();
          }else{
            this._polygonGraphic = this._generatePolygonFromPaths();
            this._map.graphics.add(this._polygonGraphic);
          }
          this._getArea(polygon);

        }
      }else{
        if (this._polygonGraphic) {
          this._map.graphics.remove(this._polygonGraphic);
          this._polygonGraphic = null;
        }
      }
    },

    // Purpose:
    // -- Updates the graphics as the user moves the mouse while drawing an area
    // Params:
    // -- Mouse Event (move/drag)
    _measureAreaMouseMoveHandler: function (evt) {
      var mapPoint;
      if (this._inputPoints.length > 0) {
        var line = new Polyline(this._map.spatialReference);
        var snappingPoint;
        if (this._map.snappingManager) {
          snappingPoint = this._map.snappingManager._snappingPoint;
        }
        mapPoint = snappingPoint || evt.mapPoint;
        line.addPath([this._currentStartPt, mapPoint]);
        var densifiedLine = this._densifyGeometry(line);
        this._tempGraphic.setGeometry(densifiedLine);
      }
      if (this._inputPoints.length > 1) {
        var closeLine = new Polyline(this._map.spatialReference);
        closeLine.addPath([mapPoint, this._inputPoints[0]]);
        var closeDensifiedLine = this._densifyGeometry(closeLine);
        this._tempGraphic.setGeometry(this._tempGraphic.geometry.addPath(closeDensifiedLine.paths[0]));
      }
    },

    // Purpose:
    // -- Gets area from server (if applicable) and updates results UI
    // Params:
    // -- Mouse Event (double click)
    _measureAreaDblClickHandler: function (evt) {
      connect.disconnect(this._mouseMoveMapHandler);
      this._mouseMoveMapHandler = null;

      //for iOS browser, dbl click won't trigger single click even when setImmediateClick as true
      //this is a workaround
      if (this._map.navigationManager.eventModel === "touch" && has("ios")) {
        this._measureAreaMouseClickHandler(evt);
      }

      var polygon = new Polygon(this._map.spatialReference);
      var ring = [];
      var i;
      for (i = 0; i < this._inputPoints.length; i++) {
        ring.push([this._inputPoints[i].x, this._inputPoints[i].y]);
      }
      ring.push([this._inputPoints[0].x, this._inputPoints[0].y]);
      polygon.addRing(ring);
      this._inputPoints = [];

      // Does this do anything?
      this.measureGeometry = this._densifyGeometry(polygon);

      // Update the Polygon
      if (this._polygonGraphic) {
        this._map.graphics.remove(this._polygonGraphic);
        this._polylineGraphics.push(this._tempGraphic);
        this._polygonGraphic = this._generatePolygonFromPaths();
        this._map.graphics.add(this._polygonGraphic);
      }

      this._getArea(polygon);

      //for android devices, dbl click triggers single click after this event
      //this is a workaround
      /*if (this._map.navigationManager.eventModel === "touch" || this._map.navigationManager.eventModel === "pointer") {
        this.setTool("area", false);
      }*/

      this._polylineGraphics = [];

    },

    // Purpose:
    // -- Event Handler for Mouse Click when Distance Tool is active
    // Params:
    // -- Mouse Event (click)
    _measureDistanceMouseClickHandler: function (evt) {

      //if it's a new measurement, store the first pt, clear previous results and graphics
      //if it's in the middle of a measurement, show the static result and geodesics, reset the _currentStartPt
      var snappingPoint;
      if (this._map.snappingManager) {
        snappingPoint = this._map.snappingManager._snappingPoint;
      }
      var mapPoint = snappingPoint || evt.mapPoint;
      this._inputPoints.push(mapPoint);
      this._currentStartPt = mapPoint;

      // New Measurement Operation
      if (this._inputPoints.length === 1) {

        var i;
        for (i = 0; i < this._measureGraphics.length; i++) {
          this._map.graphics.remove(this._measureGraphics[i]);
        }

        // Reset - TODO: use reset() function?
        this._map.graphics.remove(this._tempGraphic);
        this._measureGraphics = [];
        this.result = 0;
        this._outputResult(this.result, jsapiBundle.widgets.measurement.NLS_length_meters);

        this._tempGraphic = new Graphic();
        this._tempGraphic.setSymbol(this._lineSymbol);
        this._map.graphics.add(this._tempGraphic);
        this._mouseMoveMapHandler = connect.connect(this._map, "onMouseMove", this, "_measureDistanceMouseMoveHandler");

        //3.11 Event
        this.onMeasureStart(this.activeTool, this.getUnit());
      }
      this._tempGraphic.setGeometry(new Polyline(this._map.spatialReference));

      // Create the Graphic
      // -- Add it to the Map
      var pointGraphic = new Graphic();
      pointGraphic.setSymbol(this._pointSymbol);
      pointGraphic.setGeometry(mapPoint);
      this._measureGraphics.push(pointGraphic);
      this._map.graphics.add(pointGraphic);

      // Polyline Operation
      if (this._inputPoints.length > 1) {

        // Current Line
        this._measureGraphic = new Graphic();
        this._measureGraphic.setSymbol(this._lineSymbol);

        // Add to Line Array
        this._measureGraphics.push(this._measureGraphic);

        // Densify
        var line = new Polyline(this._map.spatialReference);
        line.addPath([this._inputPoints[this._inputPoints.length - 2], mapPoint]);
        var densifiedLine = this._densifyGeometry(line);

        // Update the polyline and add it to the Map
        this._measureGraphic.setGeometry(densifiedLine);
        this._map.graphics.add(this._measureGraphic);

        // Projected Coordinate System - Accuracy Improvement 3.13
        if (this._map.cs === "PCS") {

          //The final result should be calculated by geometry service in order to give the accurate measurement.
          this._geometryServiceLength(densifiedLine, false);

        }else{
          // Not Projected Coordinate Systems - Geometry Service NOT required
          var segmentLength = this._geodesicDistance(this._inputPoints[this._inputPoints.length - 2], mapPoint);
          var convertedSegment = this._outputResult(segmentLength, this.getUnit());
          // Add new result to previous result and update UI
          this.result = this.result + segmentLength;
          this._showDistance(this.result);
          this.onMeasure(this.activeTool, mapPoint, this._outputResult(this.result, this.getUnit()), this.getUnit(), convertedSegment);
        }
      }else{
        // Use the _pointSymbol for the very first point in a polyline
        pointGraphic.setSymbol(this._pointSymbol);
      }
    },

    // Purpose:
    // -- Event Handler for Mouse Move when Distance Tool is active
    // Params:
    // -- Mouse Event (move/drag)
    _measureDistanceMouseMoveHandler: function (evt) {
      // Only show distance (of a line) if two or more points
      // -- Don't do client-side calculation for PCS
      if (this._inputPoints.length > 0) {
        var snappingPoint, line = new Polyline(this._map.spatialReference);
        // Snapping Enabled
        if (this._map.snappingManager) {
          snappingPoint = this._map.snappingManager._snappingPoint;
        }

        // Get the point, update the line
        var mapPoint = snappingPoint || evt.mapPoint;
        line.addPath([this._currentStartPt, mapPoint]);
        var densifiedLine = this._densifyGeometry(line);
        this._tempGraphic.setGeometry(densifiedLine);

        // Show estimated distance
        if (this._map.cs !== "PCS") {
          // Get new distance and update
          var segmentLength = this._geodesicDistance(this._currentStartPt, mapPoint);
          var convertedSegment = this._outputResult(segmentLength, this.getUnit());
          // Don't update this.result because this is temporary measurement (mouse-move)
          var updatedResult = segmentLength + this.result;
          this._showDistance(updatedResult);
          this.onMeasure(this.activeTool, mapPoint, this._outputResult(updatedResult, this.getUnit()), this.getUnit(), convertedSegment);
        }
      }
    },

    // Purpose:
    // -- Calcualtes the distance of the line graphics for display in the results UI
    // Params:
    // -- Mouse Event (double click)
    _measureDistanceDblClickHandler: function (evt) {

      // Disconnect the mouse from the map
      connect.disconnect(this._mouseMoveMapHandler);
      this._mouseMoveMapHandler = null;

      // iOS Workaround (Legacy, Jian)
      // -- dblClick doesn't trigger a single event when setImmediateClick is true
      if (this._map.navigationManager.eventModel === "touch" && has("ios")) {
        this._measureDistanceMouseClickHandler(evt);
      }

      var measurementGeometry = new Polyline(this._map.spatialReference);
      measurementGeometry.addPath(this._inputPoints);
      measurementGeometry = this._densifyGeometry(measurementGeometry);

      // Update App State
      this._measureGraphic.geometry = measurementGeometry;

      if (this._map.cs === "PCS") {
        //The final result should be calculated by geometry service in order to give the accurate measurement.
        this._geometryServiceLength(measurementGeometry, true);
      }else{
        // End Measurement Operation
        this._inputPoints = [];
        this.onMeasureEnd(this.activeTool, measurementGeometry, this._outputResult(this.result, this.getUnit()), this.getUnit());
      }
    },

    _geometryServiceLength: function (geometry, isEnd) {

      var lengthParams = new LengthsParameters();
        lengthParams.polylines = [geometry];
        lengthParams.lengthUnit = 9001;
        lengthParams.calculationType = "geodesic";

      this._geometryService.lengths(lengthParams, lang.hitch(this, function (result) {
        var segmentLength = result.lengths[0];
        if (!isEnd) {
          var convertedSegment = this._outputResult(segmentLength, this.getUnit());
          // Add new result to previous result and update UI
          this.result = this.result + segmentLength;
          this._showDistance(this.result);
          this.onMeasure(this.activeTool, geometry, this._outputResult(this.result, this.getUnit()), this.getUnit(), convertedSegment);
        }else{
          // Get Final Measurement
          this.result = segmentLength; // Miles
          this._showDistance(this.result);
          this._inputPoints = [];
          this.onMeasureEnd(this.activeTool, geometry, this._outputResult(this.result, this.getUnit()), this.getUnit());
        }
      }));
    },

    // Purpose:
    // -- Event Handler for Mouse Click when Location Tool is Active
    // Params:
    // -- Mouse Event (click)
    _locationClickHandler: function (evt) {
      var snappingPoint, currentMapPt;

      // Snapping Manager Logic
      if (this._map.snappingManager) {
        snappingPoint = this._map.snappingManager._snappingPoint;
      }
      currentMapPt = snappingPoint || evt.mapPoint;

      // Keep the Tool Active (3.10 Enhancement)
      this._locationButtonToggle();
      this._locationButtonToggle();

      // Create the graphic where the user clicked
      this._locationGraphic = new Graphic();
      this._locationGraphic.setGeometry(currentMapPt);
      this._locationGraphic.setSymbol(this._pointSymbol);
      this._map.graphics.add(this._locationGraphic);
      this._measureGraphics.push(this._locationGraphic);

      // Start Measuring Process
      this._calculateLocation(currentMapPt, true);

    },

    // Purpose:
    // -- Event Handler for Mouse Move when Location Tool is active
    // Params:
    // --
    _locationMoveHandler: function (evt) {

      var snappingPoint;

      // Snapping Manager Logic
      if (this._map.snappingManager) {
        snappingPoint = this._map.snappingManager._snappingPoint;
      }
      var currentMapPt = snappingPoint || evt.mapPoint;

      // Start Measuring Process
      this._calculateLocation(currentMapPt, false);
    },

		//--------------------------------------------------------------------------
    //
    //  UI Methods
    //
    //--------------------------------------------------------------------------

    // Purpose:
    // -- Prints result for area, distance measurements to resultValue node
    // Params:
    // -- result (number), unit (string)
    // Returns:
    // -- Returns value information for measure-end event
    _outputResult: function (result, unit) {
      var finalResult = result / this._unitDictionary[unit];
      if (finalResult === 0) {
        this.resultValue.setContent("&nbsp");
      }
      else if (finalResult > 1000000) {
        this.resultValue.setContent(numberUtils.format(finalResult.toPrecision(9), { pattern: this.numberPattern }) + " " + unit);
      }
      else if (finalResult < 10) {
        this.resultValue.setContent(numberUtils.format(finalResult.toFixed(2), { pattern: this.numberPattern + "0" }) + " " + unit);
      }
      else {
        this.resultValue.setContent(numberUtils.format(finalResult.toFixed(2), { pattern: this.numberPattern }) + " " + unit);
      }
      // Added in 3.11 for Events
      return finalResult;
    },

    // Purpose:
    // -- Generates distance unit drop-down
    _createDistanceUnitList: function () {
      var defaultUnit;
      var menu = new Menu({
        style: "display: none;"
      });
      // Generate the Menu
      array.forEach(this._distanceUnitStrings, lang.hitch(this, function (lengthUnit, idx) {
        var menuItem = new MenuItem({
          label: lengthUnit,
          onClick: lang.hitch(this, function () {
            this._switchUnit(this._distanceUnitStringsLong[idx]);
          })
        });
        menuItem.set("class", "unitDropDown");
        menu.addChild(menuItem);
      }));
      registry.byNode(this._unitDropDown.domNode).set("dropDown", menu);
      // Check if Previous Unit was Selected
      if (this.currentDistanceUnit) {
        defaultUnit = this._unitStrings[this.currentDistanceUnit];
        registry.byNode(this._unitDropDown.domNode).set("label", defaultUnit);
      }else{
        defaultUnit = this._unitStrings[this._defaultDistanceUnit];
        registry.byNode(this._unitDropDown.domNode).set("label", defaultUnit);
        this.currentDistanceUnit = this._defaultDistanceUnit;
      }
      //this.onToolChange(this.activeTool, this.getUnit());
    },

    // Purpose:
    // -- generates area unit drop-down
    _createAreaUnitList: function () {
      var defaultUnit;
      var menu = new Menu({
        style: "display: none;"
      });
      // Generate the Menu
      array.forEach(this._areaUnitStrings, lang.hitch(this, function (areaUnit, idx) {
        var menuItem = new MenuItem({
          label: areaUnit,
          onClick: lang.hitch(this, function () {
            this._switchUnit(this._areaUnitStringsLong[idx]);
          })
        });
        menuItem.set("class", "unitDropDown");
        menu.addChild(menuItem);
      }));
      registry.byNode(this._unitDropDown.domNode).set("dropDown", menu);
      // Check if Previous Unit was Selected
      if (this.currentAreaUnit) {
        defaultUnit = this._unitStrings[this.currentAreaUnit];
        registry.byNode(this._unitDropDown.domNode).set("label", defaultUnit);
      }else{
        defaultUnit = this._unitStrings[this._defaultAreaUnit];
        registry.byNode(this._unitDropDown.domNode).set("label", defaultUnit);
        this.currentAreaUnit = this._defaultAreaUnit;
      }
      //this.onToolChange(this.activeTool, this.getUnit());
    },

    // Purpose:
    // -- generates location unit drop-down
    _createLocationUnitList: function () {
      var defaultUnit;
      var visibleUnits = this._locationUnitStrings;
      var menu = new Menu({
        style: "display: none;"
      });
      // Advanced Location Units Check
      if (this._geometryService === null || this.advancedLocationUnits === false) {
        visibleUnits = visibleUnits.slice(0,2);
      }
      // Generate the Menu
      array.forEach(visibleUnits, lang.hitch(this, function (locationUnit, idx) {
        var menuItem = new MenuItem({
          label: locationUnit,
          onClick: lang.hitch(this, function () {
            this._switchLocationUnit(this._locationUnitStringsLong[idx]);
          })
        });
        menuItem.set("class", "unitDropDown");
        menu.addChild(menuItem);
      }));
      registry.byNode(this._unitDropDown.domNode).set("dropDown", menu);
      // Check if Previous Unit was Selected
      if (!this.currentLocationUnit) {
        this.currentLocationUnit = this._defaultLocationUnit;
      }
      // Update
      defaultUnit = this._unitStrings[this.currentLocationUnit];
      registry.byNode(this._unitDropDown.domNode).set("label", defaultUnit);
      // Show the Table (Depending on Unit)
      if (this.currentLocationUnit === "esriDegreeMinuteSeconds" || this.currentLocationUnit === "esriDecimalDegrees") {
        this._toggleLocationResultsTable(true, false);
      }
    },

    // Purpose:
    // -- Used by the Online Viewer to generate unique SVG-based image for the Location Result Table based on this._pointSymbol;
    // -- Most of the below code is re-factored from esri/dijit/Legend.js
    _drawPointGraphics: function (node) {
      var source, surface, shapeDesc, gfxShape, sWidth = 10, sHeight = 10, symbol =  this._pointSymbol;
      // Create the Image Container
      var rampDiv = domConstruct.create("div", {
        "class": "esriLocationResultSymbol"
      }, node);
      // Create the Surface from the default width/length (10)
      surface = gfx.createSurface(rampDiv, sWidth, sHeight);
      if ( has("ie") < 9 ) {
        // Fixes an issue in IE where the shape is partially drawn and
        // positioned to the right of the table cell
        source = surface.getEventSource();
        domStyle.set(source, "position", "relative");
        domStyle.set(source.parentNode, "position", "relative");
      }
      // Get Shape Parameters
      shapeDesc = symbol.getShapeDescriptors();
      // Create the Shape
      // -- If an error occurs, delete the surface reference and bail out completely
      try {
        gfxShape = surface.createShape(shapeDesc.defaultShape).setFill(shapeDesc.fill).setStroke(shapeDesc.stroke);
      } catch (e) {
        surface.clear();
        surface.destroy();
        return;
      }
      // Rescaling
      var bbox = gfxShape.getBoundingBox(),
        width = bbox.width,
        height = bbox.height,
        // Borrowed from GraphicsLayer.js:
        // -- Aligns the center of the path with surface's origin (0,0)
        // -- This logic is specifically required for SMS symbols with STYLE_PATH style
        vectorDx = -(bbox.x + (width / 2)),
        vectorDy = -(bbox.y + (height / 2)),
        // Borrowed from TemplatePickerItem.js:
        // -- Aligns the center of the shape with the center of the surface
        dim = surface.getDimensions(),
        transform = {
          dx: vectorDx + dim.width / 2,
          dy: vectorDy + dim.height / 2
      };
      // If image is too big, shrink it with SVG Transform
      if (width > sWidth || height > sHeight) {
        // Resize Compatibility Test
        var test = (width/sWidth > height/sHeight);
        var actualSize = test ? width : height;
        var refSize = test ? sWidth : sHeight;
        var scaleBy = (refSize - 5) / actualSize;
        // Translate
        lang.mixin(transform, {
          xx: scaleBy,
          yy: scaleBy
        });
      }
      // Update the Image
      gfxShape.applyTransform(transform);
    }
  });

  // TODO: Remove when porting to 4x
  if (has("extend-esri")) {
    lang.setObject("dijit.Measurement", Measurement, esriNS);
  }

  return Measurement;
});
