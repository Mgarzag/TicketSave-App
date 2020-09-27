
const tM = "sZZUMhlb4T1r1DrKfhGuaSEqgaO6G9sC";

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


    //Main page automatic render of 6 random events from TM database

    renderRandomEvents();

    renderRandomEvents()
    //function to render random events from our API
    function renderRandomEvents() {
        axios.get(`/api/addevents`)
            .then((eventData) => {
            eventsRandom.innerHTML = "";
            console.log(eventData);
            for (var i = 0; i < eventData.data.length; i++) {
                var rando = Math.floor(Math.random() * eventData.data.length + 1);
                var name = eventData.data[rando].event_name;
                var eventDate = eventData.data[rando].event_date;
                var eventVenue = eventData.data[rando].event_venue;
                var city = eventData.data[rando].city;
                var state = eventData.data[rando].state;
                var eventTime = eventData.data[rando].event_time;
                var eventImage = eventData.data[rando].event_image;
                var price = eventData.data[rando].price;
                var eventId = eventData.data[rando].id;
                var sellerId = eventData.data[rando].seller_id;
                
    
                let eventDetails =
    
                    `
                        <div class="card mt-3 ml-2 mr-3 col-9 col-sm-5 col-xl-3 border-dark rounded bg-light" style="width: 20rem;">
                            <img class="card-img-top mt-2 border-dark rounded" id="eventImage" src="${eventImage}" alt="Event Image">
                            <div class="card-body" id="nameBody">
                            <h5 class="card-title" id="eventName">${name}</h5>
                        </div>
                            <ul class="list-group list-group-flush ">
                                <li class="list-group-item bg-light" id="eventDate">${eventDate}</li>
                                <li class="list-group-item bg-light" id="eventVenue">${eventVenue}</li>
                                <li class="list-group-item bg-light" id="eventLocation">${city}, ${state}</li>
                                <li class="list-group-item bg-light" id="eventTime">${eventTime}</li>
                            </ul>
                        <div class="card-body ">
                            <a  href={../checkout/index.html} id="${sellerId}" class="card-link">BUY</a>
                            <a  href=# id="${eventId}" class="card-link">Save Event</a>
                        </div>
                        </div>
                    </div>  
                    `
                eventsRandom.innerHTML += eventDetails;
    
            }
        })
        .catch((error) => {
            console.log(error);
        })
    
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

  //add item to wishlist of user by getting the id of clicked Saved Event
  document.addEventListener('click', function(e) {
      console.log(e.target.className);
      let eventId = e.target.id;
      if (e.target.className === "card-link") {
        window.location.href = "../checkout/index.html";
        alert("You've Added an Item to your Wishlist");
      }
      axios.post('/api/addwish', {
        "event_id" : eventId
      })
  })

