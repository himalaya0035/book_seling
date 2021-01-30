import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";
import {validationUtility} from "./validationUtility.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;

function constructDeliveryForm(data) {
    // data extract krna ha pr
    // niche wala form prefilled hona chaiye toh saari values nikalke input tag ke value me rkh dena
    return (
        `
        <div class="container-fluid" style="padding-top: 0px;">
        <div class="row justify-content-center">
            <div class="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-5 text-center p-0 mt-3 mb-2">
                <div class="card px-0 pt-4 pb-0 mt-3 mb-3">
                   
                    <form id="msform">
                        <!-- progressbar -->
                  
                       <!-- fieldsets -->
                        <fieldset>
                            <div class="form-card">
                                <div class="row">
                                    <div class="col-12">
                                        <h4 class="fs-title">Delivery Info</h4>
                                        <p>Edit Form For Different Delivery Address</p>
                                    </div>
                                    <div class="row">
                                        <div class="col-12" style="margin-left: 18px;">
                                        <h6 id="message" style="color: rgb(243, 51, 51);"></h6>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-12">
                                    <h6 id="message" style="color: rgb(243, 51, 51);"></h6>
                                    </div>
                                </div>
                                 <label class="fieldlabels">FirstName :</label> <input
                                type="text" name="firstName" placeholder="First Name" id="fname" class="loginField sectionFirst" /> <label
                                class="fieldlabels">Contact No :</label> <input type="number" name="pwd"
                                placeholder="Contact No" id="contact" class="loginField sectionFirst"> 
                                <label class="fieldlabels">Email :</label> <input
                                type="email" name="email" placeholder="Email" id="emailId" class="loginField sectionFirst" > 
                                <label class="fieldlabels">Delivery Address : (Min 30 characters)</label> <input
                                type="text" name="DeliveryAddress" placeholder="Delivery Address" id="address" class="loginField sectionFirst" /> 
                        </div> 
                        </fieldset>
                    
                       
                    </form>
                </div>
            </div>
        </div>
    </div>
        `
    )
}

let NameOfUser;
let isAuthenticated = false;


async function constructCheckoutPage(urlOne) {
    utility.enableLoader(rootElement, loader);

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }

    let deliveryFormHtml = await constructSection(urlOne, constructDeliveryForm);
    let topbarHtml = constructTopBar('Checkout', 'cart.html', 'confirmOrder.html');
    let sidebarHtml = constructSidebar(isAuthenticated, NameOfUser)
    contentWrapper = `
            <div class ="contentWrapper">
                ${topbarHtml}
                ${deliveryFormHtml}
                <div class="moveToCheckout proceedToPayment" style="display: flex; align-items: center; justify-content: center;">
                    <a href="confirmOrder.html" id="paymentBtn" style="color: white; text-decoration: none; font-weight: bold; font-size: 1.17em; display: block;">Confirm Order <i class="fa fa-angle-right" style="font-weight: normal;"></i></a>
                </div>
            </div>
    `
    rootElement.innerHTML = sidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader)
    validationUtility();
    utility.loadUtilityJs();

}

constructCheckoutPage("https://jsonplaceholder.typicode.com/todos/1", true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));