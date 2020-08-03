const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLID,
} = require('graphql');

const knex = require('./database');

const bcrypt = require('bcrypt');

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), unique: true },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    pay_service: { type: new GraphQLNonNull(GraphQLString) },
    mobile: { type: new GraphQLNonNull(GraphQLInt) },
    service_name: { type: new GraphQLNonNull(GraphQLString) },
    adress: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const CartType = new GraphQLObjectType({
  name: 'cart',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), unique: true },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    productID: { type: new GraphQLNonNull(GraphQLID) },
    sold: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});

const ProductType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), unique: true },
    name: { type: new GraphQLNonNull(GraphQLString) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const CommentType = new GraphQLObjectType({
  name: 'comment',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), unique: true },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    postID: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID), unique: true },
    userID: { type: new GraphQLNonNull(GraphQLID) },
    likes: { type: new GraphQLNonNull(GraphQLInt) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    image: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('User').select().where({ id: args.id });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(root, args) {
        return await knex('User').select();
      },
    },
    cart: {
      type: CartType,
      args: {
        // what we need as an arguments
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('Cart').select().where({ userID: args.userID });
      },
    },
    product: {
      type: ProductType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('Product').select().where({ userID: args.userID });
      },
    },
    comment: {
      type: CommentType,
      args: {
        postID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('Comment').select().where({ postID: args.postID });
      },
    },
    post: {
      type: PostType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('Post').select().where({ userID: args.userID });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        mobile: { type: new GraphQLNonNull(GraphQLInt) },
        adress: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {}, // add User with crpted password to database
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
