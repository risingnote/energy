/**
 * Entry point.
 */
const { runFromFile } = require('./fileParser')
const prices = require('../resources/prices')

runFromFile('./resources/input.txt', prices)
