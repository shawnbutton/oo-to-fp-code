/* eslint no-unused-vars: 0 */

const db = require('./db')

// pure function
const isActive = id => id.active

// not pure functions
const process = id => db.find(id).filter(isActive)

const write = rec => db.save(rec)

const inc = rec => rec.count++

const log = rec => console.log(rec)
