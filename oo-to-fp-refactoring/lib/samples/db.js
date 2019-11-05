'use strict'

const fs = require('fs')

const readFromDb = id => db.find(id)

const toFile = data => fs.writeFile('file.txt', data)

const inc = rec => rec.count++

const getRandom = () => Math.random()

const inc = x => x + 1
const square = x => x * x

const doMath = (fn, x) => fn(x) // function as parameter

doMath(inc, 3)     // 4
doMath(square, 4)  // 16

const multiplyBy = a => b => a * b // returns a function

const triple = multiplyBy(3)

triple(4) // 12
