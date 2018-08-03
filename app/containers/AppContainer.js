import React from 'react';
import Grow from '@material-ui/core/Grow';
import { UploadContainer, PlanContainer } from './index';
import { UploadButton, PaperSheet, TeamTable } from '../components';
import Validator from '../helper/Validator';

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
    };
  }

  render() {
    return (
      <PaperSheet headline={'Running Dinner Tool'}>
        <UploadContainer />
        <UploadButton
          onUpload={(groups) => {
            //TODO: validate information
            // Validator.validateGroupInformation(groups);
            this.setState({ groups });
          }}
        />
        {/* {this.state.groups.length !== 0 && (
          <TeamTable
            groups={this.state.groups}
            createPlan={() => {
              this.setState({ createPlan: true });
            }}
          />
        )} */}
        <Grow in={this.state.groups.length !== 0}>
          <TeamTable
            groups={this.state.groups}
            createPlan={() => {
              this.setState({ createPlan: true });
            }}
          />
        </Grow>
        {this.state.createPlan && <PlanContainer groups={this.state.groups} />}
      </PaperSheet>
    );
  }
}
export default AppContainer;
