import { ErrorStatus } from '../constants/index.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { ctrlWrapper } from '../middleware/index.js'

const {SECRET_KEY} = process.env;
const auth = async (req, res, next) => {
   const { authorization = ""} = req.headers;
   const [bearer, token] = authorization.split(" ");
   if(bearer !== 'Bearer') throw ErrorStatus(401, 'Not authorized');
   
   try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if(!user || !user.token) throw ErrorStatus(401, 'Not authorized');
        req.user = user;
        next();
   }

   catch (error) {
        throw ErrorStatus(401, 'Not authorized');
   }
};

export default ctrlWrapper(auth);