'use strict'
/* eslint-env jest */

const { clone } = require('ramda')

const sut = require('../lib/readingProcessor')

describe('process readings characterization tests', () => {
  it('should match expected', () => {
    const given = [
      {
        name: 'no data is ignored',
        data: [],
        temperature: 0,
        type: 'environmental'
      },
      {
        name: 'inactive is ignored',
        data: [0],
        inactive: true,
        temperature: 0,
        type: 'environmental'
      },
      {
        name: 'environmental is grouped in environmental',
        data: [0],
        temperature: 0,
        type: 'environmental'
      },
      {
        name: 'asset is grouped in asset',
        data: ['abc'],
        temperature: -10,
        type: 'asset'
      },
      {
        name: 'vehicle type is grouped in vehicle',
        data: ['abc'],
        temperature: 10,
        type: 'vehicle'
      }
      ,
      {
        name: 'other types are ignored',
        data: ['abc'],
        temperature: 10,
        type: 'other'
      }
    ]

    const expected = {
      'environmental': [
        {
          'name': 'environmental is grouped in environmental',
          'data': [
            0
          ],
          'temperature': 32,
          'type': 'environmental'
        }
      ],
      'asset': [
        {
          'name': 'asset is grouped in asset',
          'data': [
            'abc'
          ],
          'temperature': 14,
          'type': 'asset'
        }
      ],
      'vehicle': [
        {
          'name': 'vehicle type is grouped in vehicle',
          'data': [
            'abc'
          ],
          'temperature': 50,
          'type': 'vehicle'
        }
      ]
    }

    const result = sut.processReadings(given)

    expect(result).toEqual(expected)
  })

  xit('should not mutate readings', () => {
    const given = [{
      data: [0],
      temperature: 0,
    }]

    const identicalToGiven = clone(given)

    sut.processReadings(given)

    expect(given).toEqual(identicalToGiven)

  })

})
