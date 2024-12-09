function valida(){
    val = true;

    validate_text(document.getElementById('name_inp'));
    validate_text(document.getElementById('last_name_inp'));
    validate_text(document.getElementById('address_inp'));

    var email = document.getElementById('email_inp');
    if(!email.value.includes('@') || email.value.length < 3){
        email.classList.add('is-invalid');
        val = false;
    }else{
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    var phone = document.getElementById('phone_inp');
    if(phone.value.length != 9){
        phone.classList.add('is-invalid');
        val = false;
    }else{
        phone.classList.remove('is-invalid');
        phone.classList.add('is-valid');
    }

    console.log(localStorage.getItem('has_volunteered'));

    if(localStorage.getItem('has_volunteered') === true){
        document.getElementById('successfull').classList.add('d-none');
        document.getElementById('unsuccessfull').classList.remove('d-none');
        console.log(localStorage.getItem('has_volunteered'));
        return false;
    }else if(val === true && (localStorage.getItem('has_volunteered') === null)){
        console.log(localStorage.getItem('has_volunteered'))
        document.getElementById('unsuccessfull').classList.add('d-none');
        document.getElementById('successfull').classList.remove('d-none');
    }

    localStorage.setItem('has_volunteered', true);

    return val;
}

function validate_text(obj){
    if(obj.value.length < 3){
        obj.classList.add('is-invalid');
        val = false;
    }else{
        obj.classList.remove('is-invalid');
        obj.classList.add('is-valid');
    }
}