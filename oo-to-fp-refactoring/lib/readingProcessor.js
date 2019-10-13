'use strict'

const { clone, filter, map, pipe, groupBy } = require('ramda')

const hasData = reading => reading.data.length > 0 && !reading.inactive

const celciusToFarenheit = temperature => temperature * 1.8 + 32

const convertToFarenheit = reading => {
  const newReading = clone(reading)
  newReading.temperature = celciusToFarenheit(newReading.temperature)
  return newReading
}

const inAllowedTypes = reading => ['environmental', 'asset', 'vehicle'].includes(reading.type)
const byType = reading => reading.type

const onlyWithData = filter(hasData)
const allInFarenheit = map(convertToFarenheit)
const onlyAllowedTypes = filter(inAllowedTypes)
const groupByType = groupBy(byType)

const processReadings = pipe(onlyWithData, allInFarenheit, onlyAllowedTypes, groupByType)

module.exports = { processReadings }
