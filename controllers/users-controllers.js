import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ErrorStatus from '../constants/index.js';
import { ctrlWrapper } from '../middleware/index.js';
import { User } from '../models/User.js'

const {SECRET_KEY} = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(user) throw ErrorStatus (409, 'Email in use');
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,         
        }
    });
};

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) throw ErrorStatus(401, 'Email or password is wrong');
    
    const comparePassword = await bcrypt.compare(password, user.password);
    if(!comparePassword) throw ErrorStatus(401, 'Email or password is wrong');
    
    const {_id: id} = user;
    const payload =  {
        id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(id, {token});
    
    res.status(200).json({
        token,
        user: {
            email: email,
            subscription: user.subscription,
        }
    })
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;
    res.status(200).json({
            email,
            subscription,   
    })
};

const logout = async (req, res) => {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, { token: ''});

    if(!user) throw ErrorStatus(401, 'Not authorized');
    res.status(204);
}


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
}