'use-strict'

const ipc = require('electron').ipcRenderer;
const shell = require('electron').shell

let groups = null;
let times = {
    starter: '18:00',
    main: '18:00',
    dessert: '18:00',
}
let texts = {
    introText: 'Hier kommt der Plan',
    endText: 'Liebe Grüße, der Organisiator',
}
ipc.on('show-results', (event, arg) => {
    groups = arg;
    showResults();
})

const header = ['Gruppe', 'Vorspeise', 'Hauptgericht', 'Nachspeise'];
function showResults() {
    const body = document.body;
    // delete all elements in the body 
    while (body.firstChild){
        body.removeChild(body.firstChild)
    } 
    const div = document.createElement('div');
    div.setAttribute('class', 'mui-container');

    // insert text
    const textSelect = `Wähle nun die Zeiten für Vor-, Haupt- und Nachspeise aus.\n
        Anschließend kannst du den Text, der zum Beginn und zum Ende der Mail angezeigt werden soll, eingeben.\n
        Die Mails werden dann automatisch für dich generiert.\n`
    div.appendChild(document.createTextNode(textSelect))
    
    // create the time picker
    const container = document.createElement('div');
    container.setAttribute('class', 'mui-container-fluid');    
    
    const row = document.createElement('div');
    row.setAttribute('class', 'mui-row');
    const meals = ['Vorspeise: ','Hauptgericht: ', 'Nachspeise: ']
    meals.map(meal => {
        const time = document.createElement('div');
        time.setAttribute('class', 'mui-col-md-4');
        const text = document.createTextNode(meal);
        const input = document.createElement('input');
        input.setAttribute('type', 'time');
        input.setAttribute('placeholder', '18:00')
        input.setAttribute('name', meal);
        input.addEventListener('change', (event) => {
            switch(event.target.name){
                case meals[0]: times.starter = event.target.value; break;
                case meals[1]: times.main = event.target.value; break;
                case meals[2]: times.dessert = event.target.value; break;
            }
            eraseMailLinks();
            createMailLinks(groups, div);
        });
        time.appendChild(text);        
        time.appendChild(input);
        row.appendChild(time);
    })
    container.appendChild(row);
    div.appendChild(container);
    
    const textRow = document.createElement('div');
    textRow.setAttribute('class', 'mui-row');
    
    // create the text input fields
    Object.keys(texts).map(key => {
        let text;
        if (key === 'introText'){
            text = document.createTextNode('Text zu Beginn der Mail');
        } else {
            text = document.createTextNode('Text zum Ende der Mail');
        }
        const form = document.createElement('div');
        form.setAttribute('widht', '100%');
        form.setAttribute('class', 'mui-form');
        const input = document.createElement('textarea');
        if (key === 'introText') input.setAttribute('name', 'Text zu Beginn');
        if (key === 'endText') input.setAttribute('name', 'Text zum Ende');
        input.setAttribute('placeholder', texts[key]);
        input.addEventListener('change', (event) => {
            texts[key] = event.target.value; 
            eraseMailLinks();
            createMailLinks(groups, div);
        })
        form.appendChild(input)
        div.appendChild(text);
        div.appendChild(form);
    })

    const divider = document.createElement('div');
    divider.setAttribute('class', 'divider');
    div.appendChild(divider);
    const textTable = `Hier noch eine Übersicht über die Zuteilung der Teams.`;
    div.appendChild(document.createTextNode(textTable));
    
    // create a new table
    const table = document.createElement('table');
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
    groups.map((group, i) => {
        tbody.appendChild(createRow(group, i));
    })
    table.appendChild(thead);
    table.appendChild(tbody);
    div.appendChild(table);

    // create to button to download the table
    const buttonExportPlan = document.createElement('button');
    buttonExportPlan.appendChild(document.createTextNode('Download als PDF'))
    buttonExportPlan.setAttribute('class', 'mui-btn mui-btn--primary')
    buttonExportPlan.addEventListener('click', () => {
        ipc.send('export-plan', table);
    })
    div.appendChild(buttonExportPlan);

    const divider2 = document.createElement('div');
    divider2.setAttribute('class', 'divider');
    div.appendChild(divider2);
    const textMailLinks = `Hier findest du die Links, mit denen du Mails an die entsprechenden Gruppen verschicken kannst.`
    div.appendChild(document.createTextNode(textMailLinks));

    //append the links to send the mails
    createMailLinks(groups, div);
   
    body.appendChild(div);
}

function eraseMailLinks(){
    mailLinkContainer = document.getElementById('mail-link-container');
    mailLinkContainer.parentNode.removeChild(mailLinkContainer);
}

function createMailLinks(groups, div) {
    const mailLinkContainer = document.createElement('div');
    mailLinkContainer.setAttribute('class', 'mui-container');
    mailLinkContainer.setAttribute('id', 'mail-link-container')
    groups.map((group,i) => {
        const a = document.createElement('a');
        a.setAttribute('class', 'mail-link')
        const mailContent = generateMailContent(group, i);
        a.addEventListener('click', function (event) {
            const mailLink = `mailto:${group.mailAddress}?subject=Running Dinner&body=${mailContent}`
            shell.openExternal(mailLink);
        })
        a.appendChild(document.createTextNode(group.name))
        mailLinkContainer.appendChild(a);
        mailLinkContainer.appendChild(document.createElement('br'));
    })
    div.appendChild(mailLinkContainer);
}

function createRow(group, i){
    const tr = document.createElement('tr')
    const otherGroups = getGroupsEatingWithYou(i);
    tr.appendChild(document.createElement('td').appendChild(document.createTextNode(group.name)))
    tr.appendChild(generateTableData(otherGroups[0].name, otherGroups[1].name));
    tr.appendChild(generateTableData(otherGroups[2].name, otherGroups[3].name));
    tr.appendChild(generateTableData(otherGroups[4].name, otherGroups[5].name));
    return tr;
}

function getGroupsEatingWithYou(i) {
    return [
      groups[groups[i].mealGroups.starterGroup[0] - 1],
      groups[groups[i].mealGroups.starterGroup[1] - 1],
      groups[groups[i].mealGroups.mainCourseGroup[0] - 1],
      groups[groups[i].mealGroups.mainCourseGroup[1] - 1],
      groups[groups[i].mealGroups.dessertGroup[0] - 1],
      groups[groups[i].mealGroups.dessertGroup[1] - 1]
    ];
}
function generateTableData(firstGroup, secondGroup){
    const td = document.createElement('td')
    td.appendChild(document.createTextNode(firstGroup));
    td.appendChild(document.createElement('br'));
    td.appendChild(document.createTextNode(secondGroup));
    return td;
}

function generateMailContent(self, i) {
    const otherGroups = getGroupsEatingWithYou(i);
    // say hello
    let bodyString = 'Hallo ' + self.name + 
        "%0D%0A%0D%0A" + texts.introText.replace(/(?:\r\n|\r|\n)/g, '%0D%0A').replace(',','%2C')+ "%0D%0A%0D%0A";
        
    // create the meals
    for (i = 0; i < 6; i+=2) {
        let time;
        let meal;
        switch (i) {
            case 0: time = times.starter;
                meal = 'Vorspeise';
                break;
            case 2: time = times.main; 
                meal = 'Hauptgericht';
                break;
            case 4: time = times.dessert; 
                meal = 'Nachspeise';
                break;
        }
        // get the meal string depending on who has to cook
        let mealString;
        if (self.meal === meal) mealString = getMealString(meal, time, otherGroups[i], otherGroups[i+1]);
        if (otherGroups[i].meal === meal) mealString = getMealString(meal, time, otherGroups[i]);
        if (otherGroups[i+1].meal === meal) mealString = getMealString(meal, time, otherGroups[i+1]);
        bodyString = bodyString + mealString;
    }
    bodyString = bodyString + texts.endText.replace(/(?:\r\n|\r|\n)/g, '<br />').replace(',','%2C');
    if (bodyString.includes('&')){
        ipc.send('open-error-dialog', 'Fehler beim erstellen der Links', 'Bitte entferne die &-Zeichen aus deiner Nachricht.')
    } else {
        return bodyString;        
    }
}

// only receives two groups if you cook yourself
function getMealString(meal, time, group1, group2){
    if (group2){
        return `${meal} um ${time} Uhr %0D%0A Bei euch mit: ${group1.name} %0D%0A
            Tel: ${group1.tel} %0D%0A Essbesonderheiten: ${group1.eatingHabits} %0D%0A%0D%0A
            und ${group2.name}%0D%0A
            Tel: ${group2.tel} %0D%0A Essbesonderheiten: ${group2.eatingHabits} %0D%0A%0D%0A
            `
    } else {
        return `${meal} um ${time} Uhr %0D%0A Bei: ${group1.name} %0D%0A
        Location: ${group1.postalAddress} %0D%0A Tel: ${group1.tel} %0D%0A%0D%0A
        `
    }
}
