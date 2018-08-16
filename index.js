import LcCity from './src/lc-city-selector.js';

var baseInput = document.getElementById('base');
var defaultInput = document.getElementById('default');

var baseCity = new LcCity({
  confirm: function (data) {
    console.log(data);
    baseInput.innerHTML = data;
  }
});

baseInput.addEventListener('click', function(e) {
  baseCity.show(this);
});

// 有默认选项，进行回填
var defaultCity = new LcCity({
  data: {
    province: '江西省',
    city    : '南昌市',
    district: '青山湖区',
  },
  confirm: function (data) {
    console.log(data);
    defaultInput.innerHTML = data;
  }
});
defaultInput.addEventListener('click', function() {
  defaultCity.show(this);
});