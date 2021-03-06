
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connection = mongoose.createConnection("mongodb://localhost/amazon");
autoIncrement.initialize(connection);

var detailSchema = mongoose.Schema({
	p_id: {
		type: Number, 
		required: true
	},
	f_id: {
		type: Number, 
		required: true
	},
	qty: {
		type: Number, 
		required: true
	},
	price: {
		type: Number, 
		required: true
	}
});

var orderSchema = mongoose.Schema({
	o_id: {type: Number, required: true, index: true},
	c_id: {
		type: Number, 
		required: true
		//ref: 'User.c_id'
	},
	driver_id: {
		type: Number
	},
	order_detail: [detailSchema],
	address: {type: String, required:true},
	zipcode: {type: Number, required: true},
	city: {type: String, required: true},
	state: {type: String, required: true},
	contact: Number,
	sub_total: Number,
	tax: Number,
	ship_cost: Number,
	total: Number,
	estimate_delivery_time: Number,
	pickup_time: Date,
	drop_time: Date,
	distance: Number,
	truck_id: Number,
	status: {
		type: String,
		required: true,
		default: 'pending'
	}
},
{
	collection: 'orders',
    timestamps: true,
    versionKey: false
});


orderSchema.plugin(autoIncrement.plugin, {
	model: 'Order',
    field: 'o_id',
    startAt: 600000001,
    incrementBy: 1});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
