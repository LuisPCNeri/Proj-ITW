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