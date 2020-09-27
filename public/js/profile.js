// get items the currently logged in profile is selling
const mineForSale = document.getElementById('forSale');
mineForSale.addEventListener('click', function() {
    let eventsRandom = document.getElementById('displayCards');
    eventsRandom.innerHTML = "";
    axios.get('/api/myitems')
        .then((datas) => {
            //console.log(datas);
            for(let i = 0; i < 12; i++) {
                //console.log(datas.data[i].event_name);
        
                let eventsRender =
                    `
                    <div class="card mt-3 ml-2 mr-3 col-9 col-sm-5 col-xl-3 border-dark rounded bg-light" style="width: 20rem;">
                        <img class="card-img-top mt-2 border-dark rounded" id="eventImage" src="${datas.data[i].event_image}" alt="Event Image">
                        <div class="card-body">
                        <h5 class="card-title" id="eventName">${datas.data[i].event_name}</h5>
                        <p class="card-text" id="eventDate">${datas.data[i].event_date}</p>
                    </div>
                        <ul class="list-group list-group-flush ">
                        <li class="list-group-item bg-light" id="eventVenue">${datas.data[i].event_venue}</li>
                        <li class="list-group-item bg-light" id="eventLocation">${datas.data[i].city}, ${datas.data[i].state}</li>
                        <li class="list-group-item bg-light" id="eventTime">${datas.data[i].event_time}</li>
                        </ul>
                    
                </div>
                `
                    eventsRandom.innerHTML += eventsRender;
            }

        })
});



// get wishlist items for the currently logged in profile
const wishList = document.getElementById('wishList');
wishList.addEventListener('click', function() {
    let eventsRandom = document.getElementById('displayCards');
    eventsRandom.innerHTML = "";
    axios.get('/api/getwish')
        .then((moreInfo) => {
            console.log(moreInfo.data);
            for(let i = 0; i < 12; i++) {
                console.log(moreInfo.data[i]);
        
                let eventsRender =
                    `
                    <div class="card mt-3 ml-2 mr-3 col-9 col-sm-5 col-xl-3 border-dark rounded bg-light" style="width: 20rem;">
                        <img class="card-img-top mt-2 border-dark rounded" id="eventImage" src="${moreInfo.data[i].event_image}" alt="Event Image">
                        <div class="card-body">
                        <h5 class="card-title" id="eventName">${moreInfo.data[i].event_name}</h5>
                        <p class="card-text" id="eventDate">${moreInfo.data[i].event_date}</p>
                    </div>
                        <ul class="list-group list-group-flush ">
                        <li class="list-group-item bg-light" id="eventVenue">${moreInfo.data[i].event_venue}</li>
                        <li class="list-group-item bg-light" id="eventLocation">${moreInfo.data[i].city}, ${moreInfo.data[i].state}</li>
                        <li class="list-group-item bg-light" id="eventTime">${moreInfo.data[i].event_time}</li>
                        </ul>
                    
                </div>
                `
                    eventsRandom.innerHTML += eventsRender;
            }

        })
});


