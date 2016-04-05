define(
    [
        'dojo/_base/lang',
        'dojo/Deferred',
        'dojo/_base/array',
        'esri/lang',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/tasks/StatisticDefinition',
        'esri/tasks/GeometryService',
        'esri/tasks/ProjectParameters',
        'esri/tasks/AreasAndLengthsParameters',
        'esri/tasks/LengthsParameters',
        'esri/tasks/RelationParameters'
    ],

    function(
        lang,
        Deferred,
        array,
        esriLang,
        EsriQuery,
        EsriQueryTask,
        EsriStatisticDefinition,
        GeometryService,
        ProjectParameters,
        AreaLengthParameters,
        LengthParameters,
        RelationParameters
    ) {

        var queryUtils = {

            createGroupQuery: function(aggregateFields, groupByFields, /*returnGeometry,*/ whereClause, orderByFields) {
                var statDefs = [];
                array.forEach(
                    aggregateFields,
                    lang.hitch(
                        this,
                        function(aggregateField, i) {
                            var statDef = new EsriStatisticDefinition();
                            statDef.statisticType = aggregateField.statType;
                            statDef.onStatisticField = aggregateField.onStatisticField;
                            statDef.outStatisticFieldName = aggregateField.outStatisticFieldName;
                            statDefs.push(statDef);
                        }
                    )
                );
                var query = new EsriQuery();
                query.groupByFieldsForStatistics = groupByFields;
                query.outStatistics = statDefs;
                // Add the group by fields for ease
                query.outFields = groupByFields;
                query.returnGeometry = false;
                query.where = whereClause;
                query.orderByFields = orderByFields;
                return query;
            },

            createQuery: function(outFields, returnGeometry, whereClause, filterGeometry, orderByFields) {
                var query = new EsriQuery();
                query.outFields = outFields;
                query.returnGeometry = returnGeometry;
                if (whereClause) {
                    query.where = whereClause;
                } else {
                    query.where = '1=1';
                }
                if (filterGeometry) {
                    query.geometry = filterGeometry;
                }
                if (orderByFields) {
                    query.orderByFields = orderByFields;
                }
                return query;
            },

            //TODO Add error handler
            runQuery: function(queryUrl, query) {
                var deferredResult = new Deferred();
                var queryResult = new EsriQueryTask(queryUrl).execute(query);
                queryResult.then(
                    function(results) {
                        if (results.features) {
                            deferredResult.resolve(results.features);
                        }
                        else {
                            deferredResult.resolve([]);
                        }
                    }
                );
                return deferredResult;
            },

            projectGeometries: function(geometryServiceUrl, geometries, outSR) {
                var geometryService = new GeometryService(geometryServiceUrl);
                var projParams = new ProjectParameters();
                projParams.outSR = outSR;
                projParams.geometries = geometries;
                return geometryService.project(projParams);
            },

            getLengths: function(geometryServiceUrl, polylines) {
                var geometryService = new GeometryService(geometryServiceUrl);
                var params = new LengthParameters();
                params.lengthUnit = GeometryService.UNIT_KILOMETER;
                params.calculationType = 'preserveShape';
                params.polylines = polylines;
                return geometryService.lengths(params);
            },

            getAreaAndPerimeters: function(geometryServiceUrl, polygons) {
                var geometryService = new GeometryService(geometryServiceUrl);
                var params = new AreaLengthParameters();
                //params.lengthUnit = GeometryService.UNIT_KILOMETER;
                //params.areaUnit = GeometryService.UNIT_SQUARE_KILOMETERS;
                params.lengthUnit = GeometryService.UNIT_STATUTE_MILE;
                params.areaUnit = GeometryService.UNIT_SQUARE_MILES;
                params.calculationType = 'preserveShape';
                params.polygons = polygons;
                return geometryService.areasAndLengths(params);
            },

            isWithin: function(geometryServiceUrl, containedGeos, containerGeos) {
                var geometryService = new GeometryService(geometryServiceUrl);
                var relationParams = new RelationParameters();
                relationParams.geometries1 = containedGeos;
                relationParams.geometries2 = containerGeos;
                relationParams.relation = RelationParameters.SPATIAL_REL_WITHIN;
                return geometryService.relation(relationParams);
            },

            isIntersecting: function(geometryServiceUrl, containedGeos, containerGeos) {
                var geometryService = new GeometryService(geometryServiceUrl);
                var relationParams = new RelationParameters();
                relationParams.geometries1 = containedGeos;
                relationParams.geometries2 = containerGeos;
                relationParams.relation = RelationParameters.SPATIAL_REL_INTERSECTION;
                return geometryService.relation(relationParams);
            },

            unionGeos: function(geometryServiceUrl, geometries) {
                var geometryService = new GeometryService(geometryServiceUrl);
                return geometryService.union(geometries);
            }

        };

        return queryUtils;

    }

);