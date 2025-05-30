import multer from 'multer';
import path from 'path';


const __dirname = path.dirname(new URL(import.meta.url).pathname);

const uploadDir = path.join(__dirname, 'uploads');


const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadDir);  
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);  
    }
});

const upload = multer({ storage });
export default upload;
