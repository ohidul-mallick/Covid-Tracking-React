import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  const [totalCases, setTotalCases] = useState(null);
  const [todayCases, setTodayCases] = useState(null);
  const [totalDeaths, setTotalDeaths] = useState(null);
  const [todayDeaths, setTodayDeaths] = useState(null);
  const [totalRecovered, setTotalRecovered] = useState(null);
  const [todayRecovered, setTodayRecovered] = useState(null);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://api.covid19api.com/summary")
        .then((response) => response.json())
        .then((data) => {
          const { Countries } = data;
          const countries = Countries.map((country) => ({
            name: country.Country,
            value: country.Slug,
          }));

          let sortedData = sortData(Countries);
          setCountries(countries);
          setMapCountries(Countries);
          setTableData(sortedData);
          // setCountryInfo(Global);
        });
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    const getWorldWideData = async () => {
      fetch("https://corona.lmao.ninja/v2/all?yesterday")
        .then((response) => response.json())
        .then((data) => {
          setTotalCases(data.cases);
          setTotalDeaths(data.deaths);
          setTotalRecovered(data.recovered);
          setTodayCases(data.todayCases);
          setTodayDeaths(data.todayDeaths);
          setTodayRecovered(data.todayRecovered);
        });
    };
    getWorldWideData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const URL =
      countryCode === "worldwide"
        ? "https://corona.lmao.ninja/v2/all?yesterday"
        : "https://api.covid19api.com/summary";

    // const url = "https://api.covid19api.com/summary";
    await fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        if (countryCode === "worldwide") {
          setTotalCases(data.cases);
          setTotalDeaths(data.deaths);
          setTotalRecovered(data.recovered);
          setTodayCases(data.todayCases);
          setTodayDeaths(data.todayDeaths);
          setTodayRecovered(data.todayRecovered);
          // setCountryInfo(data);
        } else {
          const { Countries } = data;
          let CountryWise = Countries.filter(
            (country) => country.Slug === countryCode
          );
          const singleCountryData = CountryWise[0];
          setTotalCases(singleCountryData.TotalConfirmed);
          setTotalDeaths(singleCountryData.TotalDeaths);
          setTotalRecovered(singleCountryData.TotalRecovered);
          setTodayCases(singleCountryData.NewConfirmed);
          setTodayDeaths(singleCountryData.NewDeaths);
          setTodayRecovered(singleCountryData.NewRecovered);
          // setCountryInfo(singleCountryData);
        }
        setInputCountry(countryCode);
        // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, idx) => (
                <MenuItem key={idx} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            // cases={prettyPrintStat({countryCode === "worldwide" ? countryInfo.todayCases: countryInfo.NewConfirmed})}
            cases={prettyPrintStat(todayCases)}
            // total={numeral(countryInfo.TotalConfirmed).format("0.0a")}
            total={numeral(totalCases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(todayRecovered)}
            total={numeral(totalRecovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(todayDeaths)}
            total={numeral(totalDeaths).format("0.0a")}
            // total={numeral(countryInfo.TotalDeaths).format("0.0a")}
          />
        </div>
        {/* <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        /> */}
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
