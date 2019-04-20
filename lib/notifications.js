'use strict'

const fsdfafsdf = (sensorsFound, sensorsDefined) => {

  let sensorWithNoData = []
  for (const sensor of sensorsDefined) {
    var sensorWithNoDataFound = _.find(sensorWithNoData, sensorWithNoDataObj => sensorWithNoDataObj.sensorId === sensor.id)

    if (req.body.eventStatus === 'No-data') {
      if (sensorWithNoDataFound) {
        sensor.status = 'No Data'
      } else {
        sensor.status = 'Normal'
      }

    } else {
      sensor.status = 'Normal'
    }
  }
}

