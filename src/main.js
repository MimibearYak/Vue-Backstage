/*
 * @Description:
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2021-03-25 19:56:25
 * @LastEditors: Seven
 * @LastEditTime: 2021-04-08 16:55:13
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//引入 全局css
import './assets/css/global.css'
//引入 全局icon
import './assets/fonts/iconfont.css'
//import NProgress进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
//import axios
import axios from 'axios'
axios.defaults.baseURL='http://www.tangxiaoyang.vip:8888/api/v2/'
//拦截器 为请求头谈价token认证 拿到用户登录token 添加到headers
axios.interceptors.request.use(config=>{
  Nprogress.start()
  const userInfo=JSON.parse(sessionStorage.getItem('userInfo'))
  config.headers.Authorization=userInfo?userInfo.token:''
  return config
})
axios.interceptors.response.use(config=>{
  Nprogress.done()
  return config
})
Vue.prototype.$http=axios

//全局注册第三方表格组件
import ZkTable from 'vue-table-with-tree-grid'
//全局注册 tree-table名称,组件实例 
Vue.component('tree-table', ZkTable)

//导入common
import common from './common/common'
//挂载到Vue原型上
Vue.prototype.$common=common
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入css
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//注册组件
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
