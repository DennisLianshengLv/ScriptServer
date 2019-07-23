let schedule = require('node-schedule')

var taskMap = new Map();


function createTask(id, filename, executer, timesetting)
{
    const task = schedule.scheduleJob(timesetting,internalTestMehod(filename,timesetting));
    taskMap.set(id,task);
    return 'null';
}

function getTask(id)
{

}

function getAllTask()
{

}

function deleteTask(id)
{

}

function internalTestMehod(filename,timesetting)
{
    console.log("Internal test:FileName-"+filenname);
}

exports.createTask = createTask;