import { postJsonData } from "./constructSection.js";

export function isEmailOK(email) {
    if (email.value.includes('@') && (email.value.includes('.com') || email.value.includes('.mail'))) {
        removeErrorMsg();
        return true
    } else {
        displayErrorMsg('Email is not Valid');
        return false;
    }
}

function isFieldsEmpty(array) {
    return (array.some(arrayElement => arrayElement.value ==  ''))
}

function isAddressOk(address) {
    if (address.value.length > 30){
        removeErrorMsg();
        return true;
    }
    else{
        displayErrorMsg('Delivery address needs to be atleast 30 characters long');
        return false;
    }
}

function  isContactOk(contact) {
    if(contact.value.length > 9 && contact.value.length < 11 ){
        removeErrorMsg();
        return true;
    }
    else {
        displayErrorMsg('Contact Number needs to be 10 characters long')
        return false;
    }
}

export function disableBtn(ele) {
    ele.disabled = true;
    ele.style.background = '#cccccc';
    ele.style.color = '#666666';
}

export function enableBtn(ele) { 
    ele.disabled = false;
    ele.style.background = '#673AB7';
    ele.style.color = 'white';
}

export function displayErrorMsg(msg) {
    document.getElementById('message').innerText = msg;
}

export function removeErrorMsg() {
    document.getElementById('message').innerText = '';
}



export function validationUtility(){
    var contact = document.getElementById('contact');
    var address = document.getElementById('address');
    var email = document.getElementById('email')
    var firstSection = document.getElementsByClassName('sectionFirst');
    var saveBtn = document.getElementById('saveBtn');
    var condition
    var arr = Array.from(firstSection);
   function validateFirstSection(btn) {

        if (window.location.href.indexOf('profile') > -1){
            condition = !isFieldsEmpty(arr) && isContactOk(contact) && isEmailOK(email) && isAddressOk(address);
        }
        else {
            condition = !isFieldsEmpty(arr) && isContactOk(contact) && isAddressOk(address) ;
        }

        if (condition) {
            enableBtn(btn);
        } else {
            disableBtn(btn);
        }
    }

    if (window.location.href.indexOf("profile") > -1) {
        disableBtn(saveBtn);
        validateFirstSection(saveBtn);
        for (let i = 0; i < firstSection.length; i++) {
            firstSection[i].addEventListener('input', () => {
                validateFirstSection(saveBtn);
            })
        }
        saveBtn.onclick = async () => {
            let url = 'https://jsonplaceholder.typicode.com/posts';
            let obj = {
                address: address.value,
                user: {

                }
            }
            disableBtn(saveBtn);
            const isPostRequestOk = await postJsonData(url,obj);
            enableBtn(saveBtn)
            if(isPostRequestOk){
                window.location.reload();
            }
            else {
                alert(`couldn't update profile , try again later`);
            }
        }
    }
}
