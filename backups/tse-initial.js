/*
 * The completed script for the ThoughtSpot Everywhere tutorial.  Your solution should look similar.
 * It's recommended to refer to the documentation and Developer Playground to try to get it working before
 * using this file.
 */
import {
  init,
  Action,
  AppEmbed,
  AuthType,
  EmbedEvent,
  HostEvent,
  LiveboardEmbed,
  Page,
  RuntimeFilterOp,
  SearchEmbed,
} from 'https://unpkg.com/@thoughtspot/visual-embed-sdk/dist/tsembed.es.js';

import {getSearchData} from "./rest-api.js";
import {LiveboardContextActionData} from "./dataclasses.js";

// TODO - set the following for your URL.
const tsURL = "https://training.thoughtspot.cloud";

//------------------------------ Set up TS and authenticate and show app. ----------------------------

// Create and manage the login screen.
const onLogin = () => {
  // The following can be used if you want to use AuthType.Basic
  //const username = document.getElementById('username').value;
  //const password = document.getElementById('password').value;

  // TODO add the init() to set up the SDK interface.

  hideDiv('login');
  showDiv('landing-page');
}

// Clears out the page and shows the main app.
// This can be called from any page to make sure the state is correct.
const showMainApp = () => {
  clearEmbed(); // just to be sure.
  hideDiv('landing-page');
  showDiv('main-app');
}

//----------------------------------- Functions to embed content . -----------------------------------

const onSearch = () => {
  showMainApp();

  // TODO replace the following with a SearchEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Search not yet embedded.</p>";
}

const onLiveboard = () => {
  showMainApp();

  // TODO replace the following with a LiveboardEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Liveboard not yet embedded.</p>";
}

const onVisualization = () => {
  showMainApp();

  // TODO replace the following with a LiveboardEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Visualization not yet embedded.</p>";
}

// Embed the full application.
const onFull = () => {
  showMainApp();

  // TODO replace the following with an AppEmbed component and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Full app not yet embedded.</p>";
}

// Embed a custom action.
const onCustomAction = () => {
  showMainApp();

  // TODO replace the following with an AppEmbed component for content linking and render.
  document.getElementById("embed").innerHTML = "<p class='warning'>Custom action not yet embedded.</p>";
}

// Updates the global filterValues array, then re-runs the embedLiveboard to reload the original Liveboard with the updated values in the runtimeFilters
const filterData = (embed, payload) => {
  const actionData = LiveboardContextActionData.createFromJSON(payload);
  const columnNameToFilter = actionData.columnNames[0];
  const filterValues = [];
  filterValues.push(actionData.data[columnNameToFilter][0]);

  embed.trigger(HostEvent.UpdateRuntimeFilters, [{
    columnName: columnNameToFilter,
    operator: RuntimeFilterOp.EQ,
    values: filterValues,
  }]);
}

// Embed an example of using the SearchData api and highcharts.
const onCustomChart = () => {
  showMainApp();

  const worksheetID = "1b1c237d-9de8-4542-bf1f-0c3157ddb8d2";  // GUID for Sample Retail - Apparel - Developer WS
  const search = "[sales] [product type] [product] top 15";

  getSearchData(tsURL, worksheetID, search).then(data => {
    console.log(data);

    // Get the indexes of the columns in the data.
    const salesIdx = data.columnNames.findIndex(v => v == 'Total Sales');
    const productTypeIdx = data.columnNames.findIndex(v => v == 'Product Type');
    const productIdx = data.columnNames.findIndex(v => v == 'Product');

    // convert the resulting data to the series for the HighChart.  Format is:
    // [
    //   { name: '<product type>', data: [{ name: <product>, value: <sales> }, ... ]}
    //   { name: '<product type>', data: [{ name: <product>, value: <sales> }, ... ]}
    // ]

    const series = {}
    for (const r of data.data) {
      const productType = r[productTypeIdx]
      if (! Object.keys(series).includes(productType)) {
        series[productType] = []
      }
      // Combines all the data items to the key for each series.
      series[productType].push({ name: r[productIdx], value: r[salesIdx]/1000});
    }

    // Now need to as the chart series.
    const chartSeries = []
    for (const productType of Object.keys(series)) {
      chartSeries.push({name: productType, data: series[productType]})
    }

    // Render the chart.
    Highcharts.chart('embed', {
      chart: {
        type: 'packedbubble'
        /* height: '80%'*/
      },
      title: {
        text: 'Sales of product by product type'
      },
      tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> ${point.value:.1f}M</sub>'
      },
      plotOptions: {
        packedbubble: {
          minSize: '20%',
          maxSize: '40%',
          zMin: 0,
          zMax: 1000,
          layoutAlgorithm: {
            gravitationalConstant: 0.05,
            splitSeries: true,
            seriesInteraction: false,
            dragBetweenSeries: true,
            parentNodeLimit: true
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            filter: {
              property: 'y',
              operator: '>',
              value: 250
            },
            style: {
              color: 'black',
              textOutline: 'none',
              fontWeight: 'normal'
            }
          }
        }
      },
      series: chartSeries
    });
  });

}

//----------------------------------- Functions to manage the UI. -----------------------------------

// functions to show and hide parts of the UI.
const showDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'flex';
}

const hideDiv = divId => {
  const div = document.getElementById(divId);
  div.style.display = 'none';
}

// Clears the embedded section.
const clearEmbed = () => {
  const div = document.getElementById("embed");
  div.innerHTML = "";
}

//---------------------------- connect UI to code and start the app. ----------------------------

// Show the URL to connect to.
document.getElementById('ts-url').innerText = 'ThoughtSpot Server: ' + tsURL;

// Hook up the events to the buttons and links.
document.getElementById('login-button').addEventListener('click', onLogin);

// Events for buttons
document.getElementById('search-button').addEventListener('click', onSearch);
document.getElementById('liveboard-button').addEventListener('click', onLiveboard);
document.getElementById('viz-button').addEventListener('click', onVisualization);
document.getElementById('full-app-button').addEventListener('click', onFull);
document.getElementById('custom-action-button').addEventListener('click', onCustomAction);
document.getElementById('custom-chart-button').addEventListener('click', onCustomChart);

// Events for nav bar
document.getElementById('search-link').addEventListener('click', onSearch);
document.getElementById('liveboard-link').addEventListener('click', onLiveboard);
document.getElementById('visualization-link').addEventListener('click', onVisualization);
document.getElementById('full-application-link').addEventListener('click', onFull);
document.getElementById('custom-action-link').addEventListener('click', onCustomAction);
document.getElementById('custom-chart-link').addEventListener('click', onCustomChart);
