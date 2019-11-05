/* eslint no-unused-vars: 0 */

const db = require('./db')

// pure function
const isActive = id => id.active

// not pure functions
const readFromDb = id => db.find(id)

const toFile = data => fs.writeFile('file.txt', data)

const inc = rec => rec.count++

const getRandom = () => Math.random()

const tossCoin = () => Math.random() < 0.5 ? 'heads' : 'tails'

const lets = () => 'code'
