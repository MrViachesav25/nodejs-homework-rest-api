import multer from 'multer';
import path from 'path';

const destination = path.resolve('tmp');
const multerConfig = multer.diskStorage({
    destination,
    
})