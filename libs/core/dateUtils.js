define([
  'dojo/_base/lang',
  'dojo/date',
  'dojo/date/stamp',
  'dojo/date/locale'

], function(lang, date, stamp, locale) {
  return {

    getDate: function(timeStamp, options) {
      var _options = lang.mixin({
        selector: 'date'
      }, options);
      return locale.format(this._getDateObject(timeStamp), _options); // 'd MMM yyyy' // 'yyyy-MM-dd'
    },

    getTime: function(timeStamp, options) {
      var _options = lang.mixin({
        selector: 'time'
      }, options);
      return locale.format(this._getDateObject(timeStamp), _options); // 'H:m'
    },

    getDateTime: function(timeStamp, options) {
      return locale.format(this._getDateObject(timeStamp), options);
    },

    isToday: function(strDate) {
      var arrDate = strDate.split('/');
      var dateToCompare = new Date(parseInt(arrDate[0], 10), parseInt(arrDate[1], 10) - 1, parseInt(arrDate[2], 10));
      return (date.difference(dateToCompare) === 1);
    },

    _getDateObject: function(timeStamp) {
      var timeStampObj = (timeStamp) ? timeStamp : Date.now();
      return stamp.fromISOString(timeStampObj);
    }

  };

});
