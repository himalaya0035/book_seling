$(document).ready(function () {

    let current_fs, next_fs, previous_fs; //fieldsets
    let opacity;
    let current = 1;
    let steps = $("fieldset").length;

    setProgressBar(current);

    $(".next").click(function () {

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({'opacity': opacity});
            },
            duration: 500
        });
        setProgressBar(++current);
    });

    $(".previous").click(function () {

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();

        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({'opacity': opacity});
            },
            duration: 500
        });
        setProgressBar(--current);
    });

    function setProgressBar(curStep) {
        let percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        $(".progress-bar")
            .css("width", percent + "%")
    }

    $(".submit").click(function () {
        return false;
    })

});


let signupGenres = document.getElementsByClassName('signupGenre');
let submitBtn = document.getElementsByClassName('submit')[0];
let selectedGenre = document.getElementsByClassName('selected')

disableBtn(submitBtn);

for (let i = 0; i < signupGenres.length; i++) {
    signupGenres[i].addEventListener('click', (e) => {
        let clickedGenre = e.target;
        clickedGenre.classList.toggle('selected')
        if (selectedGenre.length > 0) {
            enableBtn(submitBtn)
        } else {
            disableBtn(submitBtn)
        }
    })


}


// form validation starts now
let firstSectionBtn = document.getElementById('sectionFirstBtn');
let firstSection = document.getElementsByClassName('sectionFirst');
let contact = document.getElementById('contact');
let address = document.getElementById('address');


disableBtn(firstSectionBtn);

for (let i = 0; i < firstSection.length; i++) {
    firstSection[i].addEventListener('input', () => {
        validateFirstSection();
    })
}

function validateFirstSection() {
    for (let i = 0; i < firstSection.length; i++) {
        if (firstSection[i].value !== '' && address.value.length >= 30 && contact.value.length > 9 && contact.value.length < 13) {
            enableBtn(firstSectionBtn);
        } else {
            disableBtn(firstSectionBtn);
        }
    }
}


let secondSectionBtn = document.getElementById('sectionSecondBtn');
let secondSection = document.getElementsByClassName('sectionSecond');
let password = document.getElementById('password');
let confirmPass = document.getElementById('confirmPassword');
let username = document.getElementById('username')
let email = document.getElementById('email')

disableBtn(secondSectionBtn);

for (let i = 0; i < secondSection.length; i++) {
    secondSection[i].addEventListener('input', () => {
        validateSecondSection();
    })
}

function validateSecondSection() {
    for (let i = 0; i < secondSection.length; i++) {
        if (secondSection[i].value !== '' && username.value.length >= 6 && password.value.length > 7 && confirmPass.value.length > 7) {
            if (isPassowrdsEqual() && isEmailOK()) {
                enableBtn(secondSectionBtn);
            } else {
                disableBtn(secondSectionBtn);
            }
        } else {
            disableBtn(secondSectionBtn);
        }

    }

}

function isPassowrdsEqual() {
    if (password.value === confirmPass.value) {
        removeErrorMsg();
        return true;
    } else {
        displayErrorMsg('Password Does Not Match')
        return false;
    }
}

function isEmailOK() {
    if (email.value.includes('@') && (email.value.includes('.com') || email.value.includes('.mail'))) {
        removeErrorMsg();
        return true
    } else {
        displayErrorMsg('Email is not Valid');
        return false;
    }
}

let timer = document.getElementById('timer');
submitBtn.addEventListener('click', () => {


    let genre_names = [];
    for (let i = 0; i < selectedGenre.length; i++) {
        genre_names.push(selectedGenre[i].innerText)
    }

    console.log(genre_names)
    const first_name = firstSection[0].value;
    const last_name = firstSection[1].value;

    const data = {
        user: {
            username: username.value,
            first_name,
            last_name,
            password: password.value,
            get_favourite: genre_names,
        },
        address: address.value
    }

    console.log(data)

    let config = {
        headers: {
            "X-CSRFToken": csrftoken
        }
    }

    const url = "http://127.0.0.1:8000/api/accounts/register";
    axios.post(url, data, config)
        .then(res => console.log(res))

    let timeleft = 0;
    let downloadTimer = setInterval(function () {
        if (timeleft > 4) {
            clearInterval(downloadTimer);

            /*
            {
"user":{
"username": "priyansh2001anshul",
"first_name":"Priyansh",
"last_name":"Singh",
"password":"Pp2315211",
    "get_favourite": [
      "Action",
      "Physics"
    ]
},
"address":"H3 Meerut"
}
             */


            // window.location.replace("http://127.0.0.1:5501/index.html");
            console.log(signupGenres)
        }
        let remain = 5 - timeleft;
        timer.innerText = 'Logging You in ' + remain + 's';
        timeleft += 1;
    }, 1000);
})
