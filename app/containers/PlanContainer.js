import React from 'react';
import Typography from '@material-ui/core/Typography';
import { TimePicker, ResultsTable, TextInput, MailLinks } from '../components';

class PlanContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      times: undefined,
      introText: '',
      endText: '',
    };
  }

  /**
   * This function creates the plan. It contains the id of the teams which eat which meal
   */
  createPlan() {
    const groups = this.props.groups;
    const n = groups.length;
    const magicNumber =
      n === 9
        ? [1, 2, 4, 8, 5, 7]
        : n === 12
          ? [1, 2, 7, 11, 8, 10]
          : n === 15
            ? [1, 2, 7, 11, 8, 10]
            : [1, 2, 7, 11, 14, 16];
    let plan = {
      starter: [],
      mainCourse: [],
      dessert: [],
    };
    for (let i = 0; i < n - 1; i += 3) {
      plan.starter.push([
        groups.find((g) => g.id === i),
        groups.find((g) => g.id === (i + magicNumber[0]) % n),
        groups.find((g) => g.id === (i + magicNumber[1]) % n),
      ]);
      plan.mainCourse.push([
        groups.find((g) => g.id === i),
        groups.find((g) => g.id === (i + magicNumber[2]) % n),
        groups.find((g) => g.id === (i + magicNumber[3]) % n),
      ]);
      plan.dessert.push([
        groups.find((g) => g.id === i),
        groups.find((g) => g.id === (i + magicNumber[4]) % n),
        groups.find((g) => g.id === (i + magicNumber[5]) % n),
      ]);
    }
    return plan;
  }
  render() {
    const plan = this.createPlan();
    return (
      <div>
        <Typography
          style={{ marginTop: 30 }}
          variant="subheading"
          gutterBottom
          paragraph
        >
          Wähle nun die Zeiten für Vor-, Haupt- und Nachspeise aus. Anschließend
          kannst du den Text, der zum Beginn und zum Ende der Mail angezeigt
          werden soll, eingeben. Die Mails werden dann automatisch für dich
          generiert.
        </Typography>
        <TimePicker onTimeChange={(times) => this.setState({ times })} />
        <TextInput
          onUpdateText={(introText, endText) =>
            this.setState({ introText, endText })
          }
        />
        <Typography variant="subheading" gutterBottom paragraph>
          Hier noch eine Übersicht über die Zuteilung der Teams.
        </Typography>
        <ResultsTable plan={plan} groups={this.props.groups} />
        <Typography variant="subheading" gutterBottom paragraph>
          Hier findest du die Links, mit denen du Mails an die entsprechenden
          Gruppen verschicken kannst.
        </Typography>
        <MailLinks plan={plan} groups={this.props.groups} />
      </div>
    );
  }
}
export default PlanContainer;
