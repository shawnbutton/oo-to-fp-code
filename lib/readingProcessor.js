'use strict'

const processReadings = readings => {
  let environmentalSensors = []
  let assetSensors = []
  let otherSensors = []

  for (let i = 0; i < readings.length; i++) {
    const reading = readings[i]

    // only process if we received data for reading
    if ((reading.data.length > 0 && (!reading.inactive))) {
      // convert temperature readings to fahrenheit
      reading.temperature = reading.temperature * 1.8 + 32

      if (reading.type === 'environmental') {
        environmentalSensors.push(reading)
      } else if (reading.type === 'asset') {
        assetSensors.push(reading)
      } else {
        otherSensors.push(reading)
      }
    }
  }

  return {
    environmental: environmentalSensors,
    asset: assetSensors,
    other: otherSensors
  }
}

module.exports = { processReadings }
