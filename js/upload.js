const shell = require('electron').shell;
const ipc = require('electron').ipcRenderer;
const {dialog} = require('electron').remote;

const csv = require('fast-csv');
const fs = require('fs');

const regex = /[^a-zA-Z\d?!\s@.äüöÄÖÜ]/g;
const defaultGroup = {
  mailAddress: 'tba',
  name: 'tba',
  postalAddress: 'tba',
  eatingHabits: 'tba',
  tel: 'tba',
};

// link the example table
const linkExample = document.getElementById('link-example');
linkExample.addEventListener('click', function(event) {
  shell.openExternal(
    'https://docs.google.com/forms/d/1vvO8NXG78MsO5e4sOGtwEkixkuydAficClXSWkl3OyU/edit?usp=sharing'
  );
});

let groups = [];

const buttonUpload = document.getElementById('button-upload');
buttonUpload.addEventListener('click', () => {
  groups = [];
  dialog.showOpenDialog(
    {
      properties: ['openFile'],
      filters: [{name: 'CSV-Dateien', extensions: ['csv']}],
    },
    (files) => {
      if (files) {
        handleUpload(files);
      }
    }
  );
});

const buttonCreatePlan = document.getElementById('button-create-plan');
buttonCreatePlan.addEventListener('click', () => {
  // let the main process create the plan
  ipc.send('imported-groups', groups);
});

// show the dialog and process the csv file
function handleUpload(files) {
  const stream = fs.createReadStream(files[0]);
  let error;
  let csvStream = csv()
    .on('data', (group) => {
      // check if everything is correct
      if (group.length !== 6) {
        error = true;
      }
      if (group[0] === 'Timestamp') return;

      groups.push({
        mailAddress: group[1],
        name: group[2].replace(regex, ''),
        postalAddress: group[3].replace(regex, ''),
        eatingHabits: group[4].replace(regex, ''),
        tel: group[5],
      });
    })
    .on('end', function() {
      // display the error
      if (error) {
        ipc.send(
          'open-error-dialog',
          'Fehler beim importieren',
          'Bitte kontrolliere deine CSV-Datei'
        );
      }
      // insert missing groups with default group
      if (groups.length % 3 !== 0) {
        ipc.send(
          'open-error-dialog',
          'Achtung die Anzahl deiner Gruppen ist nicht durch 3 teilbar.',
          'Die fehlende(n) Gruppe(n) wurde(n) hinzugefügt.'
        );
        groups.push(defaultGroup);
        // in case two groups are missing
        if (groups.length % 3 !== 0) {
          groups.push(defaultGroup);
        }
      }
      console.log(groups);
      createTable();
      document
        .getElementById('upload-table-container')
        .classList.remove('invisible');
    });
  stream.pipe(csvStream);
}

function createTable() {
  const tbody = document.getElementById('upload-table-tbody');
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  groups.map((group, i) => {
    group.id = i + 1;
    const tr = document.createElement('tr');
    Object.keys(group).map((key) => {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(group[key]));
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
