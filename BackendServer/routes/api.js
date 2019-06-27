
var express = require('express');
var router = express.Router();

/* GET users listing. */

router.put('/task:id', function(req, res, next) {
  console.log("task put:"+req.params.id);
  res.send("A");
});

router.get('/task:id', function(req, res, next) {
  console.log("task get:"+req.params.id);
  res.send("B");
});
router.delete('/task:id', function(req, res, next) {
  console.log("task delete:"+req.params.id);
  res.send("C");
});
router.post('/task:id', function(req, res, next) {
  console.log("task post:"+req.params.id);
  res.send("D");
});

module.exports = router;
