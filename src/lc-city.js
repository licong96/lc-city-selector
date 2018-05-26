import './lc-city.scss';
import cityData from './data.json';
import _lc from './util.js';

export default class LcCity {
  constructor(option) {
    this.option = option;
    this.el = {}; // 存储页面元素
    // 选中的数据
    this.select = {
      province: '',
      city    : '',
      district: '',
    };
    // 临时保存城市数据，后有大用
    this.ShortData = {};

    this.init();
  }

  // 初始化
  init() {
    this.renderHtml();
    this.getElement();
    // 其他绑定要放到消息队里中
    setTimeout(() => {
      this.getDataProvince();
      this.bindEvent();
    }, 30);
  }
  // 渲染页面
  renderHtml() {
    let html = `<div class="lc-city-body">
                  <div class="lc-titile">
                    <button class="lc-btn lc-cancel" id="lcCancel">取消</button>
                    <h4 class="lc-top-title">选择地区</h4>
                    <button class="lc-btn lc-cancel" id="lcConfirm">确定</button>
                  </div>
                  <div class="lc-nav-wrap" id="lcNav">
                    <span class="lc-nav active">请选择</span>
                  </div>
                  <div class="lc-center" id="lcCenter">
                    <ul class="lc-ul">
                      <div class="lc-scroll" id="lcProvince">
                      </div>
                    </ul>
                    <ul class="lc-ul">
                      <div class="lc-scroll" id="lcCity">
                      </div>
                    </ul>
                    <ul class="lc-ul">
                      <div class="lc-scroll" id="lcDistrict">
                      </div>
                    </ul>
                  </div>
                </div>
                <div class="lc-city-mask" id="lcCityMask"></div>
                <div class="lc-error-tip" id="lcErrorTip"></div>`;

    let div = document.createElement('div');
    div.className = 'lc-city-select';
    div.id = 'lcCitySelect';
    div.innerHTML = html;
    document.body.appendChild(div);
  }
  // 获取页面元素
  getElement() {
    // 页面元素
    this.el = {
      lcCitySelect: document.getElementById('lcCitySelect'),
      lcCityMask  : document.getElementById('lcCityMask'),
      lcErrorTip  : document.getElementById('lcErrorTip'),
      lcCancel    : document.getElementById('lcCancel'),
      lcConfirm   : document.getElementById('lcConfirm'),
      lcNav       : document.getElementById('lcNav'),
      lcCenter    : document.getElementById('lcCenter'),
      lcProvince  : document.getElementById('lcProvince'),
      lcCity      : document.getElementById('lcCity'),
      lcDistrict  : document.getElementById('lcDistrict'),
    };
  }
  // 事件
  bindEvent() {
    let confirm = this.option.confirm,
        cancel  = this.option.cancel,
        select  = this.select,
        errMsg  = '';

    // 取消
    this.el.lcCancel.addEventListener('click', () => {
      typeof cancel === 'function' && cancel();
      this.close();
    });
    // 确定
    this.el.lcConfirm.addEventListener('click', () => {
      for (let key in select) {
        if (!select[key]) {
          switch (key) {
            case 'province':
              errMsg = '请选择省份'
            break;
            case 'city':
              errMsg = '请选择城市'
            break;
            default:
              errMsg = '请选择地区'
            break;
          }
          this.errorTip(errMsg);
          return;
        }
      };
      typeof confirm === 'function' && confirm(this.getSelect());
      this.close();
    });

    // 点击模态框也可以关闭
    this.el.lcCityMask.addEventListener('click', () => {
      this.close();
    });
  }

  // 获取省份数据
  getDataProvince() {
    var arr = [];
    for (var key in cityData) {
      arr.push(key);
    };
    this.renderProvince(arr);   // 渲染省份
  }
  // 渲染省份
  renderProvince(arr) {
    if (!arr.length) {
      return;
    };
    let html = '';
    for (let i = 0, leng = arr.length; i < leng; i++) {
      html += `<li class="lc-li" data-val="${arr[i]}">${arr[i]}<i class="icon"></i></li>`
    };
    this.el.lcProvince.innerHTML = html;

    this.onProvince();    // 给每个省份添加事件
  }
  // 根据省份获取城市数据
  getDataCity(province) {
    if (province === this.select.province) {
      console.log('点了同一个没有什么意思啊')
      return
    };

    this.select.city = '';  // 更改省份之后，清空城市和区域
    this.select.district = '';  // 更改省份之后，清空城市和区域
    let arr = [];

    for (var key in cityData) {
      if (key === province) {
        this.ShortData = cityData[key];    // 保存省份下城市的所有数据，选中区域用到
        for (var key in cityData[key]) {
          arr.push(key);
        };
        break
      };
    };
    this.renderCity(arr);   // 渲染城市
  } 
  // 渲染城市
  renderCity(arr) {
    if (!arr.length) {
      return;
    };
    let html = '';
    for (let i = 0, leng = arr.length; i < leng; i++) {
      html += `<li class="lc-li" data-val="${arr[i]}">${arr[i]}<i class="icon"></i></li>`
    };
    this.el.lcCity.innerHTML = html;

    this.onCity();    // 给每个城市添加事件
  } 
  // 根据城市获取区域数据
  getDataDistrict(city) {
    if (city === this.select.city) {
      console.log('点了同一个没有什么意思啊')
      return
    };
    this.select.district = '';  // 更改城市之后，清空区域

    let ShortData = this.ShortData,    // 省份下城市的所有数据
        arr       = [];

    for (var key in ShortData) {
      if (key === city) {
        arr = ShortData[key]
      }
    };

    this.renderDistrict(arr);    // 渲染区域
  }
  // 渲染区域
  renderDistrict(arr) {
    if (!arr.length) {
      return;
    };
    let html = '';
    for (let i = 0, leng = arr.length; i < leng; i++) {
      html += `<li class="lc-li" data-val="${arr[i]}">${arr[i]}<i class="icon"></i></li>`
    };
    this.el.lcDistrict.innerHTML = html;

    this.onDistrict();    // 给每个区域添加事件
  }
  // 给每个省份添加事件
  onProvince() {
    let lcProvince  = this.el.lcProvince,
        aLi         = lcProvince.getElementsByTagName('li'),
        _this       = this,
        val         = '',
        previous    = null;    // 上一个选项
    
    for (let i = 0, length = aLi.length; i < length; i++) {
      aLi[i].addEventListener('click', function() {
        // 给当前元素添加class，删除上一个class
        previous && _lc.removeClass(previous, 'active');
        _lc.addClass(this, 'active');
        previous = this;

        val = this.getAttribute('data-val');
        _this.getDataCity(val);   // 拿到选中的省份，根据省份拿城市
        _this.select.province = val;  // 保存已选中的省份
        _this.renderNav();
        _this.el.lcDistrict.innerHTML = '';    // 选择省份的时候，没有选中城市，要去掉区域
      });
    };
  }
  // 给每个城市添加事件
  onCity() {
    let lcCity  = this.el.lcCity,
        aLi         = lcCity.getElementsByTagName('li'),
        _this       = this,
        val         = '',
        previous    = null;    // 上一个选项
    
    for (let i = 0, length = aLi.length; i < length; i++) {
      aLi[i].addEventListener('click', function() {
        // 给当前元素添加class，删除上一个class
        previous && _lc.removeClass(previous, 'active');
        _lc.addClass(this, 'active');
        previous = this;

        val = this.getAttribute('data-val');
        _this.getDataDistrict(val);   // 拿到选中的城市，根据城市拿地区
        _this.select.city = val;  // 保存已选中的城市
        _this.renderNav();    // 渲染导航
        _this.addTranx();
      });
    };
  }
  // 给每个区域添加事件
  onDistrict() {
    let lcDistrict  = this.el.lcDistrict,
        aLi         = lcDistrict.getElementsByTagName('li'),
        _this       = this,
        val         = '',
        previous    = null;    // 上一个选项
    
    for (let i = 0, length = aLi.length; i < length; i++) {
      aLi[i].addEventListener('click', function() {
        // 给当前元素添加class，删除上一个class
        previous && _lc.removeClass(previous, 'active');
        _lc.addClass(this, 'active');
        previous = this;

        val = this.getAttribute('data-val');
        _this.select.district = val;  // 保存已选中的城市
        _this.renderNav();
      });
    };
  }

  // 渲染导航
  renderNav() {
    // for (let key in select) {
    //   if (select[key] === val) {
    //     console.log('点了同一个没有什么意思啊')
    //     return
    //   }
    // };

    let lcNav   = this.el.lcNav,
        aSpan   = lcNav.getElementsByTagName('span'),
        select  = this.select,
        index   = 0,    // 下标记录
        html    = '';

    console.log(this.select)
    for (let key in select) {
      if (select[key]) {
        html += `<span class="lc-nav">${select[key]}</span>`;
        index++
      }
      else {
        html += `<span class="lc-nav">请选择</span>`;
        if (index === 1) {    // 选中省份的时候，只需要个请选择项
          break
        }
      }
    };
    lcNav.innerHTML = html;
    setTimeout(() => {
      _lc.addClass(aSpan[index-1], 'active');   // 给对应的选项添加class
    }, 30);
    
    this.onNav();   // 给导航添加事件
  }
  // 给导航添加事件
  onNav() {
    let lcNav     = this.el.lcNav,
        aSpan     = lcNav.getElementsByTagName('span'),
        length    = aSpan.length;

    for (let i = 0; i < length; i++) {
      aSpan[i].addEventListener('click', () => {

        for (let i = 0; i < length; i++) {
          _lc.removeClass(aSpan[i], 'active');
        }
        _lc.addClass(aSpan[i], 'active');

        // 导航点击功能只是起到一个容器滑动的作用
        if (i === 0 || i=== 1) {
          this.removeTranx();
        }
        else {
          this.addTranx();
        }
      });
    };
  }

  // 错误提示
  errorTip(errMsg) {
    let lcErrorTip = this.el.lcErrorTip;

    lcErrorTip.innerHTML = errMsg;

    _lc.addClass(lcErrorTip, 'lc-show');
    setTimeout(() => {
      _lc.removeClass(lcErrorTip, 'lc-show');
    }, 1500);
  }

  // 选中第二几城市的时候，容器要偏移
  addTranx() {
    let lcCenter = this.el.lcCenter;
    if (!_lc.hasClass(lcCenter, 'tranx')) {
      _lc.addClass(lcCenter, 'tranx');
    }
  }
  // 取消容器的偏移
  removeTranx() {
    let lcCenter = this.el.lcCenter;
    if (_lc.hasClass(lcCenter, 'tranx')) {
      _lc.removeClass(lcCenter, 'tranx');
    }
  }

  // 获取选中的数据，拼接成一个字符串
  getSelect() {
    let select  = this.select,
        str     = '';

    for (let key in select) {
      str += select[key] + ' ';
    };
    return str;
  }

  // 打开
  show() {
    _lc.addClass(this.el.lcCitySelect, 'lc-show');
  }
  // 关闭
  close() {
    let lcCitySelect = this.el.lcCitySelect;
    _lc.addClass(lcCitySelect, 'lc-close');

    setTimeout(() => {
      _lc.removeClass(lcCitySelect, 'lc-show');
      _lc.removeClass(lcCitySelect, 'lc-close');
    }, 300);
  }
};
