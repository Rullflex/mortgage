document.addEventListener('DOMContentLoaded', function () {
  var mapLinks = document.querySelectorAll('.map__cities-list [data-link]');
  var mapRegions = document.querySelectorAll('.map path[data-link]');
  mapLinks.forEach(function (item) {
    var enterHandler = function (event) {
      document.querySelector('.map svg [data-link="' + event.target.getAttribute('data-link') +'"]').classList.add('map__active-region');
    }
    var leaverHandler = function (event) {
      document.querySelector('.map svg [data-link="' + event.target.getAttribute('data-link') +'"]').classList.remove('map__active-region');
    }
    item.addEventListener('mouseover', enterHandler);
    item.addEventListener('focus', enterHandler);
    item.addEventListener('mouseleave', leaverHandler);
    item.addEventListener('blur', leaverHandler);
  })
  mapRegions.forEach(function (item) {
    item.addEventListener('mouseover', function (event) {
      document.querySelector('.map__cities-list [data-link="' + event.target.getAttribute('data-link') +'"]').classList.add('map__btn--hover');
    });
    item.addEventListener('mouseleave', function (event) {
      document.querySelector('.map__cities-list [data-link="' + event.target.getAttribute('data-link') +'"]').classList.remove('map__btn--hover');
    });
  })
})
