const { 
    compose2, 
    identity, 
    compose, 
    flip,
    compose2P,
    identityP,
    composeP, 
    curry,
    __
} = require('./')

describe('compose2 test', () => {
    test("compose2 should compose 2 functions", () => {
        const plus = n => n + 1
        const double = n => n * 2
        const plusDouble =  compose2(double , plus)
        expect(plusDouble(1)).toEqual(4)
    })

    test("compose2 should compose 2 functions whit first function variadic", () => {
        const plus = n => n + 1
        const { max } = Math
        const plusMax =  compose2(plus , max)
        expect(plusMax(1,4,2,3)).toEqual(5)
    })
})

describe('compose test', () => {
    const plus = n => n + 1
    const double = n => n * 2
    const pow2 = n => n * n

    test("compose should compose multiple functions", () => {
        const f = compose(plus , double ,pow2)
        expect(f(2)).toEqual(9)
    })

    test("compose should compose multiple functions whit first function variadic", () => {
        const plus = n => n + 1
        const { max } = Math
        const f =  compose(plus , double ,pow2, max)
        expect(f(1,5,2,3)).toEqual(51)
    })
})


test('identity should return te same value', () => {
    expect(identity(1)).toEqual(1)
    expect(identity([1,2,3])).toEqual([1,2,3])
})

test('flip should return a function', () => {
    const collect = (...args) => args
    const flippedCollect = flip(collect)
    expect(flippedCollect(1,2,3,4)).toEqual([4,3,2,1])
})

describe('compose2P test', () => {
    test("compose2P should compose 2 functions with promises", () => {
        const plusP = n => Promise.resolve(n + 1)
        const double = n => n * 2
        const plusDouble =  compose2P(double , plusP)
        return plusDouble(1).then(n =>  expect(n).toEqual(4))
    })

    test("compose2P should compose 2 functions whit first function variadic with promises", () => {
        const plus = n => n + 1
        const maxP = (...ns) => Promise.resolve(Math.max(...ns))
        const plusMax =  compose2P(plus , maxP)
        return plusMax(1,4,2,3).then(n => expect(n).toEqual(5))
    })
})

test('identityP should return te same value into Promise', () => {
    return identityP(1).then(n => expect(n).toEqual(1) )
})

describe('composeP test', () => {
    const plus = n => n + 1
    const double = n => n * 2
    const pow2P = n => Promise.resolve(n * n)

    test("compose should compose multiple functions with promises", () => {
        const f = composeP(plus , double , pow2P)
        return f(2).then(n => expect(n).toEqual(9))
    })

    test("composeP should compose multiple functions whit first function variadic with promises", () => {
        const plus = n => n + 1
        const maxP = (ns) => Promise.resolve(Math.max(...ns))
        const f =  composeP(plus , double , pow2P, maxP)
        return f([1,5,2,3]).then(n => expect(n).toEqual(51))
    })
})

describe('curry test', () => {
    const add3 = curry((a, b, c) => a + b + c)
    const collect = curry((a, b, c) => [a, b, c])

    test('curry should do partial application', () => {
        expect(add3(1)(2)(3)).toEqual(6)
        expect(add3(1, 2)(3)).toEqual(6)
        expect(add3(1, 2, 3)).toEqual(6)
        expect(add3()).toBeInstanceOf(Function)
    })

    test('curry should do partial application whit placeholder', () => {
        expect(collect(1, 2, 3)).toEqual([1, 2, 3])
        expect(collect(__, 2, 3)(1)).toEqual([1, 2, 3])
        expect(collect(1,__, 3)(2)).toEqual([1, 2, 3])
        expect(collect(1, 2, __)(3)).toEqual([1, 2, 3])
        expect(collect()).toBeInstanceOf(Function)
    })
})

