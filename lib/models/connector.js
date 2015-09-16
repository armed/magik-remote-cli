/** @babel */
import {Emitter} from 'atom'
import ConnectorComponent from '../views/connector-component.jsx'

export default class Connector {
  constructor(location = '') {
    this.location = location
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
      this.registerView()
    }
    this.panel.show()
    this.emitter.emit('did-show')
  }

  hide() {
    this.panel.hide()
    this.emitter.emit('did-hide')
  }

  destroy() {
    this.panel.destroy()
    this.emitter.dispose()
  }

  onDidShow(callback) {
    this.emitter.on('did-show', callback)
  }

  onDidHide(callback) {
    this.emitter.on('did-hide', callback)
  }
}
