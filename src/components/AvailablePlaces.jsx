import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [error, setError] = useState();
  // Fetching Api Data Using Promises
  // useEffect(() => {
  //   fetch("http://localhost:3000/places")
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((result) => {
  //       setAvailablePlaces(result.places);
  //     });
  // }, []);

  //Fetchiing data from API Using asyn await

  useEffect(() => {
    async function asyncFunction() {
      setIsFetchingData(true);
      try {
        //Getting users current location
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetchingData(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places , please try again leter ",
        });
        setIsFetchingData(false);
      }
    }
    asyncFunction();
  }, []);
  if (error) {
    return <Error title={"An error occurred!"} message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      isLoading={isFetchingData}
      loadingText="Fetching Plases Please Wait For A Minute ....!"
      places={availablePlaces}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
