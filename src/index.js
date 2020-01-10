
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

module.exports = {
  compose2,
  identity,
  compose,
  flip,
  pipe,
  compose2P,
  identityP,
  composeP,
  pipeP
}