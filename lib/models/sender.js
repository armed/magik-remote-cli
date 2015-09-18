/** @babel */

const TIMEOUT = 200

export default class Sender {
  constructor(remoteClient) {
    this.client = remoteClient
    this.dataBuffer = ''
    this.errorBuffer = ''
    this.client.onData(this.showInfo)
    this.client.onError(this.showError)
  }

  send(code) {
    this.client.send(code)
  }

  showInfo(data) {
    this.dataBuffer += data
    clearTimeout(this.dataTimeoutId)
    this.dataTimeoutId = setTimeout(() => {
      atom.notifications.addInfo('SW Magik', {
        detail: this.dataBuffer,
        dismissable: true
      })
      this.dataBuffer = ''
    }, TIMEOUT)
  }

  showError(error) {
    this.errorBuffer += error
    clearTimeout(this.errorTimeoutId)
    this.errorTimeoutId = setTimeout(() => {
      atom.notifications.addWarning('SW Magik Error', {
        detail: this.errorBuffer,
        dismissable: true
      })
      this.errorBuffer = ''
    }, TIMEOUT)
  }
}
