var previous;
try {
	previous = JSON.parse(localStorage.getItem('history') || '[]');
} catch (e) {
	previous = [];
}

var output = document.getElementById("current");
var previousOut = document.getElementById("history");

function renderCoords( coords ) {
	
	var date = new Date( coords.time );

	var html = '';

	html += '<div class="location">';
	html += '<span class="latitude">' + coords.latitude.toFixed(2) + '</span>';
	html += '<span class="longitude">' + coords.longitude.toFixed(2) + '</span>';
	html += '</div>';
	html += '<div class="altitude">';
	html += '<span class="meters">' + Math.round(coords.altitude) + '</span>';
	html += '<span class="feet">' + Math.round(coords.altitude * 3.28084) + '</span>';
	html += '</div>';
	html += '<div class="time">' + date.getDate() + '/' 
								 + (date.getMonth()+1) + ' '
								 + (date.getHours()) + ':'
								 + (date.getMinutes())
								 + '</div>';

	return html;
}

function addHistoryEntry( entry ) {
	var toPrepend = renderCoords( entry );
	var el = document.createElement('div');
	el.className = 'measurement';

	el.innerHTML = toPrepend;
	if(previousOut.children.length === 0) {
		previousOut.appendChild(el);
	} else {
		previousOut.insertBefore( el, previousOut.firstChild );
	}
}

var isFirst = true;
function geoFindMe() {
	if (!navigator.geolocation){
		output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
		return;
	}

	function success(position) {
		var dto = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
			altitude: position.coords.altitude,
			time: Date.now()
		};

		if (previous.length && !isFirst) {
			var last = previous[previous.length-1];
			if (
			    Math.abs(last.altitude - dto.altitude) > 5 &&
			    Math.abs(last.longitude - dto.longitude) > 0.01 &&
			    Math.abs(last.latitude - dto.latitude) > 0.01
			    ) {
			    return;
			}
			console.log(last);
			addHistoryEntry( last );
		}

		isFirst = false;

		var html = renderCoords( dto );
		output.innerHTML = html;

		previous.push( dto );

		try {
			localStorage.setItem('history', JSON.stringify(previous));
		} catch (e) {}

	}

	function error() {
		output.innerHTML = "Unable to retrieve your location";
	}

	output.innerHTML = "<p>Locating</p>";

	navigator.geolocation.getCurrentPosition(success, error);

}

geoFindMe();
previous.forEach(addHistoryEntry);
