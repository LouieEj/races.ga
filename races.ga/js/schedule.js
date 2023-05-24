function convertTZ(time){
    var currentFormat = "YYYY-MM-DD HH:mm:ssZ";
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

var raceDetailsArray = [];

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

const offset = 216000000;

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
                session1Date = raceDetails.children[4].children[0].innerHTML;
                session1Time = raceDetails.children[4].children[1].innerHTML;
                session1DateTime = session1Date + ":" + session1Time;
                session2Name = raceDetails.children[5].localName;
                session2Date = raceDetails.children[5].children[0].innerHTML;
                session2Time = raceDetails.children[5].children[1].innerHTML;
                session2DateTime = session2Date + ":" + session2Time;
                session3Name = raceDetails.children[6].localName;
                session3Date = raceDetails.children[6].children[0].innerHTML;
                session3Time = raceDetails.children[6].children[1].innerHTML;
                session3DateTime = session3Date + ":" + session3Time;
                session4Name = raceDetails.children[7].localName;
                session4Date = raceDetails.children[7].children[0].innerHTML;
                session4Time = raceDetails.children[7].children[1].innerHTML;
                session4DateTime = session1Date + ":" + session4Time;
                raceDateTime = raceDate + ":" + raceTime;
                raceDetailsArray.push([raceName, raceLocality, raceCountry, session1Date, session1Time, session2Name, session2Date, session2Time, session3Name, session3Date, session3Time, session4Name, session4Date, session4Time, raceDate, raceTime]);
                
            }
            currentDate = moment();

            for (i = 0; i < raceDetailsArray.length; i++){
                currentRaceDate = Date.parse(raceDetailsArray[i][14]);

                raceDistance = moment.duration(currentDate.diff(currentRaceDate));

                if (raceDistance - offset >= 0){
                    raceDetailsArray[i].splice(0, 16);
                }
            }

            filtered = raceDetailsArray.filter(function (el) {
                return el.length != 0;
            });

            for (i = 0; i < filtered.length; i++){
                if (filtered[i][5] == "SecondPractice"){
                    filtered[i][5] = "Practice 2";
                    filtered[i][8] = "Practice 3";
                }
                else if (filtered[i][5] == "Qualifying"){
                    filtered[i][8] = "Practice 2";
                } 

                session1Date = filtered[i][3];
                session1Time = filtered[i][4];

                session2Name = filtered[i][5];
                session2Date = filtered[i][6];
                session2Time = filtered[i][7];

                session3Name = filtered[i][8];
                session3Date = filtered[i][9];
                session3Time = filtered[i][10];

                session4Name = filtered[i][11];
                session4Date = filtered[i][12];
                session4Time = filtered[i][13];

                raceDate = filtered[i][14];
                raceTime = filtered[i][15];

                number = raceDetailsArray.length - filtered.length + 1;


                row = `<h2>${"Race " + (number + i) + ":"}</h2>
                        <h2 class="scheduleHeader">${filtered[i][0]}</h2>
                        <h3>${filtered[i][1]} - ${filtered[i][2]}</h3>
                        <table width="100%">
                            <thead>
                                <tr>
                                    <th text-align="center">Session</th>
                                    <th text-align="center">Date</th>
                                    <th text-align="center">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td text-align="center">Practice 1</td>
                                    <td text-align="center">${convertDate(session1Date)}</td>
                                    <td text-align="center">${convertTZ(session1Date + " " + session1Time)}</td>
                                </tr>
                                <tr>
                                    <td text-align="center">${session2Name}</td>
                                    <td text-align="center">${convertDate(session2Date)}</td>
                                    <td text-align="center">${convertTZ(session2Date + " " + session2Time, "Europe/London")}</td>
                                </tr>
                                <tr>
                                    <td text-align="center">${session3Name}</td>
                                    <td text-align="center">${convertDate(session3Date)}</td>
                                    <td text-align="center">${convertTZ(session3Date + " " + session3Time, "Europe/London")}</td>
                                </tr>
                                <tr>
                                    <td text-align="center">${session4Name}</td>
                                    <td text-align="center">${convertDate(session4Date)}</td>
                                    <td text-align="center">${convertTZ(session4Date + " " + session4Time, "Europe/London")}</td>
                                </tr>
                                <tr>
                                    <td text-align="center">Race</td>
                                    <td text-align="center">${convertDate(raceDate)}</td>
                                    <td text-align="center">${convertTZ(raceDate + " " + raceTime, "Europe/London")}</td>
                                </tr>
                            </tbody>
                            
                        </table><br><br>`
                const schedule = document.querySelector("#scheduleData");
                if (schedule != null){
                    schedule.insertAdjacentHTML("beforeend", row);
                }
            }
        })
    .catch(error => console.log('error', error));