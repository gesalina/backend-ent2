import handleRouter from './router.js';
import jwt from 'jsonwebtoken';
import UserModel from "../../models/user.model.js";
import {JWT_COOKIE_NAME, passportCall } from "../../../utils.js";
import passport from "passport";

export default class SessionsRouter extends handleRouter {
  init(){
    /**
    *  This route get the login form
    */
    this.get('/login',(request, response) => {
      response.render('sessions/login', {
        view_name: "Login | Tenda";
      })
    });
    
    /**
    *  This route get the register form
    */
    this.get('/register', (request, response) => {
      response.render('sessions/register', {
        view_name: 'Register | Tenda'
      })
    });

    /**
    *  This route handle the errors
    */
    this.get('/failLogin', (request, response) => {
      response.send({error: 'Failed to authenticate'});
    })
    
    /**
    *  API to register a new user
    */
    this.post('/register', passport.authenticate("register", {
      failureRedirect: 'session/failRegister'
    }),
    async(request, response) => {
      response.redirect('/session/login');
    }         
    )
    /**
    *  API to auth the user
    */
    this.post('/login', passport.authenticate("login", {
      failureRedirect: 'session/failRegister'
    }),
    async(request, response){
      if(!request.user){
        return response.status(400).send({status: 'error', error: 'Invalid credetials'});
      }
      response.cookie(JWT_COOKIE_NAME, request.user.token, {signed: true}).redirect('/products');
    }
             )
    
  }
}
