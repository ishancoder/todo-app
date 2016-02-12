var mongoose = require("mongoose");

var Workschema = mongoose.Schema({
	work: String,
	priority: {type: Number, default: 0},
	done: {type: Boolean, default: false}
});

Workschema.methods.incrementPriority = function(cb){
	this.priority += 1;
	this.save(cb);
};

Workschema.methods.decrementPriority = function(cb){
	if(this.priority > 0){
		this.priority -= 1;
	}
	this.save(cb);
}

mongoose.model("Work", Workschema);