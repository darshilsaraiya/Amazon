var Product = require('./model/product');
var Farmer = require('./model/farmer');
var Category = require('./model/category');
var resGen = require('./commons/responseGenerator');
var Farmer = require('./model/farmer');


exports.suggest = function(req, callback){
	// console.log("SERVER suggest");
	q = req.q;
	// console.log(q);

	re = new RegExp('(^|\\s+)'+q,'i');
	// console.log(re);
	Product.aggregate([{$match: {name: new RegExp('(^|\\s+)'+q,'i')}}, {$group: {_id:'$name', name: {$first:'$name'}, 'p_id':{$first:'$p_id'}}}, {$limit: 5}]).exec(function(err, name){
		// Product.find({name: new RegExp('(^|\\s+)'+q,'i')}, 'name').exec(function(err, name){
		// console.log(name);
		callback(null, JSON.stringify(name));
	});
	// Product.find()
}
exports.getProducts = function(req, res){

	Product.find({isActive:true},function(err,results){
		if(err)
		{
			resGen.error(err,res);
		}
		else
		{
			if(results.length > 0){
				console.log("all products found");
				//console.log(results[0]);
				res(null,resGen.responseGenerator(200, results));
			}
			else
			{
				console.log("no data");
				resGen.error("null",res);
			}
		}
	});
}


exports.getCategory = function(req,res){
	Category.find({},function(err,results){
		if(err){
			resGen.error(err,res);
		} else {
			if(results){
				console.log("categories found");
				console.log(results);
				res(null,resGen.responseGenerator(200,results));
			}
		}
	})

}

exports.prod_search = function(msg, callback){

	searchData = {};
	if(typeof msg.cat_id != 'undefined'){

		searchData.cat_id = msg.cat_id;
	}
	if(typeof msg.search != 'undefined'){
		regexp = new RegExp('(^|\\s+)'+msg.search,'i')
		searchData.name = regexp;	
	}
	
	console.log(searchData);

	Product.find(searchData, function(err, product){
		if(product == "")
				{
					console.log(err);
					res.code = "401";
					res.value = "Failed to fetch Product";
				}
			else
				{
				// console.log(product);
					res.code = "200";
					res.value = "Product Fetched";
					res.object = product;
				}
		callback(null, res);
	});

	// if (msg.search != undefined && msg.cat_id != undefined) {
	// // Product.find({name: /.*T.*/, cat_id: msg.cat_id, isActive: true}, function(err, product) {
	// Product.find({}, function(err, product) {
	// 	if(product == "")
	// 			{
	// 			console.log(err);
	// 			res.code = "401";
	// 			res.value = "Failed to fetch Product";
	// 			}
	// 		else
	// 			{
	// 			// console.log(product);
	// 			res.code = "200";
	// 			res.value = "Product Fetched";
	// 			res.object = product;
	// 			}
	// 	callback(null, res);
	// });
	// }	
	// if (msg.search != undefined && msg.cat_id == undefined) {
	// 	console.log("Category is undefined");
	// Product.find({name: new RegExp('(^|\\s+)'+msg.search,'i'), isActive: true}, function(err, product) {
	// 	if(product == "")
	// 			{
	// 			console.log(err);
	// 			res.code = "401";
	// 			res.value = "Failed to fetch Product";
	// 			}
	// 		else
	// 			{
	// 			// console.log(product);
	// 			res.code = "200";
	// 			res.value = "Product Fetched";
	// 			res.object = product;
	// 			// console.log(product);
	// 			}

	// 	callback(null, res);
	// });
	// }
	// if (msg.search == undefined && msg.cat_id != undefined) {
	// Product.find({cat_id: msg.cat_id,isActive: true}, function(err, product) {
	// 	if(product == "")
	// 			{
	// 			console.log(err);
	// 			res.code = "401";
	// 			res.value = "Failed to fetch Product";
	// 			}
	// 		else
	// 			{
	// 			// console.log(product);
	// 			res.code = "200";
	// 			res.value = "Product Fetched";
	// 			res.object = product;
	// 			}
	// 	callback(null, res);
	// });
	// }
};


exports.get_prod = function(msg, callback){
	var res = {};
	console.log("In servers get prod");
	console.log(msg);
	console.log(msg.p_id);

	Product.find({p_id: msg.p_id,isActive: true}, function(err, product) {
		if(product == "")
				{
				console.log(err);
				res.code = "401";
				res.value = "Failed to fetch Product";
				}
			else
				{
				console.log(product);
				res.code = "200";
				res.value = "Product Fetched";
				res.object = product;
				}
		callback(null, res);
	});
};

exports.farmer_page = function(msg, callback){
	var p= {};
	var f= {};
	
	//console.log("In servers get farmers");
	Farmer.find({f_id: msg.f_id}, function(err, farmer) {
		if(farmer == "")
				{
				console.log(err);
				farmer.code = "401";
				farmer.value = "Failed to fetch farmer_page";

				}
			else
				{
				//console.log(farmer);
				f.code = "200";
				f.value = "Farmer Fetched";
				f.object = farmer;
				console.log(farmer);
				Product.find({f_id: msg.f_id}, function(err, product) {
		if(product == "")
				{
				console.log(err);
				product.code = "401";
				product.value = "Failed to fetch prod info";
				}
			else
				{
				console.log(product);
				p.code = "200";
				p.value = "Farmer products Fetched";
				p = product;
				//console.log(p);
				
	//console.log(p);
	//console.log(f);
	var res = {"farmer": f,"product": p};
	callback(null, res);
				}
	});
				}
	});
};
	exports.myReviews = function(msg, callback){
	var p= {};
	var f= {};
	
	//console.log("In servers get farmers");
	Farmer.find({"reviews.username" : msg.sid}, function(err, farmer) {
		if(farmer == "")
				{
				console.log(err);
				farmer.code = "401";
				farmer.value = "Failed to fetch farmer review";
				console.log("No farmer fetched");
				}
			else
				{
				//console.log(farmer);
				f.code = "200";
				f.value = "Farmers review Fetched";
				f.object = farmer;
				}
				Product.find({"reviews.username": msg.sid}, function(err, product) {
		if(product == "")
				{
				console.log(err);
				product.code = "401";
				product.value = "Failed to fetch prod reviews";
				}
			else
				{
				//console.log(product);
				p.code = "200";
				p.value = "Products reviews Fetched";
				p = product;
				//console.log(p);
				
	console.log(p);
	console.log(f.object);
	var res = {"farmer": f,"product": p};
	callback(null, res);
				}
	});
				
	});
};

exports.create_review = function(msg, callback){
	var res = {};
	console.log("In servers create review");
	console.log(msg);
	Product.update({"p_id": msg.p_id}, {"$push": {"reviews": {"c_id": msg.c_id, "username": msg.name,"rating": msg.star,"review_title": msg.title,"review_desc": msg.review}}},{upsert:true},function(err){
        console.log("In prod update");
        if(err){
                console.log(err);res.code = "401";
				res.value = "Failed to create review";
        }else{	
        		res.code = "200";
				res.value = "Review Created";
                console.log("create_review successful");
        }
        callback(null, res);
});
};

exports.f_create_review = function(msg, callback){
	var res = {};
	console.log("In servers farmer create review");
	console.log(msg);
	Farmer.update({"f_id": msg.f_id}, {"$push": {"reviews": {"c_id": msg.c_id, "username": msg.name,"rating": msg.star,"review_title": msg.title,"review_desc": msg.review}}},{upsert:true},function(err){
        console.log("In f_create update place");
        if(err){
                console.log(err);res.code = "401";
				res.value = "Failed to create review";
        }else{	
        		res.code = "200";
				res.value = "Review Created";
                console.log("Farmers create_review successful");
        }
        callback(null, res);
});
};


exports.createProduct = function(req, res){
/*
		"name" : req.param("name"),
		"f_id" : req.param("f_id"),
		//"f_name": req.param("f_name"),
		"cat_id" : req.param("cat_id"),
		"price" : req.param("price"),
		"weight" : req.param("weight"),
		"unit" : req.param("unit"),
		"quantity": req.param("quantity"),
		"details" : req.param("details"),
		"description" : req.param("description"),
		"features": req.param("features"),
		"sid":req.sessionID
*/	
	var farmer_name = null;
	console.log("in createProduct");
	Farmer.findOne({f_id:req.f_id},function(err,result){
		if(err){
			console.log("error finding farmer");
			console.log(err);
			resGen.error(err,res);
		}else{
			if(result){
				console.log("result found");
				farmer_name = result.fname + " " + result.lname;	
				console.log(farmer_name);	
				var product = Product({
					//p_id : req.p_id,
					name : req.name,
					f_id: req.f_id,
					f_name: farmer_name,
					cat_id: req.cat_id,
					price : req.price,
					weight : req.weight,
					unit: req.unit,
					price_unit: Number(req.price)/Number(req.weight),
					quantity: req.quantity,
					details : req.details,
					description : req.description,
					features: req.features,
					product_img: req.product_img
				});
				product.images[0] = req.image1;
				product.images[1] = req.image2;
				product.images[2] = req.image3;
				console.log(req.product_img);
				product.save(function(err,results){
					if(err)
					{
						resGen.error(err,res);
					}
					else
					{
						if(results){
							console.log("product created");
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
			else{
				console.log("no result add product");
				res(null,result);
			}
		}
	});

}

exports.editProduct = function(req, res){

	Product.findOne({p_id:req.p_id},{pass:0},function(err,result){
		if(err)
		{
			resGen.error(err,res);
		}
		else
		{
			console.log(result);
			if(result){
				result.name = req.name;
				
				if(result.f_id != req.f_id){
					Farmer.find({f_id:req.f_id}, {fname:1,lname:1,f_id:1}, function(err,res){
						if(err){
							resGen.error(err,res);
						} else {
							result.farmer_name = res.fname + " " + res.lname;
							result.f_id = res.f_id;
						}
					});
				}
				console.log(result.f_id);
				result.cat_id = req.cat_id;
				result.price = req.price;
				result.weight = req.weight;
				result.unit = req.unit;
				result.details = req.details;
				result.description = req.description;
				result.features = req.features;
				result.quantity = req.quantity;
				//result.description = req.description;
				result.save(function(err,doc){
					if(err){
						resGen.error(err,res);
					} else {
						console.log("product edited");
						//console.log(doc);
						res(null,resGen.responseGenerator(200, doc));
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

exports.deleteProduct = function(req, res){

	console.log(req.p_id);
	Product.findOne({p_id:req.p_id},function(err,result){
		if(err)
		{
			resGen.error(err,res);
		}
		else
		{
			console.log(result);
			if(result){
				//console.log("all products found");
				//console.log(result);
				result.isActive = false;
				result.save(function(err,doc){
					if(err){
						resGen.error(err,res);
					} else {
						console.log("product inactive now");
						//console.log(doc);
						res(null,resGen.responseGenerator(200, doc.isActive));
					}
				});
			}
			else
			{
				console.log("no data delete product");
				resGen.error(null,res);
			}
		}
	});
}
