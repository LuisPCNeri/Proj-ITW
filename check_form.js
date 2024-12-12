// Validação principal
function valida() {
    let val = true;

    // Validação de texto para Nome e Sobrenome
    val = validate_text(document.getElementById('name_inp'), /^[a-zA-Z\s]+$/, val);
    val = validate_text(document.getElementById('last_name_inp'), /^[a-zA-Z\s]+$/, val);

    // Validação de endereço (mínimo 5 caracteres)
    val = validate_text(document.getElementById('address_inp'), /.{5,}/, val);

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

    if (val) {
        document.getElementById('successfull').classList.remove('d-none');
    }

    return val;
}

// Validação de texto reutilizável
function validate_text(obj, regex, val) {
    if (!regex.test(obj.value)) {
        obj.classList.add('is-invalid');
        return false;
    } else {
        obj.classList.remove('is-invalid');
        obj.classList.add('is-valid');
        return val;
    }
}

// Limpar validações e mensagens ao clicar no botão Reset
document.querySelector('button[type="reset"]').addEventListener('click', function () {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
    document.getElementById('successfull').classList.add('d-none');
    document.getElementById('unsuccessfull').classList.add('d-none');
});


