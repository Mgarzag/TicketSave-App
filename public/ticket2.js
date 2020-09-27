$(document).ready(function () {
    console.log("ready!");

    tM = "sZZUMhlb4T1r1DrKfhGuaSEqgaO6G9sC";

    //Search Button Event Listener
    searchConcert = document.getElementById("searchConcert");

    searchConcert.addEventListener('click', function () {
        var zipCode = document.getElementById("zipCode").value;
        var concertType = document.getElementById("concertType").value;
        var concertSearch = document.getElementById("concertSearch").value;

        searchTickets(zipCode, concertType, concertSearch);
    });

    //Submit search values with return key
    concertSearch.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchConcert").click();
        }
        
    });




    //-------------------FUNCTIONS------------------------//

    ///Visual Spinner while API loads
    function loadingSpinner() {

        let spinners =
            `
            <div class="d-flex justify-content-center">
            <div class="spinner-border text-success mt-5" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        `
        eventsRandom.innerHTML += spinners;
    }

    loadingSpinner()


    ///Main page automatic render of 6 random events from TM database

    eventRenderMain();

    function eventRenderMain() {
        $.get(`https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=200&stateCode=GA,TX&apikey=${tM}`, function (data) {
            console.log(data);
            eventsRandom.innerHTML = "";
            for (var i = 0; i < 100; i++) {
                var eventNumber = Math.floor(Math.random() * 200 + 1);

                console.log(data._embedded.events[eventNumber]);
                var name = data._embedded.events[eventNumber].name;
                var eventImage = data._embedded.events[eventNumber].images[0].url;
                var eventVenue = data._embedded.events[eventNumber]._embedded.venues[0].name;
                var eventDate = data._embedded.events[eventNumber].dates.start.localDate;
                var eventTime = data._embedded.events[eventNumber].dates.start.localTime;
                var city = data._embedded.events[eventNumber]._embedded.venues[0].city.name;
                var state = data._embedded.events[eventNumber]._embedded.venues[0].state.stateCode;



                let eventDetails =
                    `
                    <div class="card mt-3 ml-2 mr-3 col-9 col-sm-5 col-xl-3 border-dark bg-light" style="width: 20rem;">
                        <img class="card-img-top mt-2 border-dark rounded" id="eventImage" src="${eventImage}" alt="Event Image">
                        <div class="card-body">
                        <h5 class="card-title" id="eventName">${name}</h5>
                        <p class="card-text" id="eventDate">${eventDate}</p>
                    </div>
                        <ul class="list-group list-group-flush ">
                           <li class="list-group-item bg-light" id="eventVenue">${eventVenue}</li>
                           <li class="list-group-item bg-light" id="eventLocation">${city}, ${state}</li>
                           <li class="list-group-item bg-light" id="eventTime">${eventTime}</li>
                        </ul>
                    <div class="card-body ">
                        <a href="#" class="card-link">BUY</a>
                        <a href="#" class="card-link">Save Event</a>
                    </div>
            </div>
        `
                eventsRandom.innerHTML += eventDetails;
            }

        });
    }




    // Function to search for events through form on main page and post to events database (kind of)

    function searchTickets(zipcode, concertType, concertSearch) {
        eventsRandom.innerHTML = "";
        $.get(`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${concertSearch}&postalCode=${zipcode}&radius=30&unit=miles&&size=100&countryCode=US&classificationName=${concertType}&apikey=${tM}`, function (searchData) {
            console.log(searchData);


            for (var i = 0; i < searchData._embedded.events.length; i++) {

                var name = searchData._embedded.events[i].name;
                var eventImage = searchData._embedded.events[i].images[0].url;
                var eventVenue = searchData._embedded.events[i]._embedded.venues[0].name;
                var eventDate = searchData._embedded.events[i].dates.start.localDate;
                var eventTime = searchData._embedded.events[i].dates.start.localTime;
                var city = searchData._embedded.events[i]._embedded.venues[0].city.name;
                var state = searchData._embedded.events[i]._embedded.venues[0].state.stateCode;

                $.post('http://localhost:3000/api/events', {
                    "event_name": `${name}`,
                    "event_date": `${eventDate}`,
                    "event_venue": `${eventVenue}`,
                    "city": `${city}`,
                    "state": `${state}`,
                    "event_time": `${eventTime}`

                });

                let eventsRender =
                    `
                <div class="card mt-3 ml-2 mr-3 col-9 col-sm-5 col-xl-3 border-dark rounded bg-light" style="width: 20rem;">
                    <img class="card-img-top mt-2 border-dark rounded" id="eventImage" src="${eventImage}" alt="Event Image">
                    <div class="card-body">
                    <h5 class="card-title" id="eventName">${name}</h5>
                    <p class="card-text" id="eventDate">${eventDate}</p>
                </div>
                    <ul class="list-group list-group-flush ">
                       <li class="list-group-item bg-light" id="eventVenue">${eventVenue}</li>
                       <li class="list-group-item bg-light" id="eventLocation">${city}, ${state}</li>
                       <li class="list-group-item bg-light" id="eventTime">${eventTime}</li>
                    </ul>
                <div class="card-body ">
                    <a href="#" class="card-link">BUY</a>
                    <a href="#" class="card-link">Save Event</a>
                </div>
        </div>
              `
                eventsRandom.innerHTML += eventsRender;

            }
        });
    }
});