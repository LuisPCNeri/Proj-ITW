//--- Internal functions
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            hideLoading();
        }
    });
}

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}

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
    console.log("sPageURL=", sPageURL);
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

//--- Page Events
function activatePage(page) {
    console.log('CALL: getAthletes...');
    var composedUri = `http://192.168.160.58/Paris2024/api/Sports?page=${page}&pageSize=20`;
    ajaxHelper(composedUri, 'GET').done(function (data) {
        console.log(data);
        hideLoading();
        // Process data
    });
}

function removeFav(teamId) {
    console.log("Removendo equipa favorita com ID:", teamId);
    $(`#fav-${teamId}`).remove(); // Remove a linha da tabela

    // Carregar os favoritos do localStorage
    let favourites = JSON.parse(localStorage.getItem("fav") || '[]');

    // Filtrar o array para remover o objeto com a chave `team` igual ao `teamId`
    favourites = favourites.filter(fav => fav.sport !== teamId);

    // Atualizar o localStorage com o array filtrado
    localStorage.setItem("fav", JSON.stringify(favourites));

    console.log("Favoritos atualizados no localStorage:", favourites);
}

$(document).ready(function () {
    showLoading();

    // Carregar os favoritos do localStorage
    let favourites = JSON.parse(localStorage.getItem("fav") || '[]');
    console.log("Favoritos carregados:", favourites);

    // Iterar sobre os favoritos
    for (const fav of favourites) {
        // Verificar se a chave é `team`
        if (fav.sport) {
            console.log("Carregando Atleta favorita com ID:", fav.sport);

            // Fazer a chamada à API com o ID associado à chave `team`
            ajaxHelper(`http://192.168.160.58/Paris2024/api/Sports/${fav.sport}`, 'GET').done(function (data) {
                console.log("Dados da equipa:", data);

                // Exibir a tabela somente se houver favoritos
                $("#table-favourites").show();
                $('#noadd').hide();
                $('#nofav').hide();

                // Adicionar a equipa à tabela
                $("#table-favourites").append(
                    `<tr id="fav-${fav.sport}">
                        <td class="align-middle">${fav.sport}</td>
                        <td class="align-middle">${data.Name}</td>
                        <td class="align-middle"><img style="height: 75px; width: 75px;" src="${data.Pictogram}"></td>
                        <td class="align-middle">${data.Athletes.length}</td>
                        <td class="align-middle">${data.Coaches.length}</td>
                        <td class="align-middle">${data.Teams.length}</td>
                        <td class="align-middle">${data.Competitions.length}</td>
                        <td class="text-end align-middle">
                            <a class="btn btn-default btn-sm btn-favourite" onclick="removeFav('${fav.sport}')">
                                <i class="fa fa-heart text-danger" title="Selecione para remover dos favoritos"></i>
                            </a>
                        </td>
                    </tr>`
                );
            });
            sleep(50);
        }
    }

    hideLoading();
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});
z   