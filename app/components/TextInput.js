import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texts: ['', ''],
    };
  }

  onTextChange(text, i) {
    const newTexts = this.state.texts;
    newTexts[i] = text;
    this.setState({ texts: newTexts });
    this.props.onTextChange(newTexts);
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
          onChange={(event) => this.onTextChange(event.target.value, 0)}
        />
        <TextField
          style={{ flex: 1, marginLeft: 15, marginRight: 15 }}
          label="Text zum Ende der Mail"
          multiline
          rows="4"
          margin="normal"
          onChange={(event) => this.onTextChange(event.target.value, 1)}
        />
      </Paper>
    );
  }
}
export default TextInput;
