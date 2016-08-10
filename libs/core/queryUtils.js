define([
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/Deferred',

    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/tasks/RelationshipQuery'],

function(lang, topic, Deferred,
  EsriQuery, QueryTask, RelationshipQuery) {
  return {

    /**
     * Wrapper for esri/task/QueryTask
     * @param  {Object}   queryArgs JSON object that passes in the esri/tasks/query properties:  outFields, returnGeometry, whereClause, filterGeometry, orderByFields
     * @return {Deferred} Array of features (can be empty) or error object
     */
    runQuery: function(queryArgs) {
      var query = this._createEsriQuery(queryArgs.query);
      var deferredResult = new Deferred();
      var queryResult = new QueryTask(queryArgs.url).execute(query);
      queryResult.then(
        function(results) {
          if (results.features) {
            deferredResult.resolve(results.features);
          } else {
            deferredResult.resolve([]);
          }
        },
        function(error) {
          console.error('runQuery error: ' + error);
          deferredResult.reject(error);
        }
      );
      return deferredResult;
    },

    /**
     * internal function that creates the esri/tasks/query object
     * @param  {Object} queryArgs outFields, returnGeometry, whereClause, filterGeometry, orderByFields
     * @return {Query}            Query object
     */
    _createEsriQuery: function(queryArgs) {
      var query = new EsriQuery();
      lang.mixin(query, queryArgs);
      if (!queryArgs.where) {
        query.where = '1=1';
      }

      return query;
    },

    createQueryTaskExecute: function(url, query) {
      var queryTaskExecute = new QueryTask(url).execute(query);
      return queryTaskExecute;
    },

    //----------------------------------------------------
    // functions below are being used by UnifiedSearch

    createQuery: function(argObj) {
      var q = new EsriQuery();
      lang.mixin(q, argObj);
      return q;
    },

    createRelQuery: function(argObj) {
      var rq = new RelationshipQuery();
      lang.mixin(rq, argObj);
      return rq;
    },

    createAndRun: function(argObj) {
      argObj.query = this.createQuery(argObj.query);
      this.runQT(argObj);
    },

    createAndRunRelated: function(argObj) {
      argObj.rq = this.createRelQuery(argObj.rq);
      this.runRelated(argObj);
    },

    runQT: function(argObj) {
      topic.publish('query-start');
      var qt = new QueryTask(argObj.url);
      if (argObj.callbackArgs) {
        qt.execute(argObj.query,
            lang.hitch(argObj.self, argObj.callback, argObj.callbackArgs),
            this.genericErrback);
      } else {
        qt.execute(argObj.query,
            lang.hitch(argObj.self, argObj.callback),
            this.genericErrback);
      }
    },

    runRelated: function(argObj) {
      topic.publish('query-start');
      if (argObj.callbackArgs) {
        argObj.layerToQuery.queryRelatedFeatures(argObj.rq)
            .then(lang.hitch(argObj.self, argObj.callback, argObj.callbackArgs),
                this.genericErrback);
      } else {
        argObj.layerToQuery.queryRelatedFeatures(argObj.rq)
            .then(lang.hitch(argObj.self, argObj.callback),
                this.genericErrback);
      }
    },

    constructWhere: function(fieldValArr, joinStr) {
      var whereArr = _.map(fieldValArr, function(obj) {
        if (obj.newValue + 0 === obj.newValue) {
          return obj.fieldName + ' = ' + obj.newValue;
        }

        return obj.fieldName + ' = \'' + obj.newValue + '\'';
      });
      // hack to fix a bug in server 10.1...
      //whereArr.push(this.getDirtyStr());

      return whereArr.join(joinStr);
    },

    // TODO: this 'dirty' trick addresses a server bug and isn't
    // necessary except for AGS 10.1.
    getDirtyStr: function() {
      // hack to fix a bug in server 10.1...
      /*
      if (config.serverBug) {
          var dirty = (new Date()).getTime();
          return dirty + ' = ' + dirty;
      }
      */
      return '';
    },

    constructWhereOr: function(fieldValArr) {
      return this.constructWhere(fieldValArr, ' OR ');
    },

    constructWhereAnd: function(fieldValArr) {
      return this.constructWhere(fieldValArr, ' AND ');
    },

    genericErrback: function(error) {
      topic.publish('query-done');
      console.error('Generic errback', error);
    },

    checkResponseSuccess: function(response) {
      if (response.error) {
        this.genericErrback(response.error);
        return false;
      }

      return true;
    },

    checkFeatureExistence: function(response) {
      if (!response.features || response.features.length <= 0) {
        console.debug('no features found', response);
        return false;
      }

      return true;
    },

    checkSingleFeature: function(response) {
      if (response.features.length !== 1) {
        console.debug('not a single feature', response);
        return false;
      }

      return true;
    }
  };
});
