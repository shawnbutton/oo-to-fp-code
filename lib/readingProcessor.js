'use strict'

function processReadings (readings) {

  const environmental = []
  const asset = []
  const vehicle = []
  for (let i = 0; i < readings.length; i++) {
    const reading = readings[i]

    // only process if we received data for reading
    if (reading.data.length > 0 && !reading.inactive) {
      // convert temperature readings to fahrenheit
      reading.temperature = reading.temperature * 1.8 + 32

      if (reading.type === 'environmental') {
        environmental.push(reading)
      } else if (reading.type === 'asset') {
        asset.push(reading)
      } else if (reading.type === 'vehicle') {
        vehicle.push(reading)
      }
    }
  }

  const grouped = {}

  if (environmental.length > 0) grouped['environmental'] = environmental
  if (asset.length > 0) grouped['asset'] = asset
  if (vehicle.length > 0) grouped['vehicle'] = vehicle

  return grouped
}

module.exports = { processReadings }
