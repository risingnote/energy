const { runIfCost, runIfUsage } = require('./fileParser')

jest.mock('./cost')
const { costByTariff } = require('./cost')

jest.mock('./usage')
const annualUsage = require('./usage')

describe('Parse input and determine correct operation to run', () => {
  const prices = {}
  beforeEach(() => {
    costByTariff.mockImplementationOnce(() => () => {})
    annualUsage.mockImplementationOnce(() => () => {})
  })
  afterEach(() => {
    costByTariff.mockClear()
    annualUsage.mockClear()
  })

  it('parses cost line succesfully', () => {
    expect(runIfCost('cost 123 765', prices)).toBeTruthy()
    expect(costByTariff).toBeCalledWith({ power: '123', gas: '765' }, prices)
  })

  it('does not parse cost line with missing param', () => {
    expect(runIfCost('cost 999', prices)).toBeFalsy()
    expect(costByTariff).toHaveBeenCalledTimes(0)
  })

  it('parses usage line succesfully', () => {
    expect(runIfUsage('usage greener-energy power 40', prices)).toBeTruthy()
    expect(annualUsage).toBeCalledWith('greener-energy', 'power', '40', prices)
  })

  it('does not parse usage line with missing param', () => {
    expect(runIfUsage('usage greener-energy power')).toBeFalsy()
    expect(annualUsage).toHaveBeenCalledTimes(0)
  })
})
