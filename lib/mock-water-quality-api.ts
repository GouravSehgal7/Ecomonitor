// This file simulates fetching water quality data from an external API

// Water quality parameters with realistic ranges
const waterParameters = {
  ph: { min: 6.0, max: 9.0, unit: "", safeMin: 6.5, safeMax: 8.5 },
  tds: { min: 50, max: 800, unit: "mg/L", safeMax: 500 },
  hardness: { min: 50, max: 400, unit: "mg/L", safeMax: 300 },
  chlorine: { min: 0.1, max: 6.0, unit: "mg/L", safeMax: 4 },
  turbidity: { min: 0.1, max: 10.0, unit: "NTU", safeMax: 5 },
  bacteria: { min: 0, max: 500, unit: "CFU/100mL", safeMax: 100 },
  nitrates: { min: 0, max: 50, unit: "mg/L", safeMax: 10 },
  phosphates: { min: 0, max: 5, unit: "mg/L", safeMax: 1 },
}

// Locations with their typical water quality profiles
const locations = [
  {
    name: "Delhi Municipal Supply",
    profile: "urban",
    coordinates: { lat: 28.6139, lng: 77.209 },
  },
  {
    name: "Yamuna River",
    profile: "river",
    coordinates: { lat: 28.6129, lng: 77.2295 },
  },
  {
    name: "Groundwater Well",
    profile: "groundwater",
    coordinates: { lat: 28.5355, lng: 77.291 },
  },
  {
    name: "Treatment Plant Output",
    profile: "treated",
    coordinates: { lat: 28.6304, lng: 77.2177 },
  },
]

// Profile modifiers to make data realistic
const profileModifiers = {
  urban: {
    ph: { offset: 0, multiplier: 1 },
    tds: { offset: 100, multiplier: 1.2 },
    hardness: { offset: 50, multiplier: 1.1 },
    chlorine: { offset: 1, multiplier: 1.5 },
    turbidity: { offset: 0, multiplier: 1.2 },
    bacteria: { offset: 20, multiplier: 1.3 },
    nitrates: { offset: 2, multiplier: 1.2 },
    phosphates: { offset: 0.5, multiplier: 1.2 },
  },
  river: {
    ph: { offset: -0.5, multiplier: 1.1 },
    tds: { offset: 50, multiplier: 1.5 },
    hardness: { offset: 20, multiplier: 0.9 },
    chlorine: { offset: -0.5, multiplier: 0.3 },
    turbidity: { offset: 2, multiplier: 2 },
    bacteria: { offset: 100, multiplier: 2 },
    nitrates: { offset: 5, multiplier: 1.8 },
    phosphates: { offset: 1, multiplier: 2 },
  },
  groundwater: {
    ph: { offset: 0.2, multiplier: 0.8 },
    tds: { offset: 200, multiplier: 1.4 },
    hardness: { offset: 100, multiplier: 1.5 },
    chlorine: { offset: -0.8, multiplier: 0.2 },
    turbidity: { offset: -1, multiplier: 0.5 },
    bacteria: { offset: -50, multiplier: 0.5 },
    nitrates: { offset: 3, multiplier: 1.5 },
    phosphates: { offset: -0.2, multiplier: 0.8 },
  },
  treated: {
    ph: { offset: 0.5, multiplier: 0.7 },
    tds: { offset: -50, multiplier: 0.8 },
    hardness: { offset: -30, multiplier: 0.9 },
    chlorine: { offset: 1.5, multiplier: 1.2 },
    turbidity: { offset: -1.5, multiplier: 0.4 },
    bacteria: { offset: -80, multiplier: 0.2 },
    nitrates: { offset: -2, multiplier: 0.7 },
    phosphates: { offset: -0.5, multiplier: 0.6 },
  },
}

// Generate a realistic value for a parameter based on location profile
function generateParameterValue(parameter: string, profile: string) {
  const param = waterParameters[parameter as keyof typeof waterParameters]
  const modifier =
    profileModifiers[profile as keyof typeof profileModifiers][
      parameter as keyof (typeof profileModifiers)[keyof typeof profileModifiers]
    ]

  // Base value in the middle of the range
  const baseValue = (param.max + param.min) / 2

  // Apply profile modifier
  let value = baseValue * modifier.multiplier + modifier.offset

  // Add some randomness (±10%)
  value *= 0.9 + Math.random() * 0.2

  // Ensure value is within parameter range
  value = Math.max(param.min, Math.min(param.max, value))

  // Round appropriately based on parameter type
  if (parameter === "ph" || parameter === "turbidity" || parameter === "phosphates") {
    value = Math.round(value * 10) / 10 // One decimal place
  } else if (parameter === "chlorine") {
    value = Math.round(value * 100) / 100 // Two decimal places
  } else {
    value = Math.round(value) // Integer
  }

  return {
    value,
    unit: param.unit,
    isSafe: parameter === "ph" ? value >= param.safeMin && value <= param.safeMax : value <= param.safeMax,
  }
}

// Generate complete water quality data for a location
export function getWaterQualityForLocation(locationName?: string) {
  // Find location or use first one
  const location = locations.find((loc) => loc.name === locationName) || locations[0]

  // Generate data for all parameters
  const data = Object.keys(waterParameters).reduce(
    (acc, param) => {
      acc[param] = generateParameterValue(param, location.profile)
      return acc
    },
    {} as Record<string, any>,
  )

  return {
    location: location.name,
    coordinates: location.coordinates,
    timestamp: new Date().toISOString(),
    parameters: data,
    overallSafety: Object.values(data).every((param) => param.isSafe) ? "Safe" : "Unsafe",
  }
}

// Get water quality data for all locations
export function getAllLocationsWaterQuality() {
  return locations.map((location) => getWaterQualityForLocation(location.name))
}

// Simulate historical data for a parameter
export function getHistoricalData(parameter: string, days = 30) {
  const data = []
  const now = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate slightly different values for each location
    const locationData = locations.map((location) => {
      const paramData = generateParameterValue(parameter, location.profile)
      return {
        location: location.name,
        value: paramData.value,
        isSafe: paramData.isSafe,
      }
    })

    data.push({
      date: date.toISOString().split("T")[0],
      locations: locationData,
    })
  }

  return data
}

// Simulate fetching data with network delay
export async function fetchWaterQualityData(locationName?: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  return getWaterQualityForLocation(locationName)
}

export async function fetchAllLocationsData() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

  return getAllLocationsWaterQuality()
}

export async function fetchHistoricalData(parameter: string, days = 30) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

  return getHistoricalData(parameter, days)
}

