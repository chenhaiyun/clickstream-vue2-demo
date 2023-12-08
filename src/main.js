import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import { ClickstreamAnalytics } from '@aws/clickstream-web';
// import VueSocketIO from 'vue-socket.io'



Vue.config.productionTip = false

Vue.config.errorHandler = function (err, vm, info) {
  // 处理错误
  // `err` 是错误对象
  // `vm` 是出错的 Vue 实例
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  console.info('errorHandler');
  console.log(`Captured in Vue errorHandler: ${err}, VM: ${vm} Info: ${info}`);
  ClickstreamAnalytics.record({
    name: 'runtime_exception',
    attributes: { error_message: err.toString(), vm: vm.toString(), info: info }
  });
};





function sendPerformanceData() {
  const tmpPerf = {
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
totalJSHeapSize: performance.memory.jsHeapSizeLimit,
usedJSHeapSize:performance.memory.usedJSHeapSize,
  }
  console.info("performance.memory:",tmpPerf);
  ClickstreamAnalytics.record({
    name: 'app_performance',
    attributes: { ...tmpPerf, ...(performance.getEntriesByType("navigation")) }
  });
}


setInterval(() => {
  // 发送数据
  sendPerformanceData();
}, 60000);

// function reportError(err, vm, info) {
//   // 将错误信息发送到后端或错误追踪服务
//   console.info('reportError');
//   console.log(`Captured in Vue errorHandler: ${err}, VM: ${vm} Info: ${info}`);
// }

// Vue.use(new VueSocketIO({
//   debug: true,
//     connection: 'http://localhost:4001',
//     options: { withCredentials: true }
//   // connection: 'http://localhost:4001',
//   // connection: SocketIO('http://metinseylan.com:1992', options), 
//   // withCredentials: true
// }));

new Vue({
  router,
  render: h => h(App),
  // errorHandler: function (err, vm, info) {
  //   // 上报错误
  //   reportError(err, vm, info);
  // }
}).$mount('#app')
