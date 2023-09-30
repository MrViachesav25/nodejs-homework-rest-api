import Contact from '../models/Contact.js';
import { ErrorStatus} from '../constants/index.js';
import { ctrlWrapper } from '../middleware/index.js';

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 2 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({owner}, "name email phone favorite", {skip, limit: Number(limit)}).populate(
      "owner",
      "email"
    );
    res.status(200).json(result);
};


const addContact = async (req, res) => {
  const newContact = req.body; 
  const { _id: owner } = req.user;
  const result = await Contact.create({...newContact, owner});
  console.log(result);
  res.status(201).json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) throw ErrorStatus (404, `Contact with id=${id} not found`);

  res.status(200).json(result);
};

const updateContact = async (req, res) => {
  const body = req.body
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, body, { new: true });
  if (!result) throw ErrorStatus (404, 'Not found')
  res.status(200).json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);

  if (!result) throw ErrorStatus (404, 'Not found')

  res.status(200).json({ message: "Contact deleted" });
};

const getFiltered = async (req, res) => {

  const { _id: owner } = req.user;
  const { favorite } = req.query;

  let filteredContacts;
  try {
      if (favorite === "true") {
          filteredContacts = await Contact.find({ owner, favorite: true });
      }
      res.status(200).json(filteredContacts);
  } catch (error) {
      console.log('Not favorite contacts')
  }
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  addContact: ctrlWrapper(addContact),
  getContactById: ctrlWrapper(getContactById),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  getFiltered: ctrlWrapper(getFiltered),
};


