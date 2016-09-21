define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/promise/all',
    'dojo/topic',
    'dojo/json',

    'esri/tasks/QueryTask',
    'esri/tasks/query',
    'esri/tasks/locator',
    'esri/geometry/Point',
    'esri/geometry/Extent',
    'esri/geometry/webMercatorUtils',

    'core/queryUtils',

    './UnifiedSearch/UnifiedSearchView'],

function(
  declare, lang, dojoAll, topic, JSON,
  QT, Query, Locator, Point, Extent, webMercatorUtils,
  queryUtils,
  LSView)
{

  return declare([], {

    locModel: null,
    viewElement: null, // can be id string or actual node

    queries: [],
    queryTasks: [],

    toolPrefix: null,

    constructor: function(options) {
      this.inherited(arguments);
      this.postCreate(options);
    },

    // this does not happen automatically.
    /**
     * instantiate the unified search controller
     * @param  {options} options required: map object & viewElement reference / optional: searchConfig & portalSearchConfig
     * @return {this}         returns itself
     */
    postCreate: function(options) {
      if (_.isUndefined(options.map)) {
        console.error('UnifiedSearch::Map not defined');
        return;
      }

      this.map = options.map;
      this.toolPrefix = '/' + options.toolPrefix || '/UnifiedSearch';

      this.searchConfig = options.searchConfig;

      if (_.isObject(options.portalSearchConfig)) {
        this.mixinPortalSearchConfig(options.portalSearchConfig);
      }

      // initialize the view object
      this.lsView = new LSView({
        searchConfig: this.searchConfig,
        searchDelay: this.searchConfigsearchDelay || 400
      }, options.viewElement); //
      this.lsView.startup();

      // initialize the queries
      this.initQueries();

      return this;
    },

    startup: function() {
      this.inherited(arguments);
      this._attachEventListeners();
    },

    mixinPortalSearchConfig: function(searchObj) {
      //var searchObj = this.mapObj._agsResponse.itemInfo.itemData.applicationProperties.viewing.search;
      lang.mixin(this.searchConfig, {
        placeholder: searchObj.hintText
      });

      // remove any tables
      this.searchConfig.tables.length = 0;

      // add the tables from the webmap
      var tables = [];
      _.each(searchObj.layers, lang.hitch(this, function(layer, index) {
        var layerInfo = this.mapObj.layerController.getLayerInfoByLayerId(layer.id);
        if (layerInfo !== null) {
          var table = {
            url: layerInfo.url,
            idField: 'OBJECTID',
            query: {
              returnGeometry: true,
              id: layer.id,
              fields: [layer.field.name], // TODO
              group: {
                isGrouped: true,
                sectionHeader: layerInfo.title,
                iconClass: 'fa fa-folder'
              },
              results: {
                labelFields: layer.field.name,
                iconClassFunction: function(attrs) {
                  return 'fa fa-map-marker';
                },
                priority: index
              },
              relatedQuery: null
            }
          };
          tables.push(table);
        }
      }));
      this.searchConfig.tables = tables;
    },

    searchMapPoint: function(mapPoint) {
      var mp = webMercatorUtils.webMercatorToGeographic(mapPoint);
      this.lsView.setInputValue(mp.x.toFixed(6) + ', ' + mp.y.toFixed(6));
      var unifiedResults = [];
      var loc = new Locator(this.searchConfig.geocode.url);
      //loc.setOutSpatialReference(this.map.spatialReference);
      loc.locationToAddress(mp, this.searchConfig.geocode.distance, lang.hitch(this, function(result) {
        unifiedResults.push({
          oid: 0,
          label: this.searchConfig.geocode.addressLabelFunction(result.address),
          layer: '',
          extent: JSON.stringify(this._pointToExtent(mapPoint, 10)), //JSON.stringify(mp.getExtent()),
          iconClass: 'fa fa-map-marker',
          obj: JSON.stringify(result)
        });
        this.lsView.handleFormattedResults(unifiedResults);
      }), function(error) {
        console.log('geocode error', error);
      });
      /*
      var executeObj = Object.create(null);
      _.each(this.searchConfig.locators, lang.hitch(this, function(locator) {
        var loc = new Locator(locator.url);
        loc.setOutSpatialReference(this.map.spatialReference);
        executeObj[locator.id] = loc.locationToAddress(mp, this.searchConfig.geocode.distance);
      }));
      dojoAll(executeObj).then(lang.hitch(this, this.handleQueryResults), queryUtils.genericErrback);
      */
    },

    _pointToExtent: function(point, toleranceInPixel) {
      //calculate map coords represented per pixel
      var pixelWidth = this.map.extent.getWidth() / this.map.width;
      //calculate map coords for tolerance in pixel
      var toleraceInMapCoords = toleranceInPixel * pixelWidth;
      //calculate & return computed extent
      return new Extent(point.x - toleraceInMapCoords,
        point.y - toleraceInMapCoords,
        point.x + toleraceInMapCoords,
        point.y + toleraceInMapCoords,
        this.map.spatialReference);
    },

    initQueries: function() {
      this.queries.length = 0;
      this.queryTasks.length = 0;
      _.each(this.searchConfig.tables, lang.hitch(this, function(table) {
        var query = queryUtils.createQuery({
          outFields: _.union(table.query.fields, table.query.results.labelFields, [table.idField]),
          outSpatialReference: this.map.spatialReference,
          returnGeometry: table.query.returnGeometry
        });
        this.queries.push(query);
        this.queryTasks.push(new QT(table.url));
      }));
    },

    _attachEventListeners: function() {
      if (this.searchConfig.hasReverseGeocode) {
        topic.subscribe(this.toolPrefix + '/map/clicked', lang.hitch(this, function(sender, args) {
          //this.initErrorDialog(args || null);
          console.log('reverse geocode received', args);
        }));
      }

      this.lsView.on('input-change', lang.hitch(this, this.handleSearchStr));
      this.lsView.on('select-oid', lang.hitch(this, this.handleResultSelection));

      this.lsView.on('locateme', lang.hitch(this, this._locateMeClicked));
      this.lsView.on('clear', lang.hitch(this, this._clearClicked));
    },

    _locateMeClicked: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(lang.hitch(this, this.zoomToLocation), this.locationError);
      } else {
        alert('Browser does not support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.');
      }
    },

    _clearClicked: function() {
      console.log('clear button clicked');
      topic.publish(this.toolPrefix + '/clear/clicked', this, {});
      // TODO is there a better place for this?
      // Clear the map marker as well
      topic.publish('/map/clear/simplemarker', this, {});
    },

    zoomToLocation: function(location) {
      if (_.isObject(location.coords)) {
        var args = {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude
        };

        // zoom to the coordinates
        //this._zoomToLatLong(args);
        topic.publish('/map/zoom/latlong', this, args);
      }
    },

    locationError: function(error) {
      alert('geolocate error: ', error.code);
      /*
      //error occurred so stop watchPosition
      if( navigator.geolocation ) {
      navigator.geolocation.clearWatch(watchId);
      }
      switch (error.code) {
      case error.PERMISSION_DENIED:
      alert("Location not provided");
      break;

      case error.POSITION_UNAVAILABLE:
      alert("Current location not available");
      break;

      case error.TIMEOUT:
      alert("Timeout");
      break;

      default:
      alert("unknown error");
      break;
      }
      */
    },

    _zoomToLatLong: function(args) {
      var pt = new Point(args.longitude, args.latitude);
      //addGraphic(pt);
      this.map.centerAndZoom(pt, 12);
    },

    constructWhere: function(fieldArr, valueStr) {
      var upperStr = valueStr.toUpperCase();
      var whereArr = _.map(fieldArr, function(field) {
        return 'UPPER(' + field + ') LIKE \'%' + upperStr + '%\'';
      });
      var whereStr = whereArr.join(' OR ');

      // server bug 10.1
      var dirtyStr = queryUtils.getDirtyStr();
      if (dirtyStr) {
        whereStr = '(' + whereStr +  ') AND ' + dirtyStr;
      }

      console.log(whereStr);

      return whereStr;
    },

    getResultsByPriority: function(responsesObj) {
      var sortedTablesIds = [];
      var idx = 0;
      _.each(this.searchConfig.locators, function(locator) {
        sortedTablesIds[idx] = locator.id;
        idx += 1;
      });
      _.each(this.searchConfig.tables, function(table) {
        sortedTablesIds[table.query.results.priority + 100] = table.query.id;
      });

      var sortedResponsesObj = {};
      _.each(sortedTablesIds, function(id) {
        if (!_.isUndefined(responsesObj[id])) {
          sortedResponsesObj[id] = responsesObj[id];
        }
      });
      return sortedResponsesObj;
    },

    getTableByLayerKey: function(queryId) { // queryId
      var t = null;
      _.each(this.searchConfig.tables, lang.hitch(this, function(table) {
        if (table.query.id === queryId) {
          t = table;
        }
      }));
      return t;
    },

    getLocatorById: function(id) { // queryId
      var t = null;
      _.each(this.searchConfig.locators, lang.hitch(this, function(locator) {
        if (locator.id === id) {
          t = locator;
        }
      }));
      return t;
    },

    handleSearchStr: function(str) {
      console.debug('handleSearchStr', str);
      this.currentSearchString = str;
      if (!this.lsView.inputValue || this.lsView.inputValue !== this.currentSearchString) {
        console.debug('why bother querying?', this.lsView.inputValue, this.currentSearchString);
        return;
      }

      var executeObj = Object.create(null);

      // first add the locators
      if (this.searchConfig.locators && this.searchConfig.locators.length > 0) {
        _.each(this.searchConfig.locators, lang.hitch(this, function(locator) {
          var loc = new Locator(locator.url);
          loc.setOutSpatialReference(this.map.spatialReference);
          var address = {
            'SingleLine': this.currentSearchString
          };
          var params = {
            address: address,
            outFields: ['*'],
            maxLocations: locator.maxLocations
          };
          if (locator.countryCode) {
            params.countryCode = locator.countryCode;
          }

          executeObj[locator.id] = loc.addressToLocations(params);
        }));
      }

      // now add the tables
      _.each(this.queries, lang.hitch(this, function(query, index) {
        query.where = this.constructWhere(this.searchConfig.tables[index].query.fields, this.currentSearchString);
        //query.outFields = ["*"];
        executeObj[this.searchConfig.tables[index].query.id] = this.queryTasks[index].execute(query);
      }));

      // execute all queries
      dojoAll(executeObj).then(lang.hitch(this, this.handleQueryResults), queryUtils.genericErrback);
    },

    handleQueryResults: function(responsesObj) {
      console.debug('handleQueryResults', responsesObj);

      // hide the info panel if open
      topic.publish(this.toolPrefix + '/clear/clicked', this, {});

      var unifiedResults = [];
      var sortedResponsesObj = this.getResultsByPriority(responsesObj);

      _.each(sortedResponsesObj, lang.hitch(this, function(response, lyrKey) {
        if (!queryUtils.checkResponseSuccess(response)) { // || !queryUtils.checkFeatureExistence(response)) {
          return;
        }

        // get the layer object
        var layer = this.getTableByLayerKey(lyrKey);

        // if layer is still null, then it is a locator
        if (layer === null) {
          var locator = this.getLocatorById(lyrKey);
          console.log('Locator  (' + lyrKey + ') response: ', response);

          // do NOT group the results
          _.each(response, lang.hitch(this, function(obj, index) {
            if (locator !== null) {
              unifiedResults.push({
                oid: index,
                label: obj.address,
                layer: lyrKey,
                extent: JSON.stringify(obj.extent),
                iconClass: 'fa fa-map-marker',
                obj: JSON.stringify(obj)
              });
            }
          }));
        } else {
          console.log('Table (' + lyrKey + ') returned ' + response.features.length + ' results');

          // group the results
          if (layer.query.group.isGrouped) {
            if (response.features.length > 0) {
              unifiedResults.push((layer !== null) ? {
                oid: '',
                label: '' + layer.query.group.sectionHeader + ' (' + response.features.length + ' results)',
                layer: lyrKey,
                iconClass: layer.query.group.iconClass,
                extent: ''
              } : null);
            }
          } else {
            // do NOT group the results
            var formattedResults = _.map(response.features, lang.hitch(this, function(feat) {
              return (layer !== null) ? {
                oid: feat.attributes[layer.idField],
                label: (layer.query.results.labelFunction) ? layer.query.results.labelFunction(feat.attributes) : feat.attributes[layer.query.results.labelFields[0]],
                layer: lyrKey,
                iconClass: (layer.query.results.iconClassFunction) ? layer.query.results.iconClassFunction(feat.attributes) : '',
                extent: (feat.extent) ? JSON.stringify(feat.extent) : '',
                obj: JSON.stringify(feat)
              } : null;
            }));
            unifiedResults = unifiedResults.concat(formattedResults); //.slice(0,5)
          }

          // mixin the results, for now let's just take the first 5 of each source
          // ideally this filters duplicates, weighs and ranks them, etc.

        }
      }));

      this.lsView.handleFormattedResults(unifiedResults);
    },

    mapClickEvent: function(target) {
        if (target.e_graphic) {
            target = target.e_graphic;

            var resultObj = {
                oid: target.attributes.OBJECTID,
                lyr: target._layer.id
            }
            console.debug('map click intercept', resultObj);

            topic.publish('/InfoPanel/clear', this);
            this.handleResultSelection(resultObj, false);
        }
    },

    /**
     * Handles clicking a result
     * @param  {Object} resultObj from UnifiedSearchView (oid, lyr, extent, labelText)
     * @return {[type]}           [description]
     */
    handleResultSelection: function(resultObj, zoomTo) {
      //console.debug('handleResultSelection', resultObj, zoomTo);
      //console.debug('handleResultSelection');

      // Check if there is an oid
      if (resultObj.oid && resultObj.oid !== '' && resultObj.oid !== 'null') {
        // if there is an oid then we have a feature
        // clear the search panel to make room for the info panel
        this.lsView.clearResults();

        // Run a query on the features OID and LayerID to get the feature data
        var hasValidFeature = false;


            console.debug('entering query loop');
        var query = new Query();
        query.objectIds = [parseInt(resultObj.oid)];
        query.outFields = [ "*" ];
        var selectedFeatureLyr = this.map._layers[resultObj.lyr];

        var featureQuery = selectedFeatureLyr.queryFeatures(query, lang.hitch(this, function(featureSet) {
            // Format the feature data a little
            //console.debug('handleResultSelection query', featureSet, query);
            var featureObj = {
                feature: featureSet.features[0]
            }
            console.debug('Preping to zoom', featureObj);
            if (typeof featureObj.feature === 'undefined') {
                //hasValidFeature = true;
                console.debug('Re-running query');
                this.handleResultSelection(resultObj, zoomTo);
                return;
            }
            // TODO Should the layer be made visibile?
            //selectedFeatureLyr.setVisibility(true);

            // If zoomTo is true then this is a USearch event else this is a Map click event
            if (zoomTo !== false) {
                topic.publish('/map/zoom/feature', this, featureObj);
            }
            // Add marker graphics to show the feature location
            topic.publish('/map/add/simplemarker', this, featureObj.feature);

            // Send the signal to open the info panel for the selected feature
            topic.publish('/UnifiedSearch/result/clicked', this,
              {
                layerId: resultObj.lyr,
                obj: featureObj.feature
              }
            );

        }));

      } else {
        if (resultObj.oid !== '') {
          // when oid is populated we can run the related query
          this.runSelectedQuery(resultObj);
        } else {
          // otherwise we need to get the actual results first (e.g. result is a group)
          this.runGroupedQuery(resultObj);
        }
      }
    },

    _zoomToFeatureDeferred: function() {
        console.log('the deferred has resolved');
    },

    runGroupedQuery: function(resultObj) {
      var table = this.getTableByLayerKey(resultObj.lyr);
      queryUtils.createAndRun({
        query: {
          outFields: _.union(table.query.fields, table.query.results.labelFields, [table.idField]), //["*"],
          returnGeometry: true,
          where: this.constructWhere(table.query.fields, this.currentSearchString)
        },
        url: table.url,
        self: this,
        callback: this.runGroupedQueryResponseHandler,
        callbackArgs: {
          lyrKey: resultObj.lyr,
          label: resultObj.labelText
        }
      });
    },

    runGroupedQueryResponseHandler: function(params, response) {
      console.debug('runGroupedQueryResponseHandler', response);
      //console.log(response);

      var layer = this.getTableByLayerKey(params.lyrKey);

      var formattedResults = _.map(response.features, lang.hitch(this, function(feat) {
        return (layer !== null) ? {
          oid: feat.attributes[layer.idField],
          label: (layer.query.results.labelFunction) ? layer.query.results.labelFunction(feat.attributes) : feat.attributes[layer.query.results.labelFields[0]],
          layer: params.lyrKey,
          iconClass: (layer.query.results.iconClassFunction) ? layer.query.results.iconClassFunction(feat.attributes) : layer.query.results.iconClass,
          extent: (feat.geometry) ? JSON.stringify(feat.geometry.getExtent()) : '',
          obj: JSON.stringify(feat)
        } : null;
      }));

      //console.debug('reutruning formatted results', formattedResults);

      this.lsView.handleFormattedResults2(formattedResults, params.label);
    },

    runSelectedQuery: function(resultObj) {
      var table = this.getTableByLayerKey(resultObj.lyr);
      var strUrl;
      var strWhere;
      var intObjectid = parseInt(resultObj.oid, 10);
      var fieldValArr = [{
        fieldName: table.idField,
        newValue: intObjectid
      }];
      if (table.query.relatedQuery != null && table.query.relatedQuery.isRelated) {
        // run the related query
        strUrl = table.query.relatedQuery.url;
        var val = (isNaN(intObjectid)) ? '\'' + resultObj.oid + '\'' : intObjectid;
        strWhere = table.query.relatedQuery.foreignKeyField + ' = ' + val;
      } else {
        // get the geometry from the same table
        strUrl = table.url;
        strWhere = queryUtils.constructWhere(fieldValArr, 'AND');
      }
      // construct the query
      queryUtils.createAndRun({
        query: {
          outFields: ['*'],
          returnGeometry: true,
          where: strWhere
        },
        url: strUrl,
        self: this,
        callback: this.runSelectedResponseHandler,
        callbackArgs: {
          zoomToFeature: this.searchConfig.zoomToFeature,
          showInfoWindow: this.searchConfig.showInfoWindow,
          layer: this.map.getLayer(resultObj.lyr),
          layerId: resultObj.lyr,
          labelText: resultObj.labelText,
          obj: JSON.parse(resultObj.obj)
        }
      });
    },

    runSelectedResponseHandler: function(params, response) {
      console.debug('runSelectedResponseHandler');
      if (!queryUtils.checkResponseSuccess(response) || !queryUtils.checkFeatureExistence(response) || !queryUtils.checkSingleFeature(response)) {
        console.error('not a single feature');
        return;
      }

      this.lsView.openFeatureDetails(params.labelText);

      var selectedFeature = lang.mixin(response.features[0], {_layer: params.layer});
      console.debug('zooming to feature - prelim', response);
      lang.mixin(response.features[0].attributes, params.obj.attributes);

      topic.publish(this.toolPrefix + '/result/clicked', this,
        {
          layerId: params.layerId,
          obj: selectedFeature
        }
      );

      console.debug('zooming to feature', selectedFeature);
      topic.publish('/map/zoom/feature', this,
        {
          feature: selectedFeature,
          zoomToFeature: true,
          showInfoWindow: params.showInfoWindow,
          refreshLayers: true
        }
      );
    },

    hide: function() {
        this.lsView.hide();
    },

    show: function() {
        this.lsView.show();
    }

  });
});
