import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;
var shippingMail;

function constructShippingAddress(data) {
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
            <p>x4</p> <!-- // yeh nikalna hai -->
        </div>
        <div class="descriptionItems">
            <p>Cart Total</p>
            <p id="cartTotal">Rs 2999</p> <!-- yeh bhi nikalana hai -->
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
    let topBarHtml = constructTopBar('Order Received', '/cart', undefined);
    let sidebarHtml = constructSidebar(isAuthenticated, NameOfUser);

    contentWrapper = `

                <div class="contentWrapper">
                    
                    ${topBarHtml}
                    <div class="expectedDelivery">
                        <p>An order confirmation mail has been sent to <span style="font-weight:bolder;"> ${shippingMail} </span></p>
                     </div>
                    ${shippingAddressHtml}
                    ${orderTotalHtml}
                    <div class="expectedDelivery">
                        <p>Order would be delivered by <span style="font-weight: bolder;" id="fillDeliveryDate"></span></p>
                    </div>
                    <div class="expectedDelivery">
                    <p>Thank you for shopping with us !! 😊</p>
                 </div>
                    <div class="placeOrder" style="display: flex; justify-content: center; margin: 20px 10px 20px 10px;">
                        <a href="index.html"  style="text-decoration: none; background-color: #673AB7; color: white; padding: 10px; border-radius: 1px solid white; width: 100%; text-align: center; box-shadow: 0px 0px 3px #673AB7;">Continue Shopping</a>
                    </div>
                </div>
    `
    rootElement.innerHTML = sidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader);
    utility.loadUtilityJs();
    utility.loadOrderTotalJs();
}

constructConfirmOrderPage("/api/cart/checkout")
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));