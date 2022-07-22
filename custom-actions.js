/*
 * This script contains classes and functions for using custom actions in the TSE tutorial.
 */
import {
  LiveboardContextActionData
} from "./dataclasses.js";

import {
  LiveboardEmbed,
  RuntimeFilterOp,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

/**
 * Highlights the JSON.  Taken from https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript.
 * See custom-actions.css for CSS to highlight.
 * @param json
 * @returns {*}
 */
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

/**
 * Shows the payload as JSON.
 * @param payload The JSON payload to show.
 */
const showJSON = (payload) => {

  // Try to get the data from the object or just show the entire payload.
  if (payload.data?.embedAnswerData) {
    payload = payload.data.embedAnswerData;
  }
  else if (payload.data) {
    payload = payload.data;
  }

  let json = `${JSON.stringify(payload, null, 2)}`;
  const showDataElement = document.getElementById('modal-data-content');
  showDataElement.innerHTML = syntaxHighlight(json);

  // display the model box.
  const dataElement = document.getElementById('show-data');
  dataElement.style.display = 'block';
}

/**
 * Shows a detailed view of the data, using the value from the context popup.
 * This is has hard-coded values that should be more flexible in a production environment.
 * @param payload The custom action payload to use.
 */
const showDetails = (payload) => {
  const liveboardContextData = LiveboardContextActionData.createFromJSON(payload);

  // Only gets the first column value.
  const filter = liveboardContextData.data[liveboardContextData.columnNames[0]];
  // Now show the details with the filter applied in a popup.
  const embed = new LiveboardEmbed("#modal-data-content", {
    frameParams: { width: "75vw", height: "50vh" },
    liveboardId: "e40c0727-01e6-49db-bb2f-5aa19661477b",
    vizId: "96db6db8-662a-45b5-bc70-00341d75846b",
    runtimeFilters: [{
          columnName: 'state',
          operator: RuntimeFilterOp.EQ,
          values: [filter]
     }],
   });
  embed.render();

  // display the model box.
  const dataElement = document.getElementById('show-data');
  dataElement.style.display = 'block';
}

export { showDetails, showJSON }
