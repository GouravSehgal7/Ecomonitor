// This file simulates fetching UV data from The Weather Network

export interface UVData {
  current: {
    index: number
    category: string
    color: string
    textColor: string
    description: string
    timestamp: string
  }
  forecast: UVForecast[]
  location: string
  sunTimes: {
    sunrise: string
    sunset: string
  }
  protectionTimes: {
    start: string
    end: string
    required: boolean
  }
}

export interface UVForecast {
  day: string
  date: string
  index: number
  maxIndex: number
  category: string
  color: string
  protectionRequired: boolean
}

// Get UV category, color, and text color based on UV index
export function getUVCategory(index: number): {
  category: string
  color: string
  textColor: string
  description: string
} {
  if (index <= 2) {
    return {
      category: "Low",
      color: "#10b981",
      textColor: "text-green-500",
      description: "Low danger from the sun's UV rays for the average person.",
    }
  } else if (index <= 5) {
    return {
      category: "Moderate",
      color: "#f59e0b",
      textColor: "text-amber-500",
      description: "Moderate risk of harm from unprotected sun exposure.",
    }
  } else if (index <= 7) {
    return {
      category: "High",
      color: "#f97316",
      textColor: "text-orange-500",
      description: "High risk of harm from unprotected sun exposure.",
    }
  } else if (index <= 10) {
    return {
      category: "Very High",
      color: "#ef4444",
      textColor: "text-red-500",
      description: "Very high risk of harm from unprotected sun exposure.",
    }
  } else {
    return {
      category: "Extreme",
      color: "#7f1d1d",
      textColor: "text-red-900",
      description: "Extreme risk of harm from unprotected sun exposure.",
    }
  }
}

// Get protection recommendations based on UV index
export function getUVProtectionRecommendations(index: number): string[] {
  const baseRecommendations = ["Wear sunscreen with SPF 30+", "Reapply sunscreen every 2 hours"]

  if (index <= 2) {
    return ["Minimal protection required for normal activity", "Wear sunglasses on bright days"]
  } else if (index <= 5) {
    return [...baseRecommendations, "Stay in shade during midday hours", "Wear protective clothing when outdoors"]
  } else if (index <= 7) {
    return [
      ...baseRecommendations,
      "Reduce time in the sun between 10 a.m. and 4 p.m.",
      "Cover up with sun protective clothing, hat, and UV-blocking sunglasses",
      "Use SPF 30+ broad spectrum sunscreen",
    ]
  } else if (index <= 10) {
    return [
      ...baseRecommendations,
      "Minimize sun exposure between 10 a.m. and 4 p.m.",
      "Seek shade when outdoors",
      "Wear sun protective clothing, wide-brim hat, and UV-blocking sunglasses",
      "Use SPF 50+ broad spectrum sunscreen",
    ]
  } else {
    return [
      ...baseRecommendations,
      "Avoid sun exposure between 10 a.m. and 4 p.m.",
      "Stay indoors if possible",
      "If outdoors, seek shade and wear sun protective clothing, wide-brim hat, and UV-blocking sunglasses",
      "Use SPF 50+ broad spectrum sunscreen and reapply every hour if swimming or sweating",
      "Check the UV index forecast regularly",
    ]
  }
}

// Simulate fetching UV data from The Weather Network
export async function fetchDelhiUVData(): Promise<UVData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Current time
  const now = new Date()
  const hours = now.getHours()

  // Simulate realistic UV index based on time of day
  let currentUVIndex = 0
  if (hours >= 6 && hours < 8) {
    currentUVIndex = 2 // Early morning
  } else if (hours >= 8 && hours < 10) {
    currentUVIndex = 5 // Morning
  } else if (hours >= 10 && hours < 14) {
    currentUVIndex = 9 // Midday (peak)
  } else if (hours >= 14 && hours < 16) {
    currentUVIndex = 7 // Afternoon
  } else if (hours >= 16 && hours < 18) {
    currentUVIndex = 4 // Late afternoon
  } else if (hours >= 18 && hours < 19) {
    currentUVIndex = 2 // Early evening
  } else {
    currentUVIndex = 0 // Night
  }

  // Get category data
  const { category, color, textColor, description } = getUVCategory(currentUVIndex)

  // Format timestamp
  const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // Generate forecast for next 7 days
  const forecast: UVForecast[] = []
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date()
    forecastDate.setDate(now.getDate() + i)

    // Simulate varying UV index with a peak in the middle of the week
    let maxIndex = 0
    if (i === 0) {
      maxIndex = 8 // Today
    } else if (i === 1) {
      maxIndex = 9 // Tomorrow
    } else if (i === 2) {
      maxIndex = 10 // Day after tomorrow
    } else if (i === 3) {
      maxIndex = 11 // Peak
    } else if (i === 4) {
      maxIndex = 9
    } else if (i === 5) {
      maxIndex = 8
    } else {
      maxIndex = 7
    }

    // Add some randomness
    maxIndex = Math.max(1, Math.min(12, maxIndex + Math.floor(Math.random() * 3) - 1))

    const dayName = days[forecastDate.getDay()]
    const dateStr = forecastDate.getDate().toString()

    forecast.push({
      day: dayName.substring(0, 3).toUpperCase(),
      date: dateStr,
      index: i === 0 ? currentUVIndex : Math.floor(maxIndex * 0.7), // Current index for today, estimated for other days
      maxIndex,
      category: getUVCategory(maxIndex).category,
      color: getUVCategory(maxIndex).color,
      protectionRequired: maxIndex > 2,
    })
  }

  // Sunrise and sunset times
  const sunrise = "06:15"
  const sunset = "18:30"

  // Protection times (when UV index is 3 or higher)
  const protectionStart = "08:30"
  const protectionEnd = "16:30"

  return {
    current: {
      index: currentUVIndex,
      category,
      color,
      textColor,
      description,
      timestamp,
    },
    forecast,
    location: "New Delhi, India",
    sunTimes: {
      sunrise,
      sunset,
    },
    protectionTimes: {
      start: protectionStart,
      end: protectionEnd,
      required: currentUVIndex > 2,
    },
  }
}

// Get health risks based on UV index
export function getUVHealthRisks(index: number): { skin: string; eye: string; immune: string } {
  if (index <= 2) {
    return {
      skin: "Minimal risk of skin damage for most people.",
      eye: "Low risk of eye damage.",
      immune: "Minimal impact on immune system.",
    }
  } else if (index <= 5) {
    return {
      skin: "Risk of sunburn for fair-skinned people. Skin reddening can begin in about 45 minutes.",
      eye: "Moderate risk of eye damage without protection.",
      immune: "Some suppression of immune responses possible with prolonged exposure.",
    }
  } else if (index <= 7) {
    return {
      skin: "High risk of sunburn. Fair-skinned people can burn in 30 minutes. Risk of skin damage and long-term skin aging.",
      eye: "High risk of eye damage without adequate protection.",
      immune: "Immune system suppression more likely with extended exposure.",
    }
  } else if (index <= 10) {
    return {
      skin: "Very high risk of severe sunburn. Unprotected skin can burn in 15-25 minutes. Significant risk of long-term skin damage.",
      eye: "Very high risk of eye damage. Unprotected eyes can become inflamed and sensitive quickly.",
      immune: "Significant immune system suppression with exposure.",
    }
  } else {
    return {
      skin: "Extreme risk of severe sunburn. Unprotected skin can burn in less than 10 minutes. Very high risk of long-term skin damage and increased skin cancer risk.",
      eye: "Extreme risk of eye damage. Unprotected eyes can suffer acute damage.",
      immune: "Severe immune system suppression with even short exposure periods.",
    }
  }
}

