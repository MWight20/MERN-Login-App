# MERN-Login-App
This is a MERN stack login app that is based on [this MERN boilerplate project.](https://github.com/keithweaver/MERN-boilerplate) 
following a practice tutorial for authentication.

This project uses these technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation


## Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```

## Using MongoDB
```
This program uses api with intent to connect to MongoDB atlas. 
To connect to a new database, you must copy and paste your mongoDB URI into config/config.js. 

For the program to function properly follow these steps:

1. rename config/config.example.js => config.js
2. copy your mongoDB custom user/password uri from atlas and paste it into your db variable.
```

## Running

Production mode:

```shell
npm run start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```
