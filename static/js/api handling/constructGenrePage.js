import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;
var genreName = window.location.pathname.split('/')[2].replace('%20', ' ');

// genreName;

function constructBookList(data) {
    // jo bhi genre ho like action or adventure wo line number 8 pe genreName waale variable me store krna
    // abhi ke liye aise kr diya hai
    var sectionBooks = '';
    for (let i = 0; i < data.length; i++) {
        console.log(data[i].name)
        sectionBooks +=
            `
            <div class="bookItem">
                <div class="coverImgHolder">
                    <a href="book.html"><img loading="lazy" src=${data[i].cover_image} alt=""></a>
                </div>
                <div class="cartBookInfo">
                    <p class="cartBookName">${data[i].name}</p>
                    <p class="authorName"></p>
                    <div class="priceRating">
                        <p class="cartBookPrice">Rs ${data[i].lowest_price.price}</p>
                        <p class="cartBookRating"><i class="fa fa-star"></i> ${data[i].rating}</p>
                    </div>
                    <div class="options bookOptions">
                        <div class="qty addToCart">
                            <button class="addToCartBtn"><i class="fa fa-cart-plus"
                                    style="color: white; font-size: 1.1em;"></i>&nbsp;&nbsp;Add to cart</button>
                        </div>
                        <button class="bookmark" style="background-color: #673AB7; color: white; padding: 8px;"><i
                                class="fa fa-bookmark-o" style="color: white;"></i>&nbsp;&nbsp;Bookmark</button>
                    </div>
                </div>
            </div>
        `
    }
    return (
        `
        <div class="bookList">
            ${sectionBooks}
        </div>
    `
    )
}


let NameOfUser = "Priyansh Singh"; // ye data kaise nikalna hai api se wo dekhlena
let userId = 1;


async function constructGenrePage(urlOne, isAuthenticated) {
    utility.enableLoader(rootElement, loader);

    let bookListHtml = await constructSection(urlOne, constructBookList);
    let mobilesidebarHtml = constructSidebar(isAuthenticated, userId, NameOfUser); // is function ko phle component.js me check krle, tab arguements jo diye wo smj jayega
    let topBarHtml = constructTopBar(genreName, "index.html", "cart.html");
    contentWrapper = `
            <div class="contentWrapper">
                ${topBarHtml}
                ${bookListHtml}
            </div>
    `
    rootElement.innerHTML = mobilesidebarHtml + contentWrapper;

    utility.disableLoader(rootElement, loader);
    utility.loadUtilityJs();
    utility.toggleButton("bookmark", "fa-bookmark", "fa-bookmark-o", "Bookmarked", "Bookmark");
    utility.toggleButton("addToCartBtn", "fa-check", "fa-cart-plus", "Added", "Add to Cart");
}
const baseURL = `${window.location.protocol}//${window.location.host}/api`;
const genreBooksURL = `${baseURL}/books/all?name=&author__name=&genre__name=${genreName}&ISBN=&author__id=`;
console.log(genreName)
constructGenrePage(genreBooksURL, true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));