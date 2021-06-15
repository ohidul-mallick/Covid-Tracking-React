import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map((country, idx) => (
            <tr key={idx}>
              <td>{country.Country}</td>
              <td>
                <strong>{numeral(country.TotalConfirmed).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
