import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import PapaParse from "papaparse";
import { connect } from "react-redux";
import { setUseLocation, setDialog } from "../redux/actions";

class defaultGroup {
  constructor() {
    return {
      mailAddress: "tba",
      name: "tba",
      postalAddress: "tba",
      addressAddition: "tba",
      eatingHabits: "tba",
      tel: "tba"
    };
  }
}

class UploadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      progress: 0
    };
  }

  async getAddress(address) {
    try {
      let response = await fetch(
        encodeURI(
          "https://nominatim.openstreetmap.org/search/" +
            address +
            " " +
            this.props.city +
            "?format=json&limit=1"
        )
      );
      let responseJson = await response.json();
      if (responseJson.length > 0) return responseJson[0];
      else return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async handleData(data) {
    try {
      let groups = [];
      // iterate over all groups, transform array to object
      for (let i = 1; i < data.length; i++) {
        const group = data[i];
        // ignore empty lines
        if (group[0] === "") continue;

        // throw error
        if (group.length !== 7) {
          throw Error({ i: i });
        }

        this.setState({ progress: (i / data.length) * 100 });
        let location;
        if (this.props.useLocation) {
          location = await this.getAddress(group[3]);
        }

        groups.push({
          id: i - 1,
          mailAddress: group[1],
          name: group[2],
          postalAddress: group[3],
          addressAddition: group[4],
          eatingHabits: group[5],
          tel: group[6],
          location: location
        });
      }

      // in case we don't have enough groups, add default groups
      while (groups.length % 3 !== 0) {
        const group = new defaultGroup();
        group.id = groups.length;
        groups.push(group);
        this.props.setDialog({
          open: true,
          title: "Warnung",
          content:
            "Die Anzahl der Gruppen ist nicht durch 3 teilbar. DIe Liste wurde mit Default-Gruppen aufgefüllt."
        });
      }
      // successful upload
      this.props.onUpload(groups);
    } catch (e) {
      setDialog({
        title: "Fehler beim Import",
        content:
          "Die Gruppe " + e.i + "hat nicht die richtige Anzahl an Einträgen.",
        open: true
      });
    }
  }

  render() {
    return (
      <div>
        {/* {this.props.groups.length !== 0 && (
          <Button
            variant="contained"
            color="primary"
            component="span"
            size="large"
            onClick={() => this.props.onUpload()}
          >
            Letzten Stand benutzen
            <RedoIcon style={{ marginRight: 10 }} />
          </Button>
        )} */}
        <input
          accept=".csv"
          id="outlined-button-file"
          data-testid="csvInput"
          type="file"
          hidden={true}
          onChange={e => {
            let reader = new FileReader();
            reader.onload = event => {
              const csvData = PapaParse.parse(event.target.result);
              this.handleData(csvData.data);
            };
            reader.readAsText(e.target.files[0]);
          }}
        />
        <label htmlFor="outlined-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            size="large"
          >
            Upload
            <CloudUploadIcon style={{ marginLeft: 10 }} />
          </Button>
        </label>
        {/* Switch to use location */}
        <Tooltip title="Benutze Location (beta)">
          <Switch
            // checked={navigator.onLine ? settings.useLocation : false}
            checked={this.props.useLocation}
            color="primary"
            onChange={(event, checked) => {
              this.props.setUseLocation(checked);
            }}
          />
        </Tooltip>

        {/* Progress Bar */}
        <LinearProgress
          style={{ paddingTop: 5, marginTop: 10 }}
          variant="determinate"
          value={this.state.progress}
        />
      </div>
    );
  }
}

const mapStateToProps = state => state.settings;
const mapDispatchToProps = dispatch => ({
  setUseLocation: useLocation => dispatch(setUseLocation(useLocation)),
  setDialog: dialog => dispatch(setDialog(dialog))
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadButton);
