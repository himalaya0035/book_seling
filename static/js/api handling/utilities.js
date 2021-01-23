import {
    postJsonData
} from './constructSection.js';
import {
    disableDeleteBtn,
    enableDeleteBtn
} from './orderProcessingUtilities.js';
import {
    enableBtn,
    disableBtn,
    isEmailOK,
    displayErrorMsg,
    removeErrorMsg
} from './validationUtility.js';
import csrftoken from "../csrftoken.js";

import {constructSection} from './constructSection.js';

const baseAPIUrl = `${window.location.protocol}//${window.location.host}/api`;

export function manageBookNameLength() {
    let booknames = document.getElementsByClassName('cartBookName');
    for (let i = 0; i < booknames.length; i++) {
        if (booknames[i].innerText.length > 50) {
            booknames[i].innerText = booknames[i].innerText.substring(0, 50) + '...';
        }
    }
}


export function manageAboutSection() {
    let characterlength;
    if (window.location.href.indexOf('book') > -1) {
        characterlength = 383;
    } else if (window.location.href.indexOf('author') > -1) {
        characterlength = 503;
    }
    let aboutSection = document.getElementById('about');
    if (aboutSection.innerText.length > characterlength) {
        aboutSection.innerText = aboutSection.innerText.substring(0, characterlength) + ' ...';
    }
}

export function loadUtilityJs() {
    var sidebarToggler = document.getElementsByClassName("sidebarToggler")[0];
    var sidebar = document.getElementsByClassName("mobileSidebar")[0];
    var cross = document.getElementsByClassName("cross")[0];

    sidebarToggler.addEventListener('click', function () {
        sidebar.classList.toggle('sidebarActive');
    })
    cross.addEventListener('click', function () {
        sidebar.classList.toggle('sidebarActive');
    })

    var bookNames = document.getElementsByClassName("bookName");
    for (let i = 0; i < bookNames.length; i++) {
        if (bookNames[i].innerText.length > 23) {
            bookNames[i].innerText = bookNames[i].innerText.substring(0, 25) + ' ...';
        }
    }
}

export function toggleButton(mainElementClass, toBeReplacedClass, checkClass, buttonInitialText, buttonFinalText) {
    var commonElement = document.getElementsByClassName(mainElementClass);
    for (let i = 0; i < commonElement.length; i++) {
        commonElement[i].addEventListener('click', async (e) => {

            var ele = e.target;
            disableBtn(ele)

            var child = ele.getElementsByTagName('i')[0];
            let url;
            let obj;

            if (mainElementClass === 'addToCartBtn') {
                // when you want to add item from cart
                console.log(child)
                url = 'https://jsonplaceholder.typicode.com/posts';
                obj = {
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                }
                ele.classList.toggle('removeFromCartBtn')
            } else if (mainElementClass === 'addToCartBtn' && ele.classList.contains('removeFromCartBtn')) {
                // item already sdded to cart , now you want to remove it using the same button
                url = 'https://jsonplaceholder.typicode.com/posts';
                obj = {
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                }
                ele.classList.toggle('removeFromCartBtn')
            } else if (mainElementClass === 'bookmark') {
                // when you want to bookmark a book
                url = `${baseAPIUrl}/cart/bookmark`;
                obj = {
                    book_id: ele.id
                }
                console.log(ele)
                console.log(obj)
                ele.classList.toggle('removeFromBookmark')
            } else if (mainElementClass === 'bookmark' && ele.classList.contains('removeFromBookmark')) {
                // the book is already bookmarked and you want to remove it from bookmark using the same button
                url = 'https://jsonplaceholder.typicode.com/posts';
                obj = {
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                }
                console.log(child)
                ele.classList.toggle('removeFromBookmark')
            } else if (mainElementClass === 'deleteBookmark') {
                // console.log(ele.id, ' child 2')
                // jo api request isse just phle waale else if section me ki hai , wohi isme lgni hai
                // yeh bhi bookmark htane ke liye hai pr khi doosri jgeh se
                // url = `http://127.0.0.1:8000/api/cart/bookmark`;
                url = `${baseAPIUrl}/cart/bookmark`;
                obj = {
                    book_id: ele.id
                }
            }
            const isPostRequestOk = await postJsonData(url, obj);
            enableBtn(ele)
            if (isPostRequestOk && mainElementClass !== 'deleteBookmark') {
                if (child.classList.contains(checkClass)) {
                    ele.innerHTML = `<i class ="fa ${toBeReplacedClass}" style="color:white;"></i>` + ` ${buttonInitialText}`;
                } else {
                    ele.innerHTML = `<i class ="fa ${checkClass}" style="color:white;"></i>` + ` ${buttonFinalText}`;
                }

            } else if (mainElementClass !== 'deleteBookmark') {
                alert('Operation Failed, Try again')
                return false;
            }

            if (window.location.href.indexOf('bookmark') > -1 && mainElementClass === 'deleteBookmark') {
                let bookItem = ele.closest('.bookItem');
                bookItem.remove();
                if (document.getElementsByClassName('bookList')[0].innerText.length === 0) {
                    document.getElementById('NoBookmarkedMsg').style.display = 'block';
                }
            }

        })
    }
}

export function addScrollEffect() {
    var rellax = new Rellax('.rellax');
    var authorInfoContainer = document.getElementsByClassName('authorInfoContainer')[0];
    window.onscroll = () => {
        if (window.scrollY > 0 && window.scrollY < 20) {
            authorInfoContainer.style.opacity = 0.9;
        } else if (window.scrollY >= 20 && window.scrollY < 40) {
            authorInfoContainer.style.opacity = 0.8;
        } else if (window.scrollY >= 40 && window.scrollY < 60) {
            authorInfoContainer.style.opacity = 0.7;
        } else if (window.scrollY >= 60 && window.scrollY < 80) {
            authorInfoContainer.style.opacity = 0.6;
        } else if (window.scrollY >= 80 && window.scrollY < 100) {
            authorInfoContainer.style.opacity = 0.5;
        } else if (window.scrollY >= 100 && window.scrollY < 120) {
            authorInfoContainer.style.opacity = 0.4;
        } else if (window.scrollY >= 120 && window.scrollY < 140) {
            authorInfoContainer.style.opacity = 0.3;
        } else if (window.scrollY >= 140 && window.scrollY < 160) {
            authorInfoContainer.style.opacity = 0.2;
        } else if (window.scrollY >= 160 && window.scrollY < 170) {
            authorInfoContainer.style.opacity = 0.1;
        } else if (window.scrollY >= 170) {
            authorInfoContainer.style.opacity = 0;
        } else {
            authorInfoContainer.style.opacity = 1;
        }
    }
}

export function enableLoader(containerElement, loaderGif) {
    containerElement.style.visibility = 0;
    containerElement.style.opacity = 0;
    loaderGif.style.display = 'block';
    loaderGif.style.visibility = 1;
    loaderGif.style.opacity = 1;
}

export function disableLoader(containerElement, loaderGif) {
    containerElement.style.visibility = 1;
    containerElement.style.opacity = 1;
    loaderGif.style.display = 'none';
    loaderGif.style.visibility = 0;
    loaderGif.style.opacity = 0;
}

export function loadAccountModalJs() {
    var modal = document.getElementsByClassName("modal");

    var btn = document.getElementsByClassName("myBtn");

    var span = document.getElementsByClassName("close");


    for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function () {
            modal[i].style.display = "block";
        }
        span[i].onclick = function () {
            modal[i].style.display = "none";
        }
    }


    if (window.location.href.indexOf('account') > -1) {
        var emailInput = document.getElementById('emailAddress');
        var confirmPasswordDelete = document.getElementById('confirmPasswordDelete');
        var confirmPasswordDelete2 = document.getElementById('confirmPasswordDelete2')
        var updateEmailBtn = document.getElementById('updateEmailBtn')
        var deleteAccountBtn = document.getElementById('deleteAccountBtn');

        updateEmailBtn.onclick = async () => {
            if (!isEmailOK(emailInput)) {
                displayErrorMsg('Email is not valid');

                return;
            } else if (confirmPasswordDelete2.value.length < 8) {
                displayErrorMsg('Password is too short')

                return;
            } else {

                removeErrorMsg();
                let url = 'https://jsonplaceholder.typicode.com/posts';
                let obj = {
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                }
                disableDeleteBtn(updateEmailBtn)
                const isPostRequestOk = await postJsonData(url, obj);
                if (isPostRequestOk) {
                    document.getElementById('message').style.color = '#673AB7';
                    displayErrorMsg('Email Updated succesfully')
                    setTimeout(() => {
                        span[0].click();
                    }, 2000);
                } else {
                    displayErrorMsg(`couldn't update email, try again later`);
                }
                enableDeleteBtn(updateEmailBtn, '#000000');
            }

        }
        deleteAccountBtn.onclick = async () => {
            if (confirmPasswordDelete.value.length < 8) {
                document.getElementById('message2').innerText = 'Password is too short';
                return;
            } else {

                document.getElementById('message2').innerText = '';
                let url = 'https://jsonplaceholder.typicode.com/posts';
                let obj = {
                    title: 'foo',
                    body: confirmPasswordDelete.value,
                    userId: 1,
                }
                disableDeleteBtn(deleteAccountBtn)
                const isPostRequestOk = await postJsonData(url, obj);
                if (isPostRequestOk) {
                    document.getElementById('message').style.color = '#673AB7';
                    console.log('chl bhenchod');
                    setTimeout(() => {
                        window.location.replace('http://127.0.0.1:5501/index.html') // jha bhi redirect krna ho daal diyo,
                    }, 1000);
                } else {
                    document.getElementById('message2').innerText = 'Password is incorrect, try again';
                }
                enableDeleteBtn(deleteAccountBtn, '#000000');
            }

        }
    }
}

function calculateTotalAmount(discountPercent) {
    var cartTotalString = document.getElementById('cartTotal');
    var cartTotalInt = parseInt(cartTotalString.innerText.replace('Rs ', ''));
    var discount = document.getElementById('discount')
    var discountValue = discount.innerText.replace('Rs ', '');
    var discountValueInt;
    if (discountPercent) {
        discountValueInt = parseInt((cartTotalInt * discountPercent) / 100);
        discount.innerText = 'Rs ' + discountValueInt;
    } else {
        discountValueInt = parseInt(discountValue);
    }
    var totalAmt = cartTotalInt - discountValueInt + 40;
    document.getElementById('totalAmt').innerText = 'Rs ' + totalAmt;
}

function setExpectedDeliveryDate() {
    var d = new Date();
    d.setDate(d.getDate() + 2);
    var stringDate = d.toString();
    var expectedDate = stringDate.slice(0, 3) + ', ' + stringDate.slice(8, 10) + ' ' + stringDate.slice(4, 7) + ' 8am - 6pm';
    document.getElementById('fillDeliveryDate').innerText = expectedDate;
}

export function loadOrderTotalJs() {
    calculateTotalAmount();
    setExpectedDeliveryDate();
    var promocode = document.getElementById('promocodeinput');
    var applyButton = document.getElementById('applypromocode')
    var placeorderbtn = document.getElementById('placeOrder');
    applyButton.onclick = async () => {

        if (promocode.value.length < 3) {
            alert('Invalid Promocode');
            return false;
        } else {
            let url = 'https://jsonplaceholder.typicode.com/posts';
            let obj = {
                title: 'foo',
                body: 'bar',
                userId: 1,
                // object here would be - code : promocode.value
            }
            disableBtn(applyButton)
            const isPostRequestOk = await postJsonData(url, obj);
            if (isPostRequestOk) {
                var discountPercent = parseInt(promocode.value.replace(/[^0-9\.]/g, ''), 10);
                calculateTotalAmount(discountPercent)

            } else {
                alert('Invalid Promocode');

            }
            enableBtn(applyButton)
        }
    }
    placeorderbtn.onclick = async () => {
        let url = 'https://jsonplaceholder.typicode.com/posts';
        let obj = {
            title: 'foo',
            body: 'bar',
            userId: 1,
            // object here would be - code : promocode.value
        }
        const isPostRequestOk = postJsonData(url, obj);
        disableBtn(placeorderbtn);
        if (isPostRequestOk) {
            window.location.replace('http://127.0.0.1:5501/index.html');
        } else {
            alert(`couldn't place order`);
        }

    }
    // abhi smj me nhi aa rha ki kya kru place order ke baad, payment gateway khulna chaiye yha pr
    // wo dekhenge kaise kre
}

var arrayForResults = [];

function filterData(data, searchText) {
    if (data) {
        arrayForResults = data.results;
    }
    let matches = arrayForResults.filter(arrElement => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return arrElement.name.match(regex)
    })
    outputHtml(matches)
}

function outputHtml(matches) {
    var searchResults = document.getElementById('searchResults');
    let html = matches.map(match => `<div class="result">
        <div class="resultImg">
            <a href="book.html"><img src="${match.imgUrl}" alt=""></a>
        </div>
        <div class="resultName">
            <h4><a href="book.html" style="text-decoration:none; color:rgb(41,41,41);">${match.name}</a></h4>
        </div>
     </div>`
    ).join('');
    searchResults.innerHTML = html;
}

function enableSearchLoader(loader) {
    loader.style.display = 'block';
    loader.style.visibility = 1;
    loader.style.opacity = 1;
}

function disableSearchLoader(loader) {
    loader.style.display = 'none';
    loader.style.visibility = 0;
    loader.style.opacity = 0;
}

export function manageSearchResults() {
    var searchBox = document.getElementById('searchBox');
    var searchResults = document.getElementById('searchResults');
    var loader2 = document.getElementById('loader2');
    var searchIcon = document.getElementById('searchIcon');
    searchIcon.onclick = () => {
        if (searchIcon.classList.contains('fa-close'))
            searchBox.value = '';
        searchResults.style.display = 'none';
        searchIcon.classList.remove('fa-close');
    }
    searchBox.addEventListener('input', async () => {
        if (searchBox.value.length > 0) {
            searchResults.style.display = 'block';
            searchIcon.classList.add('fa-close');
            if (searchBox.value.length === 1) {
                arrayForResults = [];
                enableSearchLoader(loader2)
                let aisehi = await constructSection('./js/api handling/sample.json', filterData, searchBox.value);
                disableSearchLoader(loader2)
            } else {
                filterData(undefined, searchBox.value)
            }
        } else {
            searchResults.style.display = 'none';
            searchIcon.classList.remove('fa-close');
            searchResults.innerHTML = '';
        }
    })
}

