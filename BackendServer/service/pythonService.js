let {exec,spawn} = require("child_process");
let crypto = require("crypto");
let os = require("os");
let path = require("path");
let fs = require("fs")
let _execpython = function(pythonpath,callback,paramslist){
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
            let spawnObj = spawn("python",spwanparmas,{encoding:"utf-8"});
            spawnObj.stdout.on("data",function(chunk){
                console.log('success : ' + chunk.toString());
                callback && callback({data:chunk.toString(),pythonpath})
            })
            spawnObj.stderr.on("data",function(chunk){
                console.log('err : ' + chunk.toString());
                reject({data:`执行${pythonpath} 错误:${chunk}`,pythonpath})
                // callback && callback({data:chunk.toString(),pythonpath})
            })
            spawnObj.on('close', function(code) {
                console.log('close code : ' + code);
            })

        } catch (error) {
            reject({data:`执行${pythonpath} 异常:${error}`,pythonpath})
        }
        
    })
}


function runpath(path,callback){
    _execpython(path,callback).then(
        data=>{
            try{
                //It's a json
                const result = JSON.parse(results[0]);
                callback(result);
            } catch(error) {
                //It's not json
                callback(results);
            }
        },
        err=>{
            console.log('执行py路劲错误 :', err);
            callback(err)
        }
    )
}
function runpath_with_params(path,params,callback){
    //"[object Array]"
    let paramslist = []
    if(Object.prototype.toString.call(params) === "[object String]"){
        paramslist = params.split(" ")
    }
    if(Object.prototype.toString.call(params) === "[object Array]"){
        paramslist=params
    }
    
    _execpython(path,callback,paramslist).then(
        data=>{
            console.log('执行py文件成功 :', data);
            callback(data);
        },
        err=>{
            console.log('执行py路劲错误 :', err);
            callback(err)
        }
    )
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
    runpath_with_params
}