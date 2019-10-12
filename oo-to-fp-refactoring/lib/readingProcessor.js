'use strict'

const hasData = reading => reading.data.length > 0 && !reading.inactive

const convertToFarenheit = reading => {
  reading.temperature = reading.temperature * 1.8 + 32
  return reading
}

const allowedTypes = ['environmental', 'asset', 'vehicle']

const inAllowedTypes = (reading) => {
  return (allowedTypes.includes(reading.type))
}

const groupByType = (grouped, reading) => {
  if (!grouped[reading.type]) grouped[reading.type] = []
  grouped[reading.type].push(reading)
  return grouped
}

const processReadings = readings => {
  return readings
    .filter(hasData)
    .map(convertToFarenheit)
    .filter(inAllowedTypes)
    .reduce(groupByType, {})
}

module.exports = { processReadings }
