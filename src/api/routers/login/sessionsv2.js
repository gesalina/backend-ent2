import handleRouter from './router.js';
import jwt from 'jsonwebtoken';

export default class SessionsRouter extends handleRouter {
  init(){
    this.post();
  }
}
