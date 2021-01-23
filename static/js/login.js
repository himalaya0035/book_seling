// const host =

function disableBtn(ele) {
    ele.disabled = true;
    ele.style.background = '#cccccc';
    ele.style.color = '#666666';
}

function enableBtn(ele) {
    ele.disabled = false;
    ele.style.background = '#673AB7';
    ele.style.color = 'white';
}


let progress = document.getElementsByClassName('progress-bar')[0];
let loginFields = document.getElementsByClassName('loginField');
let loginBtn = document.getElementById('loginBtn');

disableBtn(loginBtn)
for (i = 0; i < loginFields.length; i++) {
    loginFields[i].addEventListener('input', () => {
        if (loginFields[0].value.length >= 6 && loginFields[1].value.length > 7) {
            progress.style.width = '100%';
            enableBtn(loginBtn);
        } else if (loginFields[0].value.length >= 6 || loginFields[1].value.length > 7) {
            progress.style.width = '66%';
            disableBtn(loginBtn);
        } else {
            progress.style.width = '33%';
            disableBtn(loginBtn);
        }
    })
}


loginBtn.onclick = async () => {
    const username = loginFields[0].value;
    const password = loginFields[1].value;

    const url = `${window.location.protocol}//${window.location.host}/api/accounts/login`;
    const data = {
        username,
        password
    };


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify(data)
        })
        if (response.status === 201 || response.status === 200) {
            window.location.push()
            return true;
        }
    } catch (err) {
        console.log(err.message)
        return false
    }
}

