import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // can be used a unique suffix 
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage })