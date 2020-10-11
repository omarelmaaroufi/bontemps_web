(function() {

    $(document).ready(init);

    function init() {
        fetch('/user')
            .then(response => {
                return response.json();
            })
            .then(user => {
                if (user.authenticated) {
                    handleAuthenticated();
                } else {
                    handleUnauthenticated();
                }
            });
        $("#insertButton").click(function() {
            $("#form1").toggle();
        });
    }

    function handleAuthenticated() {
        $('#logout-btn').parent().removeAttr('hidden');

        fetch('/api/gerechten')
            .then(response => {
                return response.json();
            })
            .then(gerechten => {
                let newRowsHtml = '';

                gerechten.forEach(function(gerecht) {
                    newRowsHtml +=
                        '<tr>' +
                        `<td>${gerecht.id}</td>` +
                        `<td>${gerecht.naam} ${gerecht.soort}</td>` +
                        `<td>${gerecht.bijzonderheden}</td>` +
                        `<td>${gerecht.prijs}</td>` +
                        '</tr>\n';
                });

                $('#gerechten-tbl').children('tbody').html(newRowsHtml);
            });

    }

    function handleUnauthenticated() {
        $('#login-btn').parent().removeAttr('hidden');
        $('#unauthenticated-msg').removeAttr('hidden');
    }
}());