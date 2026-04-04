const multer=require("multer")

//middleware -> upload

const upload=multer({
    storag:multer.memoryStorage(),
    limits:{
        size: 3*1024*1024 //3MB
    }
})

module.exports=upload