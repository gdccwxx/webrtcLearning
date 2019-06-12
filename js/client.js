'use strict'
var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var vidioSource = document.querySelector('select#vidioSource')

var videoPlayer = document.querySelector('video#player')
function gotMediaStream(stream) {
    videoPlayer.srcObject = stream
    return navigator.mediaDevices.enumerateDevices();
}
function gotDevices(deviceInfos) {
    deviceInfos.forEach(deviceInfo => {
        var option = document.createElement('option')
        option.text = deviceInfo.label
        option.value = deviceInfo.deviceId

        if (deviceInfo.kind === 'audioinput') {
            audioSource.appendChild(option)
        } else if (deviceInfo.kind === 'audiooutput') {
            audioOutput.appendChild(option)
        } else if (deviceInfo.kind === 'videoinput') {
            vidioSource.appendChild(option)
        }
    });
}
function handleError(err) {
    console.log('getUserMedia err: '+ err)
}
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('not support')
} else {
    var contrants = {
        video: {
            width: 640,
            height: 480
        },
        audio: false
    }
    navigator.mediaDevices.getUserMedia(contrants)
    .then(gotMediaStream)
    .then(gotDevices)
    .catch(handleError)
}
