/**
 * Responsible for converting customer monthly spend into annual power consumption.
 */
const { grossToNet } = require('./vatConversion')

const calcUsage = (monthlySpend, kwhCost, standingCharge) =>
  Math.round((grossToNet(monthlySpend) - standingCharge) * 12 / kwhCost)

/**
 * Calculate annual power consumption from customer monthly spend.
 * @param {String} tariffName 
 * @param {String} energyType 
 * @param {Number} monthlySpend in pounds
 * @param {Object[]} prices 
 * 
 * @return {Function} With signature (result as annual kwh). If no tariff found return 0.
 */

const annualUsage = (tariffName, energyType, monthlySpend, prices) => {
  return processResult => {
    const tariff = prices.find(
      tariff => tariff.tariff === tariffName && tariff.rates[energyType]
    )
    const result =
      tariff !== undefined
        ? calcUsage(
            monthlySpend,
            tariff.rates[energyType],
            tariff.standing_charge
          )
        : 0
    processResult(result)
  }
}

module.exports = annualUsage
