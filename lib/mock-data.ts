// Mock data for air quality predictions
export function getHourlyAirQualityData() {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12
    const ampm = i < 12 ? "AM" : "PM"
    return `${hour}${ampm}`
  })

  // Generate realistic AQI pattern with morning and evening peaks
  return hours.map((hour, index) => {
    let aqi
    if (index < 6) {
      // Early morning (improving)
      aqi = 150 - index * 10 + Math.floor(Math.random() * 20)
    } else if (index < 10) {
      // Morning rush hour (worsening)
      aqi = 100 + (index - 5) * 30 + Math.floor(Math.random() * 30)
    } else if (index < 16) {
      // Midday (stable high)
      aqi = 220 + Math.floor(Math.random() * 40)
    } else if (index < 20) {
      // Evening (gradually improving)
      aqi = 260 - (index - 15) * 20 + Math.floor(Math.random() * 30)
    } else {
      // Night (improving)
      aqi = 180 - (index - 19) * 15 + Math.floor(Math.random() * 20)
    }

    // Ensure AQI is within realistic bounds
    aqi = Math.max(50, Math.min(400, aqi))

    return {
      hour,
      aqi,
    }
  })
}

// Mock data for daily air quality predictions
export function getDailyAirQualityData() {
  const days = ["Today", "Tomorrow"]
  for (let i = 2; i < 10; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    days.push(date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))
  }

  // Generate realistic AQI pattern with weekly variations
  return days.map((day, index) => {
    // Weekend effect (slightly better air quality)
    const isWeekend = day.includes("Sat") || day.includes("Sun")
    const baseAqi = isWeekend ? 180 : 220

    // Add some randomness and trend
    let aqi = baseAqi + Math.floor(Math.random() * 60) - 30

    // Add seasonal trend (first few days higher, then improving)
    if (index < 3) {
      aqi += 40
    } else if (index > 6) {
      aqi -= 30
    }

    // Ensure AQI is within realistic bounds
    aqi = Math.max(80, Math.min(380, aqi))

    return {
      day,
      aqi,
    }
  })
}

// Mock data for regional air quality
export function getRegionalAirQualityData() {
  return [
    {
      name: "Anand Vihar",
      aqi: 342,
      position: { x: 0.7, y: 0.3 },
    },
    {
      name: "Rohini",
      aqi: 295,
      position: { x: 0.3, y: 0.25 },
    },
    {
      name: "Dwarka",
      aqi: 210,
      position: { x: 0.2, y: 0.6 },
    },
    {
      name: "Lodhi Road",
      aqi: 180,
      position: { x: 0.5, y: 0.5 },
    },
    {
      name: "IGI Airport",
      aqi: 165,
      position: { x: 0.3, y: 0.7 },
    },
    {
      name: "Mandir Marg",
      aqi: 225,
      position: { x: 0.5, y: 0.3 },
    },
    {
      name: "Nehru Place",
      aqi: 260,
      position: { x: 0.6, y: 0.6 },
    },
  ]
}

// Mock data for water quality parameters
export function getWaterQualityData() {
  // Randomly generate values that occasionally exceed safe limits
  const exceedLimit = Math.random() > 0.7

  return [
    {
      name: "pH",
      value: exceedLimit && Math.random() > 0.5 ? 8.7 + Math.random() * 0.5 : 7.2 + Math.random() * 1.0,
      unit: "",
      min: 0,
      max: 14,
      safeLimit: 8.5,
    },
    {
      name: "TDS",
      value:
        exceedLimit && Math.random() > 0.5
          ? 520 + Math.floor(Math.random() * 100)
          : 320 + Math.floor(Math.random() * 150),
      unit: "mg/L",
      min: 0,
      max: 1000,
      safeLimit: 500,
    },
    {
      name: "Hardness",
      value:
        exceedLimit && Math.random() > 0.5
          ? 310 + Math.floor(Math.random() * 50)
          : 180 + Math.floor(Math.random() * 100),
      unit: "mg/L",
      min: 0,
      max: 500,
      safeLimit: 300,
    },
    {
      name: "Chlorine",
      value: exceedLimit && Math.random() > 0.5 ? 4.2 + Math.random() * 1.0 : 1.5 + Math.random() * 2.0,
      unit: "mg/L",
      min: 0,
      max: 10,
      safeLimit: 4,
    },
  ]
}

// Mock historical water quality data
export function getWaterQualityHistoryData(parameter: string) {
  // Generate 24 hours of data
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12
    const ampm = i < 12 ? "AM" : "PM"
    return `${hour}${ampm}`
  })

  // Parameter-specific configurations
  const configs = {
    ph: {
      baseline: 7.5,
      variation: 1.0,
      safeLimit: 8.5,
      exceedProbability: 0.15,
    },
    tds: {
      baseline: 350,
      variation: 150,
      safeLimit: 500,
      exceedProbability: 0.2,
    },
    hardness: {
      baseline: 200,
      variation: 100,
      safeLimit: 300,
      exceedProbability: 0.15,
    },
    chlorine: {
      baseline: 2.0,
      variation: 1.5,
      safeLimit: 4.0,
      exceedProbability: 0.1,
    },
  }

  const config = configs[parameter as keyof typeof configs]

  // Generate data with occasional spikes
  return hours.map((time, index) => {
    // Determine if this hour should exceed the safe limit
    const shouldExceed = Math.random() < config.exceedProbability

    // Generate value
    let value
    if (shouldExceed) {
      // Exceed the safe limit
      value = config.safeLimit + Math.random() * (config.variation / 2)
    } else {
      // Normal variation
      value = config.baseline + Math.random() * config.variation - config.variation / 2
    }

    // Round to appropriate precision
    value = parameter === "ph" ? Math.round(value * 10) / 10 : Math.round(value)

    return {
      time,
      value,
    }
  })
}

