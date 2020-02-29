import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

class ResultsTable extends React.Component {
  mapCell(group, i, dish) {
    const postfix = i !== 2 ? " / " : "";
    if (group.id % 3 === dish)
      return (
        <span>
          <span style={{ fontWeight: "bold" }}>{group.name}</span> {postfix}
        </span>
      );
    return group.name + postfix;
  }

  render() {
    const plan = this.props.plan;
    let data = [];
    for (let i = 0; i < 3; i++) {
      data.push([plan.starter[i], plan.mainCourse[i], plan.dessert[i]]);
    }
    return (
      <Table style={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            <TableCell>Vorspeisen</TableCell>
            <TableCell>Hauptgerichte</TableCell>
            <TableCell>Nachspeisen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((dataForRow, i) => {
            return (
              <TableRow key={"ResultTableRow" + i}>
                {/* Starter */}
                <TableCell>
                  {dataForRow[0].map((group, i) => this.mapCell(group, i, 0))}
                </TableCell>
                {/* Main Course */}
                <TableCell>
                  {dataForRow[1].map((group, i) => this.mapCell(group, i, 1))}
                </TableCell>
                {/* Dessert */}
                <TableCell>
                  {dataForRow[2].map((group, i) => this.mapCell(group, i, 2))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}
export default ResultsTable;
