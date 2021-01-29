import {postJsonData} from './constructSection.js';
import {disableBtn, enableBtn} from './validationUtility.js'


async function manageQuantity(e) {
    let clickedBtn = e.target.parentElement;
    var parent = clickedBtn.parentElement;
    let input = parent.getElementsByClassName('itemQuantity')[0];
    if (input.value === '') {
        input.value = 1;
    }
    let currentQty = parseInt(input.value);
    let url;
    let obj;
    withoutBackgroundDisableBtn(e.target);
    if (clickedBtn.classList.contains('increaseQuantity')) {
        // increase quantity post request here
        console.log(clickedBtn)
        url = '/api/cart/all';
        obj = {
            deal_id: clickedBtn.id
        }
        const isPostRequestOk = await postJsonData(url, obj);
        if (isPostRequestOk) {
            input.value = currentQty + 1;
        } else {
            alert(`couldn't increase quanity, request failed`)
        }
        withoutBackgroundEnableBtn(e.target);
        if (input.value > 10) {
            input.value = 10;
            alert('Max Quantity is 10')
        }

    } else if (clickedBtn.classList.contains('decreaseQuantity')) {
        // decrease quantity post request here
        url = '/api/cart/all';
        obj = {
            deal_id: deal_id
        }
        const isPostRequestOk = await postJsonData(url, obj);
        if (isPostRequestOk) {
            input.value = currentQty - 1;
        } else {
            alert(`couldn't decrease quanity, request failed`)
        }
        withoutBackgroundEnableBtn(e.target);
        if (input.value < 1) {
            input.value = 1;
        }
    }

    var prices = document.getElementsByClassName('cartBookPrice');
    getTotalQuantityAndAmount(prices);
}

function getTotalQuantityAndAmount(prices) {
    let totalQty = 0;
    let totalAmt = 0;
    var inputElements = document.getElementsByClassName('itemQuantity');
    for (let i = 0; i < inputElements.length; i++) {
        let strQuantity = inputElements[i].value;
        let Quantity = parseInt(strQuantity);
        let strPrice = prices[i].textContent.replace('Rs ', '');
        let price = parseInt(strPrice)
        totalQty = totalQty + Quantity;
        totalAmt = totalAmt + price * Quantity;
    }
    document.getElementById('totalQuantity').innerText = totalQty;
    document.getElementById('totalAmount').innerText = 'Rs ' + totalAmt;
}


export function orderProcessingUtility() {
    var increase = document.getElementsByClassName('increaseQuantity');
    var decrease = document.getElementsByClassName('decreaseQuantity');
    var inputElements = document.getElementsByClassName('itemQuantity');
    var prices = document.getElementsByClassName('cartBookPrice');
    var deleteBtns = document.getElementsByClassName('deleteCartItem');

    var checkoutBtn = document.getElementById('checkoutBtn');
    var nextLink = document.getElementById('nextLink');

    if (deleteBtns.length === 0) {
        document.getElementById('NoBookmarkedMsg').style.display = 'block';
        checkoutBtn.href = "#";
        checkoutBtn.style.color = "#808080";
        nextLink.href = "#";
        nextLink.style.color = '#808080'
    } else {
        document.getElementById('NoBookmarkedMsg').style.display = 'none';
        checkoutBtn.href = "checkout.html";
        checkoutBtn.style.color = "white";
        nextLink.href = "checkout.html";
        nextLink.style.color = 'white';
    }


    for (let i = 0; i < increase.length; i++) {
        increase[i].addEventListener('click', manageQuantity);
        decrease[i].addEventListener('click', manageQuantity);
        inputElements[i].addEventListener('input', function (e) {
            if (e.target.value < 1) {
                e.target.value = 1;
            } else if (e.target.value > 10) {
                e.target.value = 10;
            }
        })
    }
    getTotalQuantityAndAmount(prices);
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', async (e) => {
            var clickedDeleteBtn = e.target;
            console.log(e.target)
            var cartItem = clickedDeleteBtn.closest('.item');
            disableDeleteBtn(clickedDeleteBtn);
            // api call here
            let url = 'https://jsonplaceholder.typicode.com/posts';
            let obj = {
                title: 'foo',
                body: 'bar',
                userId: 1,
            }
            const isPostRequestOk = await postJsonData(url, obj)
            cartItem.remove();
            enableDeleteBtn(clickedDeleteBtn, '#504F4F');
            getTotalQuantityAndAmount(prices);

            if (deleteBtns.length === 0) {
                document.getElementById('NoBookmarkedMsg').style.display = 'block';
                checkoutBtn.href = "#";
                checkoutBtn.style.color = "#808080";
                nextLink.href = "#";
                nextLink.style.color = '#808080'
            } else {
                document.getElementById('NoBookmarkedMsg').style.display = 'none';
                checkoutBtn.href = "checkout.html";
                checkoutBtn.style.color = "white";
                nextLink.href = "checkout.html";
                nextLink.style.color = 'white';
            }

        })
    }
}

function withoutBackgroundEnableBtn(btn) {
    btn.disabled = false;
    btn.style.animation = 'none';
    btn.classList.remove('fa-spinner')
}

function withoutBackgroundDisableBtn(btn) {
    btn.disabled = true;
    btn.classList.add('fa-spinner');
    btn.style.animation = 'spinInfinitely 0.4s linear 0s infinite';
}

// well done himalaya
export function disableDeleteBtn(btn) {
    btn.disabled = true;
    btn.style.color = '#b9b7b7';
}

export function enableDeleteBtn(btn, color) {
    btn.disabled = false;
    btn.style.color = color
}