## Entonces... ¿Qué es la programación funcional?

Hola lector anónimo!

Empieza el año y con él este proyecto para difundir la programación funcional en Javascript.

En esta primera entrada determinaremos nuestro “flow” para esta serie de posts,
el alcance de los contenidos, responderemos ¿por qué te debería  interesar la programación funcional? ¿por qué programación funcional en Javascript? ¿cuál es la promesa de este paradigma? y definiremos de “forma filosófica” y desenfadada que es la programación funcional.


## ¿Cuál será nuestro flow?
* Vamos a crear un glosario de términos en donde definiremos los "palabros" utilizados
* Según avancemos en los conceptos iremos implementando nuestra propia librería de utilidades funcionales la cual utilizaremos a lo largo de todas las publicaciones.
* Cada publicación tendrá asociado su propio codepen para trabajar con ejercicios para reforzar el contenido.
* Al final de cada post te dejaré aburridos papers para que profundices de forma teórica práctica.

## ¿Cuál Será el alcance de esta serie ?

Iremos de forma incremental de los más elemental a lo más avanzado.  Desde funciones puras, composición, currificación hasta la parte más dura cubriendo tipos de datos algebraicos (monoides, functors, monadas) todo ello con ejemplos prácticos hasta ser capaces de construir una  aplicación totalmente funcional.

**Vamos con las preguntas!**

## ¿Por qué te debería  interesar la programación funcional?

* Permite componer programas de forma consistente.
* Evita inconsistencias con el manejo del estado.
* Separa de forma notoria las partes fiables de mi aplicación.


**Permite componer programas de forma consistente**

Por limitaciones humanas es imposible abordar un programa sin descomponerlo en pequeñas piezas. Una vez descompuesto juntamos todas esas piezas para solucionar un problema. Podemos decir que programa es componer. La programación funcional se fundamenta en la teoría de categorías la cual es la teoría de la composición. Nos brinda poderosas herramienta para componentes programas de forma consistente.

**Evita inconsistencias con el manejo del estado**

La complejidad de una aplicación está directamente relacionada con la gestión de su estado. Mientras otros paradigmas como la POO aborda este reto encapsulando el estado en pequeñas unidades llamadas objetos la programación funcional en este aspecto es radical. Lo elimina por completo. (Muerto el perro se acabó la rabia ;)).
 

**Separa de forma notoria las partes fiables de mi aplicación** 

Nos da herramientas para mantener separados los E/S, conexiones a API, etc de la parte lógica de nuestro programas lo cual nos permite testear y modificar las aplicaciones de maneras más sencillas.

## ¿Por qué programación funcional en Javascript?

Hoy en dia javascript es un lenguaje casi omnipresente y multiparadigma. Gracias a las funciones como ciudadanos de primer orden y las closures podemos implementar patrones funcionales de forma muy orgánica. Javascript es un gran candidato para implementar este paradigma!

## ¿Cúal es la promesa de este paradigma?

* Mejorará tu capacidad de abstracción
* Te convertirá en un programador más eficiente 
* Te permitirá construir programas más recientes, desacoplados y escalables.

## Entonces… ¿Qué es la programación funcional?

Según la wikipedia, la programación funcional es un paradigma de programación declarativa basado en el uso de funciones matemáticas, en contraste con la programación imperativa, que enfatiza los cambios de estado mediante la mutación de variables.1​ La programación funcional tiene sus raíces en el cálculo lambda, un sistema formal desarrollado en los años 1930 para investigar la definición de función, la aplicación de las funciones y la recursión. 

Después de todo ese bla bla bla podemos sacar que la programación funcional es un paradigma. Es decir un modelo que tiene sus propias reglas las cuales sigue como un dogma por los beneficio que aporta.

**Reglas del paradigma:**

* Las funciones son ciudadanos de primer orden
* Las funciones tienen que ser puras
* No se permiten los efectos secundarios
* No se permite la mutacion

Nota: cubriré estas reglas en mayor profundidas según avancemos pero daremos un pequeño vistazo de lo que quieren decir.


## Las funciones son ciudadanos de primer orden

Las funciones son un tipo de dato más, es decir pueden pasarse como parámetro o ser retornadas. En JS estamos muy acostumbrado a pasar funciones como argumentos.

Los beneficios de poder pasar funciones como parámetro son muchos. Nos permite inyectar a funciones generales sólo los aspectos que nos interesa modificar y hacer modificaciones a funciones existentes sin tener que repetir el código.

Aquí algunos ejemplos de funciones como ciudadanos de primer orden:

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

## Las funciones tienen que ser puras:

Una función es pura si el valor de retorno es determinado solamente por sus valores de entrada y no produce efectos secundarios. 

Las funciones siempre tiene que retornar y para las mismas entradas siempre deberá retornar la misma salida.

Los beneficios de tener funciones puras son muchos, dentro de ellos tenemos funciones altamente fiables y altamente testeables.

¡Imagina la consistencia de nuestro programa si se compone totalmente de funciones puras!.

Aquí algunos ejemplos de funciones puras:

```js
 
const add = (a, b) => a + b
const sayHello = (name) => `Hello ${name}`
 
add(1, 1) // 2
sayHello('Maurice') // Hello Maurice
```

Aquí algunos ejemplos de funciones impuras:

```js
Math.random() // 0.7605501814717155
Date.now() // 1577913161557
```
## No se permiten los efectos secundarios

Se dice que una función o expresión tiene un efecto secundario si aparte de retornar un valor, interactúa con el estado mutable externo (lee o escribe).

Aquí algunos ejemplos de efectos secundarios:

```js
 
const sum = (a, b) => {
   const result = a + b
   console.log('result:', result) // <-- efectos secundarios
   return result
}
 
```
 
```js
 
const sum = (a, b) => {
   const result = a + b
   fs.writeFile('result.txt', result, someCallback) // <-- efectos secundarios
   return result
}
 
```
 
```js
 
const results = []
 
const sum = (a, b) => {
   const result = a + b
   results.push(result) // <-- efectos secundarios
   return result
}
 
```

En la práctica si queremos tener un programa útil es necesario mutar un estado, escribir en disco, mostrar un mensaje por pantall o conectarse a una base de datos. La programación funcional nos permite tener bien separadas estas partes (las partes impuras, de las puras).

## No se permite la mutación

Cada vez que tenga que modificar una estructura de datos será necesario crear una nueva copia y añadir las modificaciones de tal forma que la estructura original no sea afectada.

El beneficio de la inmutabilidad se traduce en seguridad, (al ser los objetos y arrays elementos que se pasan por referencia) de esta forma podemos evitar que por accidente se modifique sin darnos cuenta un elemento con el que estamos trabajando.

Aquí algunos ejemplos de mutación:

 
```js
 const user = {
   name: "Rox"
}
 
user.isActive = true // <-- mutación
 
```
 
```js
 
const sum = (numbers) => {
   let result = 0
 
   for(let i = 0; i <= numbers.length; i++ /* mutación */) {
       result = result + numbers[i] // <-- mutación
   }
 
   return result
}
 
```
 
```js
 
const pushNumber = (numbers, number) => {
   numbers.push(number) // <-- mutación
   return numbers
}
 
```
 
 
Aquí algunos ejemplos de inmutabilidad:

```js
const user = { name: "Rox"}
 
const activeUser = {
   ...user, // <-- copia el original y añade a un nuevo objeto
   isActive: true
}
 
```
 
```js
 
const sum = (numbers) => {
   return numbers.reduce((a, b) => a + b, 0) // <-- usa reduce pare evitar la mitación en un bucle
}
 
```
 
```js
 
const pushNumber = (numbers, number) => [...numbers, number] // <-- copia el original y añade a un nuevo array
 
```


## Ejemplo práctico

Después de dar un pequeño vistazo a "las reglas del juego" implementaremos un programa no muy útil para ponerlas en práctica.

Dado una lista de posts agrupar los post por tags y ordenar por título y links de forma ascendente.

Para la entrada: 

```js
[
            { 
                title: 'FP Javascript',
                likes: 25,
                tags: ['functional programing', 'javascript']
            },
            
            { 
                title: 'Functional Reactive programing',
                likes: 8,
                tags: ['functional programing']
            },
            { 
                title: 'Pure functions',
                likes: 30,
                tags: ['functional programing', 'javascript']
            },
            { 
                title: 'The power of Functors',
                likes: 100,
                tags: ['functional programing', 'adt']
            },
            { 
                title: 'Monoids are awesome',
                likes: 30,
                tags: ['functional programing', 'adt']
            },
            { 
                title: 'Monads are awesome',
                likes: 31,
                tags: ['functional programing', 'adt']
            }
        ]
```

tenemos que obtener la salida:

```js
{
  "functional programing": [
    {
      "title": "FP Javascript",
      "likes": 25,
      "tags": [
        "functional programing",
        "javascript"
      ],
      "tag": "functional programing"
    },
    {
      "title": "Functional Reactive programing",
      "likes": 8,
      "tags": [
        "functional programing"
      ],
      "tag": "functional programing"
    },
    {
      "title": "Monads are awesome",
      "likes": 31,
      "tags": [
        "functional programing",
        "adt"
      ],
      "tag": "functional programing"
    },
    {
      "title": "Monoids are awesome",
      "likes": 30,
      "tags": [
        "functional programing",
        "adt"
      ],
      "tag": "functional programing"
    },
    {
      "title": "Pure functions",
      "likes": 30,
      "tags": [
        "functional programing",
        "javascript"
      ],
      "tag": "functional programing"
    },
    {
      "title": "The power of Functors",
      "likes": 100,
      "tags": [
        "functional programing",
        "adt"
      ],
      "tag": "functional programing"
    }
  ],
  "javascript": [
    {
      "title": "FP Javascript",
      "likes": 25,
      "tags": [
        "functional programing",
        "javascript"
      ],
      "tag": "javascript"
    },
    {
      "title": "Pure functions",
      "likes": 30,
      "tags": [
        "functional programing",
        "javascript"
      ],
      "tag": "javascript"
    }
  ],
  "adt": [
    {
      "title": "Monads are awesome",
      "likes": 31,
      "tags": [
        "functional programing",
        "adt"
      ],
      "tag": "adt"
    },
    {
      "title": "Monoids are awesome",
      "likes": 30,
      "tags": [
        "functional programing",
        "adt"
      ],
      "tag": "adt"
    },
    {
      "title": "The power of Functors",
      "likes": 100,
      "tags": [
        "functional programing",
        "adt"
      ],
      "tag": "adt"
    }
  ]
}
```

**Enfoque imperativo**

```js
const program = posts => {
    const postsByTag = [] // <-- contiene estado compartido
    const gropedByTag = {}  // <-- contiene estado compartido

    // hacemos el producto carteciano de los post por cada tags 
    for(let post of posts){
        for(let tag of post.tags){
            postsByTag.push( //  <-- muta el estado
                Object.assign({}, post, {tag})
            )
        }
    }

    // agrupamos por tag
    for(let post of postsByTag){
        gropedByTag[post.tag] = gropedByTag[post.tag] || [] //  muta el estado
        gropedByTag[post.tag].push(post) // <-- muta el estado
    }

    // por cada propiedad en el objecto ordena de forma acendente por title y likes
    for(let [key, posts] of Object.entries(gropedByTag)){
        gropedByTag[key] = posts.sort(function compareByTitleAndLikesAscend (x, y) { // <-- muta el estado
            if(x.title < y.title) return -1 
            else if(x.title > y.title ) return 1
            else return  x["likes"] - y["likes"]; 
        })
    }

    return gropedByTag
}

api.getPosts().then(program).then(console.log)
```

Los puntos a destacar : 

* Se tiene que dar saltos en la lectura porque usa variables mutables
* Existe un estado compartido
* Mezcla la parte pura de la parte impura
* Al tener todo mezclado es más difícil razonar o modificar su funcionamiento.

**Enfoque funcional usando librería:**

No importa mucho si no entiendes el ejemplo funcional, esto solo es un ejemplo sobre el cual iremos explorando los conceptos.

```js
const { groupBy, prop, map, pipe, sortWith, ascend, assoc, flatten, __ } = require('ramda')

const program = pipe(
    map((post) => map(assoc('tag', __, post), post.tags)), // hacemos el producto carteciano de los post por cada tags 
    flatten, // aplanamos la estrcutura para tener un array de una dimención 
    groupBy(prop('tag')), // agrupamos por tag
    map( // por cada propiedad en el objecto ordena de forma acendente por title y likes
        sortWith([
            ascend(prop('title')),
            ascend(prop('likes'))
        ])
    )
)

api.getPosts().then(program).then(console.log)
```

Los puntos a destacar : 

* Se lee de arriba a abajo
* No existe un estado compartido
* Está totalmente separado la parte pura de la parte impura
* Gracias a que el programa se componen de pequeñas funcions es muy fácil razonar o modificar su funcionamiento.

NOTA: Este es un pequeño ejemplo que nos permitirá ir explorando conceptos. Por favor ten en cuenta que no veremos los reales beneficios de la programación funcional hasta que avancemos un poco más 


## conclusiones

Ha sido un largo camino y por hoy ya tienes muchos conceptos que interiorizar.

Para afinzar lo aprendido pudes:

* Darle un vistazo al paper [Why
Functional Programming
Matters](https://www.cs.kent.ac.uk/people/staff/dat/miranda/whyfp90.pdf)
* Puedes ver la solucions funcional del ejercico sin librerías en [codepen](https://codepen.io/madoos/pen/WNbZLoL) 
* Dar un vistazo a la lista de "palabros" aprendidas en el día de hoy en nuestro [bonito glosario]((https://github.com/madoos/functionalJS-learning-path/blob/master/JARGON.md#Funciones-como-ciudadanos-de-primer-orden))
* Intenta implementar tu propia solición utilizando las "reglas del juego" que propone este paradigma.

En la próxima entrada explicaré la composición implementada desde la perspectiva funcional, empezaremos a desarrollar nuestra librería de utilidades usando todo lo aprendido (usando como pretexto el ejercicio de este capítulo).

Cuidate mucho!

Nos Leemos!
