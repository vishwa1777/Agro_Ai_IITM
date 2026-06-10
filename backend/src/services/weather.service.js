import axios from "axios";

export const getWeather =
  async (lat, lon) => {

    const response =
      await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );

    return response.data;
  };