'use strict'

const processSensors = sensors => {

  let sensorWithData = []

  for (let i = 0; i < sensors.length; i++) {

    // only process if we received data for sensor
    if (sensors[i].data.length > 0) {

      // convert temperature readings to fahrenheit
      sensors[i].temperature = sensors.temperature * 1.8 + 32

      sensorWithData.push(sensors[i])
    }

  }

  return sensorWithData

}

