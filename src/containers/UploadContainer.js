import React from "react";
import { Typography } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";

class UploadContainer extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="body1" gutterBottom paragraph>
          Für die Nutzung dieses Tools musst du die Teaminformationen über
          Google Forms sammeln. Eine Vorlage dafür findest du{" "}
          <a
            href="#top"
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/1bqJfzDQmFSAOwvCb6gXIOHneBFyPJcTSSWg4NsVmD6c/edit?usp=sharing"
              )
            }
            style={{ color: "blue" }}
            id="link-example"
          >
            hier
          </a>
          .
        </Typography>
        <Typography variant="body1" gutterBottom paragraph>
          Bitte editiere das Original nicht. Logge dich mit einem Google-Account
          ein,
          <b> kopiere</b> dir das Formular (Die Drei Punkte rechts oben → Kopie
          erstellen) und passe die Beschreibungen an (Wichtig: Verändere die
          Reihenfolge der Fragen nicht!).
        </Typography>
        <Typography variant="body1" gutterBottom paragraph>
          Sobald sich alle Teams angemeldet haben, exportiere die Ergenisse als
          CSV (Antworten → Die Drei Punkte → Antworten herunterladen (CSV)).
          Entzippe die Datei und lade sie hier im Programm über den
          Upload-Button hoch.
        </Typography>
        <Tooltip title="Stadt des Running Dinners">
          <TextField
            id="city"
            label="Stadt 🌇"
            value={this.props.city}
            onChange={event => this.props.onCityChanged(event.target.value)}
            margin="normal"
          />
        </Tooltip>
      </div>
    );
  }
}

export default UploadContainer;
