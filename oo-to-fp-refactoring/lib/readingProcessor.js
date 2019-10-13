'use strict'

const hasData = reading => reading.data.length > 0 && !reading.inactive

const celciusToFarenheit = temperature => temperature * 1.8 + 32

const convertToFarenheit = reading => {
  reading.temperature = celciusToFarenheit(reading.temperature)
  return reading
}

const allowedTypes = ['environmental', 'asset', 'vehicle']

const inAllowedTypes = reading => allowedTypes.includes(reading.type)

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
