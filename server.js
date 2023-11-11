const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLScalarType
} = require('graphql')
const app = express()

const posts = [
  { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
  { id: 2, title: 'Another Post', content: 'Content for another post by a different user.' },
  { id: 3, title: 'Yet Another Post', content: 'More content for a post by the first user.' },
  { id: 4, title: 'Random Thoughts', content: 'Thoughts on various topics.' },
  { id: 5, title: 'Exciting News', content: 'Exciting news to share with everyone.' },
];

const users = [
    { id: 1, username: 'john_doe', email: 'john@example.com' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com' },
    { id: 3, username: 'bob_jones', email: 'bob@example.com' },
    { id: 4, username: 'alice_wonder', email: 'alice@example.com' },
    { id: 5, username: 'charlie_brown', email: 'charlie@example.com' },
  ];
  

const UserType = new GraphQLObjectType ({
    name: 'User',
    description: 'This contains a users information',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt)},
        username: { type: GraphQLNonNull(GraphQLString)},
        email: { type: GraphQLNonNull(GraphQLString)},
        posts: {
            type: PostType,
            resolve: (user) => {
                return posts.find(post => post.id === user.id)
            }
        }
    })
})

const PostType = new GraphQLObjectType ({
    name: 'Post',
    description: 'This contains a post from a user',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt)},
        title: { type: GraphQLNonNull(GraphQLString)},
        content: { type: GraphQLNonNull(GraphQLString)},
        users: {
            type: new GraphQLList(UserType),
            resolve: (post) => {
                return users.filter(user => user.id === post.id)
            }
        }
    })
})



  const RootQueryType = new GraphQLObjectType ({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        user: {
            type: UserType,
            description: 'A single user',
            args: {
                id: { type: GraphQLInt}
            },
            resolve: (parent, args) => users.find(user => user.id === args.id)
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List of all users',
            resolve: () => users
        },
        post: {
            type: PostType,
            description: 'A single post',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => posts.find(post => post.id === args.id)
        },
        posts: {
            type: new GraphQLList(PostType),
            description: 'List of all posts',
            resolve: () => posts
        }
    })
  })

const RootMutationType = new GraphQLObjectType ({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            description: 'Add a user',
            args: {
                username: { type: GraphQLNonNull(GraphQLString)},
                email: { type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const user = { id: users.length + 1, username: args.username, email: args.email }
                users.push(user)
                return user
            }
        },
        addPost: {
            type: PostType,
            description: 'Add a post',
            args: {
                title: { type: GraphQLNonNull(GraphQLString)},
                content: { type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const post = { id: posts.length + 1, title: args.title, content: args.content }
                posts.push(post)
                return post
            }
        }
    })
})

  const schema = new GraphQLSchema ({
    query: RootQueryType,
    mutation: RootMutationType
  })

// const schema = new GraphQLSchema ({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: {
//                  type: GraphQLString,
//                  resolve: () => 'Hello World'
//                 }
//         })

//     })
// })

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(5000, () => console.log('Server Running'))