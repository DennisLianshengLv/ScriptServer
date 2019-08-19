let {exec,spawn} = require("child_process");
let crypto = require("crypto");
let os = require("os");
let path = require("path");
let fs = require("fs")
//let execc = require('child_process').exec;
let storageService = require('../service/storageService')
let _execpython = function(pythonpath,callback,paramslist,scriptPath){
    return new Promise((resolve,reject)=>{
        try {
            let spwanparmas = [pythonpath]
            if(paramslist){
                paramslist.forEach(
                    (value,index)=>{
                        value!="" && (spwanparmas.push(value))
                    }
                )
            }
            //const scriptPath = storageService.getScriptFolderPath();
            var spawnObj;
            if(scriptPath != undefined)
            {
                spawnObj = spawn("python.exe",spwanparmas,{cwd:scriptPath,encoding:"utf-8"});
            }
            else
            {
                spawnObj = spawn("python.exe",spwanparmas,{encoding:"utf-8"});
            }
            spawnObj.stderr.on("data",function(chunk){
                console.log('err : ' + chunk.toString());
                callback && callback(null,{err:chunk.toString(),pythonpath})
                //reject({err:`执行${pythonpath} 错误:${chunk}`,pythonpath})
            })
            spawnObj.stdout.on("data",function(chunk){
                console.log('success : ' + chunk.toString());
                callback && callback({data:chunk.toString(),pythonpath},null)
            })
            spawnObj.on('close', function(code) {
                console.log('close code : ' + code);
            })

        } catch (error) {
            reject({data:`执行${pythonpath} 异常:${error}`,pythonpath})
        }
        
    })
}


function runpath(fileName,callback,scriptPath){
    _execpython(fileName,callback,scriptPath).then(
        data=>{
            console.log('执行py文件成功 :', data);
            callback(data,null);
        },
        err=>{
            console.log('执行py路劲错误 :', err);
            callback(null,err)
        }
    )
    
}
function runpath_with_params(fileName,params,callback,scriptPath){
    //"[object Array]"
    let paramslist = []
    if(Object.prototype.toString.call(params) === "[object String]"){
        paramslist = params.split(" ")
    }
    if(Object.prototype.toString.call(params) === "[object Array]"){
        paramslist=params
    }
    
    _execpython(fileName,callback,paramslist,scriptPath).then(
        data=>{
            console.log('执行py文件成功 :', data);
            callback(data,null);
        },
        err=>{
            console.log('执行py路劲错误 :', err);
            callback(null,err)
        }
    )
}

/**
 * 把文本输入到　路劲
 * @param {*} pythontext 类python文件
 * @param {*} tmppath  路径
 */
let _writeFileAdd = function(pythontext,tmppath){
    return new Promise((resolve,reject)=>{
        fs.writeFile(tmppath,pythontext,{ 'flag': 'a' },function(err){
            if(err){
                reject(`writing data err! ${err}`)
            }else{
                resolve(tmppath)
            }
        })
    })
}
/**
 * 把文本输入到　路劲
 * @param {*} pythontext 类python文件
 * @param {*} tmppath  路径
 */
let _writeFile = function(pythontext,tmppath){
    return new Promise((resolve,reject)=>{
        fs.writeFile(tmppath,pythontext,function(err){
            if(err){
                reject(`writing data err! ${err}`)
            }else{
                resolve(tmppath)
            }
        })
    })
}
let _removeFile = function(tmppath){
    return new Promise((resolve,reject)=>{
        fs.unlink(tmppath,function(err){
            if (err) {
                reject(`remove file err! ${err}`)
            }else{
                resolve(`Delete succeed ${tmppath}`)
            }
        })
    })
}


let runpytext = (pythontext,callback)=>{
    let md5 = crypto.createHash("md5");
    let pathname = md5.update(pythontext).digest("hex")
    let tmppath = path.join(os.tmpdir(),`${pathname}.py`)
    console.log('tmppath :', tmppath);
    _writeFile(pythontext,tmppath).then(
        data=>{
            console.log(" Create file succeed :",data);
            let paramslist = []
            return _execpython(data,callback,paramslist).then(
                data=>{
                    console.log('执行py文件成功 :', data);
                    callback(data);
                },
                err=>{
                    console.log('执行py路劲错误 :', err);
                    callback(err)
                }
            )},
        err=>{
            console.log(' Create Failed :', err);
        }
    ).then(
        filedata =>{
            let {data,pythonpath} = filedata
            console.log(' Exec succeed :', data);
            return _removeFile(pythonpath)
        },
        err=>{
            let {data,pythonpath} = err
            console.log(' Exec failed:', data);
            return _removeFile(pythonpath)
        }
    ).then(
        data =>{
            console.log(' Delete succeed :', data);
        },
        err=>{
            console.log(' Delete failed :', err);
        }
    )
}

module.exports = {
    runpath,
    runpytext,
    runpath_with_params,
    _writeFileAdd,
    _removeFile
}