# Glosario de la Programación Funcional.

* [Función Pura](#Función-Pura)
* [Efectos Secundarios](#Efectos-Secundarios)
* [Funciones como ciudadanos de primer orden](#Funciones-como-ciudadanos-de-primer-orden)
* [Composición Funcional](#Composición-Funcional)
* [Monoide](#Monoide)
* [Combinador](#Combinador)
* [Funciones de Orden Superior (HOF)](#Funciones-de-Orden-Superior-(HOF))
* [Aplicación parcial](#Aplicación-parcial)
* [Currificación](#Currificación)
* [Autocurrificación](#Autocurrificación)
* [Aridad](#Aridad)

## Función Pura
Una funcion es pura si el valor de retorno es determinado solamente por sus valores de entrada, y no produce efectos secundarios.

```js
const greet = (name) => `Hi, ${name}`

greet('Brianne') // 'Hi, Brianne'
```

```js
const add = (a, b) => a + b
add(1, 1) // 2
```

## Efectos Secundarios
Se dice que una funcion o expresion tiene un efecto secundario si aparte de retornar un valor, interactua con el estado mutable externo (lee o escribe).

```js
const differentEveryTime = new Date()
```

```js
console.log('IO es un efecto secundario!')
```

```js
const random = Math.random()
```

## Funciones como ciudadanos de primer orden

Se dice que una función es ciudadano de primer orden cuando puede ser pasada o retornada como un tipo de dato más.

```js
const users = [{ name: "Rox", age:25 }, { name: "Sara", age:15 }]
const getAge = user => user.age
const ages = users.map(getAge) // pasamos getAge como argumento
```
 
```js
const getAges = users => users.map(getAge)
api.get('/users').then(getAges) // pasamos getAges como argumento
```
 
```js
const always = (data) => {
   // podemos retornar un función
   return () => {
       return data
   }
}
 
const alwaysTrue = always(true)
alwaysTrue() // true
alwaysTrue() // true
```

## Composición Funcional

Componer funciones es el acto de poner 2 funciones juntas para formar una tercera funcion donde la salida de una es la entrada de la otra.

```js
const compose = (f,g) => (argumentos) => f(g(argumentos)) // Definicion
const toString = (val) => val.toString()
const floorAndToString = compose(toString, Math.floor);
floorAndToString(121.212121) // '121'
```

## Monoide

Objeto con una funcion que "combina" ese objeto con otro del mismo tipo.

Un simple monoide es la suma de numeros.

```js
1 + 1 // 2
```

En este caso los numeros son los objetos y `+` es la funcion.

Tambien debe existir un valor "identidad" que cuando se combina con un valor no lo cambia.

El valor identidad para la suma es el  `0`.
```js
1 + 0 // 1
```

Tambien es necesario que el agrupamiento de operaciones no altere el resultado (asociatividad).

```js
1 + (2 + 3) === (1 + 2) + 3 // true
```

La concatenacion de los Arrays tambien forma un monoide.

```js
;[1, 2].concat([3, 4]) // [1, 2, 3, 4]
```

 El valor identidad es un array vacio `[]`.

```js
;[1, 2].concat([]) // [1, 2]
```

Si se proporcionan funciones de identidad y composicion, las funciones mismas forman un monoide:

```js
const identity = (a) => a
const compose = (f, g) => (x) => f(g(x))
```
`foo` es cualquier funcion que toma un argumento.
```js
compose(foo, identity) ≍ compose(identity, foo) ≍ foo
```

## Combinador

Son funciones de orden superior que retornan funciones adaptadas según algún tipo de lógica combinatoria.

los combinadores son construcciones de programación que le permiten armar piezas de lógica de maneras interesantes y a menudo avanzadas.

```js
const flip = (f) => (...args) => f(...args.reverse) // combinador

const reverseConcat = flip((a,b) => a.concat(b))
reverseConcat('Hello', "world ") // "world hello"

```

## Funciones de Orden Superior (HOF)

Funcion que toma una funcion como argumento y puede o no retornar una funcion.

```js
const filter = (predicate, xs) => {
  const result = []
  for (let idx = 0; idx < xs.length; idx++) {
    if (predicate(xs[idx])) {
      result.push(xs[idx])
    }
  }
  return result
}
const is = (type) => (x) => Object(x) instanceof type
filter(is(Number), [0, '1', 2, null]) // [0, 2]
```

## Aplicación parcial

Aplicar parcialmente una funcion, significa crear una nueva funcion rellenando previamente alguno de los argumentos de la funcion original.

```js
// Ayudante para creaqr funciones parcialmente aplicadas.
// Toma una funcion y algunos argumentos.
const partial = (f, ...args) =>
  // retorna una funcion que toma el resto de los argumentos.
  (...moreArgs) =>
    // y llama a la funcion original con todos ellos.
    f(...args, ...moreArgs)

// Algo para aplicar.
const add3 = (a, b, c) => a + b + c

// Parcialmente aplica  `2` y `3` a `add3` obteniendo una funcion de un solo argumento ( funcion unaria o de aridad 1 )
const fivePlus = partial(add3, 2, 3) // (c) => 2 + 3 + c

fivePlus(4) // 9
```
Tambien puede utilizar Function.prototype.bind para aplicar parcialmente una funcion en JavaScript.

const add1More = add3.bind(null, 2, 3) // (c) => 2 + 3 + c
La aplicacion parcial ayuda a crear funciones mas simples a partir de funciones mas complejas mediante la adicion de sus datos cuando los tenga. Las funciones curri se aplican parcialmente de forma automatica.

## Currificación

El proceso de convertir una funcion que toma multiples argumentos, en una funcion que los toma uno a la vez.

Cada vez que la funcion es llamada, esta solamente acepta un argumento y retorna una funcion que toma el siguiente argumento y asi continua hasta que se pasen todos los argumentos.

```js
const sum = (a, b) => a + b

const curriedSum = (a) => (b) => a + b

curriedSum(40)(2) // 42.

const add2 = curriedSum(2) // (b) => 2 + b

add2(10) // 12
```

## Autocurrificación

Transforma una funcion que toma multiples argumentos en una funcion que, si se le da un numero menor de argumentos de los que espera, devuelve una funcion que toma el resto. Cuando la funcion obtiene el numero completo de argumentos se evalua.

Underscore, lodash, y ramda tienen una funcion curry que trabaja de esta manera.

```js
const add = (x, y) => x + y

const curriedAdd = _.curry(add)
curriedAdd(1, 2) // 3
curriedAdd(1) // (y) => 1 + y
curriedAdd(1)(2) // 3
```

## Aridad

El numero de argumentos que una función toma. Utiliza términos como unario, binario, ternario etc. Esta palabra tiene la distinción de estar compuesta de dos sufijos, "Ary" y "ity" Adicionalmente por ejemplo, toma dos argumentos, y así se define como una función binaria o una función de aridad dos. Tal función a veces puede ser llamada "diadica" por personas que prefieren las raíces griegas al latín. Del mismo modo, una función que toma un numero variable de argumentos se denomina "variadic", mientras que una función binaria solamente toma dos y nada mas que dos argumentos.

```js
const sum = (a, b) => a + b

const arity = sum.length
console.log(arity) // 2
// The arity of sum is 2
```