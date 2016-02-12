var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Work = mongoose.model('Work');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('work', function(req, res, next, id){
	var query = Work.findById(id);
	query.exec(function(err, work){
		if(err){return next(err);}
		if(!work){return next(new Error("Can't find the work!"));}
		req.work = work;
		return next();
	});
});

router.get('/works', function(req, res, next){
	Work.find(function(err, works){
		if(err){return next(err); }
		res.json(works);
	});
});

router.post('/works', function(req, res, next){
	var work = new Work(req.body);
	work.save(function(err, work){
		if(err){return next(err);}
		res.json(work);
	});
});

router.post('/works/:work/remove', function(req, res, next){
	var workRemoved = req.work;
	Work.remove(req.work, function(err){
		if(err){return next(err);}
		res.json(workRemoved);
	});
});

module.exports = router;
