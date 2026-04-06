const multer=require("multer")

//middleware -> upload

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        size: 3*1024*1024 //3MB
    },
    fileFilter: (req, file, cb) => {
        console.log("File upload received:", file.originalname, "Size:", file.size);
        cb(null, true);
    }
})

module.exports=upload