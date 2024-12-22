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

            var map = L.map('map_area', {
                inertia: false
            }).setView([data[0].Lat, data[0].Lon], 10);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                minZoom: 2,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            for(k=0; k < data.length; k++){
                if(!data[k].Lat || !data[k].Lon){ continue; }
                marker = L.marker([data[k].Lat, data[k].Lon]);
                marker.addTo(map);
                marker.bindPopup(`${data[k].Name}, \n ${data[k].DateStart} => ${data[k].DateEnd}`);
            }
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