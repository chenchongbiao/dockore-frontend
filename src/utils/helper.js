import Loading from "element-ui/packages/loading/src";
import Notification from "element-ui/packages/notification/src/main";

let loadings = [], loading;

export default {
  startLoading(text) {
    loadings.push({text, lock: true});
    if (loadings.length && !loading) {
      loading = Loading(loadings.pop());
      loading.$el.style['z-index'] = 9999;
    }
  },
  stopLoading() {
    loading.close();
    if (loadings.length) {
      loading = Loading(loadings.pop());
    } else {
      loading = undefined;
    }
  },
  sendNotification(title, message, type, html, duration, offset) {
    offset |= 128;
    duration |= 3;
    duration *= 1000;
    Notification({title, message, type, offset, duration, dangerouslyUseHTMLString: html})
  }
}
