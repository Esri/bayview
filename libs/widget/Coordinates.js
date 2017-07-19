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
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',

  'dojo/_base/lang',
  'dojo/_base/connect',

  'esri/geometry/webMercatorUtils',

  'dojo/text!./Coordinates/Coordinates.html'
],

function(
  declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
  lang, connect,
  webMercatorUtils,
  template
) {

  // main geolocation widget
  return declare('widget/Coordinates', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString: template,
    widgetsInTemplate: true,

    postCreate: function() {
      this.inherited(arguments);

      connect.connect(this.map, 'onMouseMove', lang.hitch(this, 'showCoordinates'));
      connect.connect(this.map, 'onMouseDrag', lang.hitch(this, 'showCoordinates'));
    },

    startup: function() {
      console.log('Coordinates started');
    },

    showCoordinates: function(evt) {
      // get mapPoint from event
      // The map is in web mercator - modify the map point to display the results in geographic
      var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
      // display mouse coordinates
      this.mapCoordinatesContent.innerHTML = mp.x.toFixed(3) + ', ' + mp.y.toFixed(3);
    }

  });

});
