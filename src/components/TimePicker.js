import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { setTime } from "../redux/actions";
import { connect } from "react-redux";

class MyTimePicker extends React.Component {
  render() {
    const courses = ["Vorspeise", "Hauptspeise", "Nachspeise"];
    return (
      <Paper style={{ padding: 20 }}>
        <Grid
          container
          justify="center"
          style={{ flexGrow: 1, display: "flex" }}
          spacing={10}
        >
          {[0, 1, 2].map(i => (
            <Grid key={i} item>
              {courses[i] + " "}
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <TimePicker
                  margin="normal"
                  id="time-picker"
                  ampm={false}
                  value={this.props.time[i]}
                  onChange={time =>
                    this.props.setTime({ time: time, mealIndex: i })
                  }
                  autoOk={true}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = state => state.dinnerDetails;
const mapDispatchToProps = dispatch => ({
  setTime: time => dispatch(setTime(time))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTimePicker);
