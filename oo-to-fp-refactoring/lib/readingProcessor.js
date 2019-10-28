'use strict'

const { clone, groupBy, filter, map, pipe } = require('ramda')

const hasData = reading => reading.data.length > 0 && !reading.inactive

const celciusToFahrenheit = temperature => temperature * 1.8 + 32

const convertToFahrenheit = reading => {
  const readingClone = clone(reading)
  readingClone.temperature = celciusToFahrenheit(readingClone.temperature)
  return readingClone
}

const inAllowedTypes = reading => ['environmental', 'asset', 'vehicle'].includes(reading.type)

const onlyWithData = filter(hasData)
const toFahrenheit = map(convertToFahrenheit)
const onlyAllowedTypes = filter(inAllowedTypes)

const readingType = reading => reading.type

const groupedByType = groupBy(readingType)

const processReadings = readings => {
  const withData = onlyWithData(readings)
  const inFahrenheit = toFahrenheit(withData)
  const allowedTypesOnly = onlyAllowedTypes(inFahrenheit)
  return groupedByType(allowedTypesOnly)
}

module.exports = { processReadings }
