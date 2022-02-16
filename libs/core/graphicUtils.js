define([
    'dojo/_base/declare',
    'esri/graphic',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol'
], function (
    dojoDeclare,
    EsriGraphic,
    EsriSFS,
    EsriSLS,
    EsriSMS
) {
    return dojoDeclare(null, {
        currentGraphic : null,

        currentSymbol : null,

        m : null,

        defaultMarkerSymbol : {
            "type": "esriSMS",
             "style": "esriSMSCircle",
             "color": [250, 248, 155, 125],
             "size": 16,
             "outline": {
                "color": [46, 204, 57, 255],
                "width": 2
              }
        },

        defaultLineSymbol : {
            "type": "esriSLS",
            "style": "esriSLSSolid",
            "color": [46, 204, 57, 255],
            "width": 2
        },

        defaultFillSymbol :{
            "type": "esriSFS",
            "style": "esriSFSSolid",
            "color": [250, 248, 155, 125],
            "outline": {
                "type": "esriSLS",
                "style": "esriSLSSolid",
                "color": [46, 204, 57, 255],
                "width": 2
            }
        },
        
        /**
         * 
         */
        constructor: function (map) {
            this.m = map;
        },

        /**
         * 
         */
        drawGraphic: function(geo){
            this.currentGraphic = new EsriGraphic(geo);
            
            this.currentSymbol = this._getSymbology();

            this.currentGraphic.setSymbol(this.currentSymbol);

            this.m.graphics.add(this.currentGraphic);
        },

        /**
         * 
         */
        removeGraphic: function () {
            this.m.graphics.remove(this.currentGraphic);
        },

        /**
         * 
         */
        _getSymbology: function () {
            switch (this.currentGraphic.geometry.type) {
                case 'point':
                case 'multipoint':
                    return new EsriSMS(this.defaultMarkerSymbol);
                    break;
                case 'polyline':
                    return new EsriSLS(this.defaultLineSymbol);
                    break;
                case 'polygon':
                case 'extent':
                    return new EsriSFS(this.defaultFillSymbol);
                    break;
                
            }
        }
    });
});