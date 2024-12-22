// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Torch_route');
    self.displayName = 'Paris 2024 Torch Route';
    self.records = ko.observableArray([]);

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getRoutes...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            self.records(data);

            var map = L.map('map_area',{
                inertia: false
            }).setView([data[0].Lat, data[0].Lon], 5);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                minZoom: 2,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            for(k=0; k < data.length; k++){
                if(k === 1){continue;}
                marker = L.marker([data[k].Lat, data[k].Lon], {
                    title: data[k].title,
                });
                marker.addTo(map);
                marker.bindPopup(`${data[k].City}, \n ${data[k].Date_start} => ${data[k].Date_end}, \n ${data[k].Title}`)
            }
        });
    };

    //--- start ....
    self.activate(1);
    console.log("VM initialized!");
}
//--- Internal functions
function ajaxHelper(uri, method, data) {
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

$('document').ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

