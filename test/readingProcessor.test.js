'use strict'
/* eslint-env jest */

const sut = require('../lib/readingProcessor')

describe('process readings characterization tests', () => {
  it('should match expected', () => {
    const given = [
      {
        name: 'no data is ignored',
        data: []
      },
      {
        name: 'inactive is ignored',
        data: [0],
        inactive: true
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
      'other': [
        {
          'name': 'vehicle is grouped in vehicle',
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
})
