import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';
import { ErrorStatus, sendEmail } from '../constants/index.js';
import { ctrlWrapper } from '../middleware/index.js';
import User  from '../models/User.js'

const {SECRET_KEY, BASE_URL, PORT} = process.env;
const avatarPath = path.resolve('public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(user) throw ErrorStatus (409, 'Email in use');
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}:${PORT}/users/verify/${verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail);
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,         
        }
    });
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) throw ErrorStatus(404, "User not found");
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    res.status(200).json({
        message: 'Verification successful'
    });
};

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw ErrorStatus(404);

    if(user.verify) throw ErrorStatus(400, 'Verification has already been passed')
    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}:${PORT}/users/verify/${user.verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail);
    res.status(200).json({
        message: 'Verification email sent'
    });

}

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user) throw ErrorStatus(401, 'Email or password is wrong');
    if(!user.verify) throw ErrorStatus(401, 'User not verify');
    
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
    res.status(204).json({
		message: 'No Content'
	});;
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename)
    await fs.rename(oldPath, newPath);
    const resizeFile = await Jimp.read(newPath);
    await resizeFile.resize(250, 250).write(newPath);
    const avatarURL = path.join('avatars', filename);
    const avatar = await User.findByIdAndUpdate( _id, { avatarURL });
    if(!avatar) throw ErrorStatus(401, 'Not authorized');
    
    res.status(200).json({
        avatarURL,
    })

}


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}