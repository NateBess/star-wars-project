import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import CharacterTable from "./components/CharacterTable";

const worldCache = {};
const speciesCache = {};

function App() {
  const [currentPage, setCurrentPage] = useState([]);
  const [searchWord, setSearchWord] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [enablePrevious, setEnablePrevious] = useState(false);
  const [enableNext, setEnableNext] = useState(false);

  const returnPlanet = async (url) => {
    if (url in worldCache) return worldCache[`${url}`];
    const data = await axios.get(url);
    worldCache[`${url}`] = data.data.name;
    return data.data.name;
  };
  const returnSpecies = async (url) => {
    if (url in speciesCache) return speciesCache[`${url}`];
    const data = await axios.get(url);
    if (data.data.name === undefined) {
      speciesCache[`${url}`] = "Human";
      return "Human";
    } else speciesCache[`${url}`] = data.data.name;
    return data.data.name;
  };

  const returnFixedPage = async (page) => {
    const newPage = [];
    for (let i = 0; i < page.length; i++) {
      const newCharacter = {
        id: i,
        name: page[i].name,
        birth_year: page[i].birth_year,
        height: page[i].height,
        mass: page[i].mass,
        homeworld: await returnPlanet(page[i].homeworld),
        species: await returnSpecies(page[i].species),
      };
      newPage.push(newCharacter);
    }
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
    updateCurrentPage("1");
  }, []);

  const searchButtonAction = async () => {
    const searchValue = document.getElementById("search-box").value;
    setSearchWord(searchValue);
    setPageNumber(1);
    updateCurrentPage("1", searchValue);
    currentPage.sort((a, b) => a.id - b.id);
  };
  const previousButtonAction = async (searchWord) => {
    if (enablePrevious === true) {
      if (pageNumber > 1) {
        updateCurrentPage("-", searchWord);
        setPageNumber(pageNumber - 1);
      }
    }
  };
  const nextButtonAction = async (searchWord) => {
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
        <div className="image-container">
          <img
            src="https://www.freepnglogos.com/uploads/star-wars-logo-31.png"
            className="App-logo"
            alt="logo"
          />
        </div>

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

        <CharacterTable currentResults={currentPage} />

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
