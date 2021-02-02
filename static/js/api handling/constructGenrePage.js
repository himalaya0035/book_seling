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
        sectionBooks +=
            `
            <div class="bookItem">
                <div class="coverImgHolder">
                    <a href="/book/${data[i].ISBN}"><img loading="lazy" src=${data[i].cover_image} alt=""></a>
                </div>
                <div class="cartBookInfo">
                    <p class="cartBookName" onclick='window.location = "/book/${data[i].ISBN}"' style="cursor: pointer">${data[i].name}</p>
                                <div>
                ${data[i].author_names.map(author_detail => `<p class="authorName">${author_detail}</p>`)}
            </div>

                    <div class="priceRating">
                        <p class="cartBookPrice">Rs ${data[i].lowest_price.price}</p>
                        <p class="cartBookRating"><i class="fa fa-star"></i> ${data[i].rating}</p>
                    </div>
                    <div class="options bookOptions">
                        <div class="qty addToCart">
                            <button class="addToCartBtn" id="${data[i].lowest_price.id}"><i class="fa fa-cart-plus"
                                    style="color: white; font-size: 1.1em;"></i>&nbsp;&nbsp;Add to cart</button>
                        </div>
                        <button class="bookmark" style="background-color: #673AB7; color: white; padding: 8px;" id="${data[i].ISBN}"><i
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


let NameOfUser = 'Guest'
let isAuthenticated = false;

async function constructGenrePage(urlOne) {

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }

    utility.enableLoader(rootElement, loader);

    let bookListHtml = await constructSection(urlOne, constructBookList);
    let mobilesidebarHtml = constructSidebar(isAuthenticated, NameOfUser); // is function ko phle component.js me check krle, tab arguements jo diye wo smj jayega
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
constructGenrePage(genreBooksURL, true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));