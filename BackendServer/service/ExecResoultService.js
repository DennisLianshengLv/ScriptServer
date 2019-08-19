const maxFileCount = 10;
let storageService = require('../service/storageService')
let {_writeFileAdd,_removeFile} = require("../service/pythonService")
var moment = require('moment');
var fs = require("fs");
async function AsyncSort(dir,files)
{
    let sorted = await files.sort((a, b) => {
        let s1 = fs.statSync(dir + a);
        let s2 = fs.statSync(dir + b);
        return s1.mtime.getTime() - s2.mtime.getTime();
    });
    /*sorted.forEach(file => {
        console.log(file+"  "+fs.statSync(dir + file).mtime);  //mtime mean last modify time  ctime mean create time
    });*/
    return sorted;
}

function AddWatchForFolder(FolderInfo,callback)
{
    var watcher = fs.watch(FolderInfo, {
        persistent: true, // 设为false时，不会阻塞进程。
        recursive: false
    }, function(event, filename) {
        if (event === 'change') {
            callback(FolderInfo);
        }
    });
}

async function CheckInfoFolderFileNumber(dir)
{
    let files = fs.readdirSync(dir);
    /*files.forEach(file => {
        console.log(file+"  "+fs.statSync(dir + file).mtime);  //mtime mean last modify time  ctime mean create time
    });*/
    while( files.length > 10 ) {
        console.log(files.length);
        await AsyncSort(dir,files).then((sorted) => {
        /*let sorted = files.sort((a, b) => {
            let s1 = fs.statSync(dir + a);
            let s2 = fs.statSync(dir + b);
            return s1.mtime.getTime() > s2.mtime.getTime();
        });*/
        console.log("Remove" + dir + sorted[0]);
        fs.unlinkSync(dir + sorted[0]);
        files = fs.readdirSync(dir);    
        });
    }
}

function WriteResultToFile(data,err,fileInfo)
{
    let outputfolder = storageService.getOutputFolderPath();
    if(data != undefined)
    {
        let outputInfoFile = storageService.getOutputInfoPath("Info_"+fileInfo + ".log");
        _writeFileAdd(data['data'],outputInfoFile).then
        (
            data=>{
                CheckInfoFolderFileNumber(outputfolder+"Info\\");
            }
        )        
    }
    if(err != undefined)
    {
        let outputErrorFile = storageService.getOutputErrorPath("Error_"+fileInfo + ".log");
        _writeFileAdd(err['err'],outputErrorFile).then
        (
            data=>{
                CheckInfoFolderFileNumber(outputfolder+"Info\\");
            }
        )        
    }   
}

function GetCurrentLogFileName(fileName)
{
    var NowTime = moment().format("_YYYY_MM_DD_HH_mm_ss_SSS");
    return fileName + NowTime;
}

module.exports = {
    AddWatchForFolder,
    WriteResultToFile,
    GetCurrentLogFileName
}