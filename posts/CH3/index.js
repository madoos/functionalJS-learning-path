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