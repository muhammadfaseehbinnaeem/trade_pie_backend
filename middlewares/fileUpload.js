import multer from "multer";
import {v4 as uuidv4, v4} from 'uuid';

const MIME_TYPE_MAP = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/receipts');
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, v4() + '.' + ext);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, and PNG images are allowed.'));
    }
};

const fileUpload = multer({
    limit: 500000,
    storage,
    fileFilter,
}).single('image');

// const fileUpload = multer({
//     limit: 500000,
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, 'uploads/receipts');
//         },
//         filename: (req, file, cb) => {
//             const ext = MIME_TYPE_MAP[file.mimetype];
//             cb(null, uuid.v1() + '.' + ext);
//         }
//     }),
//     fileFilter: (req, file, cb) => {
//         const isValid = !!MIME_TYPE_MAP[file.mimetype];
//         let error = isValid ? null : new Error('Invalid mime type!');
//         cb(error, isValid);
//     }
// });

export default fileUpload;