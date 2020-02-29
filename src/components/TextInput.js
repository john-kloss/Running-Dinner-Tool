import React from "react";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

class TextInput extends React.Component {
  render() {
    return (
      <Paper
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: 20,
          marginBottom: 20
        }}
      >
        <TextField
          style={{ flex: 1, marginLeft: 15, marginRight: 15 }}
          label="Text zu Beginn der Mail"
          multiline
          rows="10"
          margin="normal"
          defaultValue={this.props.texts[0]}
          onChange={event =>
            this.props.onTextChange({ text: event.target.value, textIndex: 0 })
          }
        />
        <TextField
          style={{ flex: 1, marginLeft: 15, marginRight: 15 }}
          label="Text zum Ende der Mail"
          multiline
          rows="10"
          margin="normal"
          defaultValue={this.props.texts[1]}
          onChange={event =>
            this.props.onTextChange({ text: event.target.value, textIndex: 1 })
          }
        />
      </Paper>
    );
  }
}
export default TextInput;
