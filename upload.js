
const BrowserWindow = require('electron').remote.BrowserWindow;
const shell = require('electron').shell;
const ipc = require('electron').ipcRenderer;
const {dialog} = require('electron').remote;

const csv = require('fast-csv');
const fs = require('fs');

// link the example table
const linkExample = document.getElementById('link-example');
linkExample.addEventListener('click', function (event) {
    shell.openExternal('https://docs.google.com/spreadsheets/d/1TCWv3OGkir72pjG4ONVgBd6fqk_c3p-6Rcz_IlYGams/edit#gid=0')
})

const buttonUpload = document.getElementById('button-upload');
buttonUpload.addEventListener('click', () => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'CSV-Dateien', extensions: ['csv']}
        ]
      }, function (files) {
        if (files) {
            handleUpload(files);
        }
      })
})

const buttonCreatePlan = document.getElementById('button-create-plan');
buttonCreatePlan.addEventListener('click', () => {
    // let the main process create the plan
    ipc.send('imported-groups', groups);
})

let groups = [];
// show the dialog and process the csv file
function handleUpload(files){
    const stream = fs.createReadStream(files[0]);
    var csvStream = csv()
    .on("data", function(group){
         if (group.length !== 6){
             ipc.send('open-error-dialog', 'Fehler beim importieren', 'Bitte entferne alle Kommas aus deiner CSV-Datei.')
             return;
         }
         if (group[1].includes('&') || group[3].includes('&') || group[4].includes('&')){
            ipc.send('open-error-dialog', 'Fehler beim importieren', 'Bitte entferne die &-Zeichen aus der Tabelle');
             return;
         }
         if (group[0] === 'Teamnummer') return;
         groups.push({
            id: parseInt(group[0]),
            name: group[1],
            mailAddress: group[2],
            postalAddress: group[3],
            eatingHabits: group[4],
            tel: group[5] 
         });
    })
    .on("end", function(){
        if (groups.length % 3 === 0){
            createTable();  
            document.getElementById('upload-table-container').classList.remove('invisible');          
        } else {
            ipc.send('open-error-dialog', 'Fehler beim importieren', 'Die Anzahl der Gruppen muss durch 3 teilbar sein.');
        }
    });
    stream.pipe(csvStream);
}

function createTable(){
    const tbody = document.getElementById('upload-table-tbody')    
    groups.map(group => {
        const tr = document.createElement('tr');
        Object.keys(group).map(key => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(group[key]))
            tr.appendChild(td);
        })
        tbody.appendChild(tr);
    })
}


