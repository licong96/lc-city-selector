import './lc-city-selector.css';
import cityData from './data.json';
import _lc from './util.js';
// import { removeListener } from 'cluster';

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

    this.isFill = false;    // 是不是回填
    this.fillCount = {};    // 记录回填的次数
    // 判断是否有data数据，有就是回填
    if (option && option.data) {
      this.isFill = true;
    };
    this.timeNav = null;   // 防止导航渲染重复渲染

    // 生成一个随机数
    this.randomNum = parseInt(Math.random() * 1000);
    
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
      this.handerTouch();
    }, 30);
  }
  // 渲染页面
  renderHtml() {
    let html = `<div class="lc-city-body">
                  <div class="lc-titile">
                    <button class="lc-btn lc-cancel lc_cancel">取消</button>
                    <h4 class="lc-top-title">选择地区</h4>
                    <button class="lc-btn lc-cancel lc_confirm">确定</button>
                  </div>
                  <div class="lc-nav-wrap lc_nav">
                    <span class="lc-nav active">请选择</span>
                  </div>
                  <div class="lc-center lc_center">
                    <ul class="lc-ul">
                    <div class="lc-scroll lc_province">
                    </div>
                    </ul>
                    <ul class="lc-ul">
                      <div class="lc-scroll lc_city">
                      </div>
                    </ul>
                    <ul class="lc-ul">
                      <div class="lc-scroll lc_district">
                      </div>
                    </ul>
                  </div>
                </div>
                <div class="lc-city-mask lc_city_mask"></div>
                <div class="lc-error-tip lc_error_tip"></div>`;

    let div = document.createElement('div');
    div.className = 'lc-city-select';
    div.id = 'lcCitySelect' + this.randomNum;
    div.innerHTML = html;
    document.body.appendChild(div);
  }
  // 获取页面元素
  getElement() {
    // 页面元素
    let lcCitySelect = document.getElementById('lcCitySelect' + this.randomNum);
    this.el = {
      lcCitySelect: lcCitySelect,
      lcCityMask  : lcCitySelect.getElementsByClassName('lc_city_mask')[0],
      lcErrorTip  : lcCitySelect.getElementsByClassName('lc_error_tip')[0],
      lcCancel    : lcCitySelect.getElementsByClassName('lc_cancel')[0],
      lcConfirm   : lcCitySelect.getElementsByClassName('lc_confirm')[0],
      lcNav       : lcCitySelect.getElementsByClassName('lc_nav')[0],
      lcCenter    : lcCitySelect.getElementsByClassName('lc_center')[0],
      lcProvince  : lcCitySelect.getElementsByClassName('lc_province')[0],
      lcCity      : lcCitySelect.getElementsByClassName('lc_city')[0],
      lcDistrict  : lcCitySelect.getElementsByClassName('lc_district')[0],
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
      // errMsg = '';
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
    let html = this._renderList(arr);
    if (html) {
      this.el.lcProvince.innerHTML = html;
      this.onProvince();    // 给每个省份添加事件
    }
  }
  // 渲染城市
  renderCity(arr) {
    let html = this._renderList(arr);
    if (html) {
      this.el.lcCity.innerHTML = html;
      this.onCity();    // 给每个城市添加事件
  
      // 判断是否回填城市
      if (this.isFill && !this.fillCount.city) {
        this.fillCount.city = true;     // 只回填一次，否则要出大事
        this.fillCity()
      }
    }
  } 
  // 渲染区域
  renderDistrict(arr) {
    let html = this._renderList(arr);
    if (html) {
      this.el.lcDistrict.innerHTML = html;
      this.onDistrict();    // 给每个区域添加事件
  
      // 判断是否回填区域
      if (this.isFill && !this.fillCount.district) {
        this.fillCount.district = true;
        this.fillDistrict()
      }
    }
  }
  // 列表渲染列表函数，返回html
  _renderList(arr) {
    if (!arr.length) {
      return false;
    };

    let html = '';
    for (let i = 0, leng = arr.length; i < leng; i++) {
      html += `<li class="lc-li" data-val="${arr[i]}">${arr[i]}</li>`
    };
    return html;
  }
  // 根据省份获取城市数据
  getDataCity(province) {
    if (province === this.select.province) {
      return
    };

    this.select.province = province;  // 保存已选中的省份
    this.el.lcDistrict.innerHTML = '';    // 选择省份的时候，没有选中城市，要去掉区域

    this.select.city = '';  // 更改省份之后，清空城市和区域
    this.select.district = '';  // 更改省份之后，清空城市和区域
    this.renderNav();   // 渲染导航，要在数据清除之后

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
  // 根据城市获取区域数据
  getDataDistrict(city) {
    if (city === this.select.city) {
      return
    };
    
    this.select.city = city;  // 保存已选中的城市
    this.select.district = '';  // 更改城市之后，清空区域
    this.renderNav();       // 渲染导航
    this.addTranx();        // 添加偏移

    let ShortData = this.ShortData,    // 省份下城市的所有数据
        arr       = [];

    for (var key in ShortData) {
      if (key === city) {
        arr = ShortData[key]
      }
    };

    this.renderDistrict(arr);    // 渲染区域
  }
  // 给每个省份添加事件
  onProvince() {
    let lcProvince  = this.el.lcProvince,
        aLi         = lcProvince.getElementsByTagName('li'),
        _this       = this,
        val         = '';
    
    for (let i = 0, length = aLi.length; i < length; i++) {
      aLi[i].addEventListener('click', function() {
        // 先删除所有的class, 再给当前元素添加class
        for (let i = 0, length = aLi.length; i < length; i++) {
          _lc.removeClass(aLi[i], 'active');
        };
        _lc.addClass(this, 'active');

        // 拿到选中的省份，根据省份拿城市
        _this.getDataCity(this.getAttribute('data-val'));
      });
    };
  }
  // 给每个城市添加事件
  onCity() {
    let lcCity  = this.el.lcCity,
        aLi     = lcCity.getElementsByTagName('li'),
        _this   = this,
        val     = '';
    
    for (let i = 0, length = aLi.length; i < length; i++) {
      aLi[i].addEventListener('click', function() {
        // 先删除所有的class, 再给当前元素添加class
        for (let i = 0, length = aLi.length; i < length; i++) {
          _lc.removeClass(aLi[i], 'active');
        };
        _lc.addClass(this, 'active');

        // 拿到选中的城市，根据城市拿地区
        _this.getDataDistrict(this.getAttribute('data-val'));
      });
    };
  }
  // 给每个区域添加事件
  onDistrict() {
    let lcDistrict  = this.el.lcDistrict,
        aLi         = lcDistrict.getElementsByTagName('li'),
        _this       = this,
        val         = '';
    
    for (let i = 0, length = aLi.length; i < length; i++) {
      aLi[i].addEventListener('click', function() {
        // 先删除所有的class, 再给当前元素添加class
        for (let i = 0, length = aLi.length; i < length; i++) {
          _lc.removeClass(aLi[i], 'active');
        };
        _lc.addClass(this, 'active');

        val = this.getAttribute('data-val');
        // 判断是否点击相同选项
        if (val !== _this.select.district) {
          _this.select.district = val;  // 保存已选中的城市
          _this.renderNav();
        }
      });
    };
  }

  // 渲染导航
  renderNav() {
    var _line = () => {
      let lcNav   = this.el.lcNav,
          aSpan   = lcNav.getElementsByTagName('span'),
          select  = this.select,
          index   = 0,    // 下标记录
          html    = '';
  
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
  
        // 如果是回填，这里添加class有点不一样了
        if (this.isFill) {
          this.fillCount.nav = true;    // 只执行一次
          for (let i = 0, length = aSpan.length; i < length; i++) {
            _lc.removeClass(aSpan[i], 'active');
          };
          _lc.addClass(aSpan[aSpan.length-1], 'active');   // 给对应的选项添加class
        };
      }, 30);
      
      this.onNav();   // 给导航添加事件
    };
    
    if (this.isFill) {
      this.timeNav && clearTimeout(this.timeNav);
      // 防止重复渲染，已提高性能
      this.timeNav = setTimeout(() => {
        _line();
      }, 30);
    }
    else {
      _line();
    };
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
  // 获取选中的数据，直接返回一个对象
  getSelectObj() {
    return this.select;
  }

  // 打开，可以把当前点击触发打开的元素过来，pc端可以用到他的位置
  show(event) {
    // 判断是不是pc端打开
    if (_lc.getPageSize().windowWidth > 768 && event) {
      let offset = _lc.getOffset(event),
          height = event.offsetHeight;
          
      this.el.lcCitySelect.style.top = offset.top + height + 'px';
      this.el.lcCitySelect.style.left = offset.left + 'px';
    };
    
    _lc.addClass(this.el.lcCitySelect, 'lc-show');
    // 回填
    if (this.isFill && !this.fillCount.show) {
      this.fillCount.show = true;
      this.backfill();
    }
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

  // 数据回填
  backfill() {
    let data    = this.option.data;

    if (Object.keys(data).length !== 3) {
      console.error('data里面的数据有问题，长度必须是3位');
      return;
    };

    for (let key in data) {
      if (key === 'province' && data[key]) {
        // select.province = data[key];
      }
      else if (key === 'city' && data[key]) {
        // select.city = data[key];
      }
      else if (key === 'district' && data[key]) {
        // select.district = data[key];
      }
      else {
        console.error('请检查你传入的字段是否匹配 ' + key);
        return
      }
    };
    this.fillProvince();    // 回填省份
  }
  // 回填省份
  fillProvince() {
    let province    = this.option.data.province,
        lcProvince  = this.el.lcProvince,
        aLi         = lcProvince.getElementsByTagName('li'),
        liHeight    = aLi[0].offsetHeight;  // 一个li的高度

    for (let i = 0, length = aLi.length; i < length; i++) {
      if (aLi[i].getAttribute('data-val') === province) {
        _lc.addClass(aLi[i], 'active');
        // 设置滚动位置，让当前选中的元素居中显示
        i > 5 ? (lcProvince.scrollTop = (i - 4) * liHeight) : '';
      }
    };

    this.getDataCity(province);
  }
  // 回填城市
  fillCity() {
    let city      = this.option.data.city,
        lcCity    = this.el.lcCity,
        aLi       = lcCity.getElementsByTagName('li'),
        liHeight  = aLi[0].offsetHeight;  // 一个li的高度

    for (let i = 0, length = aLi.length; i < length; i++) {
      if (aLi[i].getAttribute('data-val') === city) {
        _lc.addClass(aLi[i], 'active');
        // 设置滚动位置，让当前选中的元素居中显示
        i > 5 ? (lcCity.scrollTop = (i - 4) * liHeight) : '';
      }
    };

    this.getDataDistrict(city);
  }
  // 回填区域
  fillDistrict() {
    let district      = this.option.data.district,
        lcDistrict    = this.el.lcDistrict,
        aLi           = lcDistrict.getElementsByTagName('li'),
        liHeight      = aLi[0].offsetHeight;  // 一个li的高度

    for (let i = 0, length = aLi.length; i < length; i++) {
      if (aLi[i].getAttribute('data-val') === district) {
        _lc.addClass(aLi[i], 'active');
        // 设置滚动位置，让当前选中的元素居中显示
        i > 5 ? (lcDistrict.scrollTop = (i - 4) * liHeight) : '';
      }
    };
    // 最后，填入区域选项
    this.select.district = this.option.data.district;
    this.renderNav();
  }


  // 添加滑动时间
  handerTouch() {
    let { lcCenter } = this.el;

    let pageX, pageY, pageXMove, pageYMove;

    // 这里加一个触屏事件就可以解决一个移动端滑动bug
    lcCenter.addEventListener('touchstart', function (e) {
      // console.log(e)
      // pageX = e.touches[0].pageX;
      // pageY = e.touches[0].pageY;

      // this.addEventListener('touchmove', function (e) {
      //   pageXMove = pageX - e.touches[0].pageX;
      //   pageYMove = pageY - e.touches[0].pageY;

      //   console.log(pageXMove, pageYMove)

      //   lcCenter.style.transition = 'none';
      //   lcCenter.style.transform = `translate3d(${-pageXMove}px, 0, 0)`

      //   this.addEventListener('touchend', function () {


      //     return false;
      //   })
      // })
    })


  }
};
