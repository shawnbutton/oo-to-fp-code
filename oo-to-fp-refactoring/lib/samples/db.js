'use strict'

const fs = require('fs')

const find = id => ({ active: true })
const save = record => ({ })

const writeToFile = data => fs.writeFile('file.txt', data)

module.exports = { find, save }

const getRandom = () => Math.random()

console.log(getRandom())
