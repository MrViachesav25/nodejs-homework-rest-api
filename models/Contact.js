import { Schema, model } from 'mongoose';

import { handleSaveError, runValidateAtUpdate } from './hooks.js';

const contactSchema = new Schema(
	{
		name: { type: String, required: [true, "Put contact name"] },
		email: { type: String },
		phone: { type: String, required: true },
		favorite: { type: Boolean, default: false },
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		}
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', runValidateAtUpdate);
contactSchema.post('findOneAndUpdate', handleSaveError);

const Contact = model('contact', contactSchema);

export default Contact;