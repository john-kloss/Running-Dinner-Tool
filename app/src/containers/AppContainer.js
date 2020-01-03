import React from "react";
import Grow from "@material-ui/core/Grow";
import {
  UploadContainer,
  PlanContainer,
  OverviewContainer,
  MailContainer
} from "./index";
import { UploadButton, PaperSheet, AlertDialog } from "../components";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { setTime, setText } from "../redux/actions";

// import electron to receive the message before quit
let electron = window.require("electron");
let ipc = electron.ipcRenderer;

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      city: "",
      activeStep: 0,
      plan: {},
      showAlertDialog: false
    };
  }

  componentDidMount() {
    // load previous state from local storage
    try {
      // groups, city, text and time
      let groups = localStorage.getItem("groups");
      if (groups != "undefined" && groups != null) {
        groups = JSON.parse(groups);
      } else {
        groups = [];
      }
      let city = localStorage.getItem("city") || "Berlin";
      let text = localStorage.getItem("text");
      if (text != "undefined" && text != null) {
        text = JSON.parse(text);
        this.props.setText(text);
      }
      let time = localStorage.getItem("time");
      if (time != "undefined" && time != null) {
        time = JSON.parse(time);
        this.props.setTime(time);
      }
      this.setState({ groups, city });
    } catch (error) {
      console.log("error: ", error);
    }
    localStorage.clear();

    // save state before quit
    ipc.on("saveState", () => {
      localStorage.setItem("city", this.state.city);
      localStorage.setItem("groups", JSON.stringify(this.state.groups));
      localStorage.setItem("text", JSON.stringify(this.props.text));
      localStorage.setItem("time", JSON.stringify(this.props.time));
    });
  }

  handleNext() {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  }

  handleBack() {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <UploadContainer
              city={this.state.city}
              onCityChanged={city => {
                this.setState({ city });
              }}
            />
            <UploadButton
              groups={this.state.groups}
              city={this.state.city}
              showAlertDialog={() => this.setState({ showAlertDialog: true })}
              onUpload={groups => {
                // trick to use previous groups
                if (groups) {
                  this.setState({ groups });
                }
                this.handleNext();
              }}
            />
          </div>
        );
      case 1:
        return (
          // <Grow in={this.state.groups.length !== 0}>
          <OverviewContainer
            groups={this.state.groups}
            city={this.state.city}
            updateGroups={groups => {
              this.setState({ groups });
            }}
            createPlan={() => {
              this.handleNext();
            }}
          />
          // </Grow>
        );
      case 2:
        return (
          <PlanContainer
            groups={this.state.groups}
            onPlanChange={plan => this.setState({ plan })}
            handleNext={() => this.handleNext()}
          />
        );
      case 3:
        return (
          <MailContainer plan={this.state.plan} groups={this.state.groups} />
        );
      default:
        return "Unknown step";
    }
  }

  render() {
    const steps = [
      "Vorbereitung",
      "Plan generieren",
      "Details hinzufügen",
      "Mails senden"
    ];
    const { activeStep } = this.state;

    return (
      <PaperSheet headline={"Running Dinner Tool"}>
        <AlertDialog
          open={this.state.showAlertDialog}
          title="Zu wenige Gruppen"
          content="Die Anzahl der Gruppen muss durch 3 teilbar sein. 
          Die Liste wurde mit Default-Gruppen aufgefüllt."
          handleClose={() => this.setState({ showAlertDialog: false })}
        />
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {this.getStepContent(index)}

                  <div style={{ paddingTop: 10 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={() => this.handleBack()}
                    >
                      Zurück
                    </Button>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </PaperSheet>
    );
  }
}
const mapStateToProps = state => state.dinnerDetails;
const mapDispatchToProps = dispatch => ({
  setTime: time => dispatch(setTime(time)),
  setText: text => dispatch(setText(text))
});
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
