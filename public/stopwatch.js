/*
Shamelessly stolen from: https://codepen.io/_Billy_Brown/pen/dbJeh

Added some tiny mods for my purposes
*/

class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.laps = [];
        this.reset();
        this.print(this.times);
    }

    reset() {
        this.times = [0, 0, 0];
    }

    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    lap() {
        let times = this.times;
        let li = document.createElement('li');
        li.innerText = this.format(times);
        this.results.appendChild(li);
    }

    stop() {
        this.running = false;
        console.log(this.times);
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }

    clear() {
        this.reset();
        this.print();
        this.time = null;
    }

    getRunTime() {
        var millis = (this.times[0] * (1000 * 60)) + (this.times[1] * 1000) + (this.times[2]);
        //console.log(millis);
        return millis;
    }

    getSplit(splitTime) {
        //console.log("split time: " + splitTime);
        //console.log("stoppedTime: " + this.stoppedTime);
        var splitDif = splitTime - this.getRunTime();
        var returnString = null;

        //console.log("splitDif: " + splitDif);
        if (splitDif > 0) {
            //console.log("green -" + timeFormatter(splitDif));
            returnString = "<span class='splitGreen'>-" + timeFormatter(splitDif) + "</span>"
        }
        else {
            //console.log("red +" + timeFormatter(splitDif * -1));
            returnString = "<span class='splitRed'>+" + timeFormatter(splitDif * -1) + "</span>"
        }

        return returnString;
    }

    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }

    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }

    print() {
        if (document.querySelector('#speedRunTimer')) {
            document.querySelector('#speedRunTimer').innerHTML = this.format(this.times);
        }
    }

    format(times) {
        return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}<span class='millis'>:\
${pad0(Math.floor(times[2]), 2)}</span>`;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString().slice(0, 2);

    if (minutes.length < 2) { minutes = '0' + minutes; }
    if (seconds.length < 2) { seconds = '0' + seconds; }
    if (milliseconds.length < 2) { milliseconds = '0' + milliseconds; }

   // console.log(milliseconds);

    return minutes + ':' + seconds + '.<span class="millis">' + milliseconds + '</span>';
}