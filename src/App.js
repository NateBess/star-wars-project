import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import CharacterTable from "./components/CharacterTable";

function App() {
  const [currentPage, setCurrentPage] = useState([]);
  const [searchWord, setSearchWord] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [enablePrevious, setEnablePrevious] = useState(false);
  const [enableNext, setEnableNext] = useState(false);
  const worldCache = {};
  const speciesCache = {};

  const returnPlanet = async (url) => {
    if (Object.values(worldCache).includes(url)) {
      console.log("TEST HERE BELOW");
      console.log(worldCache);
      console.log(worldCache[`${url}`]);
      return worldCache[`${url}`];
    }
    const data = await axios.get(url);
    console.log(data);
    worldCache[`${url}`] = data.data.name;
    return data.data.name;
  };

  const returnSpecies = async (url) => {
    if (Object.values(speciesCache).includes(url)) {
      console.log("TEST HERE BELOW");
      console.log(speciesCache);
      console.log(speciesCache[`${url}`]);
      return speciesCache[`${url}`];
    }
    const data = await axios.get(url);
    if (data === undefined) return "Human";
    console.log(data);
    speciesCache[`${url}`] = data.data.name;
    return data.data.name;
  };

  const getPlanet = async (url) => await axios.get(url).data.name;
  const getSpecies = async (url) => {
    const species = await (await axios.get(url)).data.name;
    if (species === undefined) return "Human";
    else return species;
  };

  const returnFixedPage = async (page) => {
    const newPage = [];
    page.forEach(async (character, index) => {
      const newCharacter = {
        id: index,
        name: character.name,
        birth_year: character.birth_year,
        height: character.height,
        mass: character.mass,
        homeworld: await returnPlanet(character.homeworld),
        species: await returnSpecies(character.species),
      };
      newPage.push(newCharacter);
    });
    return newPage;
  };

  const getPageData = async (pageNumber = 1, searchWord = "") => {
    const SEARCH_URL = `https://swapi.dev/api/people/?search=${searchWord}&page=${pageNumber}`;
    const data = await axios.get(SEARCH_URL);

    data.data.next === null ? setEnableNext(false) : setEnableNext(true);
    data.data.previous === null
      ? setEnablePrevious(false)
      : setEnablePrevious(true);

    const page = await returnFixedPage(data.data.results);
    setCurrentPage(page.sort((a, b) => a.id - b.id));
  };

  const updateCurrentPage = async (action = "*", searchWord) => {
    if (action === "+") getPageData(pageNumber + 1, searchWord);
    if (action === "-") getPageData(pageNumber - 1, searchWord);
    if (action === "*") getPageData(pageNumber, searchWord);
    if (action === "1") getPageData(1, searchWord);
  };

  useEffect(() => {
    console.log("Refresh");
    updateCurrentPage();
  }, []);

  // BUTTON FUNCTIONS BELOW
  const searchButtonAction = async () => {
    const searchValue = document.getElementById("search-box").value;
    setSearchWord(searchValue);
    // Get search url's and results to show up the same, maybe skip console log to be safe.
    setPageNumber(1);
    updateCurrentPage("1", searchValue);
    currentPage.sort((a, b) => a.id - b.id);
  };
  const previousButtonAction = async (searchWord) => {
    console.log(enablePrevious);
    if (enablePrevious === true) {
      if (pageNumber > 1) {
        updateCurrentPage("-", searchWord);
        setPageNumber(pageNumber - 1);
      }
    }
  };
  const nextButtonAction = async (searchWord) => {
    console.log(enableNext);
    if (enableNext === true) {
      if (pageNumber < 9) {
        updateCurrentPage("+", searchWord);
        setPageNumber(pageNumber + 1);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* IMAGE CONTAINER BELOW */}
        <div className="image-container">
          <img
            src="https://www.freepnglogos.com/uploads/star-wars-logo-31.png"
            className="App-logo"
            alt="logo"
          />
        </div>

        {/* SEARCH CONTAINER BELOW */}
        <div className="search-container">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Character Search..."
            aria-label="Search"
            id="search-box"
          ></input>
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            onClick={() => {
              searchButtonAction();
            }}
          >
            Search
          </button>
        </div>

        {/* TABLE CONTAINER BELOW */}
        <CharacterTable currentResults={currentPage} />

        {/* BUTTONS CONTAINER BELOW */}
        <div className="pages-container">
          <div className="page-buttons-container">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => previousButtonAction(searchWord)}
            >
              Previous
            </button>
            <div className="page-number">{pageNumber}</div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => nextButtonAction(searchWord)}
            >
              Next
            </button>
          </div>
        </div>
      </header>
      <main>
        <div></div>
      </main>
    </div>
  );
}

export default App;
