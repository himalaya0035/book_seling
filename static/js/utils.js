function displayErrorMsg(msg) {
    document.getElementById('message').innerText = msg;
}

function removeErrorMsg() {
    document.getElementById('message').innerText = '';
}

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

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
