const { costByTariff, kwhCost, suitableMatch } = require('./cost')

describe('Determine if usage pattern can be used with rate', () => {
  it('is allowed if usage matches rate', () => {
    const rate = { power: 1.0, gas: 2.0 }
    const usage = { power: 100, gas: 200 }
    expect(suitableMatch(usage, rate)).toBeTruthy()
  })

  it('is not allowed if first rate is missing', () => {
    const rate = { gas: 1.0 }
    const usage = { power: 100, gas: 200 }
    expect(suitableMatch(usage, rate)).toBeFalsy()
  })

  it('is not allowed if second rate is missing', () => {
    const rate = { power: 1.0 }
    const usage = { power: 100, gas: 200 }
    expect(suitableMatch(usage, rate)).toBeFalsy()
  })

  it('is allowed if a rate is missing but the usage is 0', () => {
    const rate = { power: 1.0 }
    const usage = { power: 100, gas: 0 }
    expect(suitableMatch(usage, rate)).toBeTruthy()
  })

  it('Handles no usage data', () => {
    const rate = { power: 1.0, gas: 2.0 }
    const usage = {}
    expect(suitableMatch(usage, rate)).toBeTruthy()
  })

  it('Handles no rate data', () => {
    const rate = {}
    const usage = { power: 100, gas: 200 }
    expect(suitableMatch(usage, rate)).toBeFalsy()
  })
})

describe('Calculates net customer kwh cost, no standing charge', () => {
  it('Calculates a kwh cost where usage is non zero', () => {
    const rate = { power: 1.0, gas: 2.0 }
    const usage = { power: 100, gas: 200 }
    expect(kwhCost(usage, rate)).toEqual(500.0)
  })

  it('Calculates a kwh costs where one usage is zero and missing rate', () => {
    const rate = { gas: 1.0 }
    const usage = { power: 0, gas: 200 }
    expect(kwhCost(usage, rate)).toEqual(200.0)
  })

  it('Handles no usage data', () => {
    const rate = { power: 1.0, gas: 2.0 }
    const usage = {}
    expect(kwhCost(usage, rate)).toEqual(0.0)
  })
})

describe('Calculate cost over all eligible tariffs', () => {
  let result
  beforeEach(() => (result = []))

  const prices = [
    {
      tariff: 'both-tariff',
      rates: { power: 0.25, gas: 0.1 },
      standing_charge: 5.5
    },
    {
      tariff: 'both-tariff-2',
      rates: { power: 0.35, gas: 0.3 },
      standing_charge: 3.0
    },
    {
      tariff: 'power-only',
      rates: { power: 0.5 },
      standing_charge: 2.5
    }
  ]

  it('Usage input for power and gas', () => {
    const usage = { power: 100, gas: 200 }

    costByTariff(usage, prices)((tariff, cost) => result.push([tariff, cost]))
    expect(result).toEqual([
      ['both-tariff', '116.55'],
      ['both-tariff-2', '137.55']
    ])
  })

  it('Usage for gas only', () => {
    const usage = { power: 0, gas: 200 }

    costByTariff(usage, prices)((tariff, cost) => result.push([tariff, cost]))
    expect(result).toEqual([
      ['both-tariff', '90.30'],
      ['both-tariff-2', '100.80']
    ])
  })

  it('Usage for power only', () => {
    const usage = { power: 100, gas: 0 }

    costByTariff(usage, prices)((tariff, cost) => result.push([tariff, cost]))
    expect(result).toEqual([
      ['both-tariff-2', '74.55'],
      ['power-only', '84.00'],
      ['both-tariff', '95.55']
    ])
  })
})
