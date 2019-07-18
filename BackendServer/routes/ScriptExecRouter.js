let express = require('express');
let router = express.Router();
let {runpath,runpytext,runpath_with_params} = require("../service/pythonService")
const PowerShell = require("../service/powershellService");
let storageService = require('../service/storageService')

//import os;import time;time.sleep(1);import sys;a = int(30)+int(40);print(a)
router.get('/ExecPY/:command', function(req, res, next) {
  const params =  req.params.command;
  runpytext(params ,function(data){
    console.log(data);
    res.send(JSON.stringify(data));
  })
});

//Add.py/20 30 
router.get('/ExecPY/:pyfilename/:parameters', function(req, res, next) {
    const filePath = storageService.getScriptPath(req.params.pyfilename);
    const params = req.params.parameters;
    runpath_with_params(filePath,params,function(data){
        console.log(data);
        res.send(JSON.stringify(data));
    })
});

//security have trouble
//script-loop.ps1/
router.get('/Powershell/:filename/:parameters', function(req, res, next) {
    const commands = storageService.getScriptPath(req.params.filename);
    const params = req.params.parameters;
    let ps = new PowerShell(commands+" "+params);
      
      // Handle process errors (e.g. powershell not found)
      ps.on("error", err => {
        console.error(err);
      });

      // Stdout
      ps.on("output", data => {
        console.log(data);
        res.send(JSON.stringify(data));
      });

      // Stderr
      ps.on("error-output", data => {
          console.error(data);
      });

      // End
      ps.on("end", code => {
        console.log(code);
        //res.send(JSON.stringify(code));
      });
  });

//echo 'powershell is awesome'
router.get('/Powershell/:command', function(req, res, next) {
      // Start the process
      const commands = req.params.command;
      let ps = new PowerShell(commands);
      
      // Handle process errors (e.g. powershell not found)
      ps.on("error", err => {
        console.error(err);
      });

      // Stdout
      ps.on("output", data => {
        console.log(data);
        res.send(JSON.stringify(data));
      });

      // Stderr
      ps.on("error-output", data => {
          console.error(data);
      });

      // End
      ps.on("end", code => {
        console.log(code);
      });
  });

module.exports = router;

