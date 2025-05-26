import multer from 'multer';
import path from 'path';

// Use import.meta.url to get the current directory in ES modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const uploadDir = path.join(__dirname, 'uploads');

// Configure multer to store files in the uploads directory
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, uploadDir);  // specify the directory where files will be stored
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);  // use the original file name
    }
});

const upload = multer({ storage });
export default upload;
