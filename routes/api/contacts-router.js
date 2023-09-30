import { Router } from 'express';
import ctrlContact from '../../controllers/contacts-controllers.js';
import contactSchema from '../../schemas/schema-contacts.js';
import { validateBody } from '../../middleware/index.js';
import { isValidId } from '../../middleware/index.js';
import { auth } from '../../middleware/index.js';

const router = Router();
router.use(auth);

const contactAddValidate = validateBody(contactSchema.addContactSchema);
const contactUpdateFavoriteValidate = validateBody(contactSchema.contactUpdateFavoriteSchema);
const notEmpty = validateBody(contactSchema.notEmptySchema);
const notEmptyFavorite = validateBody(contactSchema.notEmptyFavorite);


router.get('/', ctrlContact.getAllContacts);

router.get('/:id', isValidId, ctrlContact.getContactById);
router.get('/contacts', isValidId, contactAddValidate, ctrlContact.getFiltered);

router.post('/', contactAddValidate, ctrlContact.addContact); 

router.put('/:id', notEmpty, isValidId, contactAddValidate, ctrlContact.updateContact);
router.patch('/:id/favorite', notEmptyFavorite, isValidId, contactUpdateFavoriteValidate, ctrlContact.updateContact);
router.delete('/:id', isValidId, ctrlContact.deleteContact);

export default router;

