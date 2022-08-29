import App from "./components/App";
import { AppContainer } from "react-hot-loader";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global document, Office, module, require */

initializeIcons();

let isOfficeInitialized = false;

let dialog = null;

/* Office.context.ui.displayDialogAsync('https://domain/popup.html?id=123', {height: 45, width: 55}, function(result) {
  dialog = result.value;
  //Listen for messages coming from the dialog
  dialog.addEventHandler(
    Microsoft.Office.WebExtension.EventType.DialogMessageReceived, processMessage
  );
});

function processMessage(arg) {
  console.log(arg.message);
  dialog.close();
}

Office.initialize = function () {
  Office.context.ui.messageParent('Hello from the dialog!!!');
} */

const title = "Mateo's Task Pane Add-in";

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component title={title} isOfficeInitialized={isOfficeInitialized} />
    </AppContainer>,
    document.getElementById("container")
  );
};

/* Render application after Office initializes */
Office.onReady(() => {
  isOfficeInitialized = true;
  render(App);
});

/* Initial render showing a progress bar */
render(App);

if (module.hot) {
  module.hot.accept("./components/App", () => {
    const NextApp = require("./components/App").default;
    render(NextApp);
  });
}


/* Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged, function(eventArgs){
  //Update UI based on the new current item... this should check for null item
}); */