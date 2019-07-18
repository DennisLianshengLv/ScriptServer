let path = require('path');
let fs = require('fs');
let archiver = require('archiver');
let storageService=require('../service/storageService');

module.exports = {
    createScriptFile(fileName,fileData,callback){
        let fileFullName=storageService.getScriptPath(fileName);
        if(fs.existsSync(fileFullName)){
            let error={"message":"File has exist."};  
            return callback(error,null);
        }
        else{
            try{
                fs.writeFileSync(fileFullName,fileData,'utf8');
                let result="File created successed.";
                return callback(null,result);
            }
            catch(e){
                return callback(e,null)
            }
        }
    },

    deleteScriptFile(fileName,callback){
        let fileFullName=storageService.getScriptPath(fileName);
        if(fs.existsSync(fileFullName)){
            try{
                fs.unlinkSync(fileFullName);
                let result="File delete successed.";
                return callback(null,result);
            }
            catch(e){
                return callback(e,null)
            }
        }
        else{
            error={"message":"File not exist."};  
            return callback(error,null);
        }
    },

    updateScriptFile(fileName,fileData,callback){
        fileFullName=storageService.getScriptPath(fileName);
        if(fs.existsSync(fileFullName)){
            try{
                fs.writeFileSync(fileFullName,fileData,'utf8');
                result="File update successed.";
                return callback(null,result);
            }
            catch(e){
                return callback(e,null)
            }
        }else{
            let error={"message":"File not exist."};    
            return callback(error,null);
        }
    },

    renameScriptFile(oldfileName,newfileName,callback){
        let fulloldName=storageService.getScriptPath(oldfileName);
        let fullnewName=storageService.getScriptPath(newfileName);

        if(fs.existsSync(fulloldName)){
            try{
                fs.renameSync(fulloldName,fullnewName);
                let result="File rename successed.";
                return callback(null,result);
            }
            catch(e){
                return callback(e,null)
            }
        }else{
            let error={"message":"File not exist."};    
            return callback(error,null);
        }
    },

    importScriptFile(importfile,callback){
        let fullsourceName=importfile.path;
        let fulldestName=storageService.getScriptPath(importfile.originalname);
        try{
            fs.renameSync(fullsourceName,fulldestName);
            let result="Import file successed.";
            return callback(null,result);
        }
        catch(e){
            return callback(e,null)
        }
    },

    async exportScriptFile(res,fileName,callback){
        let fileFullName=storageService.getScriptPath(fileName);
        var archiveFileName = path.join(__dirname,'temp',fileName+'.zip');

        if(fs.existsSync(fileFullName)){
            var output = fs.createWriteStream(archiveFileName);
      var archive = archiver('zip', {
          store: false // Sets the compression method to STORE. 
      });
              
      //listen for all archive data to be written 
      output.on('close', function() {
          console.log(archive.pointer() + ' total bytes');
          console.log('archiver has been finalized and the output file descriptor has closed.');
          //res.download(archiveFileName);
          return callback(null,archiveFileName);
      });
      
      archive.on('error', function(err) {
        return callback(error,null);
      });
      // pipe archive data to the file 
      archive.pipe(output);
      archive.file(fileFullName, {
        name: fileName
      });
      // append files from a directory 
      //archive.directory(path,dest_path); 
      
      // finalize the archive (ie we are done appending files but streams have to finish yet) 
      archive.finalize();
    }else{
    error={"message":"File not exist."};  
            return callback(error,null);
    }
    }
};