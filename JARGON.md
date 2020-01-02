# Glosario de la Programación Funcional.

* [Función Pura](#Función-Pura)
* [Efectos Secundarios](#Efectos-Secundarios)
* [Funciones como ciudadanos de primer orden](#Funciones-como-ciudadanos-de-primer-orden)

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

