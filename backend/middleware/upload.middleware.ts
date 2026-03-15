import multer from "multer"
import {v4 as uuidv4} from "uuid"
import path from "path"

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "images");
    },
    filename:function(req, file, cb){
        cb(null, Date.now()+'-'+file.originalname);
    }
});

// const fileFilter = (req: any, file: any, cb: any) => {
//     const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

//     if(allowedFileTypes.includes(file.mimetype)){
//         cb(null, true);
//     }else{
//         cb(new Error("Only JPG and PNG images are allowed"), false);
//     }
// };

export const upload = multer({storage});