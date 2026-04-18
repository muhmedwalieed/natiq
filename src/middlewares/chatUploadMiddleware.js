import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import ApiError from '../utils/apiError.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const typeMap = {

            'image/jpeg': 'uploads/images/',
      'image/png': 'uploads/images/',
      'image/gif': 'uploads/images/',
      'image/webp': 'uploads/images/',

            'video/mp4': 'uploads/videos/',
      'video/webm': 'uploads/webm/',

            'audio/mpeg': 'uploads/audio/',
      'audio/mp3': 'uploads/audio/',
      'audio/wav': 'uploads/audio/',
      'audio/ogg': 'uploads/audio/',
      'audio/webm': 'uploads/audio/',
      'audio/x-m4a': 'uploads/audio/',
      'audio/m4a': 'uploads/audio/',
      'audio/amr': 'uploads/audio/',

            'application/pdf': 'uploads/files/',
      'text/plain': 'uploads/files/',
      'application/msword': 'uploads/files/',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'uploads/files/',
    };

    const folder = typeMap[file.mimetype] || 'uploads/files/';
    const fullPath = path.resolve(process.cwd(), folder);

    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${unique}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [

        'image/jpeg', 'image/png', 'image/gif', 'image/webp',

        'video/mp4', 'video/webm',

        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/x-m4a', 'audio/m4a', 'audio/amr',

        'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest(`File type ${file.mimetype} is not supported`), false);
  }
};

const chatUpload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, 
  },
  fileFilter,
});

export default chatUpload;
