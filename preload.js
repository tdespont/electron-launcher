const fs = require('fs')
const { ipcRenderer } = require('electron')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) {
      element.innerHTML += text
      console.log('el: ' + element.nodeName
        + ' value: ' + text)
    }
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  fs.readFile('./config.json', (err, data) => {
    if (err) console.log('error: ' + err)
    const config = JSON.parse(data)
    replaceText('root', '<button>test</button>')
  })

})

window.ipcRenderer = ipcRenderer;
