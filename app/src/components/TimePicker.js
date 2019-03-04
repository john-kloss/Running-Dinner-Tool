import React from "react";
import TimeInput from "material-ui-time-picker";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

class TimePicker extends React.Component {
  onTimeChange(time, i) {
    const newTimes = this.props.times;
    newTimes[i] = time.toTimeString().substring(0, 5);
    this.props.onTimeChange(newTimes);
  }
  render() {
    const courses = ["Vorspeise", "Hauptspeise", "Nachspeise"];
    return (
      <Paper>
        <Grid
          container
          justify="center"
          style={{ flexGrow: 1, display: "flex" }}
          spacing={16}
        >
          {[0, 1, 2].map(i => (
            <Grid key={i} item>
              {courses[i] + " "}
              <TimeInput
                autoOk
                defaultValue={
                  new Date("December 17, 1995 " + this.props.times[i] + ":00")
                }
                onChange={time => this.onTimeChange(time, i)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }
}
export default TimePicker;
