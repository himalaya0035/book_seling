import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;

function constructShippingAddress() {
    // jha se bhi nikalna ho deta nikal lena

    let obj = JSON.parse(localStorage.getItem('shipping_address'))
    return (
        `
        <div class="shippingAddress">
            <p>Deliver To : </p>
            <p id="name">${obj.name}</p>
            <p id="phoneNo">+91 ${obj.contact_number}</p>
            <p id="email">${obj.email}</p>
            <p id="address">${obj.address}</p>
        </div>
        `
    )
}

function constructOrderTotal(data) {
    return (
        `
        <div class="cartDescription">
        <div class="descriptionItems">
            <p>Quantity</p>
            <p id="total-qty">x${data.total_qty}</p> <!-- // yeh nikalna hai -->
        </div>
        <div class="descriptionItems">
            <p>Cart Total</p>
            <p id="cartTotal">Rs ${data.total_amount}</p> <!-- yeh bhi nikalana hai -->
         </div>
        <div class="descriptionItems">
            <p>CGST/SCGT (0%)</p>
            <p>Rs 0</p>
        </div>
        <div class="descriptionItems">
            <p>Discount</p>
            <p id="discount">Rs 0</p> <!-- yeh js se niklega -->
        </div>
        <div class="descriptionItems">
            <p>Delivery Charge</p>
            <p id="deliveryCharge">Rs 40</p> <!-- yeh fixed hai -->
        </div>
        <div class="descriptionItems total"> 
            <p>Total</p>
            <p id="totalAmt"></p> <!--yeh js se niklega -->
        </div>
    </div>
        `
    )
}

let NameOfUser;
let isAuthenticated = false;

async function constructConfirmOrderPage(urlOne) {
    utility.enableLoader(rootElement, loader)

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }

    let shippingAddressHtml = constructShippingAddress();
    let orderTotalHtml = await constructSection(urlOne, constructOrderTotal);
    let topBarHtml = constructTopBar('Confirm Order', '/checkout', undefined);
    let sidebarHtml = constructSidebar(isAuthenticated, NameOfUser);

    contentWrapper = `
                <div class="contentWrapper">
                    ${topBarHtml}
                    ${shippingAddressHtml}
                    <div class="promoCode">
                        <input type="text" id="promocodeinput" placeholder="Promo code #BOOKS50">
                        <button id="applypromocode">Apply</button>
                    </div>
                    ${orderTotalHtml}
                    <div class="expectedDelivery">
                        <p>Get it delivered by <span style="font-weight: bolder;" id="fillDeliveryDate"></span></p>
                    </div>
                    <div class="placeOrder" style="display: flex; justify-content: center; margin: 20px 10px 10px 10px;">
                    <button class="order" style="background:#673AB7;"><span class="default" >Place Order</span><span class="success">Order Placed
                    <svg viewBox="0 0 12 10">
                      <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                    </svg></span>
                  <div class="box"></div>
                  <div class="truck">
                    <div class="back"></div>
                    <div class="front">
                      <div class="window"></div>
                    </div>
                    <div class="light top"></div>
                    <div class="light bottom"></div>
                  </div>
                  <div class="lines"></div>
               
                </button>
                    </div>
                </div>
    `
    rootElement.innerHTML = sidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader);
    utility.loadUtilityJs();
    utility.animateOrderButton();
    utility.loadOrderTotalJs();
}

constructConfirmOrderPage("/api/cart/checkout", true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));