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
    introText: 'Hier kommt euer Plan',
    endText: 'Liebe Grüße, der Organisiator',
}
ipc.on('show-results', (event, arg) => {
    groups = arg;
    showResults();
})

const timePicker = document.getElementsByClassName('meal-time');
for (let i = 0; i < timePicker.length; i++) {
    timePicker[i].addEventListener('change',
        (event) => {
            switch(event.target.id){
                case 'starter': times.starter = event.target.value; break;
                case 'mainCourse': times.main = event.target.value; break;
                case 'dessert': times.dessert = event.target.value; break;
        }
        console.log(times)
        createMailLinks(groups);
    });
}

const textInputs = document.getElementsByClassName('mail-text');
for (let i = 0; i < textInputs.length; i++) {
    textInputs[i].addEventListener('change', (event) => {
        texts[event.target.name] = event.target.value; 
        createMailLinks(groups);
    });
}

const buttonExportPlan = document.getElementById('button-export-plan');
buttonExportPlan.addEventListener('click', () => {
    ipc.send('export-plan');        
})
    
function showResults() {
    // add the table data
    const tbody = document.getElementById('table-results-tbody');        
    groups.map((group, i) => {
        tbody.appendChild(createRow(group, i));
    });

    //append the links to send the mails
    createMailLinks(groups);
}

function createMailLinks(groups) {
    const mailLinkContainer = document.getElementById('mail-link-container');
    // remove previously created links
    while (mailLinkContainer.firstChild) {
        mailLinkContainer.removeChild(mailLinkContainer.firstChild);
    }
    // create links for the groups
    groups.map((group,i) => {
        const a = document.createElement('a');
        a.setAttribute('class', 'mail-link')
        const mailContent = generateMailContent(group, i);
        a.addEventListener('click', function (event) {
            const mailLink = `mailto:${group.mailAddress}?subject=Running Dinner&body=${mailContent}`
            shell.openExternal(mailLink);
        });
        a.appendChild(document.createTextNode(group.name))
        mailLinkContainer.appendChild(a);
        mailLinkContainer.appendChild(document.createElement('br'));
    })
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

// only receives two groups as arguments if you cook yourself
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
