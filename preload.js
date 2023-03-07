// You can also put expose this code to the renderer
// process with the `contextBridge` API
const { ipcRenderer } = require('electron')

ipcRenderer.on('asynchronous-reply', (_event, arg) => {
  console.log(arg) // prints "pong" in the DevTools console
})
ipcRenderer.send('asynchronous-message', 'start')

const console = document.getElementById("console")
const button = document.getElementById("button");
const input = document.getElementById("input");
const reset = document.getElementById("reset");

function log(arg) {
  const time = new Date();
  const line = document.createElement("span")
  line.classList.add("console-line")
  line.innerHTML = time.toLocaleTimeString() + " $~ " + arg
  console.appendChild(line)
}

function onInput() {
  const message = input.value
  if (!message || message == "") return input.blur();
  input.value = "";
  input.blur();
  log("ws://176.133.59.194:80/ (moi): " + message);
}

function receiveMessage(from, message) {
  log(from + " : " + message);
}

button.addEventListener("click", () => {
  onInput()
})

document.addEventListener("keydown", () => { input.focus() })

reset.addEventListener("click", () => {
  window.location.reload()
})

document.addEventListener("keyup", (event) => {
  if (event.key === "Enter" && document.activeElement == input) onInput()
})