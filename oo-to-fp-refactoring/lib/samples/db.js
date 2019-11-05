'use strict'

const fs = require('fs')

const readFromDb = id => db.find(id)

const toFile = data => fs.writeFile('file.txt', data)

const inc = rec => rec.count++

const getRandom = () => Math.random()

