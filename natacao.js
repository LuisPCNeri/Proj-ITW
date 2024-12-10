var vm = function () {
    console.log('ViewModel initiated...');
    var self = this;

    // Propriedades Observáveis
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Swimmings/Events');
    self.displayName = 'Natação - Lista de provas';
    self.error = ko.observable('');
    self.Matches = ko.observableArray([]);
    self.visibleMatches = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.itemsPerPage = 20;
    self.itemInicialOnPage = ko.observable(1);
    self.itemFinalOnPage = ko.observable(20);

    // Propriedades adicionadas para armazenar eventos
    self.events = ko.observableArray([]); // **Nova propriedade para armazenar eventos completos**
    self.eventIds = ko.observableArray([]); // **Mantido para compatibilidade**
    self.stageIds = ko.observableArray(['', 'STAGE1', 'STAGE2', 'STAGE3']);

    // Propriedades para EventId e StageId
    self.selectedEventId = ko.observable(''); // Inicializado vazio para evitar inconsistências
    self.selectedStageId = ko.observable('');

    // Cálculo do Total de Páginas
    self.totalPages = ko.computed(() => Math.ceil(self.Matches().length / self.itemsPerPage));

    // Gerar Lista de Páginas
    self.pages = ko.computed(() => Array.from({ length: self.totalPages() }, (_, i) => i + 1));

    // Atualizar os Itens Visíveis
    self.updateVisibleMatches = function () {
        const startIndex = (self.currentPage() - 1) * self.itemsPerPage;
        const endIndex = startIndex + self.itemsPerPage;
        self.visibleMatches(self.Matches().slice(startIndex, endIndex));
    };

    // Navegação: Ir para uma Página Específica
    self.goToPage = function (page) {
        if (page >= 1 && page <= self.totalPages()) {
            self.currentPage(page);
            self.itemInicialOnPage((page * self.itemsPerPage) - (self.itemsPerPage - 1));
            self.itemFinalOnPage(Math.min(page * self.itemsPerPage, self.Matches().length));
            self.updateVisibleMatches();
        }
    };

    // Navegação: Página Anterior
    self.prevPage = function () {
        if (self.currentPage() > 1) {
            self.goToPage(self.currentPage() - 1);
        }
    };

    // Navegação: Próxima Página
    self.nextPage = function () {
        if (self.currentPage() < self.totalPages()) {
            self.goToPage(self.currentPage() + 1);
        }
    };

    // Carregar Eventos da API
    self.loadEvents = function () { // **Nova função para carregar eventos**
        const uri = self.baseUri().replace('Swimmings?EventId=', 'Events'); // **Ajuste no endpoint**
        console.log('Fetching events from:', uri);
        ajaxHelper(uri, 'GET')
            .done(function (data) {
                console.log('Events received:', data);
                self.events(data); // **Armazena os eventos completos**
                self.eventIds(data.map(event => event.EventId)); // Atualiza os EventIds para compatibilidade
                self.selectedEventId(data[0]?.EventId || ''); // Define o primeiro evento como selecionado
            })
            .fail(function (error) {
                console.error('Error fetching events:', error);
            });
    };

    // Atualizar Dados ao Selecionar Novo EventId ou StageId
    self.loadMatches = function () {
        console.log('CALL: getMatches...');
        const composedUri =
            self.baseUri() +
            self.selectedEventId() +
            '&stageId=' +
            self.selectedStageId(); // Incluindo o stageId

        console.log('Fetching data from:', composedUri);
        showLoading();
        ajaxHelper(composedUri, 'GET')
            .done(function (data) {
                console.log('Data received:', data);
                hideLoading();
                self.Matches(data);
                self.currentPage(1); // Reiniciar para a primeira página
                self.updateVisibleMatches();
            })
            .fail(function (error) {
                console.log('Error fetching data:', error);
                hideLoading();
            });
    };

    // Função AJAX
    function ajaxHelper(uri, method, data) {
        self.error(''); // Limpar mensagens de erro
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

    // Funções Auxiliares para Exibir/Esconder Carregamento
    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }

    function hideLoading() {
        $("#myModal").modal('hide');
    }

    // Inicializar
    showLoading();
    self.loadEvents(); // **Carregar eventos ao inicializar**
    self.loadMatches(); // **Mantido para carregar partidas**
    console.log("ViewModel initialized!");
};

// Inicializar Knockout e Tema Claro/Escuro
document.addEventListener('DOMContentLoaded', function () {
    ko.applyBindings(new vm());
});

$(document).ready(function () {
    console.log("Document ready!");
});

$(document).ajaxComplete(function () {
    $("#myModal").modal('hide');
});
