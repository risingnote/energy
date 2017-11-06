/**
 * Manage input from file and output to console. 
 */
const fs = require('fs')
const annualUsage = require('./usage')
const { costByTariff } = require('./cost')
/* eslint no-console: 0 */

/**
 * If line indicates a cost command, run the command parsed from input line.
 * 
 * @param {String} line - input command from file 
 * @param {Object[]} prices 
 * 
 * @return {boolean} true if matched and run, false otherwise. 
 */
const runIfCost = (line, prices) => {
  const costMatch = line.match(/cost\s+(\d+)\s+(\d+)/)
  if (costMatch !== null && costMatch.length === 3) {
    const input = { power: costMatch[1], gas: costMatch[2] }

    costByTariff(input, prices)((tariff, cost) =>
      console.log(`  ${tariff.padEnd(18, ' ')} £${cost}`)
    )
    return true
  } else {
    return false
  }
}

/**
 * If line indicates a usage command, run the command parsed from input line.
 * 
 * @param {String} line - input command from file 
 * @param {Object[]} prices 
 * 
 * @return {boolean} true if matched and run, false otherwise. 
 */
const runIfUsage = (line, prices) => {
  const usageMatch = line.match(/usage\s+(.+)\s+(.+)\s+(\d+)/)

  if (usageMatch !== null && usageMatch.length === 4) {
    annualUsage(usageMatch[1], usageMatch[2], usageMatch[3], prices)(energy =>
      console.log(`  ${energy} kwh`)
    )
    return true
  } else {
    return false
  }
}

/**
 * Given an input file location, parse and run the commands.
 * 
 * @param {String} fileName - input filename 
 * @param {Object[]} prices 
 * 
 * @return {Promise} which resolves once file processed.
 */
const runFromFile = (fileName, prices) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) reject(err)
      data
        .toString()
        .split('\n')
        .map(line => {
          console.log(`${line}:`)
          runIfCost(line, prices) ||
            runIfUsage(line, prices) ||
            console.log(`  Unknown input.`)
        })
      resolve()
    })
  })
}

module.exports.runIfCost = runIfCost
module.exports.runIfUsage = runIfUsage
module.exports.runFromFile = runFromFile
