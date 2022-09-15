import React from "react";
import CharacterRow from "./CharacterRow";
import "./CharacterTable.css";

function CharacterTable({ currentResults }) {
  try {
    return (
      <table className="table-container width-container">
        <tbody className="table-body-container">
          <tr className="table-headings-container">
            <th className="heading-border name-column ">Name</th>
            <th className="heading-border birthdate-column">Birth Date</th>
            <th className="heading-border height-column">Height</th>
            <th className="heading-border mass-column">Mass</th>
            <th className="heading-border homeworld-column">Home World</th>
            <th className="heading-border species-column">Species</th>
          </tr>
          {currentResults.map((character, index) => {
            return (
              <CharacterRow
                key={index}
                name={character.name}
                birthDate={character.birth_year}
                height={character.height}
                mass={character.mass}
                homeWorld={character.homeworld}
                species={character.species}
              />
            );
          })}
        </tbody>
      </table>
    );
  } catch (err) {
    console.log(err);
    return <div className="percent-downloaded">Loading...</div>;
  }
}

export default CharacterTable;
