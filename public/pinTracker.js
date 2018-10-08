// global id trackers
var playerId = 0;
var bountyId = 0;
var objectiveId = 0;
var pinRunId = 0;

class PinTracker {
    constructor() {
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
    addPlayer(thePlayer) {
        this.players.unshift(thePlayer);
    }

    getPlayerById(theId) {

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

    shiftPlayer(theShift) {
        var currentPlayerAtIndex = 0;
        var newIndexOfPlayer = 0;
        // ok, let's find the current index...
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].playerId == this.currentPlayerId) {
                currentPlayerAtIndex = i;
                console.log("currentplayer at index: " + currentPlayerAtIndex);
            }
        }

        // shrink the index by 1 to get new index
        newIndexOfPlayer = currentPlayerAtIndex + theShift;

        // if it's less than zero, we are at the first entry, so wrap around, and go to the last index
        if (newIndexOfPlayer < 0) {
            newIndexOfPlayer = this.players.length - 1;
        }

        // if it's equal to the length of the array, we are at the last entry, so go to the first
        if (newIndexOfPlayer == this.players.length) {
            newIndexOfPlayer = 0;
        }

        console.log("new player should be:");
        console.log(this.players[newIndexOfPlayer]);

        if (this.players.length > 0) {
            this.currentPlayerId = this.players[newIndexOfPlayer].playerId;
        }
        else {
            console.log('no players defined, unable to move...');
        }
    }

    shiftObjective(theShift) {
        var currentObjectiveAtIndex = 0;
        var newIndexOfObjective = 0;
        // ok, let's find the current index...
        for (var i = 0; i < this.objectiveArray.length; i++) {
            if (this.objectiveArray[i].objectiveId == this.currentObjectiveId) {
                currentObjectiveAtIndex = i;
                console.log("currentObjectiveAtIndex: " + currentObjectiveAtIndex);
            }
        }

        // shrink the index by 1 to get new index
        newIndexOfObjective = currentObjectiveAtIndex + theShift;

        // if it's less than zero, we are at the first entry, so wrap around, and go to the last index
        if (newIndexOfObjective < 0) {
            newIndexOfObjective = this.objectiveArray.length - 1;
        }

        // if it's equal to the length of the array, we are at the last entry, so go to the first
        if (newIndexOfObjective == this.objectiveArray.length) {
            newIndexOfObjective = 0;
        }

        console.log("new objective should be:");
        console.log(this.objectiveArray[newIndexOfObjective]);

        if (this.objectiveArray.length > 0) {
            this.currentObjectiveId = this.objectiveArray[newIndexOfObjective].objectiveId;
        }
        else {
            console.log('no objectives defined, unable to move...');
        }
    }

    /* Bounty Section */
    addBounty(theBounty) {
        this.bountyArray.push(theBounty);
    }

    getBountyById(theId) {
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

    hasBounty(thePlayer, bountyId) {
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

    applyBounty(playerId, bountyId) {
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
    addObjective(theObjective) {
        this.objectiveArray.push(theObjective);
    }

    getObjectiveById(theId) {
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
    addPinRun(thePinRun) {
        this.pinRunArray.push(thePinRun);
    }

    deletePinRunById(pinRunId) {
        var atIndex = 0;
        for (var i = 0; i < this.pinRunArray.length; i++) {
            if (this.pinRunArray[i].pinRunId == pinRunId) {

                //found it, stop looping...
                this.pinRunArray[i].deleted = true;
                return;
                console.log("deleting run: " + pinRunId + " at index: " + atIndex);
            }
        }
    }

    getBestRun(objectiveId) {
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

    getBestRunForPlayer(playerId, objectiveId) {
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

    getPinRuns(playerId, objectiveId) {
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

    getPinRunById(thePinRunId) {
        console.log("getPinRunById: " + thePinRunId)
        for (var i = 0; i < this.pinRunArray.length; i++) {
            if (this.pinRunArray[i].pinRunId == thePinRunId) {
                return this.pinRunArray[i];
            }
        }
    }

    getLastRuns(numberOfRuns) {
        var runs = [];

        //console.log("getLastRuns...");

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
}

class Person {
    constructor(name, theDesc) {
        this.name = name;
        this.score = 0;
        this.description = theDesc;
        this.playerId = playerId++;
        this.deleted = false;
        this.bounties = [];
    }

    addScore(addValue) {
        this.score += parseInt(addValue);
    }
}

class Bounty {
    constructor(desc) {
        this.description = desc;
        this.bountyId = bountyId++;
        this.deleted = false;
    }
}

class Objective {
    constructor(name) {
        this.name = name;
        this.objectiveId = objectiveId++;
    }
}

class PinRun {
    constructor(playerId, objectiveId, runTime) {
        this.playerId = playerId;
        this.objectiveId = objectiveId;
        this.runTime = runTime;
        this.pinRunId = pinRunId++;
        this.deleted = false;
    }
}