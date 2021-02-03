import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;
let dataForModal;
function get_formatted_date(ordered_on) {
    const dateTime = new Date(ordered_on)
    return dateTime.toLocaleDateString()

}
function constructOrdersItem(data) {

    dataForModal = data; // store data here from api
    let orderItem = '';
    for (let i = 0; i < data.length; i++) {
        orderItem += `<div class="bookItem" style="align-items: flex-start;">
                    <div class="orderImgHolder" style="margin-right:10px; ">
                        <img src="${data[i].book_details.cover_image}" alt="" style="width:60px;height:60px; object-fit: cover; object-position: top; border-radius:10px;">
                    </div>
                    <div class="orderName cartBookInfo" style="padding:0px; margin-top: 5px;">
                        <p class="cartBookName">${data[i].book_details.name}</p>
                        <p class="authorName">Ordered : ${get_formatted_date(data[i].order_details.ordered_on)} ( <a href="#" class="myBtn" id="${i}" style="text-decoration: none; color: rgb(96, 96, 243);">View Details</a> )</p>
                    </div>
                </div>
                `
    }
    return (
        `
        <div class="bookList">
            ${orderItem}
        </div>
        `
    )
}

function constructOrderDetailModel() {
    var modal = document.getElementsByClassName("modal");

    var btn = document.getElementsByClassName("myBtn");

    var span = document.getElementsByClassName("close");

    for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function (e) {
            const dataID = e.target.id;
            document.getElementById('bodyOfModal').innerHTML = `
            
            <div class="orderDetail">
                <p>From</p>
                <p>${dataForModal[dataID].seller_details.seller.firm_name}</p>
            </div>
            <div class="orderDetail">
                <p>Quanity</p>
                <p id="total-qty">x${dataForModal[dataID].quantity}</p>
            </div>
            <div class="orderDetail">
                <p>Price</p>
                <p>Rs ${dataForModal[dataID].book_details.price}</p>
            </div>
            <div class="orderDetail">
                <p>Total Amount</p>
                <p>Rs ${dataForModal[dataID].seller_details.price * dataForModal[dataID].quantity}</p>
            </div>
            <div class="orderDetail">
                <p>Status</p>
                <p>${dataForModal[dataID].order_details.status}</p>
            </div>
            <p style="font-family:'Poppins'; margin-top:10px;">Shipping to : ${dataForModal[dataID].order_details.shipping_address.address}</p>
        
            
            `
            document.getElementById('myModal').style.display = 'block';
        }
        for (let i = 0; i < span.length; i++) {
            span[i].onclick = function () {
                document.getElementById('myModal').style.display = 'none';
            }
        }
    }


}

let NameOfUser;
let isAuthenticated = false;

async function constructOrdersPage(urlone) {
    utility.enableLoader(rootElement, loader);

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }


    let ordersItem = await constructSection(urlone, constructOrdersItem);
    let topBarHtml = constructTopBar('Your Orders', '/');
    let sidebarHtml = constructSidebar(isAuthenticated, NameOfUser);
    contentWrapper = `
        <div class="contentWrapper">
            ${topBarHtml}
            ${ordersItem}
        </div>
    `
    rootElement.innerHTML = sidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader);
    utility.manageBookNameLength();
    constructOrderDetailModel();
    utility.loadUtilityJs();

}

constructOrdersPage("/api/cart/your-orders", true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));
// /api/cart/your-orders