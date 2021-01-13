let progress = document.getElementsByClassName('progress-bar')[0];
let loginFields = document.getElementsByClassName('loginField');
let loginBtn = document.getElementById('loginBtn');

disableBtn(loginBtn)
for (let i = 0; i < loginFields.length; i++) {
    loginFields[i].addEventListener('input', () => {
        // console.log(loginFields)
        // username, password
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
        // enableBtn(loginBtn)
    })
}

loginBtn.onclick = async () => {
    const username = loginFields[0].value;
    const password = loginFields[1].value;

    const url = 'http://127.0.0.1:8000/api/accounts/login';
    const data = {
        username,
        password
    };
    let config = {
        headers: {
            "X-CSRFToken": getCookie('csrftoken')
        }
    }

    const res = await axios.post(url, data, config)
    // if (res.status)
    if (res.status === 200)
        window.location.replace('http://127.0.0.1:8000/index.html');
}