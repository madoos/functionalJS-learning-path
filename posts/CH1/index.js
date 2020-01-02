


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




const program = posts => {
    const postsByTag = [] // contiene estado compartido
    const gropedByTag = {}  // contiene estado compartido

    for(let post of posts){
        for(let tag of post.tags){
            postsByTag.push( //  muta el estado
                Object.assign({}, post, {tag})
            )
        }
    }

    for(let post of postsByTag){
        gropedByTag[post.tag] = gropedByTag[post.tag] || [] //  muta el estado
        gropedByTag[post.tag].push(post) //  muta el estado
    }

    for(let [key, posts] of Object.entries(gropedByTag)){
        gropedByTag[key] = posts.sort(function compareByTitleAndLikesAscend (x, y) { // muta el estado
            if(x.title < y.title) return -1 
            else if(x.title > y.title ) return 1
            else return  x["likes"] - y["likes"]; 
        })
    }

    return gropedByTag
}

api.getPosts().then(program).then(console.log)