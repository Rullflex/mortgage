document.addEventListener('DOMContentLoaded', function () {
  var videoPreviewButtons = document.querySelectorAll('.videos-carousel__video-opener-btn');

  loadYoutubeVideo(videoPreviewButtons[0].getAttribute('data-youtube-id'), document.querySelector('.videos-carousel__video-container'));

  function loadYoutubeVideo(id, container) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute("src",
      "https://www.youtube.com/embed/" + id
      + "?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1");

    container.appendChild(iframe);
  }

  videoPreviewButtons.forEach(function (item) {
    var videoContainer = document.querySelector('.videos-carousel__video-container');
    item.addEventListener('click', function () {
      while (videoContainer.firstChild) {
        videoContainer.removeChild(videoContainer.firstChild);
      }
      loadYoutubeVideo(item.getAttribute('data-youtube-id'), document.querySelector('.videos-carousel__video-container'));
    });
  });
});
