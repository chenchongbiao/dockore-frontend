let URL_BASE = 'http://127.0.0.1:5000'
let API_PATH = '/api'
let root = `${URL_BASE}${API_PATH}`

export default {
  LOGIN: `${root}/user/login`,
  IMAGE_LIST: `${root}/image/list`,
  IMAGE_ITEM: `${root}/image/item`,
  CONTAINER_LIST: `${root}/container/list`,
  CONTAINER_ITEM: `${root}/container/item`,
}