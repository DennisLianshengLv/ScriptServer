let express = require('express');
let router = express.Router();

let path = require('path');
let multer  = require('multer');
let fileMangementService=require('../service/fileManageService');
let package=require('../utils/ResPackage');
let storageService=require('../service/storageService');

let upload = multer({ dest: storageService.getTempPath()});  
router.use(upload.array("script"));



/*Create new file.*/
router.post('/script/:name/',function(req, res, next) { 
    let response = new package();
    
    fileMangementService.createScriptFile(req.params.name,req.body.data,function(error,result){
        if(error){
            response.fillResWithError(error);
            res.send(JSON.stringify(response));
        }
        if(result){
            response.fillResWithData(result);
            res.send(JSON.stringify(response));
        }
    });
  });

/* Delete file by name. */
router.delete('/script/:name/',function(req, res, next) { 
  let response = new package();

  fileMangementService.deleteScriptFile(req.params.name,function(error,result){
    if(error){
        response.fillResWithError(error);
        res.send(JSON.stringify(response));
    }
    if(result){
        response.fillResWithData(result);
        res.send(JSON.stringify(response));
    }
  });
});

/* Update file with data*/
router.put('/script/:name/',function(req, res, next) { 
  let response = new package();

  fileMangementService.updateScriptFile(req.params.name,req.body.data,function(error,result){
    if(error){
        response.fillResWithError(error);
        res.send(JSON.stringify(response));
    }
    if(result){
        response.fillResWithData(result);
        res.send(JSON.stringify(response));
    }
  });
});

/* Rename. */
router.put('/script/:name/:newname/',function(req, res, next) { 
    let response = new package();
  
    fileMangementService.renameScriptFile(req.params.name,req.params.newname,function(error,result){
      if(error){
          response.fillResWithError(error);
          res.send(JSON.stringify(response));
      }
      if(result){
          response.fillResWithData(result);
          res.send(JSON.stringify(response));
      }
    });
  });

/* Import. */
router.post('/import/script/',function(req, res, next) { 
    let response = new package();
  
    fileMangementService.importScriptFile(req.files[0],function(error,result){
      if(error){
          response.fillResWithError(error);
          res.send(JSON.stringify(response));
      }
      if(result){
          response.fillResWithData(result);
          res.send(JSON.stringify(response));
      }
    });
  });

/* Export. */
router.get('/export/script/:name/',function(req, res, next) { 
  let response = new package();

  let exp=fileMangementService.exportScriptFile(res,req.params.name,function(error,result){
    if(error){
        response.fillResWithError(error);
        res.send(JSON.stringify(response));
    }
    if(result){
        res.end();
        //response.fillResWithData(result);
        //res.send(JSON.stringify(response));
    }
  });
});

/* ListALL. */
router.get('/scripts',function(req,res,next){
  let response = new package();
  
    fileMangementService.listScriptFiles(function(error,result){
      if(error){
          response.fillResWithError(error);
          res.send(JSON.stringify(response));
      }
      if(result){
          response.fillResWithData(result);
          res.send(JSON.stringify(response));
      }
    });
});

  module.exports=router;