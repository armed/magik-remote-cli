/** @babel */

import RemoteCLIClient from './utils/remote-cli-client'
import {CompositeDisposable} from 'atom'
import Connector from './models/connector'
import Sender from './models/sender'

let disposables = null
let connector
let sender

export function activate(state) {
  let remoteClient = new RemoteCLIClient()
  connector = new Connector(remoteClient)
  sender = new Sender(remoteClient)

  disposables = new CompositeDisposable()
  disposables.add(connector.init())
  disposables.add(remoteClient)

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
  sender = undefined
}

export function serialize() {}

function connect() {
  connector.show()
}

function sendSelection() {
  console.log("sendSelection called")
}

function sendBuffer() {
  sender.send(atom.workspace.getActiveTextEditor().getText())
}

function sendMethod() {
  console.log("sendMethod called")
}
