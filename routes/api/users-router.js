import { Router } from 'express';
import ctrlUser from '../../controllers/users-controllers.js';
import { validateBody } from '../../middleware/index.js';
import userSchema from '../../schemas/schema-users.js';
import {auth} from '../../middleware/index.js'

const authRouter = Router();
const userRegisterValidate = validateBody(userSchema.userRegisterSchema);
const userLoginValidate = validateBody(userSchema.userLoginSchema)

authRouter.post('/register', userRegisterValidate, ctrlUser.register);
authRouter.post('/login', userLoginValidate, ctrlUser.login);
authRouter.get('/current', auth, ctrlUser.getCurrent);
authRouter.get('/logout', auth, ctrlUser.logout);

export default authRouter;
