
const compose2 = (f, g) => (...args) => f(g(...args))

const identity = x => x

const compose = (...fns) => fns.reduce(compose2, identity)

const flip = (f) => (...args) => f(...args.reverse())

const pipe = flip(compose)

const pipe2P = (f, g) => (...args) => f(...args).then(g) 

const identityP = x => Promise.resolve(x)

const pipeP = (...fns) => fns.reduce(pipe2P, identityP)

const composeP = flip(pipeP)

const compose2P = flip(pipe2P)

const __ = { "@functional/placeholder": true }

const _isPlaceholder = (x) => x === __

const _hasAllArgs  = (n, args) => args.length >= n && !args.some(_isPlaceholder)

const _handlePlaceholders = (args, rest) =>  args.map((arg) => _isPlaceholder(arg) && Boolean(rest.length) ? rest.shift() : arg).concat(rest)

const curryN = (n, f) => {
    return function curried (...args) {
        return _hasAllArgs(n, args) ? f(...args) : (...rest) => curried(..._handlePlaceholders(args, rest))
    }
}

const curry = (f) => curryN(f.length, f)

module.exports = {
  compose2,
  identity,
  compose,
  flip,
  pipe,
  compose2P,
  identityP,
  composeP,
  pipeP,
  curryN,
  curry,
  __
}