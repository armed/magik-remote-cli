/** @babel */

import {Emitter} from 'atom'
import {Socket} from 'net'
import readline from 'readline'
import S from './string'

const DEFAULT_HOST = 'localhost'
const DEFAULT_PORT = 14001
const SOCKET_TIMEOUT = 5000

export default class RemoteCLIClient {
  constructor() {
    this.emitter = new Emitter()
    this.client = new Socket()
    this.client.setEncoding('utf8')
    this.connected = false

    let first = true
    let question = false
    let promptChunks = ''
    let prompt

    this.client.on('data', (data) => {
      // first data from sw
      if (first) {
        first = false
        prompt = data
      // question from sw
      } else if (S(data).endsWith('? (Y) ')) {
        this.client.send('y\n')
        promptChunks = ''
      // prompt from sw
      } else if (S(data).endsWith(prompt)) {
        promptChunks += data + ' '
        promptChunks = promptChunks.replaceAll(prompt, '')
        if (S(promptChunks).contains('traceback:')
          || S(promptChunks).contains('Error')) {
          this.emitter.emit('error', promptChunks)
        } else {
          this.emitter.emit('data', promptChunks)
        }
        promptChunks = ''
      // arbitary lines from sw
      // before prompt
      } else {
        promptChunks += data
      }
    })
  }

  setAddress(address) {
    const [
      host = DEFAULT_HOST,
      port = DEFAULT_PORT
    ] = address.split(':').map((e) => { return e || undefined })

    this.host = host
    this.port = port
  }

  connect(callback) {
    this.client.setTimeout(SOCKET_TIMEOUT, () => {
      this.disconnect()
      callback('timeout', 'Connection timed out')
    })
    this.client.connect(this.port, this.host, (err) => {
      this.client.setTimeout(0)
      if (err) {
        callback(err, `Error connecting: ${err}`)
      } else {
        this.connected = true
        callback(undefined, `Connected to ${this.host}:${this.port}`)
      }
    })
    this.client.once('close', () => {
      callback('closed', 'Connection closed by host')
    })
  }

  send(code) {
    // code = code.replace('$', '')
    this.client.write(code)
    this.client.write('$' + '\n')
  }

  disconnect() {
    if (this.connected) {
      this.client.destroy()
      this.connected = false
    }
  }

  dispose() {
    this.disconnect()
    this.emitter.dispose()
  }

  onData(callback) {
    this.emitter.on('data', callback)
  }

  onError(callback) {
    this.emitter.on('error', callback)
  }
}
