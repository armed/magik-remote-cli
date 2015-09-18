/** @babel */
import {Emitter} from 'atom'
import ConnectorComponent from '../views/connector-component.jsx'

const DID_SHOW = 'did-show'
const DID_HIDE = 'did-hide'
const CONNECT_FAILED = 'connect-failed'
const CONNECT_SUCCESS = 'connect-success'
const OPERATION_FAILED = 'operation-failed'
const OPERATION_SUCCESS = 'operation-success'

export default class Connector {
  constructor(remoteClient) {
    this.client = remoteClient
    this.emitter = new Emitter()
  }

  init() {
    this.panel = atom.workspace.addModalPanel({
      item: new ConnectorComponent(this),
      visible: false
    })
    return atom.views.addViewProvider(Connector, (model) => {
      return new ConnectorComponent(model).element
    })
  }

  show() {
    if (!this.panel) {
      this.init()
    }
    this.panel.show()
    this.emitter.emit(DID_SHOW)
  }

  hide() {
    this.panel.hide()
    this.emitter.emit(DID_HIDE)
  }

  connect(address, connectCallback) {
    this.client.setAddress(address)
    this.client.connect((err, msg) => {
      connectCallback(err, msg)
      if (err) {
        atom.notifications.addWarning(err, {detail: msg})
      } else {
        atom.notifications.addInfo(`Connected to ${address}`)
      }
    })
  }

  operationsCallback(err, msg) {
    if (err) {
      this.emitter.emit(OPERATION_FAILED, {err, msg})
    } else {
      this.emitter.emit(OPERATION_SUCCESS, {err, msg})
    }
  }

  destroy() {
    this.panel.destroy()
    this.emitter.dispose()
  }

  onDidShow(callback) {
    this.emitter.on(DID_SHOW, callback)
  }

  onDidHide(callback) {
    this.emitter.on(DID_HIDE, callback)
  }

  onOperation(callback) {
    this.emitter.on(OPERATION_FAILED, callback)
    this.emitter.on(OPERATION_SUCCESS, callback)
  }
}
