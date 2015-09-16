/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {TextEditor} from 'atom'
import DOMListener from 'dom-listener'

export default class ConnectorComponent {
  constructor(connector) {
    this.connector = connector
    etch.createElement(this)

    let editor = this.element.querySelector('atom-text-editor')
    editor.addEventListener('blur', this.close.bind(this))
    connector.onDidShow((e) => {
      editor.focus()
    })
  }

  close() {
    this.connector.hide()
  }

  render() {
    const attributes = {
      'glutter-hidden': true,
      'mini': true,
      'placeholder-text': 'host[:port]'
    }
    return (
      <div>
        <div className='block'>
          <label>SmallWorld session location</label>
          <atom-text-editor className='location' attributes={attributes}>
            {this.connector.location}
          </atom-text-editor>
        </div>
      </div>
    )
  }
}
