import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class MailLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: [],
    };
  }
  generateMailContent(group, plan) {
    const meals = ['starter', 'mainCourse', 'dessert'];
    const mealsDE = ['Vorspeise', 'Hauptgericht', 'Nachspeise'];
    const times = this.props.times;
    // add the beginning text
    let content = `Hallo ${group.name} \n ${this.props.texts[0]} %0D%0A%0D%0A `;
    // get the groups eating together
    const mealGroups = meals.map((meal) => {
      return plan[meal].filter((g) => g.find((a) => a.id === group.id))[0];
    });

    // iterate of the three meals
    for (let i = 0; i < 3; i++) {
      // if the meal is at your place
      if (group.id % 3 === i) {
        const eatingWithYou = mealGroups[i].filter((g) => g.id !== group.id);
        content =
          content +
          `<b>${mealsDE[i]}</b> um ${times[i]} Uhr 
           Bei euch mit:
          '${eatingWithYou[0].name}'
              Tel: ${eatingWithYou[0].tel}
              Essbesonderheiten: ${eatingWithYou[0].eatingHabits} %0D%0A
          und %0D%0A '${eatingWithYou[1].name}'
              Tel: ${eatingWithYou[1].tel}
              Essbesonderheiten: ${eatingWithYou[1].eatingHabits} %0D%0A
          `;
      } else {
        // if the meal is at someone else's place
        const preparingTheMeal = mealGroups[i].filter((g) => g.id % 3 === i)[0];
        content =
          content +
          `<b>${mealsDE[i]}</b> um ${times[i]} Uhr
          Bei: '${preparingTheMeal.name}'
          Location: ${preparingTheMeal.postalAddress} 
          Tel: ${preparingTheMeal.tel} %0D%0A
          `;
      }
    }
    // add the end text
    content += this.props.texts[1];

    return content
      .replace(/(?:\r\n|\r|\n)/g, '%0D%0A')
      .replace(/,/g, '%2C')
      .replace(/&/g, 'und');
  }
  render() {
    const { plan, groups } = this.props;

    return (
      <Paper style={{ padding: 10, margin: 10 }}>
        <Typography
          variant="subheading"
          style={{ marginTop: 5 }}
          gutterBottom
          paragraph
        >
          Hier findest du die Links, mit denen du Mails an die entsprechenden
          Gruppen verschicken kannst.
        </Typography>
        <Grid container spacing={24} justify="center">
          {groups.map((group) => {
            const mailContent = this.generateMailContent(group, plan);
            return (
              <Grid
                item
                xs={3}
                style={{
                  padding: 10,
                  textAlign: 'center',
                }}
              >
                <a
                  href={`mailto:${
                    group.mailAddress
                  }?subject=Running Dinner&body=${mailContent}`}
                >
                  {group.name}
                </a>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  }
}
export default MailLinks;
