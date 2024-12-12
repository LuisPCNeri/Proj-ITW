// JavaScript atualizado
function valida() {
    let val = true;

    // Validação de texto para Nome e Sobrenome
    validate_text(document.getElementById('name_inp'), /^[a-zA-Z\s]+$/);
    validate_text(document.getElementById('last_name_inp'), /^[a-zA-Z\s]+$/);

    // Validação de endereço (mínimo 5 caracteres)
    validate_text(document.getElementById('address_inp'), /.{5,}/);

    // Validação de email
    const email = document.getElementById('email_inp');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        val = false;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    // Validação de telefone
    const phone = document.getElementById('phone_inp');
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(phone.value)) {
        phone.classList.add('is-invalid');
        val = false;
    } else {
        phone.classList.remove('is-invalid');
        phone.classList.add('is-valid');
    }

    // Verificar se já se inscreveu
    if (localStorage.getItem('has_volunteered') === 'true') {
        document.getElementById('successfull').classList.add('d-none');
        document.getElementById('unsuccessfull').classList.remove('d-none');
        return false;
    } else if (val === true && localStorage.getItem('has_volunteered') === null) {
        document.getElementById('unsuccessfull').classList.add('d-none');
        document.getElementById('successfull').classList.remove('d-none');
    }

    localStorage.setItem('has_volunteered', 'true');

    return val;
}

function validate_text(obj, regex) {
    if (!regex.test(obj.value)) {
        obj.classList.add('is-invalid');
        val = false;
    } else {
        obj.classList.remove('is-invalid');
        obj.classList.add('is-valid');
    }
}
