import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
    id: ID!
    title: String
    author: Author
}

type Author {
    id: ID!
    name: String! # ! can't return null
    books: [Book] # This list can't be null AND its list *items* can't be null
}
# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
    book(id: ID!): Book
    books(authorId: ID): [Book]
    author(id: ID!): Author
    authors: [Author]
}
`;

const books = [
    {
        id: 1,
        title: 'The Awakening',
        author: 1,
    },
    {
        id: 2,
        title: 'City of Glass',
        author: 2,
    },
];

const authors = [
    {
        id: 1,
        name: 'Kate Chopin',
        books: [1],
    },
    {
        id: 2,
        name: 'Paul Auster',
        books: [2],
    },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: (parent, args, contextValue, info) => {
            if (args.authorId) {
                return books.filter(book => book.author == args.authorId)}
            return books
        },
        book: (parent, args, contextValue, info) => {
            return books.find(book => book.id == args.id)
        },
        authors: () => authors,
        author: (parent, args, contextValue, info) => {
            return authors.find(author => author.id == args.id)
        },
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);