import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class MailLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: [],
    };
  }
  generateMailContent(group, plan) {
    //TODO: replace things??
    let content = `Hallo ${group.name}, \n ${this.props.introText} `;
    const meals = ['starter', 'mainCourse', 'dessert'];
    // get the groups eating together
    const mealGroups = meals.map((meal) => {
      return plan[meal].filter((g) => g.find((a) => a.id === group.id))[0];
    });
    for (let i = 0; i < 3; i++) {
      if (group.id % 3 === i) {
        //
        const eatingWithYou = mealGroups[i].filter((g) => g.id !== group.id);
        console.log(eatingWithYou);
        content =
          content +
          meals[i] +
          ' Bei euch mit' +
          eatingWithYou[0].name +
          ' und ' +
          eatingWithYou[1].name;
      } else {
        content = content + meals[i] + ' nicht bei euch '; //+ mealGroups[i];
      }
    }
    console.log(content);
    return content;
  }
  render() {
    const { plan, groups } = this.props;

    return (
      <Paper>
        <Grid container spacing={24}>
          {groups.map((group) => {
            const mailContent = this.generateMailContent(group, plan);
            return (
              <div id={group.id}>
                <Grid item xs={6}>
                  <Paper>
                    <a
                      href={`mailto:'${
                        group.mailAddress
                      }?subject=Running Dinner&body=${mailContent}`}
                    >
                      {group.name}
                    </a>
                  </Paper>
                </Grid>
                {/* <Grid item xs={6}>
                  <Paper>xs=6</Paper>
                </Grid> */}
              </div>
            );
          })}
        </Grid>
      </Paper>
    );
  }
}
export default MailLinks;
