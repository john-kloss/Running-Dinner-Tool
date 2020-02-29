import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MailIcon from "@material-ui/icons/Mail";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { connect } from "react-redux";
import { SnackBar, ResultsTable } from "../components";

class MailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: [],
      showSnackBar: false
    };
  }
  generateMailContent(group, plan) {
    const meals = ["starter", "mainCourse", "dessert"];
    const mealsDE = ["Vorspeise", "Hauptgericht", "Nachspeise"];
    const time = this.props.time.map(t => t.toTimeString().substring(0, 5));
    let link = "https://www.google.com/maps/dir/";
    // add the beginning text
    let content = "Hallo " + group.name + "\n" + this.props.text[0] + "\n\n";
    // get the groups eating together
    const mealGroups = meals.map(meal => {
      return plan[meal].filter(g => g.find(a => a.id === group.id))[0];
    });

    // iterate of the three meals
    for (let i = 0; i < 3; i++) {
      if (i === 1) link += "/";
      if (i === 2) link += "/";
      if (group.id % 3 === i) {
        // if the meal is at your place
        const eatingWithYou = mealGroups[i].filter(g => g.id !== group.id);
        content =
          content +
          mealsDE[i] +
          " um " +
          time[i] +
          " Uhr \nBei euch mit:\n" +
          eatingWithYou[0].name +
          "\nTel: " +
          eatingWithYou[0].tel +
          "\nEssbesonderheiten: " +
          eatingWithYou[0].eatingHabits +
          "\nund\n" +
          eatingWithYou[1].name +
          "\nTel: " +
          eatingWithYou[1].tel +
          "\nEssbesonderheiten: " +
          eatingWithYou[1].eatingHabits +
          "\n\n";

        if (group.location)
          link += group.location.lat + "," + group.location.lon;
      } else {
        // if the meal is at someone else's place
        const preparingTheMeal = mealGroups[i].filter(g => g.id % 3 === i)[0];
        content =
          content +
          mealsDE[i] +
          " um " +
          time[i] +
          " Uhr \nBei: " +
          preparingTheMeal.name +
          "\nLocation: " +
          preparingTheMeal.postalAddress +
          ", " +
          preparingTheMeal.addressAddition +
          "\nTel: " +
          preparingTheMeal.tel +
          "\n\n";

        if (group.location && preparingTheMeal.location)
          link +=
            preparingTheMeal.location.lat + "," + preparingTheMeal.location.lon;
      }
    }
    // add the link to the route
    if (group.location)
      content += `Hier findet ihr noch einmal die komplette <a href="${link +
        "/data=!3m1!4b1!4m2!4m1!3e1"}">Route</a>\n\n`;
    // add the end text
    content += this.props.text[1];

    return content;
  }
  render() {
    const { plan, groups } = this.props;

    return (
      <div style={{ margin: 10 }}>
        <Paper style={{ padding: 10 }}>
          <Typography
            variant="body1"
            style={{ marginTop: 5 }}
            gutterBottom
            paragraph
          >
            Mit einem Klick auf den Mail-Button, kannst du Mails an die
            entsprechenden Gruppen verschicken kannst. Anderfalls kannst du auch
            den Mailtext einfach mit dem Copy-Button in deine Zwischenablage
            kopieren.
          </Typography>

          {/* Grid that contains all mail links */}

          <Grid container spacing={10} justify="center" style={{ padding: 30 }}>
            {groups.map(group => {
              const mailContent = this.generateMailContent(group, plan);
              return (
                <Grid
                  item
                  xs={4}
                  style={{
                    padding: 10
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {group.name + ": " + group.mailAddress}
                    {/* Mail Button */}
                    <a
                      href={`mailto:${
                        group.mailAddress
                      }?subject=Running Dinner&body=${mailContent
                        .replace(/(?:\r\n|\r|\n)/g, "%0D%0A")
                        .replace(/,/g, "%2C")
                        .replace(/&/g, "und")}`}
                    >
                      <MailIcon style={{ marginLeft: 10, marginRight: 10 }} />
                    </a>

                    {/* Clipboard Button */}
                    <FileCopyIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.setState({ showSnackBar: true });
                        navigator.clipboard.writeText(mailContent);
                      }}
                    />
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
        <Paper style={{ padding: 20, marginTop: 10 }}>
          <Typography variant="body1" gutterBottom paragraph>
            Hier noch eine Übersicht über die Zuteilung der Teams. Die fett
            gedruckten Teams bereiten den jeweiligen Gang vor. Mach dir ruhig
            ein Foto oder einen Screenshot davon 😉
          </Typography>
          <ResultsTable plan={plan} groups={this.props.groups} />
        </Paper>
        <SnackBar
          showSnackBar={this.state.showSnackBar}
          message="Mail wurde erfolgreich in die Zwischenablage kopiert."
          onClose={() => this.setState({ showSnackBar: false })}
          snackBarType="success"
        />
      </div>
    );
  }
}
const mapStateToProps = state => state.dinnerDetails;

export default connect(mapStateToProps)(MailContainer);
