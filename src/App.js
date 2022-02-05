import React, { useState, useEffect } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import { getPlacesData, getWeatherData } from "./api/index";
import useStyles from "./components/Map/styles";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setfilteredPlaces] = useState([]);

  const [childClicked, setChildClicked] = useState(null);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});

  const [isLoading, setisLoading] = useState(false);

  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");

  // get user coordinates ie location. This code happen once
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);


  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setfilteredPlaces(filteredPlaces);
  }, [rating]);


  useEffect(() => {
    if(bounds.sw && bounds.ne) {
    setisLoading(true);

    getWeatherData(coordinates.lat, coordinates.lng)
    .then((data) => setWeatherData(data))

    getPlacesData(type, bounds.sw, bounds.ne)
    .then((data) => {
      setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
      setfilteredPlaces([])
      setisLoading(false);
    })
  }
  }, [type, bounds]);

  console.log('Weather Data', weatherData)

  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates}/>
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces: places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces: places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
