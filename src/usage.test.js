const annualUsage = require('./usage')

const prices = [
  {
    tariff: 'both-tariff',
    rates: { power: 0.25, gas: 0.5 },
    standing_charge: 10.0
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

describe('Annual usage from customer monthly spend', () => {
  it('calculates usage where a tarrif is matched', () => {
    let result = -1
    annualUsage('both-tariff', 'gas', 21, prices)(usage => (result = usage))
    expect(result).toEqual(240)
  })

  it('returns 0 usage where a tarrif is not matched', () => {
    let result = -1
    annualUsage('power-only', 'gas', 21, prices)(usage => (result = usage))
    expect(result).toEqual(0)
  })
})
