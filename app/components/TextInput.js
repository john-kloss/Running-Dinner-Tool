import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      introText: '',
      endText: '',
    };
  }

  render() {
    return (
      <Paper
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <TextField
          style={{ flex: 1, marginLeft: 15, marginRight: 15 }}
          label="Text zu Beginn der Mail"
          multiline
          rows="4"
          margin="normal"
          onChange={(event) => this.setState({ introText: event.target.value })}
        />
        <TextField
          style={{ flex: 1, marginLeft: 15, marginRight: 15 }}
          label="Text zum Ende der Mail"
          multiline
          rows="4"
          margin="normal"
          onChange={(event) => this.setState({ endText: event.target.value })}
        />
      </Paper>
    );
  }
}
export default TextInput;
