// This file simulates fetching AQI data from aqicn.org/city/delhi/

// Types for AQI data
export interface AQIData {
  aqi: number
  category: string
  color: string
  textColor: string
  primaryPollutant: string
  updatedAt: string
  location: string
  pollutants: {
    [key: string]: {
      value: number
      unit: string
      min: number
      max: number
    }
  }
  forecast: AQIForecast[]
  stations: AQIStation[]
}

export interface AQIForecast {
  day: string
  date: string
  aqi: number
  category: string
  color: string
  maxTemp: number
  minTemp: number
}

export interface AQIStation {
  name: string
  aqi: number
  category: string
  color: string
  lat: number
  lng: number
}

// Get AQI category, color, and text color based on AQI value
export function getAQICategory(aqi: number): { category: string; color: string; textColor: string } {
  if (aqi <= 50) {
    return { category: "Good", color: "#10b981", textColor: "text-green-500" } // Green
  } else if (aqi <= 100) {
    return { category: "Moderate", color: "#f59e0b", textColor: "text-amber-500" } // Yellow
  } else if (aqi <= 150) {
    return { category: "Unhealthy for Sensitive Groups", color: "#f97316", textColor: "text-orange-500" } // Orange
  } else if (aqi <= 200) {
    return { category: "Unhealthy", color: "#ef4444", textColor: "text-red-500" } // Red
  } else if (aqi <= 300) {
    return { category: "Very Unhealthy", color: "#8b5cf6", textColor: "text-purple-500" } // Purple
  } else {
    return { category: "Hazardous", color: "#7f1d1d", textColor: "text-red-900" } // Maroon
  }
}

// Simulate fetching AQI data from aqicn.org/city/delhi/
export async function fetchDelhiAQIData(): Promise<AQIData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Based on the screenshot from aqicn.org/city/delhi/
  const aqi = 489
  const { category, color, textColor } = getAQICategory(aqi)

  // Current date in format "Sunday 00:00"
  const now = new Date()
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const day = dayNames[now.getDay()]
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const updatedAt = `${day} ${hours}:${minutes}`

  // Create AQI data object based on the screenshot
  return {
    aqi,
    category,
    color,
    textColor,
    primaryPollutant: "pm10",
    updatedAt,
    location: "DITE Okhla, Delhi",
    pollutants: {
      pm25: {
        value: 187,
        unit: "μg/m³",
        min: 0,
        max: 187,
      },
      pm10: {
        value: 489,
        unit: "μg/m³",
        min: 0,
        max: 489,
      },
      o3: {
        value: 7,
        unit: "μg/m³",
        min: 3,
        max: 82,
      },
      no2: {
        value: 46,
        unit: "μg/m³",
        min: 15,
        max: 64,
      },
      so2: {
        value: 8,
        unit: "μg/m³",
        min: 5,
        max: 13,
      },
      co: {
        value: 19,
        unit: "μg/m³",
        min: 3,
        max: 29,
      },
      temp: {
        value: 21,
        unit: "°C",
        min: 19,
        max: 29,
      },
      pressure: {
        value: 989,
        unit: "hPa",
        min: 986,
        max: 992,
      },
      humidity: {
        value: 54,
        unit: "%",
        min: 33,
        max: 65,
      },
      wind: {
        value: 1,
        unit: "m/s",
        min: 0,
        max: 2,
      },
    },
    // Forecast data from the screenshot
    forecast: [
      {
        day: "SUN",
        date: "23",
        aqi: 220,
        category: "Very Unhealthy",
        color: "#8b5cf6",
        maxTemp: 35,
        minTemp: 22,
      },
      {
        day: "MON",
        date: "24",
        aqi: 250,
        category: "Very Unhealthy",
        color: "#8b5cf6",
        maxTemp: 37,
        minTemp: 23,
      },
      {
        day: "TUE",
        date: "25",
        aqi: 280,
        category: "Very Unhealthy",
        color: "#8b5cf6",
        maxTemp: 39,
        minTemp: 25,
      },
      {
        day: "WED",
        date: "26",
        aqi: 260,
        category: "Very Unhealthy",
        color: "#8b5cf6",
        maxTemp: 39,
        minTemp: 26,
      },
      {
        day: "THU",
        date: "27",
        aqi: 240,
        category: "Very Unhealthy",
        color: "#8b5cf6",
        maxTemp: 37,
        minTemp: 26,
      },
      {
        day: "FRI",
        date: "28",
        aqi: 300,
        category: "Hazardous",
        color: "#7f1d1d",
        maxTemp: 35,
        minTemp: 23,
      },
      {
        day: "SAT",
        date: "29",
        aqi: 320,
        category: "Hazardous",
        color: "#7f1d1d",
        maxTemp: 36,
        minTemp: 23,
      },
    ],
    // Station data from the map in the screenshot
    stations: [
      {
        name: "DITE Okhla, Delhi",
        aqi: 489,
        category: "Hazardous",
        color: "#7f1d1d",
        lat: 28.5491,
        lng: 77.2731,
      },
      {
        name: "Anand Vihar, Delhi",
        aqi: 461,
        category: "Hazardous",
        color: "#7f1d1d",
        lat: 28.6468,
        lng: 77.3156,
      },
      {
        name: "ITO, Delhi",
        aqi: 415,
        category: "Hazardous",
        color: "#7f1d1d",
        lat: 28.6289,
        lng: 77.2405,
      },
      {
        name: "Shadipur, Jhilmil",
        aqi: 380,
        category: "Hazardous",
        color: "#7f1d1d",
        lat: 28.6519,
        lng: 77.1473,
      },
      {
        name: "Loni, Ghaziabad",
        aqi: 356,
        category: "Hazardous",
        color: "#7f1d1d",
        lat: 28.7334,
        lng: 77.2791,
      },
      {
        name: "Vasundhara, Ghaziabad",
        aqi: 320,
        category: "Hazardous",
        color: "#7f1d1d",
        lat: 28.6603,
        lng: 77.3572,
      },
      {
        name: "Faridabad",
        aqi: 272,
        category: "Very Unhealthy",
        color: "#8b5cf6",
        lat: 28.4089,
        lng: 77.3178,
      },
      {
        name: "Gurugram",
        aqi: 210,
        category: "Very Unhealthy",
        color: "#8b5cf6",
        lat: 28.4595,
        lng: 77.0266,
      },
      {
        name: "Noida",
        aqi: 352,
        category: "Hazardous",
        color: "#7f1d1d",
        lat: 28.5355,
        lng: 77.391,
      },
    ],
  }
}

// Get health recommendations based on AQI level
export function getAQIHealthRecommendations(aqi: number): string[] {
  if (aqi <= 50) {
    return [
      "Air quality is considered satisfactory, and air pollution poses little or no risk.",
      "Enjoy outdoor activities.",
    ]
  } else if (aqi <= 100) {
    return [
      "Air quality is acceptable; however, there may be a moderate health concern for a very small number of people.",
      "Unusually sensitive people should consider reducing prolonged or heavy exertion.",
    ]
  } else if (aqi <= 150) {
    return [
      "Members of sensitive groups may experience health effects.",
      "People with heart or lung disease, older adults, and children should reduce prolonged or heavy exertion.",
    ]
  } else if (aqi <= 200) {
    return [
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
      "People with heart or lung disease, older adults, and children should avoid prolonged or heavy exertion.",
      "Everyone else should reduce prolonged or heavy exertion.",
    ]
  } else if (aqi <= 300) {
    return [
      "Health warnings of emergency conditions. The entire population is more likely to be affected.",
      "People with heart or lung disease, older adults, and children should avoid all physical activity outdoors.",
      "Everyone else should avoid prolonged or heavy exertion.",
    ]
  } else {
    return [
      "Health alert: everyone may experience more serious health effects.",
      "Everyone should avoid all physical activity outdoors.",
      "People with heart or lung disease, older adults, and children should remain indoors and keep activity levels low.",
      "Consider using air purifiers and wearing masks (N95 or better) if going outside is unavoidable.",
    ]
  }
}

// Get protection measures based on AQI level
export function getAQIProtectionMeasures(aqi: number): string[] {
  if (aqi <= 50) {
    return ["No special measures needed.", "Enjoy outdoor activities."]
  } else if (aqi <= 100) {
    return [
      "Consider reducing prolonged outdoor exertion if you are unusually sensitive to air pollution.",
      "Keep windows closed during peak traffic hours.",
    ]
  } else if (aqi <= 150) {
    return [
      "Reduce prolonged or heavy outdoor exertion.",
      "Take more breaks during outdoor activities.",
      "Consider using air purifiers indoors.",
    ]
  } else if (aqi <= 200) {
    return [
      "Avoid prolonged or heavy outdoor exertion.",
      "Use air purifiers indoors.",
      "Keep windows and doors closed.",
      "Consider wearing N95 masks outdoors.",
    ]
  } else if (aqi <= 300) {
    return [
      "Avoid all outdoor physical activities.",
      "Run air purifiers continuously.",
      "Seal windows and doors to prevent outdoor air infiltration.",
      "Wear N95 masks when outdoors.",
      "Consider relocating temporarily if possible.",
    ]
  } else {
    return [
      "Stay indoors with windows and doors closed.",
      "Run multiple air purifiers with HEPA filters.",
      "Avoid all outdoor activities.",
      "Wear N95 or better masks if going outside is unavoidable.",
      "Consider evacuation to areas with better air quality if possible.",
      "Create a clean room in your home with extra air filtration.",
    ]
  }
}

