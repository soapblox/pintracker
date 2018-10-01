function PinTimer() {
    this.started = false;
    this.stoppedTime = 0;
    this.startTime = 0;
}

var timeout;

PinTimer.prototype.clear = function () {
    this.started = false;
    this.startTime = 0;
}

PinTimer.prototype.timer = function () {

    //console.log(this.started);

    if (this.started) {
        //console.log(timeout);
        window.clearTimeout(timeout);
        $("#clear").attr("disabled", false);
        $("#start").html("Start (Alt+/)");
        this.started = false;
        this.stoppedTime = Date.now() - this.startTime;
    }
    else {
        this.started = true;
        // $("#start").html("Stop (Alt+/)");
        // $("#clear").attr("disabled", true);

        //console.log(this.startTime);




        if (this.startTime > 0) {
            this.startTime = Date.now() - this.stoppedTime;
        }
        else {
            this.startTime = Date.now();
            //console.log(this);
        }

        //console.log(this.startTime);


        this.started = true;
        var interval = 10; // ms
        var expected = Date.now() + interval;
        this.timeout = window.setTimeout(PinTimer.step, interval, interval, expected, this.startTime);


    }
}

PinTimer.prototype.getRunTime = function () {
    return this.stoppedTime;
}

PinTimer.step = function (interval, expected, theStartTime) {
    var currentTime = Date.now();
    //console.log("currentTime: " + currentTime);
    //console.log("theStartTime: " + theStartTime);
    //console.log(this.started);
    var theDif = currentTime - theStartTime;
    //console.log(theDif);
    //eturn;
    var dt = Date.now() - expected; // the drift (positive for overshooting)
    if (dt > interval) {
        // something really bad happened. Maybe the browser (tab) was inactive?
        // possibly special handling to avoid futile "catch up" run
    }

    //console.log(currentTime - theStartTime);

    h1.textContent = timeFormatter((theDif));

    expected += interval;
    timeout = window.setTimeout(PinTimer.step, Math.max(0, interval - dt), interval, expected, theStartTime); // take into account drift
}

function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString().slice(0, 2);

    if (minutes.length < 2) { minutes = '0' + minutes; }
    if (seconds.length < 2) { seconds = '0' + seconds; }
    if (milliseconds.length < 2) { milliseconds = '0' + milliseconds; }

    return minutes + ' : ' + seconds + ' . ' + milliseconds;
}