document.addEventListener('DOMContentLoaded', ready);

function ready() {
  console.log('script is working');
}

function initMap() {
  var office = {lat: 59.938972, lng: 30.323051};
  var officeIcon = {
    url: './img/map-pin.png',
    scaledSize: new google.maps.Size(62, 53),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(31, 62)
  }
  var map = new google.maps.Map(document.getElementsByClassName('contacts__map')[0], {
    zoom: 17,
    center: office,
    mapTypeId: 'roadmap'
  });
  var marker = new google.maps.Marker({
    position: office,
    icon: officeIcon,
    map: map
  });
}
