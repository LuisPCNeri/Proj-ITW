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
    var composedUri = `http://192.168.160.58/Paris2024/api/Teams?page=${page}&pageSize=20`;
    ajaxHelper(composedUri, 'GET').done(function (data) {
        console.log(data);
        hideLoading();
        // Process data
    });
}

function removeFav(Id) {
    console.log("remove fav");
    $("#fav-" + Id).remove();

    let fav = JSON.parse(localStorage.fav || '[]');

    const index = fav.indexOf(Id);

    if (index !== -1) {
        fav.splice(index, 1);
    }

    localStorage.setItem("fav", JSON.stringify(fav));
}

$(document).ready(function () {
    showLoading();

    let fav = JSON.parse(localStorage.fav || '[]');
    console.log(fav);

    for (const Id of fav) {
        console.log(Id);

        ajaxHelper(`http://192.168.160.58/Paris2024/api/Teams/${Id}`, 'GET').done(function (data) {
            console.log(data);
            if (localStorage.fav.length !== 0) {
                $("#table-favourites").show();
                $('#noadd').hide();
                $('#nofav').hide();
                $("#table-favourites").append(
                    `<tr id="fav-${Id}">
                        <td class="align-middle">${Id}</td>
                        <td class="align-middle">${data.Name}</td>
                        <td class="align-middle">${data.Sex}</td>
                        <td class="align-middle">${data.Country}</td>
                        <td class="text-end align-middle">
                            <a class="btn btn-default btn-sm btn-favourite" onclick="removeFav(${Id})"><i class="fa fa-heart text-danger" title="Selecione para remover dos favoritos"></i></a>
                        </td>
                    </tr>`
                );
            }
        });
        sleep(50);
    }

    hideLoading();
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});

