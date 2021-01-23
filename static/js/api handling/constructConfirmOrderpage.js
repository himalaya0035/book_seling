import { constructSection } from "./constructSection.js";
import { constructSidebar, constructTopBar } from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;

function constructShippingAddress(data){
    // jha se bhi nikalna ho deta nikal lena
    return (
        `
        <div class="shippingAddress">
            <p>Deliver To : </p>
            <p id="name">Himalaya Gupta</p>
            <p id="phoneNo">+91 7983154929</p>
            <p id="email">guptahimalaya@gmail.com</p>
            <p id="address">House no 46, Mohalla Sahukara Fatehganj west Bareilly, U.P - 243501</p>
        </div>
        `
    )
}

function constructOrderTotal(data){
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

let NameOfUser = "Priyansh Singh"; // ye data kaise nikalna hai api se wo dekhlena
let userId = 1;

async function constructConfirmOrderPage(urlOne,urlTwo,isAuthenticated){
    utility.enableLoader(rootElement,loader)

    let shippingAddressHtml = await constructSection(urlOne,constructShippingAddress);
    let orderTotalHtml = await constructSection(urlTwo,constructOrderTotal);
    let topBarHtml = constructTopBar('Confirm Order', 'checkout.html',undefined);
    let sidebarHtml = constructSidebar(isAuthenticated,userId,NameOfUser);

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
                        <a href="#" id="placeOrder" style="text-decoration: none; background-color: #673AB7; color: white; padding: 10px; border-radius: 1px solid white; width: 100%; text-align: center; box-shadow: 0px 0px 3px #673AB7;">Place Order</a>
                    </div>
                </div>
    `
    rootElement.innerHTML = sidebarHtml + contentWrapper;
    utility.disableLoader(rootElement,loader);
    utility.loadOrderTotalJs();
    utility.loadUtilityJs();

}

constructConfirmOrderPage("https://jsonplaceholder.typicode.com/todos/1","https://jsonplaceholder.typicode.com/todos/1",true)
  .then(() => console.log("prmoise resolved"))
  .catch((err) => console.log(err.message));