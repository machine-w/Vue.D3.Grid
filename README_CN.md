
# Vue.D3.Grid
[![GitHub open issues](https://img.shields.io/github/issues/machine-w/Vue.D3.Grid.svg)](https://github.com/machine-w/Vue.D3.Grid/issues)
[![Npm version](https://img.shields.io/npm/v/vued3grid.svg)](https://www.npmjs.com/package/vued3grid)
[![npm download](https://img.shields.io/npm/dt/vued3grid.svg)](https://www.npmjs.com/package/vued3grid)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)


基于[D3.js](https://d3js.org/)引擎的网格操作vue组件


# demo

![demo](./documents/demo.gif)

# 在线实例

[ LIVE DEMO ](http://121.36.62.6:8080/index.html)




# 测试运行

``` bash
npm install
#yarn install

npm run dev
#yarn serve

npm run build
#yarn build

```




# 使用

## 安装库

``` js
 npm install vued3grid -S
```

## 调用例子


参考例子代码在 "example"目录，修改main.js文件中的引用代码为:

```js

import D3grid from 'vued3grid'
import Css from 'vued3grid/lib/vued3grid.css'
Vue.use(D3grid)
```

```html
<D3Grid ref="grid" class="grid" :reverseSelect="reverseSelect" :gridVisible="gridVisible" :selectPoints="selectPoints" :pointattr="createPoint" :viewPoints="viewPoints" :bgImg="bgImg" :viewBackgroud="viewBackgroud" :strokeWidth="vstrokeWidth" :Opacity="vOpacity" :operMode="operMode" :viewAttr="viewAttr" :marginX="Marginx" :marginY="Marginy" :data="griddata" :latticeWidth="latticeWidth"@clicked="onClick" ></D3Grid>
```
## 组件属性（Props）

| 参数名称      | required | 类型              | 默认值     | 描述 |
| ---       | ---     | ---                     | ---         | ---         |
| data      | yes    | `Object`                     | null        | 网格数据，包括格子的大小，位置和属性颜色，包括格子上的点的信息，具体数据可是可以参考mock目录的数据生成函数 ｜
| viewAttr | yes |  `String` |  ''     | 当前查看的格子数据中哪个属性的颜色 |
| operMode    | no | `enum`| 'single_select'  | 系统对网格的操作模式选择，支持的操作:'single_select':单选,'row_select'：行选择'col_select':列选择,'poly_select':多边形圈选,'line_select':折线选择,'rect_select':矩形选择,'draw_point':选择点与画点|
| reverseSelect   | no | `Boolean`  | false | 选择点时，是否反向选择，即返回的网格为选取范围外的点。（注：反向选择不支持单选） |
| latticeWidth   | no | `Number`  | 20 |  每个格子在画布上的宽度值（注：与数据中的真实宽度值不同） |
| strokeWidth   | no | `Number`  | 1 |  每个格子的边框在画布上的宽度值（注：与数据中的真实宽度值不同） |
| Opacity    | no | `Number`           | 1            | 格子透明度，取值0-1 |
| marginX    | no | `Number`          | 20       | 可操作区域的左边距 |
| marginY    | no | `Number`           | 20            | 可操作区域的上边距 |
| viewBackgroud   | no | `Boolean`  | false |  是否显示背景图 |
| bgImg | no |  `String` |  'bg.png'     | 背景图路径 |
| gridVisible   | no | `Number`  | 2 |  无效网格的显示方式：2:灰色显示,1:不显示,0:正常显示。（注：灰色显示和正常显示的情况下，无效网格可以被选择，不显示时不能被选中） |
| pointattr      | yes    | `Object`                     | null        | 画新的点的时候点的默认属性值（半径，圆心半径，外围颜色，核心颜色，默认附加属性），例： {radius:5,core_radius:1,color:"#ff0000",core_color:"#000000",attrs:{z: 100}} ｜
| viewPoints   | no | `Boolean`  | true |  是否显示点 |
| selectPoints   | no | `Boolean`  | true |  是否可以选择点 |

## 选择数据返回

为组件设置@clicked="onClick"事件处理函数：

```js
//evt对象包含三个属性：
//Lattices：被选择的格子对象列表
//Points： 被选择的点对象列表
//oper：当前所处的操作模：'single_select','row_select', 'col_select','poly_select','line_select','rect_select','draw_point'
//select_index：如果时行选择，列选择模式则发挥选择行列索引
onClick (evt) {
    this.currentIndex = evt.select_index
    this.currentOper = evt.oper
    if(this.currentOper =="draw_point"){
    this.currentPoint = evt.Points[0]
    }else{
    this.currentLattices = evt.Lattices
    this.currentPoints = evt.Points
    }
}

```


## 网格操作api

网格操作api,为异步操作，可以事先定义调用API的异步函数，例如下do函数。

网格操作包括：行分割，列分割，行合并，列合并，设置网格为有效，设置网格为无效，修改网格属性，修改点属性。

***注：以上操作都针对当前被选择的对象。***

```js
do (action,...args) {
    this.isLoading = true
    this.$refs['grid'][action](this.currentLattices,...args).then(() => { this.isLoading = false })
},
//修改网格属性
modifyNodeValue () {
    this.do('modifyCurAttr',this.v_zone,this.v_color,this.v_value)
},
//设置网格为无效
modifyNodeInvalid () {
    this.do('modifyCurInvalid')
},
//设置网格为有效
modifyNodeValid () {
    this.do('modifyCurValid')
},
//修改点属性
//例：
// currentPoint:{
//           index:-1,
//           x: 0,
//           y: 0,
//           radius: 0,
//           core_radius: 0,
//           color: '',
//           core_color:'',
//           attrs:{z:10}
//           },
modifyPointValue () {
    this.do('modifyPointValue',this.currentPoint)
},
//分割行
splitRow(){
    this.currentOper = null
    this.do('splitRow',this.currentIndex,this.splitRate/100)
},
//合并行
//useSecondValue：合并后的节点属性是否取后面的一行
joinRow(){
    this.currentOper = null
    this.do('joinRow',this.currentIndex,this.useSecondValue)
},
//分割列
splitCol(){
    this.currentOper = null
    this.do('splitCol',this.currentIndex,this.splitRate/100)
},
//分割列
//useSecondValue：合并后的节点属性是否取后面的一列
joinCol(){
    this.currentOper = null
    this.do('joinCol',this.currentIndex,this.useSecondValue)
},
```


