'use strict'
/* eslint-env jest */

const sut = require('../lib/sensorProcessor')

describe('process sensors characterization tests', () => {

  it('should match expected', () => {

    const given = [
      {
        name: 'no data is ignored',
        data: []
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
        name: 'no type is grouped in other',
        data: ['abc'],
        temperature: 10,
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
          'name': 'no type is grouped in other',
          'data': [
            'abc'
          ],
          'temperature': 50
        }
      ]
    }

    const result = sut.processSensors(given)

    expect(result).toEqual(expected)
  })
})
