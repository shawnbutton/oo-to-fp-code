'use strict'

function processReadings (readings) {
  const grouped = {}

  for (let i = 0; i < readings.length; i++) {
    const reading = readings[i]

    // only process if we received data for reading
    if (reading.data.length > 0 && !reading.inactive) {
      // convert temperature readings to fahrenheit
      reading.temperature = reading.temperature * 1.8 + 32

      if (['environmental', 'asset', 'vehicle'].includes(reading.type)) {
        if (!grouped[reading.type]) grouped[reading.type] = []
        grouped[reading.type].push(reading)
      }
    }
  }

  return grouped
}

module.exports = { processReadings }
