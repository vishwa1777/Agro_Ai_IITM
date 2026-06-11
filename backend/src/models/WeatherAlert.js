import mongoose from "mongoose";

const weatherAlertSchema = new mongoose.Schema(
  {
    description: String,
    location: String,
    region: String,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    precipitation_probability: Number,
    current_weather: { 
      temperature: Number, 
      weathercode: Number, 
      windspeed: Number 
    },
    hourly: { 
      time: [String], 
      precipitation_probability: [Number] 
    },
    suggestion: String,
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  },
  { timestamps: true }
);

export default mongoose.models.WeatherAlert || mongoose.model("WeatherAlert", weatherAlertSchema);