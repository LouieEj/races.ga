var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  
  fetch("https://ergast.com/api/f1/2023/driverStandings", requestOptions)
    .then(response => response.text())
        .then((result) => {
            let parser = new DOMParser(),
            xml = parser.parseFromString(result, "text/xml");
            var Standing = xml.getElementsByTagName("DriverStanding");
            var position;
            var points;
            var wins;
            for (i = 0; i < Standing.length; i++){
                position = Standing[i].attributes[0].value;
                points = Standing[i].attributes[2].value;
                wins = Standing[i].attributes[3].value;
                var Driver = xml.getElementsByTagName("Driver");
                var driverName;
                driverName = Driver[i].attributes[0].value;
                var fragments = driverName.split('_');
                for (j = 0; j < fragments.length; j++){
                    fragments[j] = fragments[j].charAt(0).toUpperCase() + fragments[j].slice(1);
                }
                if (fragments[1] != null){
                    fragments[0] = fragments[1];
                }
                driverName = fragments[0];
                const row = `<tr>
                              <td align="center">${position}</td>
                              <td align="center">${driverName}</td>
                              <td align="center">${points}</td>
                              <td align="center">${wins}</td>
                             </tr>`;
                const driverStandings = document.querySelector("#driverStandings");
                driverStandings.insertAdjacentHTML("beforeend", row);
            };
        })
    .catch(error => console.log('error', error));



    fetch("https://ergast.com/api/f1/2023/constructorStandings", requestOptions)
    .then(response => response.text())
        .then((result) => {
            let parser = new DOMParser(),
            xml = parser.parseFromString(result, "text/xml");
            console.log(xml);
            var Standing = xml.getElementsByTagName("ConstructorStanding");
            console.log(xml.getElementsByTagName("ConstructorStanding"));
            var position;
            var points;
            var wins;
            var constructorName;
            for (i = 0; i < Standing.length; i++){
                position = Standing[i].attributes[0].value;
                points = Standing[i].attributes[2].value;
                wins = Standing[i].attributes[3].value;
                var Constructor = xml.getElementsByTagName("Constructor");
                constructorName = Constructor[i].attributes[0].value;
                var fragments = constructorName.split('_');
                for (n = 0; n < fragments.length; n++){
                    fragments[n] = fragments[n].charAt(0).toUpperCase() + fragments[n].slice(1);
                }
                for (x = 0; x < fragments.length; x++){
                    if (fragments[x] == "Alphatauri"){
                        fragments[0] = "Alpha";
                        fragments[1] = "Tauri";
                    }
                    else if (fragments[x] == "Alfa"){
                        fragments[0] = "Alpha";
                        fragments[1] = "Romeo";
                    }
                }
                constructorName = fragments.join(' ');
                const row = `<tr>
                                <td align="center">${position}</td>
                                <td align="center">${constructorName}</td>
                                <td align="center">${points}</td>
                                <td align="center">${wins}</td>
                            </tr>`;
                const constructorStandings = document.querySelector("#constructorStandings");
                constructorStandings.insertAdjacentHTML("beforeend", row);
            };
        })
    .catch(error => console.log('error', error));