const ipc = require('electron').ipcRenderer;
const _ = require('lodash');

ipc.on('create-plan', (event, groups) => {
  createPlan(groups);
  document.getElementById('container-upload').classList.add('invisible');
  document.getElementById('container-results').classList.remove('invisible');
});

function getGroup(n, a, b) {
  let group = [];
  for (let i = 1; group.length < n / 3; i += 3) {
    group.push([
      i,
      (i + a) % n === 0 ? n : (i + a) % n,
      (i + b) % n === 0 ? n : (i + b) % n,
    ]);
  }
  return group;
}

function createPlan(groups) {
  const n = groups.length;
  const magicNumber =
    n === 9
      ? [1, 2, 4, 8, 5, 7]
      : n === 12
        ? [1, 2, 7, 11, 8, 10]
        : n === 15
          ? [1, 2, 7, 11, 8, 10]
          : [1, 2, 7, 11, 14, 16];
  let mealGroups = {
    starterGroup: getGroup(n, magicNumber[0], magicNumber[1]),
    mainCourseGroup: getGroup(n, magicNumber[2], magicNumber[3]),
    dessertGroup: getGroup(n, magicNumber[4], magicNumber[5]),
  };

  // put the meal and meal groups into the object
  const newGroups = groups.map((group) => {
    // determine the meal to cook
    let meal = null;
    switch (group.id % 3) {
      case 1:
        meal = 'Vorspeise';
        break;
      case 2:
        meal = 'Hauptgericht';
        break;
      case 0:
        meal = 'Nachspeise';
        break;
      default:
        console.error('error switching meal');
    }
    let starterGroup = mealGroups.starterGroup
      .filter((mealGroup) => {
        return _.indexOf(mealGroup, group.id) !== -1;
      })[0]
      .filter((team) => {
        return team !== group.id;
      });
    let mainCourseGroup = mealGroups.mainCourseGroup
      .filter((mealGroup) => {
        return _.indexOf(mealGroup, group.id) !== -1;
      })[0]
      .filter((team) => {
        return team !== group.id;
      });
    let dessertGroup = mealGroups.dessertGroup
      .filter((mealGroup) => {
        return _.indexOf(mealGroup, group.id) !== -1;
      })[0]
      .filter((team) => {
        return team !== group.id;
      });
    group.meal = meal;
    group.mealGroups = {
      starterGroup: starterGroup,
      mainCourseGroup: mainCourseGroup,
      dessertGroup: dessertGroup,
    };
    return group;
  });
  ipc.send('groups-planned', newGroups);
}
