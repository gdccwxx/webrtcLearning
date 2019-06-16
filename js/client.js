'use strict'
var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var vidioSource = document.querySelector('select#vidioSource')

var filterSelect = document.querySelector('select#filter')

var snaptShot = document.querySelector('button#snapshot')
var picture = document.querySelector('canvas#picture')
picture.width = 320
picture.height = 240

var videoPlayer = document.querySelector('video#player')

var recPlayer = document.querySelector('video#recPlayer')
var btnRecord = document.querySelector('button#record')
var btnRecPlay = document.querySelector('button#recPlay')
var btnDownload = document.querySelector('button#download')

var buffer
var mediaRecorder
function gotMediaStream(stream) {
    videoPlayer.srcObject = stream
    var videoTracks = stream.getVideoTracks()[0]
    window.stream = stream
    console.log(stream)
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
function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('not support')
    } else {
        var deviceId = vidioSource.value
        console.log(vidioSource)
        var contrants = {
            video: {
                width: 320,
                height: 240,
                frameRate: 30,
                facingMode: 'enviroment'
            },
            audio: {
                noiseSuppression: true,
                echoCancellation: true
            },
            deviceId: deviceId ? deviceId : undefined
        }
        navigator.mediaDevices.getUserMedia(contrants)
        .then(gotMediaStream)
        .then(gotDevices)
        .catch(handleError)
    }
}
start()

vidioSource.onchange = start
filterSelect.onchange = function () {
    videoPlayer.className = filterSelect.value
}

snaptShot.onclick = function () {
    picture.className = filterSelect.value
    picture.getContext('2d').drawImage(videoPlayer, 0, 0,
                                        picture.width, picture.height)

}
function handleDataAvailable(e) {
    if (e && e.data && e.data.size > 0) {
        buffer.push(e.data)
    }
}
function startRecord() {
    buffer = []
    var options = {
        mimeType : 'video/webm;codecs=vp8'
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`)
        return
    }
    try {
        mediaRecorder = new MediaRecorder(window.stream, options.mimeType)
    } catch(error) {
        console.error('faild to create mediarecorder', error)
        return 
    }
    mediaRecorder.ondataavailable = handleDataAvailable
    mediaRecorder.start(10)
}

function stopRecord() {
    mediaRecorder.stop()
}

btnRecord.onclick = () => {
    console.log(btnRecord.textContent)
    if (btnRecord.textContent === 'start record') {
        startRecord()
        btnRecord.textContent = 'stop record'
        btnDownload.disabled = true
        btnRecPlay.disabled = true
    } else {
        stopRecord()
        btnDownload.disabled = false
        btnRecPlay.disabled = false
        console.log(btnDownload)
        btnRecord.textContent = 'start record'
    }
}

btnRecPlay.onclick = () => {
    var blob = new Blob(buffer, {type: 'video/webm'})
    recPlayer.src = window.URL.createObjectURL(blob)
    recPlayer.srcObject = null
    recPlayer.controls = true
    recPlayer.play()
}
btnDownload.onclick = () => {
    var blob = new Blob(buffer, {
        type: 'video/webm'
    })
    var url = window.URL.createObjectURL(blob)
    var a = document.createElement('a')
    a.href = url
    a.style.display = 'none'
    a.download = 'test.webm'
    a.click()
}