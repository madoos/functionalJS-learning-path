
# #3. Currificación


¡Hola querido lector! estoy muy emocionado por esta tercera entrega que** nos permitirá tener las herramientas básicas para abordar desarrollos de forma funcional**. ¡Espero que estés disfrutando!.

En la [entrada anterior sobre composición funcional](https://medium.com/@maurice.ronet.dominguez/2-composici%C3%B3n-funcional-aa047adfdb2f) llegamos a la conclusión de que **solo se** **puede componer con funciones de un argumento**. En la practica no siempre es posible tener funciones con esas características. En esta entrada cubriremos como la currificación nos permite seguir componiendo.

En esta entrada:

1. Definiré que es la currificación.

3. Implementaré para nuestra librería de utilidades funcional nuestra propia función de currificación (curry y curryN).

2. Estudiaré el uso práctico de la currificación y como usarla de forma consistente .

5. Exploraremos la importancia de el orden en el que se declaran los argumentos en una función currificada.

## ¿Qué es la currificación?

[Según la Wikipedia:](https://es.wikipedia.org/wiki/Currificaci%C3%B3n) en la [ciencia de la computación](https://es.wikipedia.org/wiki/Ciencia_de_la_computaci%C3%B3n), **currificar** es la técnica inventada por [Moses Schönfinkel](https://es.wikipedia.org/w/index.php?title=Moses_Sch%C3%B6nfinkel&action=edit&redlink=1) y [Gottlob Frege](https://es.wikipedia.org/wiki/Gottlob_Frege) que consiste en transformar una [función](https://es.wikipedia.org/wiki/Funci%C3%B3n_(programaci%C3%B3n)) que utiliza múltiples [argumentos](https://es.wikipedia.org/wiki/Argumento_(inform%C3%A1tica)) en una secuencia de [funciones](https://es.wikipedia.org/wiki/Funci%C3%B3n_(programaci%C3%B3n)) que utilizan un único argumento. (Eso es la operación inversa a la composición de funciones en matemáticas).

<iframe src="https://medium.com/media/e49f488c8a754758e8ab6a0e2aeb9c34" frameborder=0></iframe>
> Yo tambien he puesto esa cara la primera vez que he escuchado su definición [😱](https://emojipedia.org/face-screaming-in-fear/).

Según la definición anterior podemos concluir que si tengo una función add de dos argumentos:

    const add = (n1, n2) => n1 + n2

Una vez aplicada la currificación obtengo una función de un argumento que retorna otra función de un argumento que retorna el resultado:

    // con arrow functions:

    const add = (n1) => (n2) => n1 + n2

    // con function:

    function add (n1) {
      return function addN2 (n2) { 
        return n1 + n2
      }
    }

Pero si lo único que quiero de una función es poder ejecutarla para obtener su resultado 😐¿qué beneficio me puede aportar esta técnica?.

Si tomamos la función plus como ejemplo podemos observar que es la aplicación parcial de otra función más genérica add.

    const plus = (n) => n1 **+** 1

    plus(1) // => 2

Es decir que en el fondo plus se deriva de add.

    **const add = (n1, n2) => n1 + n2**

    const plus = (n) => **add(1, n)**

    plus(1) // => 2

Si nuestra función add estuviese currificada podríamos obtener “gratis” la función plus sin necesidad de declarar una función intermedia.

    const add = (n1) => **(n2) => n1 + n2**

    const plus = add(1) //plus es equivalente a **(n2) => 1 + n2**
    plus(1) // 2

Como puedes observar es un patrón muy comun tener funciones genéricas de varios argumentos e ir pasando los argumentos a otras funciones para crear funciones más específicas. Para ilustrar vamos a hacer algunos ejemplos.

### **Ejemplo de currificación #1**

Si tengo la función **prop** aplicando parcialmente el primer argumento puedo obtener funciones getters.

    const prop = (key, obj) => obj[key]

    const getName = (user) => prop(**'name'**, user)

    getName({ name: "Rox" }) // Rox

Si **prop** estuviese currificada podría obtener getName sin necesidad de una “función intermedia”.

    **const prop = (key) => (obj) => obj[key]** // currificada

    const getName = prop('name') // no usa función intermedia

    getName({ name: "Rox" }) // Rox

Como prop está currificada al ejecutarla con el primer argumento (‘name’) retorna una nueva función que espera recibir el objeto que al ejecutarse retornará la propiedad name del objeto que se le pase.

    const prop = (key) =>** (obj) => obj[key]**

    const getName = **prop('name')
    **// prop('name') es equivalente a (obj) => obj['name']

    getName({ name: "Rox" }) // Rox

Este comportamiento puede ser muy útil para **generar funciones “al vuelo”** por ejemplo:

    **const prop = (key) => (obj) => obj[key]**

    const users = [{name: 'Maurice', 'age': 29}, {name:'Rox', age: 24}]

    const ages = users.map(**prop('age')**) // [29, 24]
    const names = users.map(**prop('name')**) // ['Maurice', 'Rox']

Se genera dinámicamente la función** prop(‘age’)** que es equivalente a:

    // prop('age') es equivalente a **(obj) => obj['age']**

    const users = [{name: 'Maurice', 'age': 29}, {name:'Rox', age: 24}]

    users.map(**(obj) => obj['age']**) === users.map(**prop('age')**)

Se genera dinámicamente la función **prop(‘name’)** que es equivalente a:

    // prop('name') es equivalente a **(obj) => obj['name']**

    const users = [{name: 'Maurice', 'age': 29}, {name:'Rox', age: 24}]

    users.map(**(obj) => obj['name']**) === users.map(**prop('name')**)

También este comportamiento es** muy valioso para componer:**
> NOTA: puedes ir a la[ entrada anterior](https://medium.com/@maurice.ronet.dominguez/2-composici%C3%B3n-funcional-aa047adfdb2f) para repasar la composición funcional (función pipe).

    **const prop = (key) => (obj) => obj[key]**

    const getZipcode = pipe(**prop('address')**, **prop('zipcode')**)

    const user = {
      "id": 1,
      "name": "Leanne Graham",
      "address": {
        "street": "Kulas Light",
        **"zipcode": "92998-3874",**
      }
    }

    getZipcode(user) // "92998-3874"

### Ejemplo currificación #2

Hemos observado que las funciones currificada son muy útiles para generar funciones “al vuelo” pero esto se vuelve realmente interesante cuando comenzamos a pasar funciones como argumentos (HOF).

Si tenemos la función **map** y la función **prop** podemos generar “gratis” funciones para arrays.

Primero vamos a explorar el ejemplo sin currificar:

    **const prop = (key, obj) => obj[key]
    const map = (f, array) => array.map(f)
    **

    const users = [{name: 'Maurice', 'age': 29}, {name:'Rox', age: 24}]

    const getAges = (users) => **map(user => prop('age', user), users)**

    getAges(users) // [29, 24]

Si nuestras funciones estuviesen currificada:

    **const prop = (key) => (obj) => obj[key]
    const map = (f) => (array) => array.map(f)**

    const users = [{name: 'Maurice', 'age': 29}, {name:'Rox', age: 24}]

    const getAges = **map(get('age'))**

    getAges(users) // [29, 24]

    **/*
    get('age')** equivale a (user) => prop('age', user)

    **map(get('age'))** equivale a 
    (users) => map((user) => prop('age', user), users)
    */

Como te has dado cuenta este enfoque es muy útil porque prácticamente si tenemos cualquier función getter para un usuario casi sin ningún esfuerzo podemos obtener una función getters para una lista de usuarios [😍](https://emojipedia.org/smiling-face-with-heart-shaped-eyes/).

    **const prop = (key) => (obj) => obj[key]
    const map = (f) => (array) => array.map(f)**

    const getAge = **prop('age')
    **const getName = **prop('name')
    **const getId = **prop('id')**

    // Podemos obtener "gratis" funciones para listas de usuarios

    const getAges = **map(getAge)**
    const getNames = **map(getName)**
    const getIds = **map(getIds)**

***Lo que nos permite la currificación es obtener “al vuelo” funciones parcialmente aplicadas de un argumento para poder pasarlas como argumentos o componer otras funciones.***

Si eres observador probablemente has notado que esta forma de currificar tiene algunos defectos:

1. No podemos ejecutar de forma normal nuestras funciones.

1. No siempre queremos hacer la aplicación parcial de los argumentos de uno en uno, en la practica nos gustaría poder aplicar parcialmente n argumentos.

1. Estamos obligados a pasar los argumentos siempre por izquierda, en la practica en muchas ocaciones necesitamos hacer la aplicación parcial de los argumentos a al derecha o en otro orden.

1. ¿Qué pasa con las funciones que pueden recibir cualquier número de argumentos?

### **1. No podemos ejecutar de forma normal nuestras funciones.**

    **const add = (n1) => n2 => n1 + n2**

    // tenemos una función que espera n2 para ejecutarse
    add(1, 2) // [function] 

    // por su declaración siempre tenemos que usarla:
    add(1)(2) // 3

### 2. No siempre queremos hacer la aplicación parcial de los argumentos de uno en uno, en la practica nos gustaría poder aplicar parcialmente n argumentos.

Sin currificar:

    **const assoc = (key, value, src) => ({...src, [key]: value})**

    assoc('type', 'ADMIN', { name: 'Maurice'})
    // { name: 'Maurice', type: "ADMIN"}

En su versión currificada:

    **const assoc = (key) => (value) => (src) => ({...src, [key]: value})**

    assoc('type')('ADMIN')({ name: 'Maurice'})
    // { name: 'Maurice', type: "ADMIN"}

En ocaciones nos gustará poder usarla:

    const setTypeAdmin = **assoc('type', 'ADMIN')**

    setTypeAdmin({ name: 'Maurice'}) 
    // { name: 'Maurice', type: "ADMIN"}

En lugar de:

    const setTypeAdmin = **assoc('type')('ADMIN')**

    setTypeAdmin({ name: 'Maurice'}) 
    // { name: 'Maurice', type: "ADMIN"}

### 3. Estamos obligados a pasar los argumentos siempre por izquierda.

    const gte = (a) => (**b**) => a >= b

    [1,2,3].filter(gte(2)) // [1, 2] ¡Falla! porque necesitamos currificar el argumento **b **que está más a la izquierda. 

    [1,2,3].filter((n) => gte(n, 2)) // [2, 3] ¡Funciona!

### 4. ¿Qué pasa con las funciones que pueden recibir cualquier número de argumentos?

Aparentemente la currificación no es compatible con funciones [variádicas](https://en.wikipedia.org/wiki/Variadic_function).

    const sum = (...numbers) => numbers.reduce(add, 0)

Si después de todo este recorrido no estás 😴😴😴😴 ¡por fin llega el momento de implementar nuestro propia función de currificación! .

## Autocurrificación

Soñemos por un momento, imagina que Javascript nos regala como parte de su core funciones autocurrificadas.

De tal forma que si declaramos una función:

    const add = (n1, n2) => n1 + n

Fuese lo suficientemente inteligente como para decidir si la función tiene que ser currificada:

    const add = (n1, n2) => n1 + n

    add(1, 2) // Si me pasan todos los argumentos obtengo el resultado.

    add(1) // Si no me pasas todos los argumentos te retorno una función parcialmente aplicada: (n2) => 1 + n2

Volviendo a la cruel realidad sabemos que esto no es así, si llamamos a una función sin pasar algún argumento este tomará como valor undefined.

    const add = (n1, n2) => n1 + n2 // no currificada

    add(1) // NaN JS dice n1 es 1 y n2 es undefined, 1 + undefined = NaN

Pero no estamos perdidos del todo, aún hay esperanza. Redoble de tambores 🥁🥁🥁🥁🥁 .Entra en escena **curry**.
> NOTA: Como siempre vamos a hacer una implementación imperativa para luego hacerla más general.

Vamos a implementar nuestra función curry2 para una función de dos argumentos:

<iframe src="https://medium.com/media/9cf02a9ed4c28f459f0ceab485a641fe" frameborder=0></iframe>

Lo que curry2 nos dice:

1. Dame una función de dos argumentos y te retornaré una función currificada para 2 argumentos (linea 3 y 4).

2. Si a la función currificada le das todos los argumentos te retornará el resultado (linea 5 y 6).

3. Si a la función currificada le dás el primer argumento te retornará una función que espera recibir el segundo (linea 8 y 9).

4. Si a la función currificada no le dás argumentos te retorno la función currificada.

    const add = (n1, n2) => n1 + n2 // no currificada
    const curriedAdd = curry(add)

    add(1, 2) // **3**
    add(1) // **(a2) => add(a1, a2)**
    add(1)(2) // **3**
    add() // **(a1, a2) => add(a1, a2)**

Lo mejor de los 2 mundos, podemos ejecutar nuestras funciones de la forma en la que estamos acostumbrados y obtenemos los beneficios de la currificación.

En el campo de batalla normalmente currificamos las funciones a la vez que las declaramos:

    // Currificada en la declaración
    const add = **curry2((n1, n2) => n1 + n2)** 
    
    add(1, 2) // **3**
    add(1) // **(a2) => add(a1, a2)**
    add(1)(2) // **3**
    add() // **(a1, a2) => add(a1, a2)**

Aunque nuestra función curry2 funciona correctamente no es suficiente. En la práctica nos encontramos con funciones de hasta n argumentos. Sería muy interesante tener una función **curry** genérica para funciones de diferente número de argumentos.

Con la magia de la recursión es pan comido:

<iframe src="https://medium.com/media/6d22a56dee491b65c2bf5604ffb46da3" frameborder=0></iframe>

Lo que curry nos cuenta es:

1. Dame una función sin especificar el numero de argumentos que necesita y te retornaré esa función currificada (linea 1 y 2).

1. Si se pasan todos los argumentos a la función currificada te retornará el resultado (la propiedad length de una función nos dice cuantos argumentos tiene la función)(linea 3 y 4).

1. Si a la función currificada no se pasan todos los argumentos retorna otra función que espera recibir el resto, si no están completos repite el mismo procedimiento de forma recursiva (linea 5).

    const add3 = **curry((n1, n2, n3) => n1 + n2 + n3)** 
    
    add3(1, 2, 3) // **6**
    add3(**1**) // (a2, a3) => add3(**1**, a2, a3)
    add(**1**)(**2**) // (a3) => add3(**1, 2**, a3)
    add(1)(2)(3) // **6
    **add() // **(a1, a2, a3) => add(a1, a2, a3)**

Funciona correctamente. Ya podemos generar funciones currificada sin necesidad de especificar la [aridad](https://es.wikipedia.org/wiki/Aridad) de las funciones. Pero sigue teneindo algunos problemas. ¿Cómo currificamos funciones de argumentos variables?.

    const sum = **curry((...numbers) => numbers.reduce(add, 0))**

Si ejecutamos sum nunca se resolverá.

    const sum = curry((...numbers) => numbers.reduce(add, 0))
    sum(1, 2, 3, 4) // [function]
    sum(1)(2)(3)(4) // [function]

Al tener numero de argumentos variables sum no puede ser currificada porque no sabe cuando resolver, es decir cuantos argumentos necesita para ser ejecutada.

La única alternativa que tenemos es decirle [explícitamente](https://www.wordreference.com/sinonimos/expl%C3%ADcitamente) cuantos argumentos necesita.

Vamos a implementar una versión de curry que llamaremos curryN.

<iframe src="https://medium.com/media/b2049a61adb720213261ad6b7abd1d9c" frameborder=0></iframe>

Si observamos curryN podemos concluir que es similar a curry con la diferencia de que decimos explícitamente el numero de argumentos que necesita (primer argumento n) en lugar de obtenerlos del length de la función.

Entonces podemos derivar curry de curryN.

    const curry = (f) => curryN(f.length, f)

Con la implementación de curryN tenemos solucionado el problema de currificar funciones de argumentos variables.

Podemos usar curryN con sum de la siguiente manera:

    const sum = (...numbers) => numbers.reduce(add, 0)

    const sum4 = curryN(4, sum)
    const sum2 = curryN(2, sum)

    sum4(1)(2)(3)(4) // 10
    sum4(1, 2, 3, 4) // 10

    sum2(1)(2) // 3
    sum2(1, 2) // 3
> NOTA: En la práctica las librerías con enfoque funcional nunca declaran funciones con argumentos variables. En su lugar usan un array para que la función sea expresada como una función de un solo argumento. Puedes ve[r Ramda como ejemplo.](https://ramdajs.com/docs/#useWith)

    const sum = curry((numbers) => numbers.reduce(add, 0))

    sum([1, 2, 3, 4]) // 10
    sum() // curry((numbers) => numbers.reduce(add, 0))

    const someFunction = curry((arg1, multipleArgs) => ...)
    someFunction(1) // (multipleArgs) => 1 + ...multipleArgs

**Nuestra forma de currificar empieza a ser consistente:**

1. Podemos tener lo mejor de los dos mundos, ejecutar funciones de forma total (con todos los argumentos) o obtener una aplicación parcial (retorna una función que espera los argumentos que no se han pasado).

1. Nuestro curry se convierte en una aplicación parcial si es necesario (podemos pasar los argumentos de uno en uno o de n en n si es necesario).

1. Podemos currificar funciones de argumentos variables usando curryN, especificando cuantos argumentos queremos pasar para que se resuelva.

Podríamos darnos por satisfechos pero **aún estamos obligados a currificar siempre por la izquierda.** ¿Qué pasa si tengo el argumento de la derecha?.

    const prop = curry(**(key, obj) => obj[key]**)

    const maurice = {name: 'Maurice', age: 29}

    const getMauriceProp = (key) => prop(key, maurice)

    getMauriceProp('age') // 29
    getMauriceProp('name') // 'Maurice'

En nuestro ejemplo queremos obtener una función getMauriceProps en donde lo que tenemos es el valor de la derecha (el objeto).

Podríamos optar por cambiar la firma de la función, poniendo el orden de los argumento en orden inverso pero esto nos forzaría a tener 2 o más versiones de cada función. ¿Qué pasaría con funciones de 3, 4 y 5 argumentos? ¿Qué pasaría si el argumento que queremos aplicar parcialmente no está en los extremos?.

Si has estado siguiendo la serie podrías pensar en usar el combinador flip pero este solo te serviría para los argumentos de los extremos.

**Por suerte podemos solucionar todos estos inconvenientes utilizando algo que llamaremos “nuestro argumento especial” placeholder ( doble barra baja “__”).**

## Implementando currificación con un argumento especial (placeholder)

    const prop = curry(**(key, obj) => obj[key]**)

    const maurice = {name: 'Maurice', age: 29}

    const getMauriceProp = prop(**__**, maurice)

    getMauriceProp('age') // 29
    getMauriceProp('name') // 'Maurice'

Cuando pasamos como argumento el placeholder estamos declarando que prop nos retornará una función que espera el argumento pasado como placeholder. En este caso la propiedad del objeto. De esa forma podemos currificar la función por la derecha.

    prop(**__**, maurice) equivale a (key) => prop(key, maurice) 

    getMauriceProp('age') // 29

Este patrón no solo nos permite currificar por la derecha, también nos permite currificar según los argumentos que nos hagan falta sin depender del orden de ejecución.

    const assoc = curry(**(key, value, src) => ({...src, [key]: value })**)

    const maurice = {name: 'Maurice', age: 29}

    const assocTypeToMaurice = assoc('type', __, maurice)

    assocTypeToMaurice('ADMIN') 
    // {name: 'Maurice', age: 29, type: 'ADMIN'}

    assocTypeToMaurice('USER') 
    // {name: 'Maurice', age: 29, type: 'USER'}

    assoc('type', __, maurice) equivale a 
    (type) => assoc('type', type, maurice)

En este caso queremos aplicar una función parcialmente pasando los argumentos de los extremos (propiedad y objeto).

Podemos observar otro ejemplo interesante al filtrar números usando una función de comparación:

    const gte = curry(**(a, b) => a >= b**)
    const filter = curry(**(predicate, list) => list.filter(predicate)**)

    const filterGte2 = filter(**gte(__, 2)**)

    filterGte2([-1,0, 1, 2, 3, 4]) // [2,3,4]

Para que filter funcione correctamente es necesario comprar el numero actual (el que me dá filter ) con el número de la derecha en **gte(__, 2) **(el que se aplica parcialmente ).

Ahora que el comportamiento de “nuestro argumento especial” placeholder está claro vamos a dar soporte a nuestra implementación de curry.

<iframe src="https://medium.com/media/5b6691df016b38cc0e1858fbef8f3117" frameborder=0></iframe>

Ahora nuestra función curry tiene soporte para nuestro argumento especial “__”.

Con esta nueva modificación lo que nuestra implementación de curry nos dice es:

1. Dame una función sin especificar el numero de argumentos que necesita y te retornaré la esa función currificada (linea 11).

1. Si se pasan todos los argumentos** sin placeholders **a la función currificada te retornará el resultado(12 _hasAllArgs ).

1. Si a la función currificada no se pasan todos los argumentos retorna otra función que espera recibir el resto **y manejará los placeholders sustituyendo uno a uno cada placeholder por el argumento correspondiente (linea 12 **…_handlePlaceholders**).** Si no están completos los argumentos o **tiene placeholders** repite el mismo procedimiento de forma recursiva.

<iframe src="https://medium.com/media/33872bb2d9a19723b8b7003a5dd8d171" frameborder=0></iframe>

Ya casi llegamos al final de esta entrada pero aún falta un punto por aclarar. Quizás te has preguntado por la extraña forma en las firmas de las funciones.

No es casual y **todas las firmas de las funciones están diseñadas con la intención de ser currificadas.**

## El orden de los argumentos importa

<iframe src="https://medium.com/media/74354078103a966738e44abf99455f43" frameborder=0></iframe>

Si le das un vistazo a la declaración de la [función map en lodash](https://lodash.com/docs/4.17.15#map) puedes ver que el **primer argumento que se pasa es el array** y** el segundo es la función que será mapeada.**

Si damos otro vistazo a la [definición de la función map en ramda](https://ramdajs.com/docs/#map) podemos ver que **la firma se invierte. El primer argumento es la función que será mapeada, el segundo argumento es el “array” (functor).**

Como he mencionado no es casual y si lo piensas tiene más sentido cuando añades la currificación como herramienta.

Se puede pensar una función como una declaración de intenciones en donde lo último que tenemos es el dato. Una vez obtenido el dato se ejecuta.

Si por ejemplo currificamos la firma del map de lodash:

    const lodashMap = curry(**(array, f) => array.map(f)**)

    const getAges = (users) => lodashMap(prop('age'), users)

No podemos utilizar las posibilidades que el curry nos ofrece. Tendríamos que abusar constantemente de nuestro placeholder.

    const lodashMap = curry(**(array, f) => array.map(f)**)

    const getAges = lodashMap(prop('age'), __)

Al cambiar la firma de la función prop también podemos evidenciar este problema.

    const prop = curry(**(obj, key) => obj[key]**)

    const getAges = map((user) => prop(user, 'age'))

Nos vemos de nuevo obligados a abusar innecesariamente de nuestro placeholder.

    const prop = curry(**(obj, key) => obj[key]**)

    const getAges = map(prop(_, 'age'))

Queda claro. Las funciones son definiciones de intenciones. Cuando tenemos la potencia del curry lo interesante es pasar esos “sujetos” sobre los que queremos aplicar operaciones al final.

    const prop = curry(**(key, obj) => obj[key]**)

    const getAges = map(prop('age'))

## Retomando el ejemplo

Si recuerdas [el ejemplo de al entrada anterior](https://medium.com/@maurice.ronet.dominguez/1-entonces-qu%C3%A9-es-la-programaci%C3%B3n-funcional-721766b904db) ahora todo debería ser más familiar.

<iframe src="https://medium.com/media/58eb3d7c8eada2f39f360aaffffb3192" frameborder=0></iframe>

Lo que nos interesa aquí es lo que pasa en medio del pipe.

    const program = pipe(/* tiene funciones currificadas que se convierten en funciones de un argumento */)

Si tienes en cuenta la composición y la currificación descubrirás como ahora todo tiene sentido.

Como reto personal puedes probar a husmear en la [documentación de Ramda ](https://ramdajs.com/docs/)e intentar implementar tu propia solución. Si eres valiente quizás puedes hacer tu propia implementación de cada una de las funciones utilizadas (las implementaré después de la entrada sobre combindores).

## Conclusiones

<iframe src="https://medium.com/media/4dcc48a371a774d988168c82f9e8e6cc" frameborder=0></iframe>

1. La currificación nos permite obtener funciones al vuelo aplicando parcialmente un argumento, en la practica nos puede interesar aplicar parcialmente uno o n argumentos.

1. La currificación solo nos permite aplicar parcialmente argumentos por la izquierda, en lagunas ocaciones necesitamos generar funciones al vuelo desde argumentos por la derecha. El placeholder nos permite obtener aplicación parcial determinando en qué argumento.

1. El orden de los argumentos importa. Cuando tenemos el poder del curry es más útil y expresivo pasar los datos al final.

**Para afianzar lo aprendido puedes:**

1. Realizar los ejercicios sobre currificación en [codepen](https://codepen.io/madoos/pen/bGNjRqj)

2. Dar un vistazo a la lista de “palabros” aprendidas en el día de hoy en nuestro [bonito glosario](https://github.com/madoos/functionalJS-learning-path/blob/master/JARGON.md)

3. Intenta implementar tus propias funciones de currificación.

4. Dar un vistazo a las funciones implementadas en [nuestra librería](https://github.com/madoos/functionalJS-learning-path/blob/master/src/index.js)

**5.** Dar un vistazo a la [charla de DR Boolean** **Hey Underscore, You’re Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA)

¡Cuídate mucho 😘!

¡Nos leemos!

<iframe src="https://medium.com/media/e6334aad6fd87c79227a5a78c1fcc710" frameborder=0></iframe>
