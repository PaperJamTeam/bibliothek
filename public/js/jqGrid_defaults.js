/**
 * Created by gharizanov on 30.7.2015 г..
 */
$.extend($.jgrid.defaults, {
	datatype: 'json',
	jsonReader : {
		repeatitems:false,
		total: function(result) {
			//Total number of pages
			return Math.ceil(result.total / result.max);
		},
		records: function(result) {
			//Total number of records
			return result.total;
		},
		id: "_id"
	},
	prmNames: {rows: 'max', search: null},
	height: 'auto',
	viewrecords: true,
	rowList: [10, 20, 50, 100],
	altRows: true,
	pager : '#pager',
	autoencode: true,
	autowidth: true,
	shrinkToFit: false,
	loadError: function(xhr, status, error) {
		alert(error);
	}
});
