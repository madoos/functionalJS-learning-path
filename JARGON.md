# Glosario de la Programación Funcional.

* [Función Pura](#Función-Pura)
* [Efectos Secundarios](#Efectos-Secundarios)
* [Funciones como ciudadanos de primer orden](#Funciones-como-ciudadanos-de-primer-orden)
* [Composición Funcional](#Composición-Funcional)
* [Monoide](#Monoide)
* [Combinador](#Combinador)
* [Funciones de Orden Superior (HOF)](#Funciones-de-Orden-Superior-(HOF))

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