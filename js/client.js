'use strict'
var videoPlayer = document.querySelector('video#player')
function gotMediaStream(stream) {
    videoPlayer.srcObject = stream
}
function handleError(err) {
    console.log('getUserMedia err: '+ err)
}
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('not support')
} else {
    var contrants = {
        video: true,
        audio: true
    }
    navigator.mediaDevices.getUserMedia(contrants)
    .then(gotMediaStream)
    .catch(handleError)
}
