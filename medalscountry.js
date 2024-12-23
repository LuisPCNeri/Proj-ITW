// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/CountryMedals');
    self.displayName = 'Paris 2024 Top 50 Medals';
    self.medals = ko.observableArray([]);

    let c_name = [];
    let c_total = [];

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getMedals...');
        var composedUri = self.baseUri();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            for(i=0; i < data.length; i++){
                c_name.push(data[i].CountryName);
                c_total.push(data[i].Total);
            }
            console.log(data);
            self.medals(data);



            new Chart($('#graph'),
                {
                    type: 'bar',
                    data: {
                        labels: c_name,
                        datasets: [{
                            label: 'Medalhas',
                            data: c_total
                        }]
                    },
                    options: {
                        backgroundColor: 'rgba(210, 201, 201, 0.35)',
                        hoverBackgroundColor: 'rgba(174, 211, 235, 0.81)'
                    }
                }
            );
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
