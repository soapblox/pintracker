// global id trackers
var playerId = 0;
var bountyId = 0;
var objectiveId = 0;
var pinRunId = 0;

function PinTracker() {
    // the players
    this.players = [];

    // bounty holder
    this.bountyArray = [];

    this.hideBountyBoard = false;

    // holds objectives
    this.objectiveArray = [];

    // hold pinruns...
    this.pinRunArray = [];

    // current state..
    this.currentPlayerId = null;
    this.currentObjectiveId = null;

    // hold the current best run...
    this.currentBestRun = null;
}

/* Player Section */
PinTracker.prototype.addPlayer = function (thePlayer) {
    this.players.unshift(thePlayer);
}

PinTracker.prototype.getPlayerById = function (theId) {

    if (this.players) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].playerId == parseInt(theId)) {
                //console.log("returning player.....")
                //console.log(players[i]);
                return this.players[i];
            }
        }
    }

}

/* Bounty Section */
PinTracker.prototype.addBounty = function (theBounty) {
    this.bountyArray.push(theBounty);
}

PinTracker.prototype.getBountyById = function (theId) {
    console.log("getBountyById : " + theId);
    if (this.bountyArray) {
        for (var i = 0; i < this.bountyArray.length; i++) {
            if (this.bountyArray[i].bountyId == parseInt(theId)) {
                //console.log("returning bounty.....")
                //console.log(bountyArray[i]);
                return this.bountyArray[i];
            }
        }
    }
}

PinTracker.prototype.hasBounty = function (thePlayer, bountyId) {
    if (thePlayer && thePlayer.bounties && thePlayer.bounties.length > 0) {
        for (var i = 0; i < thePlayer.bounties.length; i++) {
            console.log("hasBounty: " + thePlayer.bounties[i] + ", " + bountyId);
            if (thePlayer.bounties[i] == bountyId) {
                return true;
            }
        }
    }

    return false;
}

PinTracker.prototype.applyBounty = function (playerId, bountyId) {
    var p = this.getPlayerById(playerId);

    console.log(p);

    var found = false;

    // if it exists remove it
    for (var i = 0; i < p.bounties.length; i++) {
        if (p.bounties[i] == bountyId) {
            p.bounties.splice(i, 1);
            found = true;
            p.addScore(-1);
        }
    }

    // else we add it in
    if (!found) {
        p.bounties.push(bountyId);
        p.addScore(1);
    }
}

/* Objective Section */
PinTracker.prototype.addObjective = function (theObjective) {
    this.objectiveArray.push(theObjective);
}

PinTracker.prototype.getObjectiveById = function (theId) {
    // console.log("getObjectiveById : " + theId);
    if (this.objectiveArray) {
        for (var i = 0; i < this.objectiveArray.length; i++) {
            if (this.objectiveArray[i].objectiveId == parseInt(theId)) {
                //console.log("returing objective...");
                //console.log(objectiveArray[i]);
                return this.objectiveArray[i];
            }
        }
    }
}

/* PinRun Section */
PinTracker.prototype.addPinRun = function (thePinRun) {
    this.pinRunArray.push(thePinRun);
}

PinTracker.prototype.deletePinRunById = function (pinRunId) {
    var atIndex = 0;
    for (i = 0; i < this.pinRunArray.length; i++) {
        if (this.pinRunArray[i].pinRunId == pinRunId) {
            this.pinRunArray[i].deleted = true;
            console.log("deleting run: " + pinRunId + " at index: " + atIndex);
        }
    }
}

PinTracker.prototype.getBestRun = function (objectiveId) {
    var objectiveRuns = [];

    // find all the runs for the given objectiveId
    for (var i = 0; i < this.pinRunArray.length; i++) {
        if (this.pinRunArray[i].objectiveId == objectiveId && !this.pinRunArray[i].deleted) {
            objectiveRuns.push(this.pinRunArray[i]);
        }
    }

    var bestTime = 0;
    var bestRun = null;

    // find the quickest run in the mix...
    for (var i = 0; i < objectiveRuns.length; i++) {
        if (bestTime == 0) {
            bestRun = objectiveRuns[i];
            bestTime = objectiveRuns[i].runTime;
        }
        else if (objectiveRuns[i].runTime < bestTime) {
            bestRun = objectiveRuns[i];
            bestTime = objectiveRuns[i].runTime;
        }
    }

    return bestRun;
}

PinTracker.prototype.getBestRunForPlayer = function (playerId, objectiveId) {
    var playerRuns = this.getPinRuns(playerId, objectiveId);

    var bestTime = 0;
    var bestRun = null;

    // find the quickest run in the mix...
    for (var i = 0; i < playerRuns.length; i++) {
        if (bestTime == 0) {
            bestRun = playerRuns[i];
            bestTime = playerRuns[i].runTime;
        }
        else if (playerRuns[i].runTime < bestTime) {
            bestRun = playerRuns[i];
            bestTime = playerRuns[i].runTime;
        }
    }

    return bestRun;
}

PinTracker.prototype.getPinRuns = function (playerId, objectiveId) {
    var runs = [];

    // find all the runs for the given objective and player...
    for (var i = 0; i < this.pinRunArray.length; i++) {
        if (this.pinRunArray[i].playerId == playerId && this.pinRunArray[i].objectiveId == objectiveId && !this.pinRunArray[i].deleted) {
            if (!this.pinRunArray[i].deleted) {
                runs.unshift(this.pinRunArray[i]);
            }
            else {
                console.log("skipping deleted run...");
                console.log(this.pinRunArray[i]);
            }
        }
    }

    return runs;
}

PinTracker.prototype.getPinRunById = function (thePinRunId) {
    console.log("getPinRunById: " + thePinRunId)
    for (var i = 0; i < this.pinRunArray.length; i++) {
        if (this.pinRunArray[i].pinRunId == thePinRunId) {
            return this.pinRunArray[i];
        }
    }
}

PinTracker.prototype.getLastRuns = function (numberOfRuns) {
    var runs = [];

    console.log("getLastRuns...");

    // we want numberOfRuns, but we ignore the deleted ones
    var actualRunsCollected = 0;

    for (var i = this.pinRunArray.length; (i > 0 && actualRunsCollected < numberOfRuns); i--) {
        //console.log(pinRunArray[(i-1)]);
        if (!this.pinRunArray[(i - 1)].deleted) {
            actualRunsCollected++
            runs.push(this.pinRunArray[(i - 1)]);
        }
    }

    return runs;
}

function Person(name, theDesc) {
    this.name = name;
    this.score = 0;
    this.description = theDesc;
    this.playerId = playerId++;
    this.deleted = false;
    this.bounties = [];
}

Person.prototype.addScore = function (addValue) {
    this.score += parseInt(addValue);
}

function Bounty(desc) {
    this.description = desc;
    this.bountyId = bountyId++;
    this.deleted = false;
}

function Objective(name) {
    this.name = name;
    this.objectiveId = objectiveId++;
}

function PinRun(playerId, objectiveId, runTime) {
    this.playerId = playerId;
    this.objectiveId = objectiveId;
    this.runTime = runTime;
    this.pinRunId = pinRunId++;
    this.deleted = false;
}