define([
  'dojo/number'
],
function(
    Number
) {
  return {

    /**
     * This creates a number which is suffixed
     */
    getNumberWithSuffix: function(value) {
      if (value !== 0) {
        if (value < 1000000000000000000) {
          if (value >= 10000000000000000) { //10 quadrillion
            value = Number.format(value / 1000000000000000, {
              places: 0
            }) + 'Q'; //1 quadrillion
          } else if (value >= 1000000000000000) { //1 quadrillion
            value = Number.format(value / 1000000000000000, {
              places: 1
            }) + 'Q'; //1 quadrillion
          } else if (value >= 10000000000000) { //10 trillion
            value = Number.format(value / 1000000000000, {
              places: 0
            }) + 'T'; //1 trillion
          } else if (value >= 1050000000000) { //1 trillion
            value = Number.format(value / 1000000000000, {
              places: 1
            }) + 'T'; //1 trillion
          } else if (value >= 1000000000000) { //1 trillion
            value = Number.format(value / 1000000000000, {
              places: 0
            }) + 'T'; //1 trillion
          } else if (value >= 10000000000) { //10 billion
            value = Number.format(value / 1000000000, {
              places: 0
            }) + 'B';
          } else if (value >= 1050000000) { //1 billion
            value = Number.format(value / 1000000000, {
              places: 1
            }) + 'B';
          } else if (value >= 1000000000) { //1 billion
            value = Number.format(value / 1000000000, {
              places: 0
            }) + 'B';
          } else if (value >= 10000000) { //10 million
            value = Number.format(value / 1000000, {
              places: 0
            }) + 'M';
          } else if (value >= 1050000) { //1 million
            value = Number.format(value / 1000000, {
              places: 1
            }) + 'M';
          } else if (value >= 1000000) { //1 million
            value = Number.format(value / 1000000, {
              places: 0
            }) + 'M';
          } else if (value >= 10000) {
            value = Number.format(value / 1000, {
              places: 0
            }) + 'K';
          } else if (value >= 1050) {
            value = Number.format(value / 1000, {
              places: 1
            }) + 'K';
          } else if (value >= 1000) {
            value = Number.format(value / 1000, {
              places: 0
            }) + 'K';
          } else {
            value = Number.format(value, {
              places: 0
            });
          }

        }
      }

      return value;
    }

  };
});
