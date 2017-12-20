
const BrowserWindow = require('electron').remote.BrowserWindow;
const {dialog} = require('electron').remote;
const shell = require('electron').shell;
const ipc = require('electron').ipcRenderer;


const csv = require('fast-csv');
const fs = require('fs');

// link the example table
const linkExample = document.getElementById('link-example')
linkExample.addEventListener('click', function (event) {
    shell.openExternal('https://docs.google.com/spreadsheets/d/1TCWv3OGkir72pjG4ONVgBd6fqk_c3p-6Rcz_IlYGams/edit#gid=0')
})

const buttonUpload = document.getElementById('button-upload')
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

let groups = [];
// show the dialog and process the csv file
function handleUpload(files){
    const stream = fs.createReadStream(files[0]);
    var csvStream = csv()
    .on("data", function(group){
         if (group.length !== 6){
             dialog.showErrorBox('Fehler beim importieren', 'Bitte entferne alle Kommas aus deiner CSV-Datei.')
             return;
         }
         if (group[1].includes('&') || group[3].includes('&') || group[4].includes('&')){
             dialog.showErrorBox('Fehler beim importieren', 'Bitte entferne die &-Zeichen aus der Tabelle');
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
         createTable();
    });
    stream.pipe(csvStream);
}

const header = ['Teamnummer', 'Teamname', 'E-Mail Adresse',	'Postalische Adresse', 'Essbesonderheiten',	'Handynummer'];

function createTable(){
    const body = document.getElementsByTagName('body')[0];
    const div = document.createElement('div');
    div.setAttribute('class', 'mui-container');
    const table = document.createElement('table');
    //table.style.width = '100%';
    table.setAttribute('class', 'mui-table')

    // create the header
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    header.map(column => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(column))
        tr.appendChild(th);
    })
    thead.appendChild(tr);

    // add the table data
    const tbody = document.createElement('tbody');        
    groups.map(group => {
        const tr = document.createElement('tr');
        Object.keys(group).map(key => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(group[key]))
            tr.appendChild(td);
        })
        tbody.appendChild(tr);
    })
    table.appendChild(thead);
    table.appendChild(tbody);
    // create the button to create the plan
    const buttonCreatePlan = document.createElement('button');
    buttonCreatePlan.setAttribute('class', 'mui-btn mui-btn--primary');
    buttonCreatePlan.addEventListener('click', () => {
        // let the main process create the plan
        ipc.send('imported-groups', groups);
    })
    buttonCreatePlan.appendChild(document.createTextNode('Plan erstellen'));
    div.appendChild(table);
    div.appendChild(buttonCreatePlan);
    body.appendChild(div);
}


