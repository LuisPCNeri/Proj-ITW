var vm = function () {
    console.log('ViewModel initiated...');
    //--- Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Coaches');
    self.displayName = 'Paris2024 Coaches List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.coaches = ko.observableArray([]); 
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(50);
    self.totalRecords = ko.observable(0); // Atualizado para garantir que recebe corretamente o total de registros
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);

    self.previousPage = ko.computed(function () {
        return self.currentPage() - 1;
    }, self);

    self.nextPage = ko.computed(function () {
        return self.currentPage() + 1;
    }, self);

    self.fromRecord = ko.computed(function () {
        return (self.currentPage() - 1) * self.pagesize() + 1;
    });

    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    });
    
    self.totalPages = ko.observable(0);

    self.pageArray = ko.computed(function () {
        let pages = [];
        for (let i = 1; i <= self.totalPages(); i++) {
            pages.push(i);
        }
        return pages;
    });

    //--- Página atual
    self.activate = function (id) {
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            // Atualizando as variáveis observáveis com os dados da API
            self.coaches(data.Coaches);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalAthletes); // Corrigido para o campo correto
        });
    };

    //--- Função AJAX para chamadas à API
    function ajaxHelper(uri, method, data) {
        self.error(''); // Limpa mensagens de erro
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    //--- Funções de utilidade
    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        });
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    }

    //--- Inicialização
    showLoading();
    var pg = getUrlParameter('page');
    if (pg == undefined) {
        self.activate(1); // Carregar página 1 por padrão
    } else {
        self.activate(pg); // Carregar a página específica
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm()); // Ativar o Knockout.js
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide'); // Garantir que o modal de carregamento é fechado
});
