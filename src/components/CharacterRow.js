import React from "react";
import "./CharacterRow.css";

function CharacterRow({ name, birthDate, height, mass, homeWorld, species }) {
  return (
    <tr className="table-row">
      <td className="row-border name-column">{name}</td>
      <td className="row-border birthdate-column">{birthDate}</td>
      <td className="row-border height-column">
        {height !== "unknown" ? `${height}cm` : height}
      </td>
      <td className="row-border mass-column">
        {mass !== "unknown" ? `${mass}kg` : mass}
      </td>
      <td className="row-border homeworld-column">{homeWorld}</td>
      <td className="row-border species-column">{species}</td>
    </tr>
  );
}

export default CharacterRow;
