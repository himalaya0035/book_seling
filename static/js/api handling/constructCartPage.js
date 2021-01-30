import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";
import {orderProcessingUtility} from './orderProcessingUtilities.js';

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;


function constructCartItems(data) {

    var cartItems = "";
    for (let i = 0; i < data.length; i++) {

        console.log(data)

        cartItems += `
        <div class="item">
        <div class="coverImgHolder">
            <img loading="lazy" src=${data[i].book_data.cover_image} alt="">
        </div>
        <div class="cartBookInfo">
            <p class="cartBookName">${data[i].book_data.name}</p>
            <p class="authorName">${data[i].book_data.author_names[0]}</p>
            <div class="priceRating">
                <p class="cartBookPrice">Rs ${data[i].deal_price}</p>
                <p class="cartBookRating"><i class="fa fa-star"></i> ${data[i].book_data.rating}</p>
            </div>
            <div class="options">
                <div class="qty">
                    <button class="increaseQuantity" id=${data[i].deal}><i class="fa fa-plus"></i></button>
                    <input type="number" readonly="true"  name="" id="" value=${data[i].quantity} class="itemQuantity">
                    <button class="decreaseQuantity" id=${data[i].deal}><i class="fa fa-minus"></i></button>
                </div>
                <button class="deleteCartItem" id=${data[i].deal}><i class="fa fa-trash"></i> Delete</button>
            </div>
        </div>
    </div>
        `
    }
    return (
        `
        <div class="cartItems">
            ${cartItems}
        </div>
        `
    )
}

let NameOfUser;
let isAuthenticated = false;


async function constructCartPage(urlOne) {
    utility.enableLoader(rootElement, loader);

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }

    let cartItemsHtml = await constructSection(urlOne, constructCartItems);
    let topbarHtml = constructTopBar('Cart', '/', '/checkout');
    let sidebarHtml = constructSidebar(isAuthenticated, NameOfUser);
    contentWrapper = `
                <div class="contentWrapper">
                        ${topbarHtml}
                        ${cartItemsHtml}
                        <h4 id="NoBookmarkedMsg">Cart is empty</h4>
                        <div class="bottomPart">
                            <div class="totalQty">
                                <h3>Quantity :&nbsp;</h3>
                                <h3 id="totalQuantity"></h3>
                            </div>
                            <div class="totalAmt">
                                <h3>Total :&nbsp;</h3>
                                <h3 id="totalAmount"></h3>
                            </div>
                        </div>
                        <div class="moveToCheckout" style="display: flex; align-items: center; justify-content: center;">
                             <a href="/checkout" id="checkoutBtn" style="color: white; text-decoration: none; font-weight: bold; font-size: 1.17em; display: block;">Checkout Now <i class="fa fa-angle-right" style="font-weight: normal;"></i></a>
                        </div>
                </div>
                `

    rootElement.innerHTML = sidebarHtml + contentWrapper
    utility.disableLoader(rootElement, loader);
    orderProcessingUtility();
    utility.manageBookNameLength();
    utility.loadUtilityJs();
}

constructCartPage("/api/cart/all", true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));