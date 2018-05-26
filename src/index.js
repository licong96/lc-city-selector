import LcCity from './lc-city.js';




var baseInput = document.getElementById('base');
var defaultInput = document.getElementById('default');

var baseCity = new LcCity({
  cancel: function () {
  },
  confirm: function (data) {
    console.log('confirm', data)
    baseInput.value = data
  }
});

baseInput.addEventListener('click', function() {
  baseCity.show();
});