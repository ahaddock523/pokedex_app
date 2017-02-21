var express = require('express');

var router = express.Router();

var User = require('../model/user.js');

// var auth = function(request, response, next) {
//     if (request.session && request.sessions.user === "adminlogin" && admin.user) {
//     return next();
//     }
//     else {
//         return response.sendStatus(401);
//     }
// }

router.get('/login', function(request, response) {
    if (request.session.user && request.session.user.admin == true) {
        response.redirect('/search');
    }
    else if (request.session.user) {
        response.redirect('/user/#/search');
    }
    else {
        response.render('login');
    }
});

router.post('/login', function(request, response) {
    User.findOne({
            username: request.body.username,
            password: request.body.password
        }, {},
        function(error, result) {
            if (error) {
                console.error('*** ERROR: Problem finding the user.');
                console.error(error);
                response.send('There was an error with the page.');
            } else if (!result) {
                request.flash('error', 'Your username or password is not correct');
                response.redirect('/user/login');

                console.log('***Test: ', request);
            } else {
                console.log('This is the found user: ', result);

                request.session.user = {
                    username: result.username,
                    admin: result.admin
                }
                console.log('This is the session data: ', request.session);
                if(request.session.user.admin == true) {
                    response.redirect('/search');
                }
                else {
                    response.redirect('/user/#/search');
                }
            }
        }
    );
});

router.get('/register', function(request, response) {
    if (request.session.user && request.session.user.admin == true) {
        response.redirect('/search');
    }
    else if (request.session.user){
        response.render('/user');
    }
    else {
        response.render("register");
    }
});

router.post('/register', function(request, response) {
    var newUser = User(request.body);

    newUser.save(function(error) {
        if (error) {
            var errorMessage = 'Unable to save the user to the database.'
            console.error('***ERROR: ', errorMessage);
            console.error(error);
            response.send(errorMessage);
        } else {
            request.flash('success', 'Registered Successfully, please login.')
            response.redirect('/user/login')
        }
    });
});

router.get('/logout', function(request, response) {
    request.session.destroy();

    response.redirect('/user/login');
});

module.exports = router;
