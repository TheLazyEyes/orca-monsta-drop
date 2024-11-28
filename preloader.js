// Date / Time: 2024-11-28
// Lazy 

// Get the canvas element
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

// Set initial canvas dimensions
var canvasWidth = 450;
var canvasHeight = 775;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Function to update canvas dimensions based on window size
function updateCanvasSize() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

// Update canvas size when the window is resized
window.addEventListener('resize', updateCanvasSize);
function Preloader() {
  var assetsLoaded = 0;
  var totalAssets = 0;
  var callback;

  // Preload an image
  function loadImage(url, onLoad) {
    var image = new Image();
    image.onload = onLoad;
    image.src = url;
  }

  // Preload an audio
  function loadAudio(url, onLoad) {
    var audio = new Audio();
    audio.addEventListener('canplaythrough', onLoad, false);
    audio.src = url;
  }

  // Handle asset loaded
  function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets && typeof callback === 'function') {
      callback();
    }
  }

  // Preload assets
  this.preload = function(assetsArray, onLoadCallback) {
    totalAssets = assetsArray.length;
    callback = onLoadCallback;

    for (var i = 0; i < assetsArray.length; i++) {
      var asset = assetsArray[i];
      if (asset.type === 'image') {
        loadImage(asset.url, assetLoaded);
      } else if (asset.type === 'audio') {
        loadAudio(asset.url, assetLoaded);
      }
    }
  };
}