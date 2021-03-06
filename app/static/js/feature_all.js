var viewModel = {
	columns  : ko.observableArray([
		{col: "id", val: "#", type: "string", state: ko.observable("")},
		{col: "title", val: "Title", type: "string", state: ko.observable("")},
		{col: "descr", val: "Description", type: "string", state: ko.observable("")},
		{col: "client", val: "Client", type: "string", state: ko.observable("")},
		{col: "priority", val: "Priority", type: "string", state: ko.observable("")},
		{col: "deadline", val: "Target Date", type: "date", state: ko.observable("")},
		{col: "url", val: "Ticket URL", type: "string", state: ko.observable("")},
		{col: "prodarea", val: "Product Area", type: "string", state: ko.observable("")},
	]),
	features : ko.observableArray([]),
	sortClick : function(col) {
		setSortingArrow(col);
		switch(col.type) {
			case "string":
				stringSort(col);
				break;
			case "date":
				dateSort(col);
		}
	},
	filterColumn : function() {
		var column = viewModel.columns().filter(function(column) {
			return column["val"].toLowerCase() 
				=== $("#selectedColumn").text().toLowerCase();
		});
		column = column[0].col;
		console.log(column);
		filterColumn(column);
	},
	filterTerm : ko.observable("")
};

function filterColumn(column) {
	if (viewModel.allFeatures)
		viewModel.features(viewModel.allFeatures);
	var filtered = viewModel.features().filter(function(feature) {
		return feature[column].toString().toLowerCase().includes(viewModel.filterTerm());
	});
	viewModel.allFeatures = viewModel.features();
	viewModel.features(filtered);
}

var sortArrowUp = "fa fa-arrow-up";
var sortArrowDw = "fa fa-arrow-down";

function setSortingArrow(selectedColumn) {
	var otherCols = viewModel.columns().filter(function(col) {
		return col != selectedColumn;
	});

	for (var i = 0; i < otherCols.length; i++) {
		otherCols[i].state("");
	}

	if (selectedColumn.state() === "" || selectedColumn.state() === sortArrowDw)
		selectedColumn.state(sortArrowUp);
	else
		selectedColumn.state(sortArrowDw);
}

function stringSort(col) {
	viewModel.features(viewModel.features().sort(function(a, b) {
		var featureA = a[col.col].toString().toLowerCase();
		var featureB = b[col.col].toString().toLowerCase();
		if (featureA < featureB)
			return (col.state() === sortArrowUp) ? -1 : 1;
		else if (featureA > featureB)
			return (col.state() === sortArrowUp) ? 1 : -1;
		else
			return 0;
	}));
}

function dateSort(col) {
	viewModel.features(viewModel.features().sort(function(a, b) {
		if (col.state() === sortArrowUp)
			return new Date(a[col.col]) - new Date(b[col.col]);
		else
			return new Date(b[col.col]) - new Date(a[col.col]);
	}));
}


$(document).ready(function() {
	ko.applyBindings(viewModel);
	$.getJSON("/api/feature", function(data) {
		viewModel.features(data);
	});
});

$(document.body).on("click", ".selectColumn", function(e) {
	$("#selectedColumn").text($(this).text());
	$(this).parent().close();
	return false;
})
