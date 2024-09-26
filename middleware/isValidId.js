import { isValidObjectId } from 'mongoose';
import { ErrorStatus } from '../constants/index.js';

const isValidId = (req, res, next) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return next(ErrorStatus(404, `${id} is not a valid`));
	}
	next();
};

export default isValidId;