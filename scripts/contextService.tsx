import * as Location from "expo-location";

export const getContext = async () => {
  const location = await Location.getCurrentPositionAsync({});

  const address = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&current_weather=true`
  );
  const data = await res.json();

  return {
    location: address[0]?.subregion || "Unknown", // Added simple fallback just in case
    weather: `${Math.round(data.current_weather.temperature)}°C`,
  };
};
