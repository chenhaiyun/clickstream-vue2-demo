import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

function reportError(err, vm, info) {
  // 将错误信息发送到后端或错误追踪服务
  console.info('reportError');
  console.log(`Captured in Vue errorHandler: ${err}, Info: ${info}`);
}

new Vue({
  router,
  render: h => h(App),
  errorHandler: function (err, vm, info) {
    // 上报错误
    reportError(err, vm, info);
  }
}).$mount('#app')
