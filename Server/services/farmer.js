var Farmer = require('./model/farmer');
var resGen = require('./commons/responseGenerator');


exports.getFarmers = function(req, res){
	//isAvailable:true
	Farmer.find({isAvailable:true},{pass:0},function(err,results){
		if(err)
		{
			resGen.error(err,res);
		}
		else
		{
			if(results.length > 0){
				console.log("all farmers found");
				//console.log(results[1]);
				res(null,resGen.responseGenerator(200, results));
			}
			else
			{
				console.log("no data");
				resGen.error(null,res);
			}
		}
	});
}

exports.createFarmer = function(req, res){

	var farmer = Farmer({
		fname : req.fname,
		lname : req.lname,
		email : req.email,
		pass : req.pass,
		contacts: req.contacts,
		intro: req.intro,
		video: req.video,
		tax: req.tax,
		address : req.address,
		city : req.city,
		state: req.state,
		zipcode : req.zipcode
		//,f_id : req.f_id
	});

	farmer.save(function(err,results){
		if(err)
		{
			console.log("err at save");
			resGen.error(err,res);
		}
		else
		{
			if(results){
				console.log("farmer created");
				//console.log(results);
				res(null,resGen.responseGenerator(200, results));
			}
			else
			{
				console.log("no data");
				resGen.error(null,res);
			}
		}
	});
}

exports.editFarmer = function(req, res){

	Farmer.findOne({f_id:req.f_id},{pass:0},function(err,result){
		if(err)
		{
			resGen.error(err,res);
		}
		else
		{
			//console.log(result);
			if(result){
				result.fname = req.fname;
				result.lname = req.lname;
				result.email = req.email;
				result.address = req.address;
				result.city = req.city;
				result.state = req.state;
				result.zipcode = req.zipcode;
				result.intro = req.intro;
				result.video = req.video;
				result.tax = req.tax;
				result.contacts = req.contacts;
				result.isActive = req.isActive;
				result.isAvailable = true;
				console.log(req.isActive);
				//result.city = req.city ? req.city : result.city;
				//result.zipcode = req.zipcode ? req.zipcode : result.zipcode;
				//result.intro = req.intro ? req.intro : result.intro;
				result.save(function(err,doc){
					if(err){
						resGen.error(err,res);
					} else {
						console.log("farmer edited");
						//console.log(doc);
						res(null,resGen.responseGenerator(200,doc));
					}
				});
			}
			else
			{
				resGen.error(null,res);
			}
		}
	});
}

exports.deleteFarmer = function(req, res){

	Farmer.findOne({f_id:req.f_id},function(err,result){
		if(err)
		{
			resGen.error(err,res);
		}
		else
		{
			if(result){
				console.log("farmer found");
				//console.log(result);
				result.isAvailable = false;
				result.save(function(err,doc){
					if(err){
						resGen.error(err,res);
					} else {
						console.log("farmer inactive now");
						//console.log(doc);
						res(null,resGen.responseGenerator(200, doc.isActive));
					}
				});
			}
			else
			{
				console.log("no data delete farmer");
				resGen.error(null,res);
			}
		}
	});
}
