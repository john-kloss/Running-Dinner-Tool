import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { TimePicker, ResultsTable, TextInput } from '../components';

class PlanContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      plan: {},
    };
  }

  componentWillMount() {
    const plan = this.createPlan();
    this.props.onPlanChange(plan);
    this.setState({ plan });
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
    const { plan } = this.state;
    //TODO : make time and texts persistent
    return (
      <div style={{ padding: 10 }}>
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
        <TimePicker onTimeChange={(times) => this.props.onTimeChange(times)} />
        <TextInput onTextChange={(texts) => this.props.onTextChange(texts)} />
        <Typography variant="subheading" gutterBottom paragraph>
          Hier noch eine Übersicht über die Zuteilung der Teams.
        </Typography>
        <ResultsTable plan={plan} groups={this.props.groups} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.props.handleNext()}
        >
          Weiter
        </Button>
      </div>
    );
  }
}
export default PlanContainer;
