import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { message: null });
});

router.get("/chat", (req, res)=>{
  res.render('chat',{})
})

module.exports = router;
