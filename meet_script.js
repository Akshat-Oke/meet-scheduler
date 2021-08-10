const toast = document.createElement("div");
toast.classList.add("error-toast");
document.body.insertAdjacentElement("beforeend", toast);

// There should be a better way to wait for the page
// to load completely but lemme use this for now
setTimeout(() => {
  // Join the meet
  try {
    prepareToJoin();
    joinMeeting();
  } catch (e) {
    setTimeout(() => {
      try {
        prepareToJoin();
        joinMeeting();
      } catch (e) {
        _showError("Could not turn off microphone and camera");
      }
    }, 2500);
  } finally {
    addButton();
  }
}, 5000);
function _showError(message) {
  toast.innerText = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 8000);
}
/**
 * Turn off microphone and camera
 */
function prepareToJoin() {
  document
    .querySelector('div[aria-label="Turn off microphone (CTRL + D)"')
    .click();
  document.querySelector('div[aria-label="Turn off camera (CTRL + E)"').click();
}
function joinMeeting() {
  document.querySelectorAll("div[role='button']").forEach((button) => {
    // console.log(button);
    const span = button.querySelector(" span span");
    console.log(span.innerHTML);
    const regex = /(ask to join)|(join now)/gi;
    if (regex.test(span.innerHTML)) {
      button.click();
      button.style.background = "red";
    }
  });
}
function addButton() {
  fetch(chrome.runtime.getURL("/google-meet.html"))
    .then((r) => r.text())
    .then((html) => {
      try {
        console.log(html);
        document.body
          // .querySelector('textarea[aria-label="Send a message to everyone"]')
          .insertAdjacentHTML("beforeend", html);
        document
          .getElementById("send-message-google-meet")
          .addEventListener("click", sendIntroMessage);
        addListeners();
        // not using innerHTML as it would break js event listeners of the page}
      } catch (e) {
        console.log(e);
        // setTimeout(() => {
        //   document
        //     .querySelector('textarea[aria-label="Send a message to everyone"]')
        //     .insertAdjacentHTML("beforeend", html);
        // }, 2000);
      }
    });
}

function sendIntroMessage() {
  chrome.storage.local.get("intro-message", (m) => {
    const message = m["intro-message"]?.message ?? "Good day";
    function sendIt() {
      document.querySelector(
        'textarea[aria-label="Send a message to everyone"]'
      ).value = message;
      const sendButton = document.querySelector(
        'button[aria-label="Send a message to everyone"]'
      );
      sendButton.disabled = false;
      sendButton.click();
    }
    try {
      sendIt();
    } catch (e) {
      document.querySelector('[aria-label="Chat with everyone"]').click();
      setTimeout(() => {
        sendIt();
      }, 800);
    }
  });
}
//draggable button
// window.onload = addListeners;
// window.onload = addListeners;

function addListeners() {
  document
    .getElementById("send-message-google-meet")
    .addEventListener("mousedown", mouseDown, false);
  window.addEventListener("mouseup", mouseUp, false);
}

function mouseUp() {
  window.removeEventListener("mousemove", divMove, true);
}

function mouseDown(e) {
  window.addEventListener("mousemove", divMove, true);
}
function divMove(e) {
  var div = document.getElementById("send-message-google-meet");
  div.style.position = "fixed";
  div.style.top = e.clientY + "px";
  div.style.left = e.clientX + "px";
}