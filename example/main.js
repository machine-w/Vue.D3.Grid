import Vue from 'vue'
import App from './App.vue'
import './mock/index.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/less/font-awesome.less'

// 导入组件库
import D3grid from '../src/index'
// 注册组件库
Vue.use(D3grid)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
