'use strict'

const processSensors = sensors => {
  let environmentalSensors = []
  let assetSensors = []
  let otherSensors = []

  for (let i = 0; i < sensors.length; i++) {
    // only process if we received data for sensor
    if (sensors[i].data.length > 0) {
      // convert temperature readings to fahrenheit
      sensors[i].temperature = sensors[i].temperature * 1.8 + 32

      if (sensors[i].type === 'environmental') {
        environmentalSensors.push(sensors[i])
      } else if (sensors[i].type === 'asset') {
        assetSensors.push(sensors[i])
      } else {
        otherSensors.push(sensors[i])
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
