import multer from 'multer';
import path from 'path';

const destination = path.resolve('tmp');
const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => { 
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}}`;
        const fileName = `${uniqueSuffix}_${file.originalname}`;
        cb(null, fileName);
    }
});

const limits = {
    fileSize: 560 * 560 * 3,
};

const upload = multer({
    storage,
    limits,
});

export default upload;