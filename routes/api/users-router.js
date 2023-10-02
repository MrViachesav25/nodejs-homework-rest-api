import { Router } from 'express';
import ctrlUser from '../../controllers/users-controllers.js';
import { validateBody } from '../../middleware/index.js';
import userSchema from '../../schemas/schema-users.js';
import {auth, upload} from '../../middleware/index.js'

const authRouter = Router();
const userRegisterValidate = validateBody(userSchema.userRegisterSchema);
const userLoginValidate = validateBody(userSchema.userLoginSchema)

authRouter.post('/register', userRegisterValidate, ctrlUser.register);
authRouter.post('/login', userLoginValidate, ctrlUser.login);
authRouter.get('/current', auth, ctrlUser.getCurrent);
authRouter.post('/logout', auth, ctrlUser.logout);
authRouter.patch('/avatars', auth, upload.single('avatar'), ctrlUser.updateAvatar);

export default authRouter;
