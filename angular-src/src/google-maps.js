function initMap() { console.lop(1232342334);
  var pointA = new google.maps.LatLng(18.512013333333336, 73.77510833333334),
    pointB = new google.maps.LatLng(18.511689999999998, 73.77499833333333),
    pointC = new google.maps.LatLng(18.511738333333334, 73.77501333333333),
    myOptions = {
      zoom: 7,
      center: pointA
    },
    map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService,
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    }),
    markerA = new google.maps.Marker({
      position: pointA,
      title: "point A",
      label: "A",
      map: map
    }),
    markerB = new google.maps.Marker({
      position: pointB,
      title: "point B",
      label: "B",
      map: map
    });

  // get route from A to B
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB, pointC);

}
function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB, pointC) {
  var waypts = [];
  waypts.push({
    location: pointC,
    stopover: false
  });
  directionsService.route({
    origin: pointA,
    destination: pointB,
    waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

//initMap();
