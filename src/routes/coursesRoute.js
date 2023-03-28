const express = require('express')
const multer = require('multer')
const path = require('path')
const yauzl = require('yauzl')
const fs = require('fs')
const {db,entities} = require('../../models')
const xml2js = require('xml2js')
const parser = xml2js.Parser()
const coursesRouter= express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file.originalname)
      if(file.originalname.endsWith('.zip')){//verify if zip extention
        
        const directoryName= file.originalname.split('.zip')[0]
        
        fs.mkdir('./src/uploads/'+directoryName,{recursive:true},(err,data)=>{//recurcive =true if the parentt directory does not exist it will create it
          if(!err){
            
                cb(null,'./src/uploads/'+directoryName+'/')    
                req.extractToDirectory ='./src/uploads/'+directoryName+'/'   
                
          }
          else{
            console.log('an error has happend')

            throw err
            
          }


        })
        
      }
    },
    filename: async function (req, file, cb) {
        if(file.originalname.endsWith('.zip')){
           
            cb(null, file.originalname);
            req.fileName = file.originalname

        }
    },
  });
const upload = multer({ storage: storage });
coursesRouter.post('/add',upload.single('zipFile'),(req,res)=>{
    const extractToDirectory = req.extractToDirectory
    
   const fileName = req.fileName
   if(fileName && extractToDirectory){
    yauzl.open(extractToDirectory+fileName,{lazyEntries:true},(err,zipfile)=>{
        if(err){

            res.sendStatus(500)
    
        }   

        else{
           
            zipfile.readEntry()
            zipfile.on("entry",function(entry){
                

                
                if (/\/$/.test(entry.fileName)) {
                    
                    // Directory file names end with '/'.
                    // Note that entires for directories themselves are optional.
                    // An entry's fileName implicitly requires its parent directories to exist.
                    zipfile.readEntry();
                   
                 }
                 else{
                     
                   
                    const filePath = path.join(extractToDirectory, entry.fileName)
                    const fileDirectory = path.dirname(filePath)
                          
                    // Create directory if it doesn't exist
                    if (!fs.existsSync(fileDirectory)) {
                        fs.mkdirSync(fileDirectory, { recursive: true })
                    }
                    zipfile.openReadStream(entry, function(err, readStream) {
                        if (err) {
                            console.log(err)
                        } else {
                            if(entry.fileName=='tincan.xml'){
                               readStream.on('data',chunk=>{
                                parser.parseString(chunk, async function(err, result) {
                                    await db['Course'].create({
                                        id: result.tincan.activities[0].activity[0].$.id,
                                        name:fileName.split('.zip')[0],
                                        url:fileName.split('.zip')[0]+'/'+'story.html'




                                    })
                                    console.log(result.tincan.activities[0].activity[0].$.id);
                                });
                               })     
                                
                            } 
                            readStream.on("end", function() {
                                zipfile.readEntry();
                                
                            })
                            readStream.pipe(fs.createWriteStream(filePath))

                        }
                    })

                   
                    //zipfile.readEntry();
                 }
            })
            
            /*db['Course'].create({
                name:fileName.split('.zip')[0],
                url:fileName.split('.zip')[0]+'/story.html'

            })*/
            
            res.sendStatus(200)
            
    
        }
    
        
       
       
    
        });
        
   }
   else{
    console.log('the extract to directory is not found')
    res.send(500)
   }
    

})

module.exports = coursesRouter