
var express = require('express');
var router = express.Router();
let taskService = require('../services/taskServices.js');

//create a task
router.put('/task:id/:filename/:executer/:timesetting', function(req, res, next) {
  console.log("task id:"+req.params.id);
  console.log("task filename:"+req.params.filename);
  console.log("task executer:"+req.params.executer);
  console.log("task timesetting:"+req.params.timesetting);

  taskService.createTask22(id,filename,executer,timesetting);

  res.send("Create a task");
});

//get a task
router.get('/task:id', function(req, res, next) {
  console.log("task get:"+req.params.id);
  res.send("get a task");
});

//get all tasks
router.get('/task/any', function(req, res, next) {
  console.log("task get:"+req.params.id);
  res.send("Get all tasks");
});

//delete a task
router.delete('/task:id', function(req, res, next) {
  console.log("task delete:"+req.params.id);
  res.send("Delete a task");
});

//delete all task
router.delete('/task/any', function(req, res, next) {
  console.log("task all delete");
  res.send("Delete all task");
});

//update a task
router.post('/task:id', function(req, res, next) {
  console.log("task post:"+req.params.id);
  res.send("Update a task");
});

module.exports = router;
