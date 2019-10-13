'use strict'

function processReadings (readings) {
  const grouped = {}

  for (let i = 0; i < readings.length; i++) {
    const reading = readings[i]

    // only process if we received data for reading
    if (reading.data.length > 0 && !reading.inactive) {
      // convert temperature readings to fahrenheit
      reading.temperature = reading.temperature * 1.8 + 32

      if (reading.type === 'environmental') {
        if (!grouped.environmental) grouped.environmental = []
        grouped.environmental.push(reading)
      } else if (reading.type === 'asset') {
        if (!grouped.asset) grouped.asset = []
        grouped.asset.push(reading)
      } else if (reading.type === 'vehicle') {
        if (!grouped.vehicle) grouped.vehicle = []
        grouped.vehicle.push(reading)
      }
    }
  }

  return grouped
}

module.exports = { processReadings }
