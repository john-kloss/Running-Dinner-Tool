import React from 'react';
import { Typography } from '@material-ui/core';
import ReactDOM from 'react-dom';

class UploadContainer extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="subheading" gutterBottom paragraph>
          Für die Nutzung dieses Tools musst du die Teaminformationen über
          Google Forms sammeln. Eine Vorlage dafür findest du{' '}
          <a
            onClick={() =>
              window.open(
                'https://docs.google.com/forms/d/1vvO8NXG78MsO5e4sOGtwEkixkuydAficClXSWkl3OyU/edit?usp=sharing'
              )
            }
            style={{ color: 'blue' }}
            id="link-example"
          >
            hier
          </a>
          .
        </Typography>
        <Typography variant="subheading" gutterBottom paragraph>
          Bitte editiere das Original nicht. Logge dich mit einem Google-Account
          ein,
          <b> kopiere</b> dir das Formular (Die Drei Punkte rechts oben → Kopie
          erstellen) und passe die Beschreibungen an (Wichtig: Verändere die
          Reihenfolge der Fragen nicht!).
        </Typography>
        <Typography variant="subheading" gutterBottom paragraph>
          Sobald sich alle Teams angemeldet haben, exportiere die Ergenisse als
          CSV (Antworten → Die Drei Punkte → Antworten herunterladen (CSV)).
          Entzippe die Datei und lade sie hier im Programm über den
          Upload-Button hoch.
        </Typography>
      </div>
    );
  }
}
class SubWindow extends React.Component {
  nativeWindowObject: null;

  componentWillMount() {
    this.nativeWindowObject = window.open(
      'https://docs.google.com/forms/d/1vvO8NXG78MsO5e4sOGtwEkixkuydAficClXSWkl3OyU/edit?usp=sharing'
    );
  }
  render() {
    return this.nativeWindowObject
      ? ReactDOM.createPortal(
          this.props.children,
          this.nativeWindowObject.document.body
        )
      : null;
  }
}
export default UploadContainer;
