import {constructSection, postJsonData} from './constructSection.js';
import {disableDeleteBtn, enableDeleteBtn} from './orderProcessingUtilities.js';
import {disableBtn, displayErrorMsg, enableBtn, isEmailOK, removeErrorMsg} from './validationUtility.js';


export function manageBookNameLength() {
    let booknames = document.getElementsByClassName('cartBookName');
    for (let i = 0; i < booknames.length; i++) {
        if (booknames[i].innerText.length > 50) {
            booknames[i].innerText = booknames[i].innerText.substring(0, 50) + '...';
        }
    }
}

export function manageAboutSection(objectName) {
    let characterLength;
    if (window.location.href.indexOf('book') > -1) {
        characterLength = 383;
    } else if (window.location.href.indexOf('author') > -1) {
        characterLength = 490;
    }
    let aboutSection = document.getElementById('about');
    if (aboutSection.innerText.length > characterLength) {
        aboutSection.innerText = aboutSection.innerText.substring(0, characterLength);
        aboutSection.innerHTML += `...     <a href="https://www.google.com/search?q=${objectName}" style="color: #808080; text-decoration: none" target="_blank">Read More</a>`;
    }
}

export function loadUtilityJs() {
    let sidebarToggler = document.getElementsByClassName("sidebarToggler")[0];
    let sidebar = document.getElementsByClassName("mobileSidebar")[0];
    let cross = document.getElementsByClassName("cross")[0];

    sidebarToggler.addEventListener('click', function () {
        sidebar.classList.toggle('sidebarActive');
    })
    cross.addEventListener('click', function () {
        sidebar.classList.toggle('sidebarActive');
    })

    let bookNames = document.getElementsByClassName("bookName");
    for (let i = 0; i < bookNames.length; i++) {
        if (bookNames[i].innerText.length > 23) {
            bookNames[i].innerText = bookNames[i].innerText.substring(0, 25) + ' ...';
        }
    }
}

export function toggleButton(mainElementClass, toBeReplacedClass, checkClass, buttonInitialText, buttonFinalText) {
    let commonElement = document.getElementsByClassName(mainElementClass);
    for (let i = 0; i < commonElement.length; i++) {
        commonElement[i].addEventListener('click', async (e) => {

            let ele = e.target;
            disableBtn(ele)

            let child = ele.getElementsByTagName('i')[0];
            let url;
            let obj = {}
            const deal_id = ele.id;
            if (mainElementClass === 'addToCartBtn' && ele.classList.contains('removeFromCartBtn')) {
                // item already added to cart , now you want to remove it using the same button
                url = `/api/cart/remove-from-cart/${deal_id}`;// yha url dekh lena

                ele.classList.toggle('removeFromCartBtn')
            } else if (mainElementClass === 'addToCartBtn') {
                console.log('67')
                url = '/api/cart/all';
                obj = {
                    deal_id: ele.id
                }
                ele.classList.toggle('removeFromCartBtn')
            } else if (mainElementClass === 'bookmark') {
                // when you want to bookmark a book
                url = `/api/cart/bookmark`;
                obj = {
                    book_id: ele.id
                }
                ele.classList.toggle('removeFromBookmark')
            } else if (mainElementClass === 'bookmark' && ele.classList.contains('removeFromBookmark')) {
                // the book is already bookmarked and you want to remove it from bookmark using the same button
                url = 'https://jsonplaceholder.typicode.com/posts';
                obj = {
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                }
                ele.classList.toggle('removeFromBookmark')
            } else if (mainElementClass === 'deleteBookmark') {
                url = `/api/cart/bookmark`;
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
    let rellax = new Rellax('.rellax');
    let authorInfoContainer = document.getElementsByClassName('authorInfoContainer')[0];
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
    let modal = document.getElementsByClassName("modal");

    let btn = document.getElementsByClassName("myBtn");

    let span = document.getElementsByClassName("close");


    for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function () {
            modal[i].style.display = "block";
        }
        span[i].onclick = function () {
            modal[i].style.display = "none";
        }
    }


    if (window.location.href.indexOf('account') > -1) {
        let emailInput = document.getElementById('emailAddress');
        let confirmPasswordDelete = document.getElementById('confirmPasswordDelete');
        let confirmPasswordDelete2 = document.getElementById('confirmPasswordDelete2')
        let updateEmailBtn = document.getElementById('updateEmailBtn')
        let deleteAccountBtn = document.getElementById('deleteAccountBtn');

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
    let cartTotalString = document.getElementById('cartTotal');
    let cartTotalInt = parseInt(cartTotalString.innerText.replace('Rs ', ''));
    let discount = document.getElementById('discount')
    let discountValue = discount.innerText.replace('Rs ', '');
    let discountValueInt;
    if (discountPercent) {
        discountValueInt = parseInt((cartTotalInt * discountPercent) / 100);
        discount.innerText = 'Rs ' + discountValueInt;
    } else {
        discountValueInt = parseInt(discountValue);
    }
    let totalAmt = cartTotalInt - discountValueInt + 40;
    document.getElementById('totalAmt').innerText = 'Rs ' + totalAmt;
}

function setExpectedDeliveryDate() {
    let d = new Date();
    d.setDate(d.getDate() + 2);
    let stringDate = d.toString();
    let expectedDate = stringDate.slice(0, 3) + ', ' + stringDate.slice(8, 10) + ' ' + stringDate.slice(4, 7) + ' 8am - 6pm';
    document.getElementById('fillDeliveryDate').innerText = expectedDate;
}

export function loadOrderTotalJs() {
    calculateTotalAmount();
    setExpectedDeliveryDate();
    let promocode = document.getElementById('promocodeinput');
    let applyButton = document.getElementById('applypromocode')
    let placeorderbtn = document.getElementById('placeOrder');
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
                let discountPercent = parseInt(promocode.value.replace(/[^0-9\.]/g, ''), 10);
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
var count = 0;

function filterData(data, searchText) {
    if (data) {
        arrayForResults = data;
        count = 1;
    }
    let matches = arrayForResults.filter(arrElement => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return arrElement.name.match(regex)
    })
    outputHtml(matches, searchText, count)
}


function outputHtml(matches, searchText, count) {
    var searchResults = document.getElementById('searchResults');
    let html = matches.map(match => `<div class="result">
        <div class="resultImg">
            <a href=/book/${match.ISBN}><img src="${match.cover_image}" alt=""></a>
        </div>
        <div class="resultName">
            <h4><a href=/book/${match.ISBN} style="text-decoration:none; color:rgb(41,41,41);">${match.name}</a></h4>
        </div>
     </div>`
    ).join('');
    if (matches.length === 0 && count === 1) {
        searchResults.innerHTML = `<p style="display:flex; justify-content:center; margin-top:40px; color:#808080; text-align:center;">No search Result Found <br> with keyword "${searchText}"</p>`
    } else {
        searchResults.innerHTML = html;
    }
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
    let searchBox = document.getElementById('searchBox');
    let searchResults = document.getElementById('searchResults');
    let loader2 = document.getElementById('loader2');
    let searchIcon = document.getElementById('searchIcon');
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
                count = 0;
                enableSearchLoader(loader2)
                let aisehi = await constructSection(`/api/books/all?search=${searchBox.value}`, filterData, searchBox.value);
                disableSearchLoader(loader2)
            } else {
                filterData(undefined, searchBox.value)
            }
        } else {
            searchResults.style.display = 'none';
            disableSearchLoader(loader2);
            searchIcon.classList.remove('fa-close');
            searchResults.innerHTML = '';
        }
    })
}

export function getUser(data) {

    return data.user.first_name

}


export function addDealToCart() {
    const btn = document.getElementsByClassName('addToCartBtn2');

    for (let i = 0; i < btn.length; i++) {

        btn[i].onclick = async (e) => {
            let iconClass;
            let btnText;
            let obj = {}
            const deal_id = e.target.id;
            let url;
            if (btn[i].classList.contains('addToCartBtn2') && btn[i].classList.contains('removeFromCartBtn2')) { // jb remove krna ho

                url = `/api/cart/remove-from-cart/${deal_id}`;// yha url dekh lena

                iconClass = 'fa-cart-plus';
                btnText = 'Add to cart';
                btn[i].classList.toggle('removeFromCartBtn2');

                console.log('removed from cart')
            } else if (btn[i].classList.contains('addToCartBtn2')) { // jb add krna ho

                url = '/api/cart/all';
                iconClass = 'fa-check';
                obj = {
                    deal_id
                }
                btnText = 'Added';
                btn[i].classList.toggle('removeFromCartBtn2');
                console.log('added to cart')
            }

            disableBtn(e.target);
            const res = await postJsonData(url, obj);
            if (res) {
                btn[i].innerHTML = `<i class ="fa ${iconClass}" style="color:white;"></i>` + `  ${btnText}`;
            } else {
                alert('Operation Failed')
            }
            enableBtn(e.target);

        }

    }


}

/*
export function addDealToCart() {
    const btn = document.getElementsByClassName('addToCartBtn2');

    for (let i = 0; i < btn.length; i++) {

        btn[i].onclick = async (e) => {
            let iconClass;
            let btnText;
            const deal_id = e.target.id;
            let url;
            const obj = {
                deal_id: deal_id
            }
            if (btn[i].classList.contains('addToCartBtn2') && btn[i].classList.contains('removeFromCartBtn2')) { // jb remove krna ho
                 url = 'https://jsonplaceholder.typicode.com/posts' // yha url dekh lena
                 iconClass = 'fa-cart-plus';
                 btnText = 'Add to cart';
                 btn[i].classList.toggle('removeFromCartBtn2');
                 console.log('removed from cart')
            }
            else if (btn[i].classList.contains('addToCartBtn2')){ // jb add krna ho
                url = '/api/cart/all';
                iconClass = 'fa-check';
                btnText = 'Added';
                btn[i].classList.toggle('removeFromCartBtn2');
                console.log('added to cart')
            }

            disableBtn(e.target);
            const res = await postJsonData(url, obj);
                if (res) {
                    btn[i].innerHTML = `<i class ="fa ${iconClass}" style="color:white;"></i>` + `  ${btnText}`;
                } else {
                    alert('Operation Failed')
                }
            enableBtn(e.target);

        }

    }


}
 */