let URL_BASE = 'http://127.0.0.1:5000'
let API_PATH = '/api'
let root = `${URL_BASE}${API_PATH}`

export default {
  LOGIN: `${root}/user/login`,
  IMAGE_LIST: `${root}/image/list`,
  IMAGE_ITEM: `${root}/image/item`,
  IMAGE_DELETE: `${root}/image/delete`,
  CONTAINER_LIST: `${root}/container/list`,
  CONTAINER_ITEM: `${root}/container/item`,
  CONTAINER_DELETE: `${root}/container/delete`,
}
