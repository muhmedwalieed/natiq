import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import ApiError from '../utils/apiError.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const unique = crypto.randomBytes(12).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.split('/')[1]);
  if (extOk && mimeOk) return cb(null, true);
  cb(ApiError.badRequest('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export default upload;
