import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

/**
 * @param {number} a Some Number
 *  */
class MySnackBar extends React.Component {
  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={this.props.showSnackBar}
        autoHideDuration={5000}
        onClose={this.props.onClose}
      >
        <SnackbarContent
          message={
            <span
              id="client-snackbar"
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center"
              }}
            >
              {this.props.snackBarType === "warning" && (
                <WarningIcon style={{ paddingRight: 5 }} />
              )}
              {this.props.snackBarType === "success" && (
                <CheckCircleIcon style={{ paddingRight: 5 }} />
              )}
              {this.props.message}
            </span>
          }
        />
      </Snackbar>
    );
  }
}
export default MySnackBar;
