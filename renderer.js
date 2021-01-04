// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
}

const replaceHTML = (selector, html) => {
    const element = document.getElementById(selector)
    if (element) element.innerHTML = html
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM loaded')
    window.ipcRenderer.send('config-load')
})

document.querySelector('#go').addEventListener('click', () => {
    const field1 = document.querySelector('#field1').value
    console.log('go ' + field1)
    window.ipcRenderer.send('command-execute', field1)
})

window.ipcRenderer.on('command-reply', (event, returnValue) => {
    console.log('out ' + returnValue)
    replaceText('result', returnValue)
})

window.ipcRenderer.on('config-value', (event, data) => {
    console.log('config ' + data.test)
    replaceHTML('root', '<button>'+ data.test +'</button>')
})