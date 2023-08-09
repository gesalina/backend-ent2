import {  Router } from 'express'
import jwt from 'jsonwebtoken';

export default class routeHandler {
  constructor(){
    this.router = Router()
    this.init()
  }
  init(){}
  
  getRouter(){
    return this.router
  }
  get(path, ...callbacks){
    this.router.get(path, this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  post(path, ...callbacks){
    this.router.post(path, this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  put(path, ...callbacks){
    this.router.put(path, this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  delete(path, ...callbacks){
    this.router.delete(path, this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  applyCallbacks(callbacks){
    return callbacks.map(callback => async(...params) => {
      try{
        await callback.apply(this, params)
      } catch (error){
        console.log(error);
        params[1].status(500).json({error: error});
      }
    })
  }
  generateCustomResponses = (request, response, next) => {
    response.sendSuccess = payload => response.send({status: 'success', payload});
    response.sendServerError = error => response.status(500).send({status: 'error', error});
    response.sendUserError = error => response.status(400).send({status: 'error', error});
    next();
  }
  handlePolicies = policies => (request, response, next) => {
    const authHeaders = request.headers.authorization;
    if(policies[0] === "PUBLIC") return next();
    if(!authHeaders) return response.status(401).send({status: 'error', error: 'Unauthorized'});
    const token = authHeaders.slit(" ")[1];
    let user = jwt.verify(token, 'TOKEN');
    if(!policies.includes(user.role.toUpperCase())) return response.status(403).send({error: 'error', error: 'Not privileges'});
    request.user = user;
    next()
  }
}
