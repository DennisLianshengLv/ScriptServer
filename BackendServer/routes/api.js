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


router.put('/script:id', function(req, res, next) {
  console.log("script put:"+req.params.id);
  res.send("A");
});

router.get('/script:id', function(req, res, next) {
  console.log("script get:"+req.params.id);
  res.send("B");
});
router.delete('/script:id', function(req, res, next) {
  console.log("script delete:"+req.params.id);
  res.send("C");
});
router.post('/script:id', function(req, res, next) {
  console.log("script post:"+req.params.id);
  res.send("D");
});

module.exports = router;
