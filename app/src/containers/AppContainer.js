import React from "react";
import Grow from "@material-ui/core/Grow";
import { UploadContainer, PlanContainer } from "./index";
import {
  UploadButton,
  PaperSheet,
  TeamTable,
  MailLinks,
  AlertDialog
} from "../components";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      activeStep: 0,
      times: ["18:00", "18:00", "18:00"],
      texts: ["", ""],
      plan: {},
      showAlertDialog: false
    };
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
  getSteps() {
    return [
      "Vorbereitung",
      "Plan generieren",
      "Details hinzufügen",
      "Mails senden"
    ];
  }
  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <UploadContainer />
            <UploadButton
              showAlertDialog={() => this.setState({ showAlertDialog: true })}
              onUpload={groups => {
                this.setState({ groups });
                this.handleNext();
              }}
            />
          </div>
        );
      case 1:
        return (
          <Grow in={this.state.groups.length !== 0}>
            <TeamTable
              groups={this.state.groups}
              createPlan={() => {
                this.handleNext();
              }}
            />
          </Grow>
        );
      case 2:
        return (
          <PlanContainer
            groups={this.state.groups}
            onPlanChange={plan => this.setState({ plan })}
            onTimeChange={times => this.setState({ times })}
            onTextChange={texts => this.setState({ texts })}
            handleNext={() => this.handleNext()}
            times={this.state.times}
            texts={this.state.texts}
          />
        );
      case 3:
        return (
          <MailLinks
            plan={this.state.plan}
            groups={this.state.groups}
            times={this.state.times}
            texts={this.state.texts}
          />
        );
      default:
        return "Unknown step";
    }
  }

  render() {
    const steps = this.getSteps();
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
export default AppContainer;
