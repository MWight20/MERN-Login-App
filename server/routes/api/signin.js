
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
module.exports = (app) => {
  /*
    app.get('/api/counters', (req, res, next) => {
      Counter.find()
        .exec()
        .then((counter) => res.json(counter))
        .catch((err) => next(err));
    });
  
    app.post('/api/counters', function (req, res, next) {
      const counter = new Counter();
  
      counter.save()
        .then(() => res.json(counter))
        .catch((err) => next(err));
    }); 
    */

    /*
     *    SIGN UP
     */
    app.post('/api/account/signup', (req, res, next) => {
      const { body } = req;
      console.log('body', body);
      const { 
        firstName, 
        lastName,
        password
      } = body;
      let {
        email
      } = body;
      

      if (!firstName) {
        return res.send({
          success: false,
          message: 'Error: Missing first name cannot be blank.'
        })
      }
      if (!lastName) {
        return res.send({
          success: false,
          message: 'Error: Missing last name cannot be blank.'
        })
      }
      if (!email) {
        return res.send({
          success: false,
          message: 'Error: Missing email cannot be blank.'
        })
      }
      if (!password) {
        return res.send({
          success: false,
          message: 'Error: Missing password cannot be blank.'
        })
      }

      console.log('test1'); 

      email = email.toLowerCase();

      // steps:
      // 1. Verify email doesn't exist
      // 2. Save 
      User.find({
        email: email
      }, (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error.'
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: false,
            message: 'Error: Account already exists.'
          });
        }

        // if no server error and account doesn't exist...
        // Save the new user
        const newUser = new User();

        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err,user) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error.'
            });
          }
          return res.send({
            success: true,
            message: 'Signed up'
          });
        }); //end .save
      });
    });//POST signup


    app.post('/api/account/signin', (req, res, next) => {
      const { body } = req;
      const { 
        password
      } = body;
      let {
        email
      } = body;

      if (!email) {
        return res.send({
          success: false,
          message: 'Error: Email cannot be blank.'
        })
      }
      if (!password) {
        return res.send({
          success: false,
          message: 'Error: Password cannot be blank.'
        })
      }

      email = email.toLowerCase();

      User.find({
        email: email
      }, (err, users) => {
        if (err) {
          console.log('err 2:', err);
          return res.send({
            success: false,
            message: 'Error: server error in signin'
          });
        }
        if (users.length != 1) {
          return res.send({
            success: false,
            message: 'Error: Invalid'
          });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: 'Error: Invalid password'
          });
        }

        //otherwise, correct user
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err,doc) => {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: 'Error: server error in usersession'
            });
          }


          return res.send({
            success: true,
            messager: 'Valid sign in',
            token: doc._id
          });


        });
      });
    });//POST signin

    app.get('/api/account/verify', (req, res, next) => {
      //Get the token
      const { query } = req;
      const { token } = query;
      // ?token=test

      // Veriify the token is one of a kind and it's not deleted.
      UserSession.find({
        _id: token,
        isDeleted: false
      }, (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: Server error in verify'
          });
        }

        if (sessions.length != 1) {
          return res.send({
            success: false,
            message: 'Error: Invalid'
          });
        } else {
          return res.send({
            success: true,
            message: 'Good'
          });
        }

      });


    }); //GET verify (incomplete err)

    app.get('/api/account/logout', (req, res, next) => {
      //Get the token
      const { query } = req;
      const { token } = query;
      // ?token=test

      // Veriify the token is one of a kind and it's not deleted.
      UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
      }, {
        $set: {
          isDeleted:true
        }
      }, null, (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: Server error in logout'
          });
        }

        return res.send({
          success: true,
          message: 'Good'
        });
        

      });
    });
};