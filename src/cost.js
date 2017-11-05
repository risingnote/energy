/**
 * Responsible for converting customer usage into an annual cost.
 */
const { netToGross } = require('./vatConversion')
const { roundPence } = require('./rounding')

/**
 * Do the rates have a tariff for the requested usage.
 * 
 * @param {Object} usage as {energy_type1: annual kwh, energy_type2: annual kwh} 
 * @param {Object} rates as {energy_type1: pence per kwh, energy_type2: pence per kwh}
 * 
 * @returns {boolean} true if rates exist for usage.
 */
const suitableMatch = (usage, rates) =>
  Object.keys(usage).reduce((allMatch, energyType) => {
    return (
      (usage[energyType] <= 0 ||
        (usage[energyType] > 0 && rates.hasOwnProperty(energyType))) &&
      allMatch
    )
  }, true)

/**
 * Convert annual usage in Kwh for all energy types, into net usage cost, excluding standing charge.
 * 
 * @param {Object} usage as {energy_type1: annual kwh, energy_type2: annual kwh} 
 * @param {Object} rates as {energy_type1: pence per kwh, energy_type2: pence per kwh}
 * 
 * @returns {Number} annual cost in £.
 */
const kwhCost = (usage, rates) =>
  Object.keys(usage).reduce((sum, energyType) => {
    return (
      sum + usage[energyType] * (usage[energyType] > 0 ? rates[energyType] : 0)
    )
  }, 0)

/**
 * Calculate the cost of an annual usage pattern for all applicable tariffs. Sort output lowest first.
 * 
 * @param {Object} usage as {energy_type1: annual kwh, energy_type2: annual kwh} 
 * @param {Object[]} prices array of objects with shape 
 * {"tariff": "better-energy", "rates": {"energy_type1":  £kwh, "energy_type2": £kwh}, "standing_charge": £}
 * 
 * @return {Function} With signature (tariff name, gross cost in pounds) which operates on the list of results.
 */
const costByTariff = (usage, prices) => {
  return processResult =>
    prices
      .filter(product => suitableMatch(usage, product.rates))
      .map(product => {
        return {
          tariff: product.tariff,
          grossCost: roundPence(
            netToGross(
              kwhCost(usage, product.rates) + product.standing_charge * 12
            )
          )
        }
      })
      .sort((a, b) => a.grossCost - b.grossCost)
      .map(result => processResult(result.tariff, result.grossCost.toFixed(2)))
}

module.exports.suitableMatch = suitableMatch
module.exports.kwhCost = kwhCost
module.exports.costByTariff = costByTariff
