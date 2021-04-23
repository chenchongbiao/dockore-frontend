import Vue from 'vue'

let URL_BASE = 'http://127.0.0.1:5000'
let API_PATH = '/api'
let root = `${URL_BASE}${API_PATH}`

let url = {
  USER_LOGIN: `${root}/user/login`,
  USER_INFO: `${root}/user/info`,

  IMAGE_LIST: `${root}/image/list`,
  IMAGE_ITEM: `${root}/image/item`,
  IMAGE_DELETE: `${root}/image/delete`,
  IMAGE_SEARCH: `${root}/image/search`,
  IMAGE_PULL: `${root}/image/pull`,
  IMAGE_TAG: `${root}/image/tag`,
  IMAGE_HISTORY: `${root}/image/history`,

  CONTAINER_LIST: `${root}/container/list`,
  CONTAINER_ITEM: `${root}/container/item`,
  CONTAINER_DELETE: `${root}/container/delete`,
  CONTAINER_CREATE: `${root}/container/create`,
  CONTAINER_RUN: `${root}/container/run`,
  CONTAINER_START: `${root}/container/start`,
  CONTAINER_STOP: `${root}/container/stop`,
  CONTAINER_RESTART: `${root}/container/restart`,
  CONTAINER_RENAME: `${root}/container/rename`,
  CONTAINER_LOGS: `${root}/container/logs`,
  CONTAINER_DIFF: `${root}/container/diff`,
  CONTAINER_COMMIT: `${root}/container/commit`,
}

let key = {}
for (let [k, v] of Object.entries(url))
  key[v] = k;

let options = {
  USER_LOGIN: {name: '用户登录'},
  USER_INFO: {name: '获取用户信息'},

  IMAGE_DELETE: {name: '删除镜像'},
  IMAGE_SEARCH: {name: '搜索线上镜像'},
  IMAGE_PULL: {name: '拉取镜像'},
  IMAGE_TAG: {name: '标记镜像'},
  IMAGE_HISTORY: {name: '获取镜像历史记录'},

  CONTAINER_DELETE: {name: '删除容器'},
  CONTAINER_CREATE: {name: '创建容器'},
  CONTAINER_RUN: {name: '运行容器'},
  CONTAINER_START: {name: '启动容器'},
  CONTAINER_STOP: {name: '停止容器'},
  CONTAINER_RESTART: {name: '重启容器'},
  CONTAINER_RENAME: {name: '容器更名'},
  CONTAINER_LOGS: {name: '获取容器日志'},
  CONTAINER_DIFF: {name: '容器差异对比'},
  CONTAINER_COMMIT: {name: '提交容器镜像'},
}

let axios = (new Vue()).$axios;

export default {
  $url: url,
  $options: (url) => {
    let k = key[url];
    if (!k)
      for (let kk in key)
        if (url.indexOf(kk) !== -1)
          k = key[kk];

    let r = {}
    if (k && options[k])
      r = JSON.parse(JSON.stringify(options[k]));
    if (r.loading === undefined)
      r.loading = true;
    if (r.notify === undefined)
      r.notify = !!options.name;

    return r;
  },
  userLogin: (username, password) => axios.post(url.USER_LOGIN, {username, password}),
  userInfo: () => axios.get(url.USER_INFO),
  imageList: is_all => axios.get(url.IMAGE_LIST, {params: {is_all}}),
  imageItem: id => axios.get(`${url.IMAGE_ITEM}/${id}`),
  imageDelete: ids => axios.post(url.IMAGE_DELETE, {ids}),
  imageSearch: keyword => axios.get(`${url.IMAGE_SEARCH}/${keyword}`),
  imagePull: (name, tag) => axios.post(url.IMAGE_PULL, {name, tag}),
  imageTag: (id, name, tag) => axios.post(url.IMAGE_TAG, {id, name, tag}),
  imageHistory: id => axios.get(`${url.IMAGE_HISTORY}/${id}`),
  containerList: is_all => axios.get(url.CONTAINER_LIST, {params: {is_all}}),
  containerItem: id => axios.get(`${url.CONTAINER_ITEM}/${id}`),
  containerDelete: ids => axios.post(url.CONTAINER_DELETE, {ids}),
  containerCreate: (image, command, name, interactive, tty, ports) => axios.post(
      url.CONTAINER_CREATE, {image, command, name, interactive, tty, ports}),
  containerRun: (image, command, name, interactive, tty, ports) => axios.post(
      url.CONTAINER_RUN, {image, command, name, interactive, tty, ports}),
  containerStart: ids => axios.post(url.CONTAINER_START, {ids}),
  containerStop: (ids, timeout) => axios.post(url.CONTAINER_STOP, {ids, timeout}),
  containerRestart: (ids, timeout) => axios.post(url.CONTAINER_RESTART, {ids, timeout}),
  containerRename: (id, name) => axios.post(url.CONTAINER_RENAME, {id, name}),
  containerLogs: (id, since, until) => axios.post(url.CONTAINER_LOGS, {id, since, until}),
  containerDiff: id => axios.get(`${url.CONTAINER_DIFF}/${id}`),
  containerCommit: (id, name, tag, message, author) => axios.post(
      url.CONTAINER_COMMIT, {id, name, tag, message, author}),
}
