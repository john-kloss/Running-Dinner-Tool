//React libraries
import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class TeamTable extends React.Component {
  render() {
    return (
      <div {...this.props}>
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
            {this.props.groups.map((group) => {
              return (
                <TableRow key={group.id}>
                  <TableCell component="th" scope="row">
                    {group.mailAddress}
                  </TableCell>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.postalAddress}</TableCell>
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
