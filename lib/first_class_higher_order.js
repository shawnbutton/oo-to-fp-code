const inc = x => x + 1
const square = x => x * x

const doMath = (x, fn) => fn(x) // function as parameter

doMath(3, inc)     // 4
doMath(4, square)  // 16

const multiplyBy = a => b => a * b // returns a function

const triple = multiplyBy(3)

triple(4)  // 12