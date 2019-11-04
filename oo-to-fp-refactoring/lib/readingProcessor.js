'use strict'

const { clone, groupBy, filter, map, pipe } = require('ramda')

const hasData = reading => reading.data.length > 0 && !reading.inactive

const convertToFahrenheit = reading => {
  const readingClone = clone(reading)
  readingClone.temperature = readingClone.temperature * 1.8 + 32
  return readingClone
}

const inAllowedTypes = reading => ['environmental', 'asset', 'vehicle'].includes(reading.type)

const byType = reading => reading.type

const onlyWithData = filter(hasData)
const toFahrenheit = map(convertToFahrenheit)
const onlyAllowedTypes = filter(inAllowedTypes)
const groupByType = groupBy(byType)

const processReadings = pipe(onlyWithData, toFahrenheit, onlyAllowedTypes, groupByType)

module.exports = { processReadings }
