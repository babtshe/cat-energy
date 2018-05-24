document.addEventListener('DOMContentLoaded', ready);

function ready() {
  var menuBtn = document.querySelector('.burger-menu__toggle-btn');
  var menuList = document.querySelector('.burger-menu__list');
  if (menuBtn && menuList) {
    menuBtn.classList.remove('burger-menu__toggle-btn--nojs');
    menuList.classList.add('burger-menu__list--closed');
    menuBtn.addEventListener('click', function (event) {
      menuList.classList.toggle('burger-menu__list--closed');
      menuBtn.classList.toggle('burger-menu__toggle-btn--close');
    });
  }
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
