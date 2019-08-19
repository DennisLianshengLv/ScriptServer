

var express = require('express');
var router = express.Router();
var taskService = require('../service/taskServices');
let package=require('../utils/ResPackage');

//create a task
router.put('/task:id/:filename/:executer/:timesetting/:parameters', function(req, res, next) {
  let response = new package();

  taskService.createTask(req.params.id,req.params.filename,req.params.executer,req.params.timesetting,req.params.parameters,function(error,result){
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

//get a task
router.get('/task:id', function(req, res, next) {
  let response = new package();

  taskService.getTask(id,function(error,result){
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

//get all tasks
router.get('/task/any', function(req, res, next) {
  let response = new package();

  taskService.getAllTask(function(error,result){
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

//delete a task
router.delete('/task:id', function(req, res, next) {
  let response = new package();

  taskService.deleteTask(id,function(error,result){
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

//delete all task
router.delete('/task/any', function(req, res, next) {
  let response = new package();

  taskService.deleteAllTasks(function(error,result){
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

//update a task
router.post('/task:id', function(req, res, next) {
  res.send("Update a task");
});

module.exports = router;
