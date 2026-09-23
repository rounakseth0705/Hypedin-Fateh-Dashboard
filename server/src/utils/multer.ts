// import multer from 'multer';
// import path from 'path';

// const storage = multer.memoryStorage();

// export const taskUploadMiddleware = multer({
//     storage: storage,
//     limits: {
//         fileSize: 35 * 1024 * 1024,
//     },
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = /jpeg|jpg|png|pdf|mp4|webp/;
//         const isMimeValid = allowedTypes.test(file.mimetype);
//         const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());

//         if (isMimeValid && isExtValid) {
//             return cb(null, true);
//         }
//         cb(new Error('Invalid file format. Only JPEG, PNG, and WEBP images are supported.'));
//     }
// });


import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

// Allowed file extensions
const ALLOWED_EXT = /jpeg|jpg|png|pdf|mp4|webp/;

// Allowed MIME types
const ALLOWED_MIME = /image\/(jpeg|jpg|png|webp)|application\/pdf|video\/mp4/;

export const taskUploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 35 * 1024 * 1024, // 35 MB
  },
  fileFilter: (req, file, cb) => {
    const isMimeValid = ALLOWED_MIME.test(file.mimetype);
    const isExtValid = ALLOWED_EXT.test(path.extname(file.originalname).toLowerCase());

    if (isMimeValid && isExtValid) {
      return cb(null, true);
    }
    
    // Returning false instead of throwing raw Error prevents request pipeline breaking
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, PDF, and MP4 are supported.'));
  }
});