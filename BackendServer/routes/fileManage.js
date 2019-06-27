var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');
var archiver = require('archiver');
var bodyParser = require('body-parser');
var multer  = require('multer');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var upload = multer({ dest: path.join(__dirname,'temp')});  
router.use(upload.array("script"));

/*Template json for response.*/
var retjsonTep = {
  "data": 
  {
      "title": "RACos Api",
      "code":0,
      "content": "",
      "version": "1.1.0",
      "time": 0
  },
  "msg": ""
}

/*Import file demo htm, just for test.*/
router.get('/uploadui.htm', function (req, res) {
  res.sendFile( __dirname + "/" + "uploadui.htm" );
})

/*Create new file.*/
router.post('/script/:name/',function(req, res) {  
  console.log(req.body);
  var file_data=req.body.data;
  var file_name=path.join(path.resolve(__dirname,'..'),'scripts',req.params.name);

  var retjson = JSON.parse(JSON.stringify(retjsonTep)); 
  retjson.data.content=file_data;
  retjson.data.title="Create file";

  fs.exists(file_name,function(exist){
    if(exist)
    {
      res.statusCode=409;//Conflict
      retjson.data.code=1;
      retjson.msg="File has been exist."
    }
    else
    {
      fs.writeFileSync(file_name,file_data,'utf8',function(error){
        if(error)
        {
          retjson.data.code=3;
          retjson.msg=error;
        }
        else
        {
        res.statusCode=201;
        } 
      })
    }
    res.json(retjson);
    console.log(retjson);
  })
})

/* Update file with data*/
router.put('/script/:name/',function(req, res) { 
  console.log(req.body);
  var file_data=req.body.data;
  var file_name=path.join(path.resolve(__dirname,'..'),'scripts',req.params.name);

  var retjson = JSON.parse(JSON.stringify(retjsonTep));  
  retjson.data.content=file_data;
  retjson.data.title="Update file";

  fs.exists(file_name,function(exist)
  {
    if(exist)
    {
      fs.writeFileSync(file_name,file_data,'utf8',function(error){
        if(error)
        {
          retjson.data.code=3;
          retjson.msg=error;
        }
        else
        {
        res.statusCode=201;
        } 
      })
    }
    else
    {
      res.statusCode=409;//Conflict
      retjson.data.code=2;
      retjson.msg="File not exist."
    }
    res.json(retjson);
    console.log(retjson);
  })
})

/* Delete file by name. */
router.delete('/script/:name/', function(req, res) { 
  var file_name=path.join(path.resolve(__dirname,'..'),'scripts',req.params.name);

  var retjson = JSON.parse(JSON.stringify(retjsonTep)); 
  retjson.data.title="Delete file";

  fs.exists(file_name,function(exists){
    if(exists){
      fs.unlinkSync(file_name);
      res.statusCode=201;
    }
    else
    {
      res.statusCode=409;//Conflict
      retjson.data.code=2;
      retjson.msg="File not exist."
    }
    res.json(retjson);
  })
})

/* Rename. */
router.put('/script/:name/:newname/', function(req, res) { 
  var file_name=path.join(path.resolve(__dirname,'..'),'scripts',req.params.name);
  var newname=path.join(path.resolve(__dirname,'..'),'scripts',req.params.newname);

  var retjson = JSON.parse(JSON.stringify(retjsonTep)); 
  retjson.data.title="Rename file name";
  
  fs.exists(file_name,function(exists){
  if(exists)
    {
      fs.exists(newname,function(exists){
        if(exists){
          res.statusCode=409;//conflict.
          retjson.data.code=2;
          retjson.msg="The file with name "+newname+" has been existed";
        }
        else
        {
          fs.rename(file_name,newname,function(error){
            if(error)
            {
              retjson.data.code=3;
              retjson.msg=error;
              res.json(retjson);
            }
          });
          retjson.data.code=0;
        }  
        res.json(retjson);    
      })
    }
    else
    {
      res.statusCode=404;//not found
      retjson.data.code=2;
      retjson.msg="The file with name "+req.params.name+" not existed";
      res.json(retjson);
    }  
  })
})

/* Import. */
router.post('/import/script/',function (req, res) {
 
  console.log(req.files[0]);  // 上传的文件信息
  var retjson = JSON.parse(JSON.stringify(retjsonTep)); 
  retjson.data.title="Import file.";

  var des_file = path.join(path.resolve(__dirname,'..'),'scripts',req.files[0].originalname);
  fs.readFile( req.files[0].path, function (err, data) {
       fs.writeFile(des_file, data, function (err) {
        if( err ){
             console.log( err );
             retjson.msg=err;
        }
        
        res.json(retjson);
      });
  });
})

/* Export. */
router.get('/export/script/:name/',function (req, res) {
  var file_name=req.params.name;
  var retjson = JSON.parse(JSON.stringify(retjsonTep)); 
  retjson.data.title="Export file.";
  

var sourceFileName=path.join(path.resolve(__dirname,'..'),'scripts',file_name);
var archiveFileName = path.join(__dirname,'temp',file_name+'.zip');

fs.exists(sourceFileName,function(exist)
  {
    if(exist)
    {
      var output = fs.createWriteStream(archiveFileName);
      var archive = archiver('zip', {
          store: false // Sets the compression method to STORE. 
      });
              
      // listen for all archive data to be written 
      output.on('close', function() {
          console.log(archive.pointer() + ' total bytes');
          console.log('archiver has been finalized and the output file descriptor has closed.');
          res.download(archiveFileName);
      });
      
      archive.on('error', function(err) {
          throw err;
      });
      // pipe archive data to the file 
      archive.pipe(output);
      archive.file(sourceFileName, {
        name: file_name
      });
      // append files from a directory 
      //archive.directory(path,dest_path); 
      
      // finalize the archive (ie we are done appending files but streams have to finish yet) 
      archive.finalize();
      
    }
    else
    {
      res.statusCode=409;//Conflict
      retjson.data.code=2;
      retjson.msg="File not exist."
      res.json(retjson);
      console.log(retjson);
    }
  })
})

module.exports = router;
