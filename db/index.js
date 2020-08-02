const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql');
const knex = require('./database');

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt), unique: true },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    pay_service: { type: new GraphQLNonNull(GraphQLString) },
    mobile: { type: new GraphQLNonNull(GraphQLInt) },
    service_name: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    adress: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const CartType = new GraphQLObjectType({
  name: 'cart',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt), unique: true },
    userID: { type: new GraphQLNonNull(GraphQLInt) },
    productID: { type: new GraphQLNonNull(GraphQLInt) },
    sold: { type: new GraphQLNonNull(GraphQLBoolean) },
  }),
});

const ProductType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt), unique: true },
    name: { type: new GraphQLNonNull(GraphQLString) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
    userID: { type: new GraphQLNonNull(GraphQLInt) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
    quantity: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const CommentType = new GraphQLObjectType({
  name: 'comment',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt), unique: true },
    userID: { type: new GraphQLNonNull(GraphQLInt) },
    postID: { type: new GraphQLNonNull(GraphQLInt) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt), unique: true },
    userID: { type: new GraphQLNonNull(GraphQLInt) },
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
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(root, args) {
        return await knex('user').select().where({ id: args.id });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(root, args) {
        return await knex('user').select();
      },
    },
    cart: {
      type: CartType,
      args: {
        // what we need as an arguments
        userID: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(root, args) {
        return await knex('cart').select().where({ userID: args.userID });
      },
    },
    product: {
      type: ProductType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(root, args) {
        return await knex('product').select().where({ userID: args.userID });
      },
    },
    comment: {
      type: CommentType,
      args: {
        postID: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(root, args) {
        return await knex('comment').select().where({ postID: args.postID });
      },
    },
    post: {
      type: PostType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(root, args) {
        return await knex('post').select().where({ userID: args.userID });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
