# 省-市-区三级联动城市选择器
----------
## 效果 ##
演示地址：[https://licong96.github.io/work/lc-city-selector/index.html][1]

![效果][2]
## 无依赖 ##
纯js手写，不依赖任何插件，用在移动端比较好，你如果非要用在PC端，我也拦不住你。

## 微信小程序版-城市选择器 ##
[https://github.com/licong96/WeChat-city][3]

## 安装 ##
npm安装或者cnpm：

        npm install lc-city-selector --save
yarn安装：

        yarn add lc-city-selector
        
## 使用 ##
        
        import LcCity from 'lc-city-selector';
    
        var City = new LcCity();    // 创建实例化对象
        City.show();    // 执行show方法
## confirm ##
回调函数，可以在里面拿到选中的地区

        import LcCity from 'lc-city-selector';
        var City = new LcCity({
            confirm: function (data) {
                console.log(data);  // data就是选中的地区，一个拼接好的字符串
            }
        });
        
        ----------
        如果你不想用回调的方式
        可以用`City.getSelect()`方法直接获取当前选中的地区

## 数据回填 ##
如果你已经有了数据，想要回填进去，可以加一个`data`参数，但是要注意它的格式
 
        import LcCity from 'lc-city-selector';
        var City = new LcCity({
            data: {
                province: '江西省',
                city    : '南昌市',
                district: '青山湖区',
            }
        });
        
        注意：键要相同，值要完整，省、市、区这几个字不要省略
## 参数 ##
| 参数          |     类型  |   说明                        |  默认值 |
| :--------:    | :-----:   | :----:                        | :----:  |
| data          | Object    | 需要回填的数据                |   空    |
| confirm       | Function  | 触发确定按钮，返回选中的地区  |   空    |
| cancel        | Function  | 触发取消按钮，没有返回值      |   空    |

## API ##

 1. `show()`，打开选择器
 2. `close()`，关闭选择器
 3. `getSelect()`，获取当前选中的区域，已拼接成了一个字符串
 4. `getSelectObj()`，获取当前选中的区域，返回的是一个对象

## 电脑端需要注意 ##
虽然样式上已经做了兼容，但是选择器的位置有偏移，所以在电脑上打开需要传入一个元素，我会把元素距离屏幕的位置，赋值给选择器，让选择器和元素凑在一起

        import LcCity from 'lc-city-selector';
    
        var City = new LcCity();    // 创建实例化对象
        
        // 假设有一个id为input的元素，点击它来打开选择器
        
        var oInput =  document.getElementById('input');
        
        oInput.addEventListener('click', function() {
          City.show(this);  // 这里的this指向的是oInput
        });
        


----------


欢迎提出建议和问题，我会第一时间处理
    


  [1]: https://licong96.github.io/work/lc-city-selector/index.html
  [2]: https://licong96.github.io/lib/image/gif/lc-city-selector.gif
  [3]: https://github.com/licong96/WeChat-city
