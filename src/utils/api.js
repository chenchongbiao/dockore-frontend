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

  CONTAINER_LIST: `${root}/container/list`,
  CONTAINER_ITEM: `${root}/container/item`,
  CONTAINER_DELETE: `${root}/container/delete`,
  CONTAINER_CREATE: `${root}/container/create`,
  CONTAINER_START: `${root}/container/start`,
  CONTAINER_STOP: `${root}/container/stop`,
  CONTAINER_RESTART: `${root}/container/restart`,
  CONTAINER_RENAME: `${root}/container/rename`,
  CONTAINER_LOGS: `${root}/container/logs`,
  CONTAINER_DIFF: `${root}/container/diff`,
}

let key = {}
for (let [k, v] of Object.entries(url))
  key[v] = k;

let name = {
  USER_LOGIN: '用户登录',
  IMAGE_DELETE: '删除镜像',
  IMAGE_PULL: '拉取镜像',
  IMAGE_TAG: '标记镜像',
  CONTAINER_DELETE: '删除容器',
  CONTAINER_CREATE: '创建容器',
  CONTAINER_START: '启动容器',
  CONTAINER_STOP: '停止容器',
  CONTAINER_RESTART: '重启容器',
  CONTAINER_RENAME: '容器更名',
}

let axios = (new Vue()).$axios;

export default {
  $url: url,
  $name: name,
  $key: key,
  userLogin: (username, password) => axios.post(url.USER_LOGIN, {username, password}),
  userInfo: () => axios.get(url.USER_INFO),
  imageList: is_all => axios.get(url.IMAGE_LIST, {params: {is_all}}),
  imageItem: id => axios.get(`${url.IMAGE_ITEM}/${id}`),
  imageDelete: ids => axios.post(url.IMAGE_DELETE, {ids}),
  imageSearch: keyword => axios.get(`${url.IMAGE_SEARCH}/${keyword}`),
  imagePull: (name, tag) => axios.post(url.IMAGE_PULL, {name, tag}),
  imageTag: (id, name, tag) => axios.post(url.IMAGE_TAG, {id, name, tag}),
  containerList: is_all => axios.get(url.CONTAINER_LIST, {params: {is_all}}),
  containerItem: id => axios.get(`${url.CONTAINER_ITEM}/${id}`),
  containerDelete: ids => axios.post(url.CONTAINER_DELETE, {ids}),
  containerCreate: (image, command, name, interactive, tty) => axios.post(
      url.CONTAINER_CREATE, {image, command, name, interactive, tty}),
  containerStart: ids => axios.post(url.CONTAINER_START, {ids}),
  containerStop: (ids, timeout) => axios.post(url.CONTAINER_STOP, {ids, timeout}),
  containerRestart: (ids, timeout) => axios.post(url.CONTAINER_RESTART, {ids, timeout}),
  containerRename: (id, name) => axios.post(url.CONTAINER_RENAME, {id, name}),
  containerLogs: (id, since, until) => axios.post(url.CONTAINER_LOGS, {id, since, until}),
  containerDiff: id => axios.get(`${url.CONTAINER_DIFF}/${id}`),
}
