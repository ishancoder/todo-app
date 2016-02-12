var mongoose = require("mongoose");

var Workschema = mongoose.Schema({
	work: String
});

mongoose.model("Work", Workschema);