define([
  'dojo/_base/declare',
  'dojo/topic',
  'dojo/_base/lang',
  'esri/request'
], function(declare, topic, lang, esriRequest) {

  return {
    isSync: false,
    hasProxy: false,

    get: function(args) {
      var promise = esriRequest({
        url: args.url,
        handleAs: 'json',
        sync: this.isSync,
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
        sync: this.isSync,
        timeout: timeoutValue
      }, {
        usePost: true,
        useProxy: this.hasProxy
      });
      promise.then(lang.hitch(this, function(data) {
        console.log('RequestWrapper successfully received POST: ' + data);
      }), lang.hitch(this, function(error) {
        console.error('RequestWrapper error: ' + error.message);
      }));
      return promise;
    },

    setSync: function(isSync) {
      this.isSync = isSync;
    }

  };

});
