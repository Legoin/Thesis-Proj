const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema');
const jwt = require('express-jwt');
const app = express();
const path = require('path');

app.use(express.json());

const authMiddleware = jwt({
  algorithms: ['HS256'],
  secret: process.env.SECRET,
});

app.use(
  '/api',
  expressGraphQL((req) => ({
    schema,
    context: {
      user: req.user,
    },
    graphiql: true,
  }))
);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
