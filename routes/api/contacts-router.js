import { Router } from 'express';
import ctrl from '../../controllers/contacts-controllers.js';
import contactSchema from '../../schemas/schema-validation.js';
import { validateBody } from '../../middleware/index.js';
import { isValidId } from '../../middleware/index.js';

const router = Router();

const contactAddValidate = validateBody(contactSchema.addContactSchema);
const contactUpdateFavoriteValidate = validateBody(contactSchema.contactUpdateFavoriteSchema);
const notEmpty = validateBody(contactSchema.notEmptySchema);
const notEmptyFavorite = validateBody(contactSchema.notEmptyFavorite);


router.get('/', ctrl.getAllContacts);

router.get('/:id', isValidId, ctrl.getContactById);

router.post('/', contactAddValidate, ctrl.addContact); 

router.put('/:id', notEmpty, isValidId, contactAddValidate, ctrl.updateContact);
router.patch('/:id/favorite', notEmptyFavorite, isValidId, contactUpdateFavoriteValidate, ctrl.updateContact);
router.delete('/:id', isValidId, ctrl.deleteContact);

export default router;

