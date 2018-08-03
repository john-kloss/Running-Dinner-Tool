import React from 'react';
import TimeInput from 'material-ui-time-picker';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      times: {
        starter: '',
        mainCourse: '',
        dessert: '',
      },
    };
  }
  onTimeChange(time, meal) {
    const newTimes = this.state.times;
    newTimes[meal] = time;
    console.log(newTimes);
    this.setState({ times: newTimes });
    this.props.onTimeChange(newTimes);
  }
  render() {
    return (
      <Paper>
        <Grid
          container
          justify="center"
          style={{ flexGrow: 1, display: 'flex' }}
          spacing={16}
        >
          {['starter', 'mainCourse', 'dessert'].map((course) => (
            <Grid key={course} item>
              {course}:
              {'  '}
              <TimeInput
                autoOk
                onChange={(time) => this.onTimeChange(time, course)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }
}
export default TimePicker;
