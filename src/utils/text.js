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
  version: {
    _: {
      version: '版本',
      api_version: 'API版本',
      min_apiversion: '最低支持API版本',
      os: '操作系统',
      arch: '架构',
      kernel_version: '内核版本',
      build_time: '构建时间',
      git_commit: 'Git提交版本',
    },
    Dockore: {
      hostname: '主机名',
      py_version: 'Python版本',
    },
    Docker: {
      go_version: 'Go版本',
    },
    Engine: {
      experimental: '实验特性',
    }
  },
  container: {
    status: {
      created: '已创建',
      running: '运行中',
      exited: '已退出',
    }
  },
  $get(s, i, k) {
    let text_ = this[s][i];
    let text_def = this[s]['_'];

    if (text_ === undefined)
      return k ? text_def[k] ? text_def[k] : k : i;

    if (k === undefined) {
      k = 'this';
      if (text_[k] === undefined)
        return i;
    }

    return text_[k] || text_def[k] || k;
  },
}
