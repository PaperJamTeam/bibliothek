/**
 * Created by gharizanov on 21.7.2015 г..
 */
import mongoose = require('mongoose');

function AbstractSchema() {
	mongoose.Schema.apply(this, arguments);

	this.statics.queryForTable = () => {
		//TODO
	};
}
