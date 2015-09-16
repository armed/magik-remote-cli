/** @babel */

import net from 'net'
import readline from 'readline'
import * as S from './string'

const DEFAULT_HOST = 'localhost'
const DEFAULT_PORT = 14001
const SOCKET_TIMEOUT = 5000

export default class SwConnector {
  constructor(address, sendCallback) {
    const [
      host = DEFAULT_HOST,
      port = DEFAULT_PORT
    ] = address.split(':').map((e) => { return e || undefined })

    this.host = host
    this.port = port
    this.sendCallback = sendCallback
    this.client = new net.Socket()
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
        question = true
        promptChunks += data
      // prompt from sw
      } else if (S(data).endsWith(prompt)) {
        if (S(promptChunks).contains('error')) {
          this.sendCallback(false, promptChunks)
        } else {
          this.sendCallback(true)
        }
        promptChunks = false
      // arbitary lines from sw
      // before prompt
      } else {
        promptChunks += data
      }
    })
  }

  connect(callback) {
    this.client.connect(this.port, this.host, (err) => {
      if (err) {
        callback(false, `Error connecting: ${err}`)
      } else {
        this.connected = true
        callback(true, `Connected to ${host}:${port}`)
      }
    })
    this.client.once('close', () => {
      callback(false, 'Connection closed by host')
    })
    this.client.setTimeout(SOCKET_TIMEOUT, () => {
      this.disconnect()
      callback(false, 'Connection timed out')
    })
  }

  send(code) {
    this.client.write(code + '\n')
    this.client.write('$' + '\n')
  }

  disconnect() {
    this.client.destroy()
    this.connected = false
  }

  dispose() {
    this.disconnect()
  }
}
