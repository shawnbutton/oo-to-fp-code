'use strict'
/* eslint-env jest */

const sut = require('../lib/readingProcessor')

// const { clone } = require('ramda')

describe('process readings characterization test', () => {
  it('matches expected', () => {
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
      },
      {
        name: 'other types are ignored',
        data: ['abc'],
        temperature: 10,
        type: 'other'
      }
    ]

    const expected = {
      environmental: [
        {
          name: 'environmental is grouped in environmental',
          data: [
            0
          ],
          temperature: 32,
          type: 'environmental'
        }
      ],
      asset: [
        {
          name: 'asset is grouped in asset',
          data: [
            'abc'
          ],
          temperature: 14,
          type: 'asset'
        }
      ],
      vehicle: [
        {
          name: 'vehicle type is grouped in vehicle',
          data: [
            'abc'
          ],
          temperature: 50,
          type: 'vehicle'
        }
      ]
    }

    const result = sut.processReadings(given)

    expect(result).toEqual(expected)
  })
})

describe('process readings', () => {
  const buildReading = () => {
    return {
      data: [0],
      temperature: 0,
      type: 'default'
    }
  }

  it('should ignore readings with no data', () => {
    const given = buildReading()
    given.data = []

    const expected = {}

    expect(sut.processReadings([given])).toEqual(expected)
  })

  it('should ignore readings that are inactive', () => {
    const given = buildReading()
    given.inactive = true

    const expected = {}

    expect(sut.processReadings([given])).toEqual(expected)
  })

  test('environmental is grouped', () => {
    const given = buildReading()
    given.type = 'environmental'

    const expected = {
      environmental: [
        {
          data: [0],
          temperature: 32,
          type: 'environmental'
        }
      ]
    }

    expect(sut.processReadings([given])).toEqual(expected)
  })

  test('asset is grouped', () => {
    const given = buildReading()
    given.type = 'asset'

    const expected = {
      asset: [
        {
          data: [0],
          temperature: 32,
          type: 'asset'
        }
      ]
    }

    expect(sut.processReadings([given])).toEqual(expected)
  })

  test('vehicle is grouped', () => {
    const given = buildReading()
    given.type = 'vehicle'

    const expected = {
      vehicle: [
        {
          data: [0],
          temperature: 32,
          type: 'vehicle'
        }
      ]
    }

    expect(sut.processReadings([given])).toEqual(expected)
  })

  test('other types are ignored', () => {
    const given = buildReading()
    given.type = 'something unknown'

    expect(sut.processReadings([given])).toEqual({})
  })

  // xit('should not mutate readings', () => {
  //   const given = [{
  //     data: [0],
  //     temperature: 0
  //   }]
  //
  //   const initialState = clone(given)
  //
  //   sut.processReadings(given)
  //
  //   expect(given).toEqual(initialState)
  // })
})
