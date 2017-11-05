/**
 * Manage input from file and output to console. 
 */
const fs = require('fs')
const annualUsage = require('./usage')
const { costByTariff } = require('./cost')
/* eslint no-console: 0 */

const runIfCost = (line, prices) => {
  const costMatch = line.match(/cost\s+(\d+)\s+(\d+)/)
  if (costMatch !== null && costMatch.length === 3) {
    const input = { power: costMatch[1], gas: costMatch[2] }

    costByTariff(input, prices)((tariff, cost) =>
      console.log(`  ${tariff} £${cost}`)
    )
    return true
  } else {
    return false
  }
}

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

const runFromFile = (fileName, prices) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) throw err
    data
      .toString()
      .split('\n')
      .map(line => {
        console.log(`${line}:`)
        runIfCost(line, prices) ||
          runIfUsage(line, prices) ||
          console.log(`  Unknown input.`)
      })
  })
}

module.exports.runIfCost = runIfCost
module.exports.runIfUsage = runIfUsage
module.exports.runFromFile = runFromFile
