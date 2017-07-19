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
  'dojo/_base/lang',
  'esri/request'
], function(lang, esriRequest) {

  return {
    //isSync: false,
    hasProxy: false,

    get: function(args) {
      var promise = esriRequest({
        url: args.url,
        handleAs: 'json',
        //sync: this.isSync,
        content: args.params
      }, {
        usePost: false,
        useProxy: this.hasProxy
      });
      promise.then(function(result) {}, lang.hitch(this, function(error) {
        console.error('esriRequest error: ' + error);
      }));
      return promise;
    },

    post: function(args) {
      var timeoutValue = 60000; // 1 minute
      if (args.timeout || args.timeout === 0) {
        timeoutValue = args.timeout;
      }

      var promise = esriRequest({
        url: args.url,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        rawBody: JSON.stringify(args.params),
        handleAs: 'json',
        //sync: this.isSync,
        timeout: timeoutValue
      }, {
        usePost: true,
        useProxy: this.hasProxy
      });
      promise.then(function(result) { }, lang.hitch(this, function(error) {
        console.error('esriRequest error: ' + error);
      }));
      return promise;
    }

  };

});
