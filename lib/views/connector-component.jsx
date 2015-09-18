/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {TextEditor} from 'atom'
import DOMListener from 'dom-listener'
import {CompositeDisposable} from 'atom'

export default class ConnectorComponent {
  constructor(connector) {
    this.disposables = new CompositeDisposable()
    this.connector = connector
    this.connected = false
    etch.createElement(this)

    this.attachEventHandlers()
    this.connector.onDidShow((e) => {
      if (this.refs.editor) {
        this.refs.editor.focus()
      }
    })

    this.disposables.add(
      atom.commands.add(this.refs.promptDialog, 'core:confirm', () => {
        this.connector.connect(this.refs.editor.component.getModel().getText(),
          (err, msg) => {
            if (err === 'closed') {
              this.connected = false
            } else if (err) {
              this.connected = false
            } else {
              this.connected = true
            }
            this.update()
            this.close()
          }
        )
      })
    )
  }

  dispose() {
    this.disposables.dispose()
  }

  close() {
    this.connector.hide()
  }

  update() {
    etch.updateElementSync(this)
    this.attachEventHandlers()
  }

  attachEventHandlers() {
    let editor = this.refs.editor
    let dcBtn = this.refs.dcBtn
    if (editor) {
      editor.addEventListener('blur', this.close.bind(this))
    } else if (dcBtn) {
      dcBtn.addEventListener('click', () => {
        this.connector.disposeClient()
        this.connected = false
        this.update()
        this.close()
      })
    }
  }

  render() {
    if (this.connected) {
      return (
        <div className='block' ref='promptDialog'>
          <label>Connected to ${this.connector.client.host}:${this.connector.client.port}</label>
          <button
            className='btn btn-error selected inline-block-tight'
            ref='dcBtn'>Disconnect</button>
        </div>
      )
    }
    const attributes = {
      'glutter-hidden': true,
      'mini': true,
      'placeholder-text': 'host[:port]'
    }
    return (
      <div className='block' ref='promptDialog'>
        <label>SmallWorld session location</label>
        <atom-text-editor
          className='location'
          attributes={attributes}
          ref='editor'>
          {this.connector.location}
        </atom-text-editor>
      </div>
    )
  }
}
