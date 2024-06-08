import express from "express"
const router = express.Router()
import User from "../model/user.js"
import { generateToken, jwtAuthMiddleware } from "../middleware/auth.js";
import { userRegister, userProfilePhoto, getUserProfile, userLogin } from "../controllers/userController.js"
import fs from "fs";
import path from "path";
import multer from "multer"


router.post('/register', userRegister);
router.post('/login', userLogin);
router.get("/profile", jwtAuthMiddleware, getUserProfile)

let UploadPath = "public/upload";
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname);
    },
});
const upload = multer({
    storage: fileStorageEngine,
    fileFilter: (req, file, cb) => {
        console.log("File Type: ", file.mimetype);
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.error('File type not supported. Only images are allowed.');
            cb(new Error('File type not supported. Only images are allowed.'));
        }
    }
});

let FileSizeLimit = 10; // IN Mb
const fileSizeValidator = (req, res, next) => {
    let fileSize = req.headers['content-length'] / 1024 / 1024;
    fileSize = Math.round(fileSize);
    if (fileSize >= FileSizeLimit) {
        clog.error('File Size Exceed !!');
        return res.json({ status: 0, message: req.__('File Size Exceed 10 mb') });
    } else {
        next();
    }
}

// const upload = multer({ storage: fileStorageEngine });

router.post("/profile/photo", fileSizeValidator, upload.single("file"), userProfilePhoto)



export default router