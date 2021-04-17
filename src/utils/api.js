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
  CONTAINER_LIST: `${root}/container/list`,
  CONTAINER_ITEM: `${root}/container/item`,
  CONTAINER_DELETE: `${root}/container/delete`,
  CONTAINER_CREATE: `${root}/container/create`,
}

let key = {}
for (let [k, v] of Object.entries(url))
  key[v] = k;

let name = {
  USER_LOGIN: '用户登录',
  IMAGE_DELETE: '删除镜像',
  CONTAINER_DELETE: '删除容器',
  CONTAINER_CREATE: '创建容器',
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
  containerList: is_all => axios.get(url.CONTAINER_LIST, {params: {is_all}}),
  containerItem: id => axios.get(`${url.CONTAINER_ITEM}/${id}`),
  containerDelete: ids => axios.post(url.CONTAINER_DELETE, {ids}),
  containerCreate: (image, command, name) => axios.post(url.CONTAINER_CREATE, {image, command, name}),
}
