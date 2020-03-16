import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { connect } from "react-redux";
import { setDialog } from "../redux/actions";

class AlertDialog extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={() => this.props.setDialog({ open: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.props.setDialog({ open: false })}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => state.dialog;
const mapDispatchToProps = dispatch => ({
  setDialog: dialog => dispatch(setDialog(dialog))
});
export default connect(mapStateToProps, mapDispatchToProps)(AlertDialog);
