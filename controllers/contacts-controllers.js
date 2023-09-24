import Contact from '../models/Contact.js';
import { ErrorStatus} from '../constants/index.js';
import { ctrlWrapper } from '../middleware/index.js';

const getAllContacts = async (req, res) => {
    const result = await Contact.find({}, "name email phone favorite");
    res.status(200).json(result);
};


const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
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
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) throw ErrorStatus (404, 'Not found')
  res.status(200).json(result);
}

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);

  if (!result) throw ErrorStatus (404, 'Not found')

  res.status(200).json({ message: "Contact deleted" });
}


export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  addContact: ctrlWrapper(addContact),
  getContactById: ctrlWrapper(getContactById),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};


