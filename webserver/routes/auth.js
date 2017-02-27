const RegisteredUser = require('../models/user');
const UnansweredQuery = require('../models/unansweredQuery');
const nodemailer = require('nodemailer');
module.exports = function(app, passport) {
    let rand, mailOptions, host, link;
    app.post('/login', passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
        res.cookie('token', req.user);
        res.cookie('username', req.user.name);
        res.cookie('authType', req.user.authType);
        res.cookie('profilepicture', req.user.photos);
        res.send(req.user);
    });
    /* logout - all the user informations will be
    cleared in cookie and loggedin status will be changed to false*/
    app.get('/signout', function(req, res) {
        res.clearCookie('token');
        res.clearCookie('authType');
        res.clearCookie('username');
        res.clearCookie('profilepicture');
        res.json({logout: 'Successfully LogOut'});
        RegisteredUser.update({
            'local.email': req.user.local.email
        }, {
            $set: {
                'local.loggedinStatus': false
            }
        }, function(err) {
            if (err) {
                console.log('status not updated');
            } else {
                req.logout();
            }
        });
    });
    // sends all the customer details to clientside
    app.get('/viewall', function(req, res) {
        RegisteredUser.find({
            'local.localType': 'Customer'
        }, function(err, alldetails) {
            if (err) {
                res.send(err);
            } else {
                res.send(alldetails);
            }
        });
    });
    app.get('/viewallonlineuser', function(req, res) {
            RegisteredUser.find(
              {'local.loggedinStatus': 'true', 'local.localType': 'Customer'},
               function(err, alldetails) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(alldetails);
                }
            });
        });
    /* LOCAL SIGNUP*/
    // local sign up route -  all the details entered by the user will be saved in database
    app.post('/signup', function(req, res) {
        let newUser = new RegisteredUser();
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        rand = Math.floor((Math.random() * 100) + 54);
        newUser.local.verificationID = RegisteredUser.generateHashVID(rand);
        newUser.local.name = req.body.firstName.toLowerCase().capitalizeFirstLetter() + ' '
        + req.body.lastName.toLowerCase().capitalizeFirstLetter();
        newUser.local.email = req.body.email;
        newUser.local.password = RegisteredUser.generateHash(req.body.password);
        newUser.local.firstname = req.body.firstName.toLowerCase().capitalizeFirstLetter();
        newUser.local.lastname = req.body.lastName.toLowerCase().capitalizeFirstLetter();
        newUser.local.localType = 'Customer';
        newUser.local.authType = 'local';
        newUser.local.loggedinStatus = false;
        newUser.local.isEmailVerified = false;
        newUser.local.photos = 'defultImage.jpg';
        res.cookie('profilepicture', newUser.local.photos);
        newUser.save(function(err) {
            if (err) {
                res.send('Error in registration');
            } else {
                res.send('Successfully registered');
            }
        });
    });
    // adminsignup- all the details entered by admin in postman will be saved in database
    app.post('/adminsignup', function(req, res) {
        let newUser = new RegisteredUser();
        rand = Math.floor((Math.random() * 100) + 54);
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        newUser.local.name = (req.body.firstName.toLowerCase().capitalizeFirstLetter() + ' ' +
        req.body.lastName.toLowerCase().capitalizeFirstLetter());
        newUser.local.email = req.body.email;
        newUser.local.password = RegisteredUser.generateHash(req.body.password);
        newUser.local.firstname = (req.body.firstName).toLowerCase().capitalizeFirstLetter();
        newUser.local.lastname = (req.body.lastName).toLowerCase().capitalizeFirstLetter();
        newUser.local.localType = 'Admin';
        newUser.local.isEmailVerified = true;
        newUser.local.verificationID = rand;
        newUser.local.authType = 'local';
        newUser.local.photos = 'defultImage.jpg';
        res.cookie('profilepicture', newUser.local.photos);
        newUser.save(function(err) {
            if (err) {
                res.send('Error in registration');
            } else {
                res.send('Successfully Registered');
            }
        });
    });

    // view all the unanswered query asked by user to the admin
    app.get('/viewquery', function(req, res) {
        UnansweredQuery.find({}, function(err, alldetails) {
            if (err) {
                res.send(err);
            } else {
                res.send(alldetails);
            }
        });
    });
    /* ------------------Routing Started ------------------------*/
    /* ------------------Verifiocation Mail send to the mail------------------------*/
    // send the verification mail to the user while signup to activate his account
    app.post('/send', function handleSayHello(req, res) {
        RegisteredUser.find({
            'local.email': req.body.data
        }, function(err, profile) {
            if (err) {
                res.send(err);
            } else {
                // module to send email
                let transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    secure: false,
                    auth: {
                        user: 'geniegenie0001@gmail.com',
                        // Your email id
                        pass: 'genie123'
                        // Your password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                host = req.get('host');
                let VID = RegisteredUser.generateHashVID(profile[0].local.verificationID);
                let VIDcheck = VID;
                let linkEmail = RegisteredUser.generateHashEmail(profile[0].local.email);
                link = 'http://' + req.get('host') + '/verify?id=' +
                 VID + '&email=' + profile[0].local.email;
                let text = 'Hello from \n\n' + req.body.data;
                mailOptions = {
                    from: 'geniegenie0001@gmail.com',
                     // sender address
                    to: profile[0].local.email,
                     // list of receivers
                    subject: 'Verify your Email with Genie',
                    // Subject line
                    text: text,
                    html: "<center><h1>Welcome to Genie</h1></center><br><br><br>Hi,<br><br>To complete Signup Click on the button to verify yourself.<br><br><br><a href=" + link + " style='background-color:#44c767;-moz-border-radius:28px;-webkit-border-radius:28px;border-radius:28px;border:1px solid #18ab29;display:inline-block;padding:16px 31px;color:#ffffff;text-shadow:0px 1px 0px #2f6627;text-decoration:none;'> Verify </a><br><br><b>Why verify?</b><br><br>For using Genie we require a verified email to prevent spam.<br><br>Verifying lets you join Genie quickly and easily.<br><br>Cheers,<br><br><b>Team Genie</b><br><br><small><i>This link is valid for an hour.This is an Auto-generated mail,please do not reply</i></small>"
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.json({yo: info.response});
                    }
                });
            }
        });
    });
    /* deleteuser-in case of any network error while signup the user data
    will be deleted in database if email is not sent to a particular user*/
    app.delete('/deleteuser', function(req, res) {
      //  let request = req.body.data;
        RegisteredUser.remove({
            'local.email': req.body.data
        }, function(err) {
            if (err) {
                res.send('Error in deleting the data');
            } else {
                res.send('Data is deleted successfully');
            }
        });
    });
    /* verify the link which sent to  user email*/
    // verification link cannot be used more than once (will be expired once it is used)
    app.get('/verify', function(req, res) {
        let checkID = req.query.id;
        let checkMail = req.query.email;
        RegisteredUser.find({
            'local.email': req.query.email
        }, function(err, profile) {
            if (err) {
                res.send(err);
            } else {
                if ((req.protocol + '://' + req.get('host')) === ('http://' + host)) {
                    console.log('Domain is matched. Information is from Authentic email');
                    if (profile[0].local.verificationID !== 0) {
                        RegisteredUser.update({
                            'local.email': req.query.email
                        }, {
                            $set: {
                                'local.isEmailVerified': true,
                                'local.verificationID': 0
                            }
                        }, function(error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Account Verified and Changed to true');
                            }
                        });
                        res.redirect('/#/successfullyregistered');
                    } else {
                        res.redirect('/#/expiryLink');
                    }
                } else {
                    res.redirect('/#/expiryLink');
                }
            }
        });
    });
    /* send verification link to the user mail for
    forgotpassword and this link is not valid more than once*/
    app.post('/forgetpassword', function password(req, res) {
        rand = Math.floor((Math.random() * 100) + 54);
        let encryptRand = RegisteredUser.generateHashVID(rand);
        RegisteredUser.update({
            'local.email': req.body.email
        }, {
            $set: {
                'local.verificationID': encryptRand
            }
        }, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('id changed');
            }
        });
        // find whether the user exists with that email id
        RegisteredUser.find({
            'local.email': req.body.email
        }, function(err, profile) {
            if (err) {
                res.send(err);
            } else {
                let transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    secure: false,
                    auth: {
                        user: 'geniegenie0001@gmail.com',
                        // Your email id
                        pass: 'genie123'
                        // Your password
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                host = req.get('host');
                link = 'http://' + req.get('host') + '/newPassword?id=' +
                 encryptRand + '&email=' + profile[0].local.email;
                mailOptions = {
                    from: 'geniegenie0001@gmail.com',
                     // sender address
                    to: profile[0].local.email,
                     // list of receivers
                    subject: 'Password reset for Genie account',
                     // Subject line
                    html: "<center><h1>Welcome to Genie</h1></center><br><br><br>Hi,<br><br>Forgot password??<br><br> No worries, click on the button to reset right away !!.<br><br><br><a href=" + link + " style='background-color:#FF0000;-moz-border-radius:28px;-webkit-border-radius:28px;border-radius:28px;border:1px solid #FF0000;display:inline-block;padding:16px 31px;color:#ffffff;text-shadow:0px 1px 0px #2f6627;text-decoration:none;'>Reset password</a><br><br>Cheers,<br><br><b>Team Genie</b><br><br><small><i>This link is valid for an hour.This is an Auto-generated mail,please do not reply</i></small>"
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message sent: ' + info.response);
                        res.json({yo: info.response});
                    }
                });
            }
        });
    });
    /* verify the link which sent to  user email for forgotpassword*/
    app.get('/newPassword', function(req, res) {
      RegisteredUser.find({
            'local.email': req.query.email
        }, function(err, profile) {
            if (err) {
                res.send(err);
            } else
                if (profile[0].local.verificationID !== 0) {
                    res.redirect('/#/newpassword?id=' + req.query.id);
                } else {
                    res.redirect('/#/expiryLink');
                }
        });
    });
    // once new password is changed it will be updated in user Information
    app.post('/updatepassword', function(req, res) {
        RegisteredUser.find({
            'local.verificationID': req.body.id
        }, function(err, profile) {
            if (err) {
                res.send(err);
            } else {
                // checks whether the link is valid or expired
                if ((req.protocol + '://' + req.get('host')) === ('http://' + host)) {
                    if (profile[0].local.verificationID !== 0) {
                        RegisteredUser.update({
                            'local.verificationID': req.body.id
                        }, {
                            /* using the verification id password
                             updated in particular user Information */
                            $set: {
                                'local.password': RegisteredUser.generateHash(req.body.pass),
                                'local.verificationID': 0
                            }
                        }, function(error) {
                            if (error) {
                                console.log(error);
                            } else {
                                res.redirect('/#/');
                            }
                        });
                    } else {
                        res.redirect('/#/expiryLink');
                    }
                } else {
                    res.redirect('/#/expiryLink');
                }
            }
        });
    });
    // check whether the user already exists or not during signup
    app.post('/checkuser', function(req, res) {
        RegisteredUser.find({
            'local.email': req.body.email
        }, function(err, profile) {
            // checks email already exist or not
            if (profile.length) {
                res.json({ userexists: true});
            } else {
                res.json({ userexists: false});
            }
            if (err) {
                res.send(err);
            }
        });
    });
    // profileupdation for both user and admin
    app.put('/updateprofile', function(req, res) {
        String.prototype.capitalizeFirstLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        if (req.body) {
            let request1 = req.body.email;
            let request2 = (req.body.firstname.toLowerCase().capitalizeFirstLetter() + ' ' +
             req.body.lastname.toLowerCase().capitalizeFirstLetter());
            let request3 = req.body.firstname.toLowerCase().capitalizeFirstLetter();
            let request4 = req.body.lastname.toLowerCase().capitalizeFirstLetter();
            RegisteredUser.update({
                'local.email': request1
            }, {
                // updating user details with the help of email
                $set: {
                    'local.name': request2,
                    'local.firstname': request3,
                    'local.lastname': request4
                }
            }, function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('updated Successfully');
                }
            });
        }
    });
    // user can reset password after login to the application
    app.put('/resetpassword', function(req, res) {
        if (req.body) {
            let request1 = req.body.password;
            RegisteredUser.update({
                'local.email': req.user.local.email
            }, {
                // updating the new password
                $set: {
                    'local.password': RegisteredUser.generateHash(request1)
                }
            }, function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('Password changed Successfully');
                }
            });
        }
    });
    // uploading image for localstratergy
    app.post('/uploadImage', function(req, res) {
        res.cookie('profilepicture', req.body.data);
        RegisteredUser.update({
            'local.email': req.user.local.email
        }, {
            // updating image
            $set: {
                'local.photos': req.body.data
            }
        }, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Successfully Updated');
            }
        });
    });
    // customer Information
    app.get('/clientinformation', function(req, res) {
        let email = req.user.local.email;
        // using email can fetch all the information about the user
        RegisteredUser.find({
            'local.email': email
        }, function(err, profile) {
            res.send(profile);
            if (err) {
                res.send(err);
            }
        });
    });
    // Admin Information
    app.post('/admindetails', function(req, res) {
        let email = req.body.data;
        // using email can fetch all the information about the admin
        RegisteredUser.find({
            'local.email': email
        }, function(err, profile) {
            res.send(profile);
            if (err) {
                res.send(err);
            }
        });
    });

    // *******************************************
    // Facebook authentication routes
    // *******************************************
    // send to facebook to do the authentication

    app.get('/auth/facebook', passport.authenticate('facebook', {
        session: false,
        scope: 'email'
    }), (req, res) => {
        res.json(req.user);
    });

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/#/'}), (req, res) => {
        res.cookie('token', req.user.facebook.token);
        res.cookie('authType', req.user.facebook.authType);
        res.cookie('username', req.user.facebook.displayName);
        res.cookie('profilepicture', req.user.facebook.photos);
        res.redirect('/#/clienthome');
    });
    // userprofile-in which all the user informations will be stored
    app.get('/userProfile', function(req, res) {
        res.json({user: req.user});
    });
    // *******************************************
    // Google authentication routes
    // *******************************************
    //  send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', {
        session: false,
        scope: ['email']
    }), (req, res) => {
        res.json(req.user);
    });
    // the callback after google has authorized the user
    app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/#/'}), (req, res) => {
        res.cookie('token', req.user.google.token);
        res.cookie('username', req.user.google.name);
        res.cookie('authType', req.user.google.authType);
        res.cookie('profilepicture', req.user.google.photos);
        res.redirect('/#/clienthome');
    });
};
