export default {
  config: {
    database: {
      this: '数据库设置',
      driver: '驱动',
      host: '主机',
      port: '端口',
      user: '用户名',
      password: '密码',
      database: '数据库',
      charset: '编码',
    },
    docker: {
      this: 'Docker设置',
      url: '服务URL',
    },
    user: {
      this: '用户设置',
      login_expires: '登录过期时间',
    },
    core: {
      this: 'Saika设置',
      SQLALCHEMY_TRACK_MODIFICATIONS: 'SQLAlchemy变更追踪',
      SECRET_KEY: '数据加密密钥',
      WTF_CSRF_ENABLED: '表单CSRF验证',
    },
  },
  container: {
    status: {
      created: '已创建',
      running: '运行中',
      exited: '已退出',
    }
  }
}
