const express = require('express');
const router = express.Router();

const indexRouter = require('./index');
const usersRouter = require('./TaskRouter');
const scriptExec = require('./ScriptExecRouter');
const fileManageRouter=require('./fileManageRouter');

router.use('/', indexRouter);
router.use('/TaskRouter', usersRouter);
router.use('/v1/filemanange', fileManageRouter);
router.use('/v1/ScriptExec',scriptExec);
module.exports = router;