/** @babel */

import {CompositeDisposable} from 'atom'
import Connector from './models/connector'

let disposables = null
let conneted = false
let connector

export function activate(state) {
  disposables = new CompositeDisposable()

  connector = new Connector()
  disposables.add(connector.init())

  ;[['atom-workspace', 'magik-remote-cli:connect', connect],
    ['atom-workspace', 'magik-remote-cli:send-selection', sendSelection],
    ['atom-workspace', 'magik-remote-cli:send-buffer', sendBuffer],
    ['atom-workspace', 'magik-remote-cli:send-method', sendMethod],
    ['atom-workspace', 'core:cancel', () => {
      connector.hide()
    }],
  ].forEach(([s, t, f]) => {
    disposables.add(atom.commands.add(s, t, f))
  })
}

export function deactivate() {
  disposables.dispose()
  connector.destroy()
}

export function serialize() {}

function connect() {
  connector.show()
  console.log("connect called")
}

function sendSelection() {
  console.log("sendSelection called")
}

function sendBuffer() {
  console.log("sendBuffer called")
}

function sendMethod() {
  console.log("sendMethod called")
}
