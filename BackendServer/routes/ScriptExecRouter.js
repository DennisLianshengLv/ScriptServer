let express = require('express');
let router = express.Router();
let {WriteResultToFile,GetCurrentLogFileName} = require("../service/ExecResoultService")
let {runpath,runpytext,runpath_with_params} = require("../service/pythonService")
let storageService = require('../service/storageService')
let powerShellService = require('../service/powershellService')

//import os;import time;time.sleep(1);import sys;a = int(30)+int(40);print(a)
router.get('/ExecPYCommand/:command', function(req, res, next) {
  const params =  req.params.command;
  var fileInfo = GetCurrentLogFileName("PythonCommand");
  runpytext(params ,function(data,err){
    WriteResultToFile(data,err,fileInfo);
  })
  res.send("Begin exec python command");
});

//Add.py?parameters=20 30
router.get('/ExecPYFile/:pyfilename', function(req, res, next) {
      const scriptPath = storageService.getScriptFolderPath();
      //const filePath = storageService.getScriptPath(req.params.pyfilename);
      if(req.query.parameters != undefined)
      {
        var params = req.query.parameters;
      }
      var fileInfo = GetCurrentLogFileName(req.params.pyfilename);
      if(params == undefined)
      {
          runpath(req.params.pyfilename,function(data,err){
            WriteResultToFile(data,err,fileInfo);
          },scriptPath)
      }
      else
      {
          runpath_with_params(req.params.pyfilename,params,function(data,err){
            WriteResultToFile(data,err,fileInfo);
          },scriptPath)
      }
    res.send("Begin exec python script");
});


//script-loop.ps1
router.get('/PowershellFile/:filename', function(req, res, next) {
    const scriptPath = storageService.getScriptFolderPath();
    var commands = storageService.getScriptPath(req.params.filename);
    //var commands = req.params.filename;
    if(req.query.parameters != undefined)
    {
      commands = commands+" "+req.query.parameters;
    }
    var fileInfo = GetCurrentLogFileName(req.params.filename);
    powerShellService.ExecPowershellCommand(commands,function(data,err){
      WriteResultToFile(data,err,fileInfo);
    },scriptPath)
    res.send("Begin exec powershell script");
  });

//echo 'powershell is awesome'
router.get('/PowershellCommand/:command', function(req, res, next) {
      // Start the process
      const commands = req.params.command;
      var fileInfo = GetCurrentLogFileName("PowershellCommand");
      powerShellService.ExecPowershellCommand(commands,function(data,err){
        //console.log(err['err']);
        WriteResultToFile(data,err,fileInfo);
      })
      res.send("Begin exec powershell command");
  });

module.exports = router;

