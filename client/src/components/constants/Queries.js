const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const userByCategory = (category) => {
  const us = `query{
        usersByCategory(category:"${category}"){
            id
            username
            email
            mobile
            serviceName
            location
            address
            avatar
            cover
            video
            description
            workingHours
            categoryID
            thumbnail
        }
      }`;
  return us;
};

const categoryNameByID = (categoryID) => {
  const name = `query{
    getCategoryByID(categoryID: ${categoryID}){
      category
    }
  }`;
  return name;
};

const getDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return today;
};

const addPost = (id, imageUrl, postText) => {
  const mutation = `mutation{
    addPost(userID: ${id}, date: "${getDate()}", text: "${postText}", image: "${imageUrl}"){
      id
    }
  }`;
  return mutation;
};

const deletePost = (id) => {
  const mutation = `mutation{
    deletePost(id: ${id}){
      id
    }
  }`;
  return mutation;
};

const deleteBookmark = (id) => {
  const mutation = `mutation{
    deleteBookmark(id: ${id}){
      id
    }
  }`;
  return mutation;
};

const addComment = (userID, postID, text) => {
  const q = `mutation {
    addComment(userID:${userID}, postID:${postID}, text:"${text}", date:"${getDate()}"){
      id
    }
  }`;
  return q;
};

const addProduct = (name, userID, category, price, pic) => {
  const mutation = `mutation {
    addProduct(name:"${name}", userID: ${userID}, category:"${category}", price:${price}, pic:"${pic}", rating:"0", quantity:0){
      id
    }
  }`;
  return mutation;
};

const addToCart = (productID, userID) => {
  const mutation = `mutation{
    addCart(userID: ${userID}, productID:${productID}, sold: false){
      id
    }
  }`;
  return mutation;
};

const login = (email, password) => {
  const mutation = `mutation {
    login(email: "${email}", password: "${password}"){
      token
      RoleID
    }
  }`;
  return mutation;
};

const request = async (query) => {
  try {
    return await axios.post('http://localhost:5000/api', {
      query: query,
    });
  } catch (error) {
    return error;
  }
};

const signUp = (username, email, password, mobile) => {
  const q = `mutation{
    addUser(username:"${username}", email:"${email}", password:"${password}",RoleID:"3", mobile:${Number(
    mobile
  )},avatar:"${username[0]}",
    serviceName:"", address:"", cover:"", thumbnail:"", video:"", description:""){
      id
    }
  }`;
  return q;
};

const getUserByToken = (token) => {
  const result = jwt.verify(token, 'somesuperdupersecret', {
    algorithm: 'HS256',
  });
  const q = `query {
    user(id:${result.id}){
      username
      avatar
      id
      email
      RoleID
      payService
      mobile
      serviceName
      location
      address
      cover
      thumbnail
      video
      description
      workingHours
      categoryID
      thumbnail
    }
  }`;
  return q;
};

const getPostByProviderID = (userID) => {
  const q = ` query {
    posts(userID:${userID}){
      id
      userID
      date
      text
      image
    }
  }`;
  return q;
};

const getProviderById = (userID) => {
  const q = `query {
    user(id:${userID}) {
      username
      avatar
      id
      email
      RoleID
      payService
      mobile
      serviceName
      location
      address
      cover
      thumbnail
      video
      description
      workingHours
      thumbnail
    }
  }`;
  return q;
};

const getAllCommentsByPostID = (postID) => {
  const q = `query {
    comments(postID:${postID}){
      userID
      postID
      text
      date
      user {
        username
        avatar
      }
    }
  }`;
  return q;
};

const getAllGalary = (userID) => {
  const q = `query{
    gallery(userID: ${userID}){
      id 
      userID
      image
    }
  }`;
  return q;
};

const getAllReviews = (providerID) => {
  const q = `query {
    getReviews(providerID:${providerID}){
      text
      rating
      pic
      date
      user{
        username
        avatar
      }
    }
  }`;
  return q;
};

const addReview = (providerID, userID, text, rating, pic) => {
  const q = `mutation{
    addReview(providerID:${providerID}, userID:${userID}, text:"${text}",rating:"${rating}", date:"${getDate()}",pic:"${pic}"){
      providerID
    }
  }`;
  return q;
};

const addPhoto = (userID, image) => {
  const q = `mutation {
    addGallery(userID:${userID}, image:"${image}"){
      id
    }
  }`;
  return q;
};

const addDesc = (id, desc) => {
  const q = `mutation{
    editUser(id:${id}, description:"${desc}"){
      id
    }
  }`;
  return q;
};

const addVideo = (id, videoUrl) => {
  const q = `mutation{
    editUser(id:${id}, video:"${videoUrl}"){
      id
    }
  }`;
  return q;
};

const addThumbnail = (id, thumbnailUrl) => {
  const q = `mutation{
    editUser(id:${id}, thumbnail:"${thumbnailUrl}"){
      id
    }
  }`;
  return q;
};

const addFacilities = (id, arrOfFac) => {
  const q = `mutation{
    editUser(id:${id}, facilities:"${arrOfFac}"){
      id
    }
  }`;
  return q;
};

const addBookmark = (userID, providerID) => {
  const mutation = `mutation{
    addBookmark(userID:${userID}, providerID: ${providerID}){
      id
    }
  }`;
  return mutation;
};

const addLike = (userID, postID) => {
  const mutation = `mutation{
    addLike(userID:${userID}, postID: ${postID}){
      id
    }
  }`;
  return mutation;
};

const deleteLike = (id) => {
  const mutation = `mutation{
    deleteLike(id:${id}){
      id
    }
  }`;
  return mutation;
};

const getFacilities = (userID) => {
  const q = `query {
    user(id:${userID}){
      facilities
    }
  }`;
  return q;
};

const getLikesByPostID = (postID) => {
  const query = `query {
    getLikesByPostID(postID:${postID}){
      id
      postID
      userID
    }
  }`;
  return query;
};

const getProducts = (userID) => {
  const q = `query {
    productsByUserID(userID:${userID}){
      id
      name
      price
      pic
    }
  }`;
  return q;
};

const editProviderInfo = (id, serviceName, email, mobile, address, cover) => {
  const q = `mutation {
    editUser(id:${id}, serviceName:"${serviceName}",email:"${email}",mobile:${mobile},address:"${address}",cover:"${cover}"){
      id
    }
  }`;
  return q;
};

const getProvidersByBookmarks = (userID) => {
  const q = `query {
    bookmarks(userID:${userID}) {
      id
      userID
      providerID
      provider {
        id
        username
        email
        mobile
        serviceName
        location
        address
        avatar
        cover
        video
        description
        workingHours
        categoryID
        thumbnail
      }
    }
  }`;
  return q;
};

const getBookmarksByProvider = (providerID) => {
  const q = `query {
    allBookmarks(providerID:${providerID}) {
      id
      userID
      providerID   
    }
  }`;
  return q;
};

const getPostByFavProv = (userID) => {
  const q = `query {
    bookmarks(userID:${userID}){
      provider{
        email
        posts {
          id
          userID
          date
          text
          image
          user{
            avatar
            serviceName
          }
        }
      }
    }
  }`;
  return q;
};

const editWorkingHours = (providerID, workingHours) => {
  const q = `mutation {
    editUser(id:${providerID}, workingHours:"${workingHours}"){
      id
    }
  }`;
  return q;
};

const getUsersByRoleID = (RoleID) => {
  const q = `query {
    getUsers(RoleID: ${RoleID}){
     id
    username
    email
    mobile
    serviceName
    location
    address
    avatar
    cover
    video
    description
    workingHours
    categoryID
    RoleID
    thumbnail
    categoryName{
      category
    }
    }
  }`;
  return q;
};

const deleteImage = (imgID) => {
  const q = `mutation {
    deleteGallery(id:${imgID}){
      id
    }
  }`;
  return q;
};

export default {
  userByCategory,
  categoryNameByID,
  request,
  login,
  signUp,
  addPost,
  getUserByToken,
  getPostByProviderID,
  deletePost,
  deleteBookmark,
  getProviderById,
  addComment,
  getAllCommentsByPostID,
  getAllGalary,
  getAllReviews,
  addReview,
  addPhoto,
  addDesc,
  addVideo,
  addThumbnail,
  addProduct,
  addFacilities,
  getFacilities,
  getProducts,
  editProviderInfo,
  addToCart,
  getProvidersByBookmarks,
  getPostByFavProv,
  editWorkingHours,
  getUsersByRoleID,
  getBookmarksByProvider,
  getLikesByPostID,
  addBookmark,
  addLike,
  deleteLike,
  deleteImage,
};
