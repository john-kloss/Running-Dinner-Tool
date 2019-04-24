import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import PapaParse from "papaparse";

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
      progress: 0,
      useLocation: true
    };
  }

  async getAddress(address) {
    try {
      let response = await fetch(
        encodeURI(
          "https://nominatim.openstreetmap.org/search/" +
            address +
            "?format=json&limit=1"
        )
      );
      let responseJson = await response.json();
      if (responseJson.length > 0) return responseJson[0];
      else return null;
    } catch (error) {
      console.error(error);
    }
  }

  async handleData(data) {
    let groups = [];
    // iterate over all groups, transform array to object
    for (let i = 0; i < data.length; i++) {
      const group = data[i];
      if (group.length !== 7) {
        let error = true;
      }
      if (i === 0) continue;
      if (group[0] === "") continue;

      this.setState({ progress: (i / data.length) * 100 });
      let location;
      if (this.state.useLocation) {
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
      this.props.showAlertDialog();
    }
    this.props.onUpload(groups);
  }

  render() {
    return (
      <div>
        <input
          accept=".csv"
          id="outlined-button-file"
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
        <Tooltip title="Benutze Location (beta)">
          <Switch
            checked={this.state.useLocation}
            color="primary"
            onChange={(event, checked) =>
              this.setState({ useLocation: checked })
            }
          />
        </Tooltip>
        <LinearProgress
          style={{ paddingTop: 5, marginTop: 10 }}
          variant="determinate"
          value={this.state.progress}
        />
      </div>
    );
  }
}
export default UploadButton;
