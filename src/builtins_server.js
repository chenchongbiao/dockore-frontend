import net from "net";
import fs from "fs";
import child_process from "child_process";

const isDevelopment = process.env.NODE_ENV !== 'production'

let server = {
  exe: `${getResPath()}/Dockore`,
  process: null,
  host: null,
  port: null,
  exec: (data_dir, sync, ...args) => {
    let options = {cwd: data_dir, env: {SAIKA_DATA_DIR: data_dir}}
    if (sync) {
      return child_process.execFileSync(server.exe, args, options)
    } else {
      return child_process.execFile(server.exe, args, options, (
        (error, stdout, stderr) => console.log(error, stdout, stderr)))
    }
  }
}

function getAvailablePort() {
  let server = net.createServer()
  server = server.listen(0)
  let port = server.address().port
  server.close()
  return port
}

function getResPath() {
  if (isDevelopment) {
    return `${process.cwd()}/extra_resources`
  } else {
    return `${process.resourcesPath}/extra_resources`
  }
}

function install(data_dir) {
  let install_lock = `${data_dir}/install.lock`
  if (fs.existsSync(install_lock)) {
    server.exec(data_dir, true, 'db', 'migrate')
    server.exec(data_dir, true, 'db', 'upgrade')
    return
  }

  if (!fs.existsSync(data_dir))
    fs.mkdirSync(data_dir)

  server.exec(data_dir, true, 'saika', 'cfgupd')
  server.exec(data_dir, true, 'db', 'init')
  server.exec(data_dir, true, 'db', 'migrate')
  server.exec(data_dir, true, 'db', 'upgrade')
  server.exec(data_dir, true, 'user-cli', 'add', '--is-admin', 'admin', '123456')

  fs.writeFileSync(install_lock, '')
}

function start(data_dir, listen_all) {
  if (server.process)
    return

  server.host = listen_all ? '0.0.0.0' : '127.0.0.1'
  server.port = getAvailablePort()
  server.process = server.exec(data_dir, false,
    'saika', 'run', '-t', 'gevent', '-h', server.host, '-p', String(server.port))
  server.process.on('close', () => {
    server.process = null
  })

  install(data_dir)
}

function stop() {
  if (server.process) {
    server.process.kill()
  }
}

function getInfo() {
  let host = `${server.host}:${server.port}`
  return {
    host: host,
    host_ws: host,
    ssl: false,
  }
}

export default {
  start, stop, getInfo
}