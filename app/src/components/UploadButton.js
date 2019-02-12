import React from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import PapaParse from "papaparse";

const regex = /[^a-zA-Z\d?!\s@.äüöÄÖÜß]/g;

class defaultGroup {
  constructor() {
    return {
      mailAddress: "tba",
      name: "tba",
      postalAddress: "tba",
      eatingHabits: "tba",
      tel: "tba"
    };
  }
}

class UploadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: []
    };
  }

  handleData(data) {
    let groups = [];
    // iterate over all group, transform array to object
    data.forEach((group, i) => {
      if (group.length !== 6) {
        let error = true;
      }
      if (i === 0) return;
      if (group[0] === "") return;

      groups.push({
        id: i - 1,
        mailAddress: group[1],
        name: group[2].replace(regex, ""),
        postalAddress: group[3].replace(regex, ""),
        eatingHabits: group[4].replace(regex, ""),
        tel: group[5]
      });
    });

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
          accept="*.csv"
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
      </div>
    );
  }
}
export default UploadButton;
