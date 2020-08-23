const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLID,
  GraphQLError,
} = require('graphql');

const knex = require('../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    RoleID: { type: GraphQLInt },
    payService: { type: GraphQLString },
    mobile: { type: GraphQLInt },
    serviceName: { type: GraphQLString },
    location: { type: GraphQLString },
    address: { type: GraphQLString },
    avatar: { type: GraphQLString },
    cover: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    video: { type: GraphQLString },
    description: { type: GraphQLString },
    workingHours: { type: GraphQLString },
    facilities: { type: GraphQLString },
    categoryID: { type: GraphQLID },
    token: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      async resolve(root, args) {
        return await knex('post').select().where({ userID: root.id });
      },
    },
    categoryName: {
      type: CategoryType,
      async resolve(root, args) {
        return await knex('category')
          .select()
          .where({ id: root.categoryID })
          .first();
      },
    },
  }),
});

const LikeType = new GraphQLObjectType({
  name: 'like',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    postID: { type: GraphQLID },
  }),
});

const cartType = new GraphQLObjectType({
  name: 'cart',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    productID: { type: GraphQLID },
    sold: { type: GraphQLBoolean },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: 'category',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    category: { type: GraphQLString },
    // user: {
    //   type: new GraphQLList(UserType),
    //   async resolve(parent, args){
    //     return await knex('user').select().where({categoryID : parent.id});
    //   }
    // }
  }),
});

const productType = new GraphQLObjectType({
  name: 'product',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    name: { type: GraphQLString },
    category: { type: GraphQLString },
    price: { type: GraphQLInt },
    userID: { type: GraphQLID },
    rating: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    pic: { type: GraphQLString },
  }),
});

const CommentType = new GraphQLObjectType({
  name: 'comment',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    postID: { type: GraphQLID },
    text: { type: GraphQLString },
    date: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(root, args) {
        return await knex('user').select().where({ id: root.userID }).first();
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    date: { type: GraphQLString },
    text: { type: GraphQLString },
    image: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(root, args) {
        return await knex('user').select().where({ id: root.userID }).first();
      },
    },
  }),
});

const GalleryType = new GraphQLObjectType({
  name: 'gallery',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    image: { type: GraphQLString },
  }),
});

const bookmarkType = new GraphQLObjectType({
  name: 'bookmark',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    providerID: { type: GraphQLID },
    provider: {
      type: UserType,
      async resolve(root, args) {
        return await knex('user')
          .select()
          .where({ id: root.providerID })
          .first();
      },
    },
  }),
});

const rolesType = new GraphQLObjectType({
  name: 'roles',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    Role: { type: GraphQLString },
  }),
});

const reviewType = new GraphQLObjectType({
  name: 'review',
  fields: () => ({
    id: { type: GraphQLID, unique: true },
    userID: { type: GraphQLID },
    providerID: { type: GraphQLID },
    text: { type: GraphQLString },
    rating: { type: GraphQLString },
    pic: { type: GraphQLString },
    date: { type: GraphQLString },
    user: {
      type: UserType,
      async resolve(root, args) {
        return await knex('user').select().where({ id: root.userID }).first();
      },
    },
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
        return await knex('user').select().where({ id: args.id }).first();
      },
    },
    getUsers: {
      type: new GraphQLList(UserType),
      args: {
        RoleID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('user').select().where(args);
      },
    },
    carts: {
      type: new GraphQLList(cartType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('cart')
          .select()
          .where({ userID: args.userID, sold: false }); // why sold is false
      },
    },
    productsByUserID: {
      type: new GraphQLList(productType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('product')
          .select()
          .where({ userID: args.userID })
          .limit(50);
      },
    },
    productsByCategory: {
      type: new GraphQLList(productType),
      args: {
        category: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('product')
          .select()
          .where({ category: args.category })
          .limit(50);
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      args: {
        postID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('comment').select().where({ postID: args.postID });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('post').select().where({ userID: args.userID });
      },
    },
    usersByCategory: {
      type: new GraphQLList(UserType),
      args: {
        category: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          var categoryData = await knex('category')
            .select()
            .where({ category: args.category })
            .first();
          return await knex('user')
            .select()
            .where({ categoryID: categoryData.id });
        } catch (err) {
          return err;
        }
      },
    },
    category: {
      type: CategoryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('category').select().where({ id: args.id }).first();
      },
    },
    getAllCategories: {
      type: new GraphQLList(CategoryType),
      async resolve(root, args) {
        return await knex('category').select();
      },
    },
    gallery: {
      type: new GraphQLList(GalleryType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('gallery').select().where({ userID: args.userID });
      },
    },
    getRoles: {
      type: new GraphQLList(rolesType),
      async resolve(root, args) {
        return await knex('roles').select();
      },
    },
    bookmarks: {
      type: new GraphQLList(bookmarkType),
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('bookmark').select().where({ userID: args.userID });
      },
    },

    allBookmarks: {
      type: new GraphQLList(bookmarkType),
      args: {
        providerID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('bookmark')
          .select()
          .where({ providerID: args.providerID });
      },
    },

    role: {
      type: rolesType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('roles').select().where({ id: args.id }).first();
      },
    },
    getCategoryByID: {
      type: CategoryType,
      args: {
        categoryID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        return await knex('category')
          .select('category')
          .where({ id: args.categoryID })
          .first();
      },
    },
    getReviews: {
      type: new GraphQLList(reviewType),
      args: {
        providerID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('review')
          .select()
          .where({ providerID: args.providerID });
      },
    },

    getLikesByPostID: {
      type: new GraphQLList(LikeType),
      args: {
        postID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('likes').select().where({ postID: args.postID });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // for user table
    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        //login
        try {
          const data = await knex('user')
            .select('*')
            .where({ email: args.email })
            .first();
          // console.log(data.password);
          if (data.password) {
            if (await bcrypt.compare(args.password, data.password)) {
              const token = jwt.sign(
                { id: data.id, username: data.username, email: data.email },
                process.env.SECRET,
                {
                  algorithm: 'HS256',
                  expiresIn: '2 days',
                }
              );
              await knex('user')
                .update({ token: token })
                .where({ email: args.email });
              return await knex('user')
                .select('*')
                .where({ email: args.email })
                .first();
            }
          } else {
            console.log('invalid username or password');
          }
        } catch (err) {
          console.log(err);
        }
      },
    },
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        RoleID: { type: GraphQLString },
        mobile: { type: new GraphQLNonNull(GraphQLInt) },
        serviceName: { type: new GraphQLNonNull(GraphQLString) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        avatar: { type: new GraphQLNonNull(GraphQLString) },
        cover: { type: new GraphQLNonNull(GraphQLString) },
        thumbnail: { type: new GraphQLNonNull(GraphQLString) },
        video: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        facilities: { type: GraphQLString },
      },
      async resolve(root, args) {
        // add user with crpted password to database
        var crptPass = await bcrypt.hash(args.password, 10);
        args.password = crptPass;
        return await knex('user').insert(args);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('user').where({ id: args.id }).del();
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        RoleID: { type: GraphQLInt },
        payService: { type: GraphQLString },
        mobile: { type: GraphQLInt },
        serviceName: { type: GraphQLString },
        location: { type: GraphQLString },
        address: { type: GraphQLString },
        avatar: { type: GraphQLString },
        cover: { type: GraphQLString },
        thumbnail: { type: GraphQLString },
        video: { type: GraphQLString },
        description: { type: GraphQLString },
        workingHours: { type: GraphQLString },
        categoryID: { type: GraphQLID },
        facilities: { type: GraphQLString },
      },
      async resolve(root, args) {
        // args.password = await bcrypt.hash(args.password, 10);
        return await knex('user').where({ id: args.id }).update(args);
      },
    },
    // for product table
    addProduct: {
      type: productType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        userID: { type: new GraphQLNonNull(GraphQLID) },
        rating: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        pic: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('product').insert(args);
      },
    },
    deleteProduct: {
      type: productType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('product').where({ id: args.id }).del();
      },
    },
    editProduct: {
      type: productType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        category: { type: GraphQLString },
        price: { type: GraphQLInt },
        userID: { type: GraphQLID },
        rating: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        pic: { type: GraphQLString },
      },
      async resolve(root, args) {
        return await knex('product').where({ id: args.id }).update(args);
      },
    },
    // for cart table
    addCart: {
      type: cartType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        productID: { type: new GraphQLNonNull(GraphQLID) },
        sold: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      async resolve(root, args) {
        return await knex('cart').insert(args);
      },
    },
    deleteCart: {
      type: cartType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('cart').where({ id: args.id }).del();
      },
    },
    editCart: {
      type: cartType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: GraphQLID },
        productID: { type: GraphQLID },
        sold: { type: GraphQLBoolean },
      },
      async resolve(root, args) {
        return await knex('cart').where({ id: args.id }).update(args);
      },
    },
    //for like table
    addLike: {
      type: LikeType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        postID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('likes').insert(args);
      },
    },

    deleteLike: {
      type: LikeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('likes').where({ id: args.id }).del();
      },
    },

    // for comment table
    addComment: {
      type: CommentType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        postID: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('comment').insert(args);
      },
    },
    deleteComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('comment').where({ id: args.id }).del();
      },
    },
    editComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        postID: { type: GraphQLID },
        text: { type: GraphQLString },
        date: { type: GraphQLString },
      },
      async resolve(root, args) {
        return await knex('comment').where({ id: args.id }).update(args);
      },
    },
    // for post table
    addPost: {
      type: PostType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('post').insert(args);
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('post').where({ id: args.id }).del();
      },
    },
    editPost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: GraphQLID },
        date: { type: GraphQLString },
        text: { type: GraphQLString },
        image: { type: GraphQLString },
      },
      async resolve(root, args) {
        return await knex('post').where({ id: args.id }).update(args);
      },
    },
    addCategory: {
      type: CategoryType,
      args: {
        category: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('category').insert(args);
      },
    },
    deleteCategory: {
      type: CategoryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('category').where(args).del();
      },
    },
    editCategory: {
      type: CategoryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        category: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('category').where({ id: args.id }).update(args);
      },
    },
    addGallery: {
      type: GalleryType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('gallery').insert(args);
      },
    },
    deleteGallery: {
      type: GalleryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('gallery').where(args).del();
      },
    },
    editGallery: {
      type: GalleryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('gallery').where({ id: args.id }).update(args);
      },
    },
    addBookmark: {
      type: bookmarkType,
      args: {
        userID: { type: new GraphQLNonNull(GraphQLID) },
        providerID: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('bookmark').insert(args);
      },
    },
    deleteBookmark: {
      type: bookmarkType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('bookmark').where(args).del();
      },
    },
    addRole: {
      type: rolesType,
      args: {
        Role: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('roles').insert(args);
      },
    },
    deleteRoles: {
      type: rolesType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(root, args) {
        return await knex('roles').where(args).del();
      },
    },
    editRoles: {
      type: rolesType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        Role: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('roles').where({ id: args.id }).update(args);
      },
    },
    addReview: {
      type: reviewType,
      args: {
        providerID: { type: new GraphQLNonNull(GraphQLID) },
        userID: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        rating: { type: new GraphQLNonNull(GraphQLString) },
        pic: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(root, args) {
        return await knex('review').insert(args);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
