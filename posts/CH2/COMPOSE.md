# Composición Funcional  

¡Hola Navegante!

Seguimos con esta serie de programación funcional en javascript y como lo prometido es deuda hoy toca una entrada sobre composición funcional.

Esta entrada tratará sobre:

* Definiremos de manera formal la composición.
* Veremos las propiedades de composición y su utilidad para el refactor.
* Implementaremos para nuestra librería de programación funcional funciones de composición para contextos síncronos y asíncronos (promesas).
* Implementaremos combinadores que nos permitirán ahorrar esfuerzos 
* Retomaremos el ejercicio del capítulo anterior para ver como ahora es más familiar.

## Composición

La composición es la operación más elemental que utilizamos para construir programas. Tomar la salida de un cómputo para utilizarla como entrada de otra.

```js
const plus = n => n + 1
const double = n => n * 2
 
const plusDouble = (n) => double(plus(n))

plusDouble(1) // 4
```

```js
const prop = (key, obj) => obj[key]
const isGreaterOrEqualThan18 = n => n >=18
 
const isAdult = (user) => isGreaterOrEqualThan18(prop('age', user))
 
isAdult({ name: 'Sara', age: 21 }) // true
```

La composición será la piedra angular que nos permitirá a partir de funciones puras genéricas crear funciones más específicas para al final construir nuestros programas.

Similar a  como en la música las notas (funciones puras) conforman acordes (funciones de dominio compuestas) y los acordes conforman obras (pieza de software), la composición será el pegamento que nos permitirá desarrollar nuestro programas.

## Definición formal de composición

[Según la wikipedia:](https://es.wikipedia.org/wiki/Funci%C3%B3n_compuesta)

En álgebra abstracta, una función compuesta es una función formada por la composición o aplicación sucesiva de otras dos funciones. Para ello, se aplica sobre el argumento la función más próxima al mismo y al resultado del cálculo anterior se le aplica finalmente la función restante.

Usando la notación matemática, la función compuesta g ∘ f  expresa que (g ∘ f)(x) = f(g(x)) para todo x perteneciente a X.

# propiedades de la composición:
 
* La composición de funciones es asociativa: h ∘ (g ∘ f) = (h ∘ g) ∘ f
* La composición de funciones en general no es conmutativa: f ∘ g ≠ g ∘ f
* El elemento neutro asociado a la composición de funciones es la función identidad.


NOTA: es muy importante que tengas en cuenta que en notación matemática cuando se compone las funciones se aplican en orden inverso.

Después de todo ese bla bla bla podemos sacar que dada una función f y una función g nosotros podemos obtener gratis una función fg (siempre y cuando la salida de g coincida con la entrada de f) y que la composición tiene ciertas propiedades muy importantes que explotaremos en el futuro. 


```javascript
const plus = n => n + 1
const double = n => n * 2
 
const plusDouble = double ∘ plus
 
plusDouble(1) // 4
```

```js
const age = (user) => user.age
const isGreaterOrEqualThan18 = n => n >=18
 
const isAdult = isGreaterOrEqualThan18 ∘ age
isAdult({ name: 'Sara', age: 21 }) // true
```

Los ejemplos  anteriores no son muy emocionantes y desgraciadamente javascript no tiene incorporado el operador de composición. 
 
Aquí va la primera función de nuestra librería. Redoble de tambores: entra en escena compose2 (se llamará compose2 porque permite componer dos funciones. Ya lo entenderás ;) ).

Si recordamos la definición nos dice que dada la función f y g nosotros podemos obtener gratis la función compuesta fg.

```js
const compose2 = (f, g) => (x) => f(g(x)) 
```

```js
function compose2 (f, g) {
  return function composed (x) {
    return f(g(x))
  }
}
```

Nota: recuerdas la entrada anterior en donde hablábamos que las funciones son ciudadanos de primer orden. Como puedes ver en la definición de compose2 recibe como argumentos dos funciones y retorna una función. Ves como todo está conectado.

Perfecto! 
 
Ya podemos escribir nuestros ejemplos anteriores usando nuestra nueva utilidad:

```js
const plus = n => n + 1
const double = n => n * 2

const plusDouble = compose2(double, plus)

plusDouble(1) // 4
```

```js
const age = (user) => user.age
const isGreaterOrEqualThan18 = n => n >=18
 
const isAdult = compose2(isGreaterOrEqualThan18, age)

isAdult({ name: 'Sara', age: 21 }) // true
```

Ya tenemos nuestra no tan extraordinaria función compose2 pero podemos observar que tiene ciertas limitaciones que intentaremos corregir:

* La primera función de de la cadena de transformación tiene que ser de un argumento.
* El poder componer solo 2 funciones es muy limitado, necesitamos algo que nos permita poder componer muchas funciones.
* La función compose se se aplica en orden inverso, nos gustaría poder escribir en orden que leemos.
* En el mundo real no todas las funciones son de un argumento ¿cómo componemos funciones de más de un argumento?.

## La primera función de la cadena de transformación tiene que ser de un argumento.

En el siguiente ejemplo podemos observar como nuestra función compose2 falla:

```js
const plus = n => n + 1
const plusMax = compose2(plus, Math.max) // recuerda que la composicón se hace en ordern inverso, primero se aplica Math.max y de su resultado se llama a plus.

plusMax(1,100, 2) // 2 Falla porque en la definición actual de compose2 solo se pasa un argumento en este caso el primero a la función max 
```

Podríamos decir  que con la actual definición de compose2 se interpreta:

```js

const plusMax = (n) => plus(Math.max(n)) // solo se pasa el primer argumento (1) y esto hace que la definición falle.

```

Lo correcto tendría que ser:

```js

const plusMax = (...args) => plus(Math.max(...args)) // de esta forma max puede hacer su trabajo correctamente y entregarle un 100 a plus

```

Vamos a mificar nuestra función compose2 para solucionar este error.

```js
const compose2 = (f, g) => (...args) => f(g(...args)) // pasamos cualquier numero de argumentos en la primera llamada de la composición
```

```js
function compose2 (f, g) {
  return function composed (...args) {
    return f(g(...args))  // pasamos cualquier numero de argumentos en la primera llamada de la composición
  }
}
```

Con esta simple modificación nuestra compose2 ya funciona de forma correcta.

```js
const plus = n => n + 1
const plusMax = compose2(plus, Math.max)

plusMax(1,100, 2) // 101
```

## El poder componer solo 2 funciones es muy limitado, necesitamos algo que nos permita poder componer muchas funciones

La utilidad de poder componer múltiples  funciones de un vez  son muchas, de hecho en la práctica en muy pocas ocasiones utilizamos el composed2 y es en este escenario cuando la propiedad asociativa de la composición brilla.

Vamos a definir nuestra función de composición de múltiples funciones la cual llamaremos compose.

Primero vamos a hacer una definición imperativa y luego poco a poco lo iremos moviendo un enfoque más funcional.


```js

const compose = (...fns) => { //  recibe cualquier número de funciones 
    return (...args) => {
        const [first, ...rest] = fns.reverse() // La composición se aplica en orden inverso por eso hacemos un reverse

        let result = first(...args)

        for(let f of rest ){
            result = f(result)
        }
        return result
    }
}

```

```js
const plus = n => n + 1
const double = n => n * 2
const pow2 = n => n * n

const f = compose(
    plus, // paso 3: plus(8) // -> 9
    double, // paso 2: double(4) -> 8
    pow2 // paso 1: pow(2) -> 4
)

f(2) // 9

```

Después de esa fea definición de compose intentaremos pensar de forma más funcional. Los fundamentos de la programación funcional es la teoría de categorías la cual nos desalienta a ver dentro de los objetos y nos invita a alejarnos para encontrar las relaciones estructurales entre ellos. 

Si nos alejamos de lo que hace la composición en términos de función podemos decir que la composición es una operación binaria entre elementos del mismo tipo que dá como resultado un elemento del mismo tipo  (la composición recibe dos funciones y retorna otra). 

Similar a la suma y el producto. ¿Lo ves? ¡Se ve se siente el reduce está presente!

```js
const numbers = [1, 2, 3]
const add = (a, b) => a + b
const total = numbers.reduce(add, 0)

```

Pero no solo eso, también tiene elemento neutro. ¿Recuerdas las propiedades de la composición?. Si compones una función con algo que no hace nada (función identity) obtienes una función equivalente.


```js
const identity = x => x // función que "no hace nada"
const plus = n => n + 1

const identityPlus = compose2(plus, identity)

plus(1) === identityPlus(1)

```

Entonces encontramos una analogía entre la función add y la función compose2. Entre el elemento neutro de la suma que es cero y la función identity.

```js
const fns =[plus, double, pow2]
const identity = x => x
const f = fns.reduce(compose2, identity)

f(2) // 9
```

¡Eureka! ¡La composición es un monoide!

No nos detendremos en que son los monides pero este spoiler es importante para futuras entradas, recuerda que simpre puedes ver una definición en nuestro glosario.

Entonces podemos definir compose de la siguiente forma:

```js
const identity = x => x
const compose = (...fns) => fns.reduce(compose2, identity)
```

Ahora que tenemos una bonita función compose podemos empezar observar los beneficios de la asociatividad para el refactor:

```js
const plus = n => n + 1
const double = n => n * 2
const pow2 = n => n * n

const f = compose(
    plus,
    compose(double, pow2)
)

const g = compose(
    compose(plus, double) 
    pow2
)

f(2) === g(2)

```

Como puedes observar ambas funciones (f y g) son equivalentes independientemente de cómo se compongan. Esto quiere decir que podemos identificar fácilmente patrones repetitivos en las funciones, sacarlos fuera y reutilizarlos. También que si es necesario añadir modificaciones en la función compuesta basta con añadir la nueva función a la cadena de composición.

Podemos identificar fácilmente que el patrón de (double y pow2) se repite y por lo tanto componer en otra función y reutilizar.

```js

const f = compose(
    multiplyBy20,
    plus, 
    double, // El patrón de (double y pow2) se repite 
    pow2 
)

const g = compose(
    plus, 
    double, // El patrón de (double y pow2) se repite 
    pow2
)

const program = compose(f, g)

program(10)

```

Una vez identificado el patrón podemos reutilizar.

```js
const doublePow2 = compose(double, pow2) // identificamos y reutilizamos

const f = compose(
    multiplyBy20,
    plus, 
    doublePow2 // se reutiliza
)

const g = compose(
    plus, 
    doublePow2 // se reutiliza
)

const program = compose(f, g)

program(10)

```

Gracias a la composición tenemos espacios acotados para añadir modificaciones a nuestro programa.


```js
const doublePow2 = compose(double, pow2)

const f = compose(
    multiplyBy20,
    plus, 
    doublePow2
)

const g = compose(
    plus, 
    doublePow2
)

const getNumber = (obj) => obj.number

const program = compose(f, g, getNumber) 


program({number: 10}) // en lugar de un número nos pasan un objecto. Simplemente añadimos la función que obtiene el número getNumber y el resto de nuestro programa permanece igual.

```

## La función compose se se aplica en orden inverso, nos gustaría poder escribir en orden que leemos.

Si regresamos a la definición de compose podemos solucionar este problema fácilmente implementando una nueva versión de compose (la que llamaremos pipe) sin hacer el reverse en la versión imperativa o utilizando reduceRight en la versión más funcional. 

```js
// Versión imperativa

const pipe = (...fns) => {
    return (...args) => {
        const [first, ...rest] = fns // no hacemos reverse ;)

        let result = first(...args)

        for(let f of rest ){
            result = f(result)
        }
        return result
    }
}
```

```js
// versión funcional
const identity = x => x
const compose = (...fns) => fns.reduceRight(compose2, identity)
```

La fórmula encontrada funciona pero tengo noticias para tí, ¡te estás repitiendo!.

¿Recuerdas? tenemos que alejarnos de los detalles y ver los problemas de forma estructural.

En esencia se puede decir que lo que queremos es utilizar la función compose pero pasar los argumentos en orden inverso.

Quizás podemos implementar una función que haga justamente eso.

```js
const flip = (f) => (...args) => f(...args.reverse())
```

```js
function flip(f) {
  return function flipped(...args){
    return f(...args.reverse())
  }
}
```

```js
const sayHello = (name, surname) => `Hello ${name} ${surname}!`
const reverseSayHellow = flip(sayHello)

sayHello('Maurice', 'Dominguez') // "Hello Maurice Domínguez!"
reverseSayHellow('Maurice', 'Dominguez') // "Hello Domínguez Maurice!"
```

Ya podemos definir nuestra función pipe

```js 
const pipe = flip(compose)
```

```js
const f = pipe(
  plus, // paso 1: plus(1) -> 2
  double, // paso 2: double(2) -> 4
  pow2 // paso 3: pow2(4) -> 16
)

f(2) // 16

```

Hemos creado una nueva utilidad para nuestra librería funcional (flip) y hemos evitado repetir código innecesariamente de forma que al añadir optimizaciones a compose esta se propaga automáticamente a pipe.

Esta estrategia también beneficia al testing, no es necesario testear pipe porque al garantizar que compose y flip funcionan tenemos garantías de que pipe también.

NOTA: Hemos descubierto un nuevo tipo de funciones, flip es un combinador. No entraré en detalle de lo que es un combinador porque lo abordaremos en próximas entradas. Recuerda que puedes consultar nuestro glosario de términos para obtener más información.

## En el mundo real no todas las funciones son de un argumento ¿cómo componemos funciones de más de un argumento?

Para solucionar este inconveniente nos hace falta una herramienta fundamental que cubriré en la próxima entrega (autocurrificación de funciones) pero de momento solo podemos usar funciones intermedias.

En el siguiente ejemplo se intenta obtener la media de las edades de todos los usuarios.

Todas las funciones que tenemos que componer tienen más de un argumento  (prop, map, reduce, add y divide).

```js
const users = [
    { age: 53, name: 'Olimpia'}, 
    { age: 5, name: 'Isabella'},
    { age: 25, name: 'Rox'}
  ]
  
  const numUsers = users.length
  
  // todas las funciones que queremos componer contienen más de un argumento
  const map = (f, xs) => xs.map(f)
  const reduce = (f, initial, xs) => xs.reduce(f, initial)
  const prop = (key, obj) => obj[key]
  const add = (a,b) => a + b
  const divide = (a, b) => a / b


// para poder componer usamos funciones intermedias para poder pasar los valores
const getAgeAverage = pipe(
    (users) => map((user) => prop('age', user), users),
    (ages) => reduce(add, 0, ages),
    (totalAges) => divide(totalAges, numUsers)
)

getAgeAverage(users) // 27.66

```

NOTA: Si  observas detenidamente la firma de las funciones no es muy común, primero pasamos las funciones y dejamos el dato al final. Este estilo de declarar funciones no es casual y cumple un propósito que trataremos en la siguiente entrada. 

## Componiendo con contextos

Es cierto que la composición es muy  útil pero en el mundo real no basta con componer. Si eres observador te puedes haber dado cuenta de que la composición que hemos practicado está totalmente en un contexto síncrono. 

Lo normal en una aplicación real es que los datos se obtienen de llamadas asíncronas (bases de datos, APIs, etc).

Como ejemplo intentaremos determinar si un usuario es adulto obteniendo el usuario de forma asíncrona

```js

const getUser = (id) => Promise.resolve({ id, name: 'Maurice', age: 30})
const getAge = user => user.age
const isAdult = age => age >= 18

getUser(1).then(getAge).then(isAdult) // Promise true

```

¡Funciona! como puedes darte cuenta la utilidad del .then de la promesa es componer en un contexto asíncrono.

¿Qué pasaría si intentamos componer usando una función de composición?

```js
const userIsAdultAsync = pipe(
  getUser, // paso 1: getUser(1) -> Promise user
  getAge, // paso 2: getAge(Promise user) --> Error porque getAge espera recibir un objeto 
  isAdult
)

userIsAdultAsync(1) // Error! TypeError: userIsAdultAsync(...).then is not a function

```
Ya que componer en contextos asíncronos rompe con las entradas que esperan recibir las funciones en la cadena de composición del pipe necesitamos implementar una función para componer funciones que retornan promesas (le llamaremos pipeP "P" por promesa).

Similar a la implementación de compose2 implementaré pipe2P para luego implementar pipeP usando nuestro "truquito monoidal" y composeP usando nuestro combinador flip.
 
```js
const pipe2P = (f, g) => (...args) => f(...args).then(g) 
const identityP = x => Promise.resolve(x)
const pipeP = (...fns) => fns.reduce(pipe2P, identityP)
const composeP = flip(pipeP)
```

Ahora podemos utilizar la composición de la forma que hemos aprendido y obtener todas las ventajas de la asociatividad. 

También nos brinda la oportunidad de cambiar la implementación de una composición síncrona a asíncrona simplemente cambiando el pipe por pipeP ¡más ventajas para el refactor!.

```js
const userIsAdultAsync = pipeP(
  getUser, // paso 1: getUser(1) -> Promise user
  getAge, // paso 2: saca user de la promesa y se lo pasa a getAge(user) -> Promise Number
  isAdult // paso 3: saca la edad de la promesa y se lo pasa a isAdult -> Promise Boolean
)

userIsAdultAsync(1) // Promise True

```

NOTA: Aunque componer con funciones que retornan promesas nos brinda muchas ventajas para el mundo real no es la mejor forma de manejar flujos asíncronos, en próximas entradas veremos formas más interesantes cuando hablemos de tipos de datos algebraicos.

## Retomando el ejemplo

Si recuerdas [el ejemplo de al entrada anterior](https://medium.com/@maurice.ronet.dominguez/1-entonces-qu%C3%A9-es-la-programaci%C3%B3n-funcional-721766b904db) ahora todo debería ser más familiar.

```js
const { groupBy, prop, map, pipe, sortWith, ascend, assoc, flatten, __ } = require('ramda')

const program = pipe(
    map((post) => map(assoc('tag', __, post), post.tags)), 
    flatten,
    groupBy(prop('tag')),
    map(
        sortWith([
            ascend(prop('title')),
            ascend(prop('likes'))
        ])
    )
)

api.getPosts().then(program).then(console.log)

```

Lo que nos interesa aquí es lo que sucede dentro del pipe. Queda claro que lo que estamos haciendo es componer

```js
const program = pipe(...) // componemos!
```

Vamos a hacer un pequeño refractor a nuestra función para que pueda componer en con funciones que retornan de promesas. Como puedes ver el cambio es trivial y casi no tenemos que cambiar nada en nuestro programa. 


```js
const { groupBy, prop, map, pipeP, sortWith, ascend, assoc, flatten, __ } = require('ramda')

const program = pipeP(
    api.getPosts, // <--- usamos pipP para componer funciones que retornan promesas
    map((post) => map(assoc('tag', __, post), post.tags)), 
    flatten,
    groupBy(prop('tag')),
    map(
        sortWith([
            ascend(prop('title')),
            ascend(prop('likes'))
        ])
    )
)

program().then(console.log)

```

## conclusiones

* La composición es el pegamento de las funciones puras para crear programas.
* La asociatividad de la composición nos brinda varas ventajas para identificar patrones y reutilizar funciones.
* La composición es un monoide.

Para afinzar lo aprendido pudes:

* Realizar los ejercicios sobre composición en [codepen](https://codepen.io/madoos/pen/oNgqmxx) 
* Dar un vistazo a la lista de "palabros" aprendidas en el día de hoy en nuestro [bonito glosario]((https://github.com/madoos/functionalJS-learning-path/blob/master/JARGON.md#Funciones-como-ciudadanos-de-primer-orden))
* Intenta implementar tus propias funciones de composición 
* Dar un vistazo a las funciones implementadas en [nuestra librería](https://github.com/madoos/functionalJS-learning-path/blob/master/src/index.js) 

En la próxima entrada explicaré que es el curry y los beneficios de las funciones autocurrificadas para este paradigma.

Cuidate mucho!

Nos Leemos!