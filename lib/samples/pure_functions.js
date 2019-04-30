const db = require('./db')

const isActive = id => id.active  // pure function

const process = id => db.find(id).filter(isActive)

const write = rec => db.save(rec)

const inc = rec => rec.count++

const log = rec => console.log(rec)


