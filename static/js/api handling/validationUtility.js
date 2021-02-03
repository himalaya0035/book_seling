import {postJsonData} from "./constructSection.js";
import csrftoken from "../csrftoken.js";

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
    return (array.some(arrayElement => arrayElement.value === ''))
}

function isAddressOk(address) {
    if (address.value.length > 30) {
        removeErrorMsg();
        return true;
    } else {
        displayErrorMsg('Delivery address needs to be atleast 30 characters long');
        return false;
    }
}

function isContactOk(contact) {
    if (contact.value.length > 9 && contact.value.length < 11) {
        removeErrorMsg();
        return true;
    } else {
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

function generate_shipment_details() {
    const shipping_address_data = {
        name: document.getElementsByClassName('sectionFirst')[0].value,
        address: document.getElementById('address').value,
        contact_number: document.getElementById('contact').value,
        email: document.getElementById('emailId').value,
    }

    localStorage.setItem("shipping_address", JSON.stringify(shipping_address_data));
    window.location = '/confirm-order';
}


export function validationUtility() {

    var contact = document.getElementById('contact');
    var address = document.getElementById('address');
    var email = document.getElementById('emailId')
    var firstSection = document.getElementsByClassName('sectionFirst');
    var saveBtn = document.getElementById('saveBtn');
    var condition;
    var arr = Array.from(firstSection);

    function validateFirstSection(btn) {

        if (window.location.href.indexOf('profile') > -1) {
            condition = !isFieldsEmpty(arr) && isContactOk(contact) && isAddressOk(address);
        } else {
            condition = !isFieldsEmpty(arr) && isContactOk(contact) && isAddressOk(address);
        }

        if (condition) {
            enableBtn(btn);
        } else {
            disableBtn(btn);
        }
    }

    if (window.location.href.indexOf('checkout') > -1) {
        var paymentBtn = document.getElementById('paymentBtn');
        var nextLink = document.getElementById('nextLink');
        if (!(!isFieldsEmpty(arr) && isContactOk(contact) && isEmailOK(email) && isAddressOk(address))) {

            paymentBtn.style.color = "#808080";
            nextLink.style.color = '#808080'
        } else {

            nextLink.addEventListener('click', generate_shipment_details);
            paymentBtn.addEventListener('click', generate_shipment_details);

        }

        arr.map(a => {
            a.addEventListener('input', () => {
                if (!isFieldsEmpty(arr) && isContactOk(contact) && isEmailOK(email) && isAddressOk(address)) {

                    // paymentBtn.href = "confirmOrder.html";
                    paymentBtn.style.color = "white";
                    // nextLink.href = "confirmOrder.html";
                    nextLink.href = "#";
                    nextLink.style.color = 'white';
                    nextLink.addEventListener('click', generate_shipment_details);
                    paymentBtn.addEventListener('click', generate_shipment_details);

                } else {

                    nextLink.removeEventListener('click', generate_shipment_details);
                    paymentBtn.removeEventListener('click', generate_shipment_details);


                    // paymentBtn.href = "#";
                    paymentBtn.style.color = "#808080";
                    // nextLink.href = "#";
                    nextLink.style.color = '#808080'
                }
            })
        })

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
            let url = '/api/accounts/profile';
            let obj = {
                address: address.value,
                contact_number: contact.value,
                user: {
                    first_name: firstSection[0].value,
                    last_name: firstSection[1].value
                }
            };

            const res = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrftoken
                },
                body: JSON.stringify(obj)
            });

            disableBtn(saveBtn);
            let isPostRequestOk = false;
            if (res.status === 200) {
                isPostRequestOk = true
            }

            enableBtn(saveBtn)
            if (isPostRequestOk) {
                window.location.reload();
            } else {
                alert(`couldn't update profile , try again later`);
            }
        }
    }
}
