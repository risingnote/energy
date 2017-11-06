const { runIfCost, runIfUsage, runFromFile } = require('./fileParser')

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

  it('parses a test file', done => {
    const filePrices = {}
    runFromFile('./resources/input.test.txt', filePrices)
      .then(() => {
        expect(costByTariff).toHaveBeenCalledTimes(1)
        expect(costByTariff).toBeCalledWith(
          { power: '100', gas: '200' },
          prices
        )
        expect(annualUsage).toHaveBeenCalledTimes(1)
        expect(annualUsage).toBeCalledWith('verde', 'gas', '50', prices)
        done()
      })
      .catch(err => {
        done.fail(err)
      })
  })
})
