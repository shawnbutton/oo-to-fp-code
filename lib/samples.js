'use strict'

const inc = x => x + 1
const square = x => x * x

const do_math = (x, fn) => fn(x)

do_math(3, inc)     // 4
do_math(4, square)  // 16

const multiplyBy = a => b => a * b

const triple = multiplyBy(3)

triple(4)  // 12