import Vue from 'vue'
import helper from "@/utils/helper";

let root = `${process.env.VUE_APP_BASE_URL}/api`

let url = {
  ADMIN_SYSTEM_CONFIG: `${root}/admin/system/config`,

  ADMIN_USER_LIST: `${root}/admin/user/list`,
  ADMIN_USER_ITEM: `${root}/admin/user/item`,
  ADMIN_USER_ADD: `${root}/admin/user/add`,
  ADMIN_USER_EDIT: `${root}/admin/user/edit`,
  ADMIN_USER_DELETE: `${root}/admin/user/delete`,

  SYSTEM_VERSION: `${root}/system/version`,

  USER_LOGIN: `${root}/user/login`,
  USER_INFO: `${root}/user/info`,
  USER_CHANGE_PASSWORD: `${root}/user/change_password`,

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
  CONTAINER_TERMINAL: `${root}/container/terminal`,

  NETWORK_LIST: `${root}/network/list`,
  NETWORK_ITEM: `${root}/network/item`,
  NETWORK_DELETE: `${root}/network/delete`,
  NETWORK_CREATE: `${root}/network/create`,
  NETWORK_CONNECT: `${root}/network/connect`,
  NETWORK_DISCONNECT: `${root}/network/disconnect`,

  VOLUME_LIST: `${root}/volume/list`,
  VOLUME_ITEM: `${root}/volume/item`,
  VOLUME_DELETE: `${root}/volume/delete`,
  VOLUME_CREATE: `${root}/volume/create`,
}

let key = {}
for (let [k, v] of Object.entries(url))
  key[v] = k;

let options = {
  ADMIN_SYSTEM_CONFIG: {name: '系统设置'},
  ADMIN_USER_ADD: {name: '添加用户'},
  ADMIN_USER_EDIT: {name: '编辑用户'},
  ADMIN_USER_DELETE: {name: '删除用户'},

  USER_LOGIN: {name: '用户登录'},
  USER_INFO: {name: '获取用户信息', notify: false},
  USER_CHANGE_PASSWORD: {name: '修改密码'},

  IMAGE_PULL: {name: '拉取镜像'},
  IMAGE_DELETE: {name: '删除镜像'},
  IMAGE_SEARCH: {name: '搜索线上镜像', notify: false},
  IMAGE_TAG: {name: '标记镜像'},
  IMAGE_HISTORY: {name: '获取镜像历史记录', notify: false},

  CONTAINER_CREATE: {name: '创建容器'},
  CONTAINER_DELETE: {name: '删除容器'},
  CONTAINER_RUN: {name: '运行容器'},
  CONTAINER_START: {name: '启动容器'},
  CONTAINER_STOP: {name: '停止容器'},
  CONTAINER_RESTART: {name: '重启容器'},
  CONTAINER_RENAME: {name: '容器更名'},
  CONTAINER_LOGS: {name: '获取容器日志', notify: false},
  CONTAINER_DIFF: {name: '容器差异对比', notify: false},
  CONTAINER_COMMIT: {name: '提交容器镜像'},

  NETWORK_CREATE: {name: '创建网络'},
  NETWORK_DELETE: {name: '删除网络'},
  NETWORK_CONNECT: {name: '连接网络'},
  NETWORK_DISCONNECT: {name: '断开网络'},

  VOLUME_CREATE: {name: '创建存储卷'},
  VOLUME_DELETE: {name: '删除存储卷'},
}

let axios = (new Vue()).$axios;

export default {
  $url: url,
  $options: (url, method) => {
    let k = key[url];
    if (!k)
      for (let kk in key)
        if (url.indexOf(kk) !== -1)
          k = key[kk];

    let r = {}
    if (k && options[k])
      r = helper.copyObject(options[k]);
    if (r.loading === undefined)
      r.loading = true;
    if (r.notify === undefined)
      r.notify = !!r.name && method !== 'get';

    return r;
  },
  adminQueryConfig: () => axios.get(url.ADMIN_SYSTEM_CONFIG),
  adminUpdateConfig: (config) => axios.post(url.ADMIN_SYSTEM_CONFIG, {config}),
  adminUserList: (page, per_page, keyword) => axios.get(
      url.ADMIN_USER_LIST, {params: {page, per_page, keyword}}),
  adminUserItem: (id) => axios.get(`${url.ADMIN_USER_ITEM}/${id}`),
  adminUserAdd: (username, password, role_type) => axios.post(url.ADMIN_USER_ADD, {username, password, role_type}),
  adminUserEdit: (id, username, password, role_type) => axios.post(
      url.ADMIN_USER_EDIT, {id, username, password, role_type}),
  adminUserDelete: ids => axios.post(url.ADMIN_USER_DELETE, {ids}),

  queryVersion: () => axios.get(url.SYSTEM_VERSION),

  userLogin: (username, password) => axios.post(url.USER_LOGIN, {username, password}),
  userInfo: () => axios.get(url.USER_INFO),
  userChangePassword: (old, new_) => axios.post(url.USER_CHANGE_PASSWORD, {old, 'new': new_}),

  imageList: is_all => axios.get(url.IMAGE_LIST, {params: {is_all}}),
  imageItem: id => axios.get(`${url.IMAGE_ITEM}/${id}`),
  imageDelete: (ids, tag_only) => axios.post(url.IMAGE_DELETE, {ids, tag_only}),
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
  containerTerminal: (id, cmd) => axios.post(`${url.CONTAINER_TERMINAL}`, {id, cmd}),

  volumeList: () => axios.get(url.VOLUME_LIST),
  volumeItem: id => axios.get(`${url.VOLUME_ITEM}/${id}`),
  volumeDelete: ids => axios.post(url.VOLUME_DELETE, {ids}),
  volumeCreate: (name, driver, driver_opts) => axios.post(url.VOLUME_CREATE, {name, driver, driver_opts}),

  networkList: () => axios.get(url.NETWORK_LIST),
  networkItem: id => axios.get(`${url.NETWORK_ITEM}/${id}`),
  networkDelete: ids => axios.post(url.NETWORK_DELETE, {ids}),
  networkCreate: (name, driver, driver_opts) => axios.post(url.NETWORK_CREATE, {name, driver, driver_opts}),
  networkConnect: (id, container_id, ipv4_address) => axios.post(url.NETWORK_CONNECT, {id, container_id, ipv4_address}),
  networkDisconnect: (id, container_id, force) => axios.post(url.NETWORK_DISCONNECT, {id, container_id, force}),
}
