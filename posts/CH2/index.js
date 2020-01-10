


const api = {
  getPosts: () => {
      return Promise.resolve([
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
      ])
  }
}

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