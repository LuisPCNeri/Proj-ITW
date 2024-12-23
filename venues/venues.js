var map = L.map('map_area', {
    inertia: false
}).setView(["48.85648965896477", "2.352322304880495"], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 2,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Variável global com todos os markers
let marker_arr = [];

var vm = function () {

    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Venues');
    self.displayName = 'Paris 2024 Venues';
    self.records = ko.observableArray();

    self.activate = function (id) {
        console.log('CALL: getRoutes...');

        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data);

            for(k=0; k < data.length; k++){
                if(!data[k].Lat || !data[k].Lon){ continue; }
                marker = L.marker([data[k].Lat, data[k].Lon], {
                    title: data[k].Name
                }).addTo(map);
                marker.bindPopup(`${data[k].Name}, \n ${data[k].DateStart} => ${data[k].DateEnd}`);
                marker_arr.push(marker);
            }
        });
    };

    self.search = function () {
        console.log('Searching...');
        let query = $('#searchbar').val().toLowerCase();
        const search_uri = self.baseUri() + '/Search?q=' + query;

        if(!query){self.activate(1); return;}

        ajaxHelper(search_uri, 'GET').done((data) => {
            if(data.length < 1){ return; }

            let new_data = data.filter((venue) => {
                return venue.Name.toLowerCase().includes(query);
            }).map((venue) => {
                return {
                    DateEnd: venue.DateEnd || '',
                    DateStart: venue.DateStart || '',
                    Id: venue.Id,
                    Lat: venue.Lat || '',
                    Lon: venue.Lon || '',
                    Name: venue.Name,
                    NumSports: venue.NumSports || ''
                };
            });

            let name_arr = [];
            for(k=0; k < new_data.length; k++){
                name_arr.push(new_data[k].Name);
            }

            console.log(new_data);
            for(k=0; k < marker_arr.length; k++){
                if(!name_arr.includes(marker_arr[k].options.title)){
                    marker_arr[k].removeFrom(map);
                }
            }
    
            self.records(new_data);
        });
    };

    self.activate(1);
};

function ajaxHelper (uri, method, data){
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            alert("AJAX Call[" + uri + "] Fail...");
        }
    });
}

$(document).ready(() => {
    console.log("ready!");
    ko.applyBindings(new vm());
});