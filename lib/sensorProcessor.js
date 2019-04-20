'use strict'

const processSensors = sensors => {
  let environmentalSensors = []
  let assetSensors = []
  let otherSensors = []

  for (let i = 0; i < sensors.length; i++) {
    const sensor = sensors[i]

    // only process if we received data for sensor
    if ((sensor.data.length > 0 && (!sensor.inactive))) {
      // convert temperature readings to fahrenheit
      sensor.temperature = sensor.temperature * 1.8 + 32

      if (sensor.type === 'environmental') {
        environmentalSensors.push(sensor)
      } else if (sensor.type === 'asset') {
        assetSensors.push(sensor)
      } else {
        otherSensors.push(sensor)
      }
    }
  }

  return {
    environmental: environmentalSensors,
    asset: assetSensors,
    other: otherSensors
  }
}

module.exports = { processSensors }
