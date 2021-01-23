import { constructSection } from "./constructSection.js";
import { constructSidebar, constructTopBar } from "./component.js";
import * as utility from "./utilities.js";
import { orderProcessingUtility } from './orderProcessingUtilities.js';

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;


function constructCartItems(data){
    
    // cart items ki length yha nikalana
    var cartItems = "";
    for (let i=0;i<2;i++){
        let obj = {
            // sara data per item yha extract krna
        }
        cartItems += `
        <div class="item">
        <div class="coverImgHolder">
            <img loading="lazy" src="images/book2.jpg" alt="">
        </div>
        <div class="cartBookInfo">
            <p class="cartBookName">The Subtle art of not giving a fuck</p>
            <p class="authorName">Mark Manson</p>
            <div class="priceRating">
                <p class="cartBookPrice">Rs 394</p>
                <p class="cartBookRating"><i class="fa fa-star"></i> 4.5</p>
            </div>
            <div class="options">
                <div class="qty">
                    <button class="increaseQuantity"><i class="fa fa-plus"></i></button>
                    <input type="number" readonly="true"  name="" id="" value="1" class="itemQuantity">
                    <button class="decreaseQuantity"><i class="fa fa-minus"></i></button>
                </div>
                <button class="deleteCartItem"><i class="fa fa-trash"></i> Delete</button>
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

let NameOfUser = "Priyansh Singh"; // ye data kaise nikalna hai api se wo dekhlena
let userId = 1;

async function constructCartPage(urlOne, isAuthenticated){
    utility.enableLoader(rootElement,loader);
    let cartItemsHtml = await constructSection(urlOne,constructCartItems);
    let topbarHtml = constructTopBar('Cart','index.html','checkout.html');
    let sidebarHtml = constructSidebar(isAuthenticated,userId,NameOfUser);
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
                             <a href="checkout.html" style="color: white; text-decoration: none; font-weight: bold; font-size: 1.17em; display: block;">Checkout Now <i class="fa fa-angle-right" style="font-weight: normal;"></i></a>
                        </div>

                </div>
                `
    
    rootElement.innerHTML = sidebarHtml + contentWrapper
    utility.disableLoader(rootElement,loader);
    orderProcessingUtility();
    utility.loadUtilityJs();    
}   

constructCartPage("./js/api handling/sample.json",true)
  .then(() => console.log("prmoise resolved"))
  .catch((err) => console.log(err.message));