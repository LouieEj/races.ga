const hamburgerButton = document.getElementById("mobile-hamburger-cta")
const nav = document.getElementById("nav")

const docRaceName = document.querySelector(".race-name");
const docSessionName = document.querySelector(".session-name");
countdownDate = "";
nextRaceName = "";
nextSessionName = "";    
raceIndex = 0;
var raceDetailsArray = [];
var showingPreviousRace = false;

function convertTZ(time){
    var currentFormat = "HH:mm:ssZ";
    var timeToBeConverted = moment(time, currentFormat);
    var convertedTime = timeToBeConverted.tz(moment.tz.guess()).format("hh:mm a");
    return convertedTime;
}

function convertDate(date){
    var currentFormat = "YYYY-MM-DD HH:mm:ssZ";
    var dateToBeConverted = moment(date, currentFormat);
    var convertedDate = dateToBeConverted.tz(moment.tz.guess()).format("ddd DD MMM");
    return convertedDate;
}

function fetchData(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };



fetch("/data.xml")
    .then(response => response.text())
        .then(result => {
            let parser = new DOMParser(),
            xml = parser.parseFromString(result, "text/xml");
            var races = xml.getElementsByTagName("Race");
            for (i = 0; i < races.length; i++){
                var raceDetails = races[i];
                raceName = raceDetails.children[0].innerHTML;
                raceLocality = raceDetails.children[1].children[1].children[0].innerHTML;
                raceCountry = raceDetails.children[1].children[1].children[1].innerHTML;
                raceDate = raceDetails.children[2].innerHTML;
                raceTime = raceDetails.children[3].innerHTML;
                raceDateTime = raceDate + " " + raceTime;
                session1Date = raceDetails.children[4].children[0].innerHTML;
                session1Time = raceDetails.children[4].children[1].innerHTML;
                session1DateTime = session1Date + " " + session1Time;
                session2Name = raceDetails.children[5].localName;
                session2Date = raceDetails.children[5].children[0].innerHTML;
                session2Time = raceDetails.children[5].children[1].innerHTML;
                session2DateTime = session2Date + " " + session2Time;
                session3Name = raceDetails.children[6].localName;
                session3Date = raceDetails.children[6].children[0].innerHTML;
                session3Time = raceDetails.children[6].children[1].innerHTML;
                session3DateTime = session3Date + " " + session3Time;
                session4Name = raceDetails.children[7].localName;
                session4Date = raceDetails.children[7].children[0].innerHTML;
                session4Time = raceDetails.children[7].children[1].innerHTML;
                session4DateTime = session1Date + " " + session4Time;
                raceDetailsArray.push([raceName, raceCountry, session1Date, session1Time, session1DateTime, session2Name, session2Date, session2Time, session2DateTime, session3Name, session3Date, session3Time, session3DateTime, session4Name, session4Date, session4Time, session4DateTime, raceDate, raceTime, raceDateTime]);
                
            }

            filtered = raceDetailsArray.filter(function (el) {
                return el.length != 0;
            });
            currentDateTime = moment();

            for (i = 0; i < filtered.length; i++){
                if (filtered[i][5] == "SecondPractice"){
                    filtered[i][5] = "Practice 2";
                    filtered[i][9] = "Practice 3";
                }
                else if (filtered[i][5] == "Qualifying"){
                    filtered[i][6] = "Practice 2";
                } 
                if (filtered[i][9] == "SecondPractice"){
                    filtered[i][9] = "Practice 2";
                }
            }




            for (i = 0; i < filtered.length; i++){
                session1DateTime = filtered[i][4];
                session2DateTime = filtered[i][8];
                session3DateTime = filtered[i][12];
                session4DateTime = filtered[i][14] + " " + filtered[i][15];
                raceDateTime = filtered[i][19];


                session1Distance = moment.duration(currentDateTime.diff(session1DateTime));
                session2Distance = moment.duration(currentDateTime.diff(session2DateTime));
                session3Distance = moment.duration(currentDateTime.diff(session3DateTime));
                session4Distance = moment.duration(currentDateTime.diff(session4DateTime));
                raceDistance = moment.duration(currentDateTime.diff(raceDateTime));

                if (i > 0){
                    if (moment.duration(currentDateTime.diff(filtered[i-1][19])) - 248400000 < 0){
                        raceIndex = i-1;
                        countdownDate = filtered[i-1][19];
                        nextSessionName = "Race"
                        showingPreviousRace = true;
                        break;
                    }
                }
                if (session1Distance < 0){
                    raceIndex = i;
                    countdownDate = session1DateTime;
                    nextSessionName = "Practice 1"
                    break;
                }
                else if (session2Distance < 0){
                    raceIndex = i;
                    countdownDate = session2DateTime;
                    nextSessionName = filtered[i][5];
                    break;
                }
                else if (session3Distance < 0){
                    raceIndex = i;
                    nextSessionName = filtered[i][9];
                    countdownDate = session3DateTime;
                    break;
                }
                else if (session4Distance < 0){
                    raceIndex = i;
                    nextSessionName = filtered[i][13];
                    countdownDate = session4DateTime;
                    break;
                }
                else if (raceDistance - 3600000 < 0){
                    raceIndex = i;
                    nextSessionName = "Race";
                    countdownDate = raceDateTime;
                    break;
                }
            }


            if (filtered[raceIndex][6] == "Practice 2"){
                filtered[raceIndex][6] = filtered[raceIndex][2];
            }

            row = `<h3>Weekend Schedule</h2>
                    <table width="100%" id="weekend-table">
                        <thead>
                            <tr>
                                <th text-align="center">Session</th>
                                <th text-align="center">Date</th>
                                <th text-align="center">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td text-align="center">Practice 1</a></td>
                                <td text-align="center">${convertDate(filtered[raceIndex][2])}</td>
                                <td text-align="center">${convertTZ(filtered[raceIndex][3])}</td>
                            </tr>
                            <tr>
                                <td text-align="center" id="session2Title">${filtered[raceIndex][5]}</td>
                                <td text-align="center" id="session2Date">${convertDate(filtered[raceIndex][6])}</td>
                                <td text-align="center" id="session2Time">${convertTZ(filtered[raceIndex][7])}</td>
                            </tr>
                            <tr>
                                <td text-align="center" id="session3Title">${filtered[raceIndex][9]}</td>
                                <td text-align="center" id="session3Date">${convertDate(filtered[raceIndex][10])}</td>
                                <td text-align="center" id="session3Time">${convertTZ(filtered[raceIndex][11])}</td>
                            </tr>
                            <tr>
                                <td text-align="center" id="session4Title">${filtered[raceIndex][13]}</td>
                                <td text-align="center" id="session4Date">${convertDate(filtered[raceIndex][14])}</td>
                                <td text-align="center" id="session4Time">${convertTZ(filtered[raceIndex][15])}</td>
                            </tr>
                            <tr>
                                <td text-align="center" id="session5Title">Race</td>
                                <td text-align="center" id="session5Date">${convertDate(filtered[raceIndex][17])}</td>
                                <td text-align="center" id="session5Time">${convertTZ(filtered[raceIndex][18])}</td>
                            </tr>
                        </tbody>
                        
                    </table>`

            const weekendDiv = document.getElementById("weekend-schedule");
            const weekendTable = document.getElementById("weekend-table");
            if (weekendDiv != null && !weekendDiv.contains(weekendTable)){
                weekendDiv.insertAdjacentHTML("beforeend", row);
            }                        
            return true;
        })
    .catch(error => fetchData());
}

window.onload = function(){
    fetchData();
}


function countdown(){

    try{

        if (!nextRaceName){
            fetchData();
        }

        const day = document.querySelector(".day");
        const hour = document.querySelector(".hour");
        const minute = document.querySelector(".minute");
        const second = document.querySelector(".second");


        currentDate = moment();
        countdownDate = moment(countdownDate);

        var duration = moment.duration(currentDate.diff(countdownDate));

        durationSecs = Math.abs(duration.asSeconds());

        if (showingPreviousRace){
            var days = 0;
            var hours = 0;
            var minutes = 0;
            var seconds = 0;
        }
        else{
            var days = Math.floor(durationSecs / (3600*24));
            var hours = Math.floor(durationSecs % (3600*24) / 3600);
            var minutes = Math.floor(durationSecs % 3600 / 60);
            var seconds = Math.floor(durationSecs % 60);
        }


        nextRaceName = raceDetailsArray[raceIndex][0];

        if (docRaceName && day && hour && minute && second){

            docRaceName.innerText = nextRaceName;
            docSessionName.innerText = nextSessionName;

            day.innerText = days;
            hour.innerText = hours;
            minute.innerText = minutes;
            second.innerText = seconds;
        }

        countdownImage = document.getElementById("countdownContainer");
                if (countdownImage){
                    raceName = raceDetailsArray[raceIndex][0];
                    imageSource = `url('/images/${raceName}.jpg')`;
                    countdownImage.style.backgroundImage = imageSource;
                }
    }
    catch(e){}

}

setInterval(countdown, 500)