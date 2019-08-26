let express = require('express');
let runpath = require("./pythonService").runpath;
let runpath_with_params = require("./pythonService").runpath_with_params;
let storageService = require('./storageService')
const powerShellService = require("./powershellService");
let {WriteResultToFile,GetCurrentLogFileName} = require("../service/ExecResoultService")

//Add.py,20 30 
function runPythonScript(fileName,params){
    //const filePath = storageService.getScriptPath(file);    
    const scriptPath = storageService.getScriptFolderPath()
    var fileInfo = GetCurrentLogFileName(fileName);
    if(params == undefined)
    {
        runpath(fileName,function(data,err){
          WriteResultToFile(data,err,fileInfo);
        },scriptPath)
    }
    else
    {
        runpath_with_params(fileName,params,function(data,err){
          WriteResultToFile(data,err,fileInfo);
        },scriptPath)
    }

    /*runpath_with_params(filePath,params,function(data){
          //console.log(data);
          //res.send(JSON.stringify(data));
          var today = date.format(new Date(),'YYYY-MM-DD HH:mm');
          _writeFileAdd(today,outputFile);
          _writeFileAdd(data['data'],outputFile);
      })*/

}

//script-loop.ps1/
function runPowershellScript(fileName,params)
{
    /*let filePath = storageService.getScriptPath(file);
    let outputFile = storageService.getOutputPath(file+".txt");
    let params = params;
    var today = date.format(new Date(),'YYYY-MM-DD HH:mm');
    _writeFileAdd(today,outputFile);
    let ps = new powerShellService(filePath+" "+params+" >>> "+outputFile);*/
    var commands = storageService.getScriptPath(fileName);
    //var commands = req.params.filename;
    if(params != undefined)
    {
      commands = commands+" "+params;
    }

    const scriptPath = storageService.getScriptFolderPath()
    var fileInfo = GetCurrentLogFileName(fileName);
    powerShellService.ExecPowershellCommand(commands,function(data,err){
        WriteResultToFile(data,err,fileInfo);
      },scriptPath)
}

module.exports = {
    runPythonScript,
    runPowershellScript
}