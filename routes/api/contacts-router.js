import { Router } from 'express';
import ctrl from '../../controllers/contacts-controllers.js';
import contactJoi from '../../Schemas/schema-contact.js';
import { validateBody } from '../../middleware/index.js';
import { isValidId } from '../../middleware/index.js';

const router = Router();

const contactAddValidate = validateBody(contactJoi.contactSchema);
const contactUpdateFavoriteValidate = validateBody(contactJoi.contactUpdateFavoriteSchema);

router.get('/', ctrl.getAllContacts);

router.get('/:id', isValidId, ctrl.getContactById);

router.post('/', contactAddValidate, ctrl.addContact); 

router.put('/:id', isValidId, contactAddValidate, ctrl.updateContact);
router.patch('/:id/favorite', isValidId, contactUpdateFavoriteValidate, ctrl.updateContact);
router.delete('/:id', ctrl.deleteContact);

export default router;

