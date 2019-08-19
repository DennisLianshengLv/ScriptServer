let schedule = require('node-schedule')
let {runpath,runpytext,runpath_with_params} = require("../service/pythonService")
const PowerShell = require("../service/powershellService");
let storageService = require('../service/storageService')

function createTask(id, filename, executer, timesetting, parameters,callback)
{
    if(schedule.scheduledJobs[id]){
        let error={"message":"Task already exists."};  
        return callback(error,null);
    }

    var task = schedule.scheduleJob(id,timesetting,function(x,y,z){
        internalAddTask(x,y,z);
    }.bind(null,executer,filename,parameters));

    if(task){
        let result="Task created successed.";
        return callback(null,result);  
    }else{
        let error={"message":"Task create fail."};
        return callback(error,null); 
    }
     
}
    
function getTask(id,callback)
{
    if(!schedule.scheduledJobs[jobid]){
        let error={"message":"Task doesn't exists."};  
        return callback(error,null);
    }

    //what should we do if user want to get specific task???

}
    
function getAllTask(callback)
{
    var all_jobs = schedule.scheduledJobs;
    all_jobs.forEach(element => {
        console.log(element.jobName);
    })
    
    let result="Task get successed.";
        return callback(null,result);  
}
    
function deleteTask(id,callback)
{
    if(!schedule.scheduledJobs[id]){
            let error={"message":"Task doesn't exists."};  
            return callback(error,null);
        }

    var result = schedule.calceljob(id);
    if(result){
        let result="Task delete successfully";  
        return callback(null,result);
    }else{
        let error={"message":"Task doesn't exists."};  
        return callback(error,null);
    }
}

function deleteAllTasks(callback)
{
    var all_jobs = schedule.scheduledJobs;
    all_jobs.array.forEach(element => {
        schedule.calceljob(element);
});

let result="Task delete successfully";  
return callback(null,result);
}

module.exports = {
    createTask,
    getTask,
    getAllTask,
    deleteTask,
    deleteAllTasks
}

//Call the executer services
function internalAddTask(executer,filename,parameters){
    if(executer=="py"){
    runpath_with_params(filePath,params,function(data){
            console.log(data);
        });
    }
    else if(executer=="pw"){
        const commands = storageService.getScriptPath(filename);
        const params = parameters;
        let ps = new PowerShell(commands+" "+params);
        //console.log("Run powershell script:" +filename+" "+ parameters + new Date());
    }
}
