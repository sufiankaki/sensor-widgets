/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['jquery', 'widget/bearing', 'widget/thermometer', 'widget/timechart-flot', 'widget/windrose', 'widget/table-plain', 'widget/map', 'widget/panel'],
		function($, bearing, thermometer, timechart, windrose, table, map, panel) {

	$('.nav li').on('click', function() {
		$(this).parent().find('.active').removeClass('active');
		$(this).addClass("active");
		var id = $(this).find("a").attr("href");
		//$(".section").hide();
		//$(id).show();
	});

	$("a[href=" + window.location.hash + "]").click();

	var refresh_interval = 600;

	var defs = {
		service: function() {
			return "http://sensors.portdebarcelona.cat/sos/json";
		},
		offering: function(p) {
			return "http://sensors.portdebarcelona.cat/def/weather/offerings#" + p;
		},
		feature: function(p) {
			return "http://sensors.portdebarcelona.cat/def/weather/features#" + p;
		},
		property: function(p) {
			return "http://sensors.portdebarcelona.cat/def/weather/properties#" + p;
		},
	};

	var now = new Date();
	var a_day_ago = new Date(now.getTime() - 1000 * 60 * 60 * 24);
	var back_33_samples = new Date(now.getTime() - 1000 * 60 * 60 * 17);
	var three_hours_ago = new Date(now.getTime() - 1000 * 60 * 60 * 3);
	var two_hours_ago = new Date(now.getTime() - 1000 * 60 * 60 * 2);

	// SIRENA
	bearing.init({
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("02"),
		property: defs.property("31"),
		refresh_interval: refresh_interval
	}, document.querySelector(".sirena .bearing"));

	thermometer.init({
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("02"),
		property: defs.property("32"),
		refresh_interval: refresh_interval
	}, document.querySelector(".sirena .thermometer"));

	timechart.init({
		title: "Velocitat Vent",
		service: defs.service(),
		offering: defs.offering("30m"),
		features: [defs.feature("02")],
		properties: [defs.property("30M"), defs.property("30")],
		time_start: a_day_ago.toISOString().substring(0,19)+"Z",
		time_end: now.toISOString().substring(0,19)+"Z"
	}, document.querySelector(".sirena .timechart"));

	windrose.init({
		title: "Rosa vents últimes 3h",
		subtitle: "Sirena, mostres 10-minutals",
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("02"),
		properties: [defs.property("30"), defs.property("31")],
		time_start: three_hours_ago.toISOString().substring(0,19)+"Z",
		time_end: now.toISOString().substring(0,19)+"Z",
		refresh_interval: 9999 // TODO Doesn't make sense with fixed time_start and time_end
	}, document.querySelector(".sirena .windrose"));

	table.init({
		title: "Data Table",
		service: defs.service(),
		offering: defs.offering("30m"),
		feature: defs.feature("02"),
		properties: [
			defs.property("30"), defs.property("30M"), defs.property("31"),
			defs.property("32"), defs.property("33"), defs.property("35"),
			defs.property("36"), defs.property("34")],
		time_start: back_33_samples.toISOString().substring(0,19)+"Z",
		time_end: now.toISOString().substring(0,19)+"Z"
	}, document.querySelector(".sirena .tablex"));

	// XMVQA
	bearing.init({
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("02"),
		property: defs.property("31"),
		refresh_interval: refresh_interval
	}, document.querySelector(".xmvqa .left .bearing"));

	panel.init({
		title: "Dades 10-minutals",
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("02"),
		properties: [defs.property("30"), defs.property("31"),
					defs.property("32"), defs.property("33"),
					defs.property("34"), defs.property("35"),
					defs.property("36")],
		refresh_interval: refresh_interval
	}, document.querySelector(".xmvqa .left .panel-10m"));

	timechart.init({
		title: "Velocitat Vent",
		service: defs.service(),
		offering: defs.offering("10m"),
		features: [defs.feature("02")],
		properties: [defs.property("30")],
		time_start: two_hours_ago.toISOString().substring(0,19)+"Z",
		time_end: now.toISOString().substring(0,19)+"Z"
	}, document.querySelector(".xmvqa .left .timechart"));

	panel.init({
		title: "Dades 30-minutals",
		service: defs.service(),
		offering: defs.offering("30m"),
		feature: defs.feature("02"),
		properties: [defs.property("30"), defs.property("31"),
					defs.property("32"), defs.property("33"),
					defs.property("34"), defs.property("35"),
					defs.property("36")],
		refresh_interval: refresh_interval
	}, document.querySelector(".xmvqa .left .panel-30m"));


	var stations = ["01", "P4", "03", "P6", "P3", "P5", "10"];

	for (var i in stations) {
		var station = stations[i];

		bearing.init({
			service: defs.service(),
			offering: defs.offering("10m"),
			feature: defs.feature(station),
			property: defs.property("31"),
			refresh_interval: refresh_interval
		}, document.querySelector(".xmvqa .x" + station + " .bearing"));

		panel.init({
			title: "Dades 10-minutals",
			service: defs.service(),
			offering: defs.offering("10m"),
			feature: defs.feature(station),
			properties: [defs.property("30"), defs.property("31"),
						defs.property("32"), defs.property("33"),
						defs.property("34"), defs.property("35"),
						defs.property("36")],
			refresh_interval: refresh_interval
		}, document.querySelector(".xmvqa .x" + station + " .panel"));
	}

	// TORRE CONTROL
	map.init({
		service: defs.service(),
		offering: defs.offering("30m"),
		features: [defs.feature("P4")],
		maxInitialZoom: 12
	}, document.querySelector(".torrecontrol .p4 .map"));

	bearing.init({
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("P4"),
		property: defs.property("31"),
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .p4 .bearing"));

	panel.init({
		title: "Dades 10-minutals",
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("P4"),
		properties: [defs.property("31"), defs.property("30")],
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .p4 .panel-10m"));

	panel.init({
		title: "Dades 30-minutals",
		service: defs.service(),
		offering: defs.offering("30m"),
		feature: defs.feature("P4"),
		properties: [defs.property("31"), defs.property("30")],
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .p4 .panel-30m"));

	map.init({
		service: defs.service(),
		offering: defs.offering("30m"),
		features: [defs.feature("02")],
		maxInitialZoom: 12
	}, document.querySelector(".torrecontrol .x02 .map"));

	bearing.init({
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("02"),
		property: defs.property("31"),
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .x02 .bearing"));

	panel.init({
		title: "Dades 10-minutals",
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("02"),
		properties: [defs.property("31"), defs.property("30")],
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .x02 .panel-10m"));

	panel.init({
		title: "Dades 30-minutals",
		service: defs.service(),
		offering: defs.offering("30m"),
		feature: defs.feature("02"),
		properties: [defs.property("31"), defs.property("30")],
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .x02 .panel-30m"));

	map.init({
		service: defs.service(),
		offering: defs.offering("30m"),
		features: [defs.feature("03")],
		maxInitialZoom: 12
	}, document.querySelector(".torrecontrol .x03 .map"));

	bearing.init({
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("03"),
		property: defs.property("31"),
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .x03 .bearing"));

	panel.init({
		title: "Dades 10-minutals",
		service: defs.service(),
		offering: defs.offering("10m"),
		feature: defs.feature("03"),
		properties: [defs.property("31"), defs.property("30")],
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .x03 .panel-10m"));

	panel.init({
		title: "Dades 30-minutals",
		service: defs.service(),
		offering: defs.offering("30m"),
		feature: defs.feature("03"),
		properties: [defs.property("31"), defs.property("30")],
		refresh_interval: refresh_interval
	}, document.querySelector(".torrecontrol .x03 .panel-30m"));

	var features = ["01", "02", "03", "10", "P1", "P3", "P4", "P5", "P6", "P7"];
	var featureNames = ["01 Dispensari", "02 Sirena", "03 Adossat", "10 ZAL2", "P1 ESCU", "P3 Unitat Mobil", "P4 Dic Sud", "P5 Dàrsena sud B", "P6 Contradic", "P7 Torre Control"];
	var offerings = ["1m", "10m", "30m"];
	var offeringNames = ["Minutals", "10 minutals", "30 minutals"];

	for (var f in features) {
		var feature = features[f];
		var featureName = featureNames[f];
		var html = '<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">' + featureName + '</h3></div><div class="panel-content"><div class="row"></div></div></div>';
		var pnl = $(html).appendTo(".databrowser");
		for (var o in offerings) {
			var offering = offerings[o];
			var col = $('<div/>').addClass("col-md-4").addClass("x"+offering).appendTo(pnl.find(".row"));
			panel.init({
				title: offeringNames[o],
				service: defs.service(),
				offering: defs.offering(offerings[o]),
				feature: defs.feature(features[f]),
				properties: [],
				refresh_interval: refresh_interval
			}, col.get(0));
		}
	}

});