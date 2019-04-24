//React libraries
import React from "react";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import { SnackBar } from "./index";

var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

class TeamTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedGroup: null,
      currentAddress: "",
      groups: this.props.groups,
      showSnackBar: false,
      snackBarMessage: "SnackBar",
      snackBarType: "warning"
    };
  }
  componentDidMount() {
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v9"
    });
    let lngLatBounds = new mapboxgl.LngLatBounds();
    // iterate over the groups
    this.state.groups.map(group => {
      if (group.location) {
        new mapboxgl.Marker()
          .setLngLat([group.location.lon, group.location.lat])
          .setPopup(new mapboxgl.Popup().setText(group.name))
          .addTo(this.map);
        // extend the bounds to the current location
        lngLatBounds.extend(
          new mapboxgl.LngLat(group.location.lon, group.location.lat)
        );
      }
    });
    // the map will show all markers
    if (!lngLatBounds.isEmpty()) {
      this.map.fitBounds(lngLatBounds, {
        padding: 50,
        linear: true
      });
    }
  }

  // update the address and the location
  async onAddressEdited() {
    try {
      let response = await fetch(
        encodeURI(
          "https://nominatim.openstreetmap.org/search/" +
            this.state.currentAddress +
            "?format=json&limit=1"
        )
      );
      let responseJson = await response.json();

      // if the address was found
      if (responseJson.length > 0) {
        const groups = this.state.groups;
        groups[
          this.state.selectedGroup
        ].postalAddress = this.state.currentAddress;
        groups[this.state.selectedGroup].location = responseJson[0];
        // show the snackbar -> success
        await this.setState({
          groups,
          open: false,
          showSnackBar: true,
          snackBarMessage: "Die Adresse wurde erfolgreich aktualisiert.",
          snackBarType: "success"
        });
        this.buildMap();
      } else {
        // otherwise show failure
        this.setState({
          showSnackBar: true,
          snackBarMessage: "Die Adresse konnte nicht gefunden werden.",
          snackBarType: "warning"
        });
      }
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoiamtsb3NzIiwiYSI6ImNqc292MGQzZzBxc2g0OXQ5dDEyaWltZzIifQ.Sc3GhcafRaIxXxCOzNhOfw";

    return (
      <div {...this.props}>
        <div style={{ height: 500 }} ref={el => (this.mapContainer = el)} />
        {/* Dialog for address editing */}
        <Dialog
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
          onKeyPress={event => {
            if (event.key == "Enter") this.onAddressEdited();
          }}
        >
          <DialogTitle>Adresse bearbeiten</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Editiere die Adresse. Die Karte wird danach automatisch
              aktualisiert.
            </DialogContentText>
            <TextField
              autoFocus
              value={this.state.currentAddress}
              onChange={event =>
                this.setState({ currentAddress: event.target.value })
              }
              margin="dense"
              id="name"
              label="Adresse"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ open: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.onAddressEdited();
              }}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <SnackBar
          showSnackBar={this.state.showSnackBar}
          message={this.state.snackBarMessage}
          onClose={() => this.setState({ showSnackBar: false })}
          snackBarType={this.state.snackBarType}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>E-Mail Adresse</TableCell>
              <TableCell>Teamname</TableCell>
              <TableCell>Postalische Adresse</TableCell>
              <TableCell>Essbesonderheiten</TableCell>
              <TableCell>Handynummer</TableCell>
              <TableCell>Teamnummer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.groups.map((group, i) => {
              return (
                <TableRow key={group.id}>
                  <TableCell component="th" scope="row">
                    {group.mailAddress}
                  </TableCell>
                  <TableCell>{group.name}</TableCell>
                  <TableCell
                    style={{ color: group.location ? "black" : "red" }}
                  >
                    {group.postalAddress}
                    <EditIcon
                      style={{ margin: 5 }}
                      color="primary"
                      onClick={e => {
                        this.setState({
                          open: true,
                          selectedGroup: i,
                          currentAddress: group.postalAddress
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>{group.eatingHabits}</TableCell>
                  <TableCell>{group.tel}</TableCell>
                  <TableCell>{group.id}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Typography style={{ marginTop: 10, marginBottom: 10 }}>
          Sieht das gut aus? Dann erstelle jetzt deinen Plan.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.props.createPlan()}
        >
          Plan erstellen
        </Button>
      </div>
    );
  }
}
export default TeamTable;
