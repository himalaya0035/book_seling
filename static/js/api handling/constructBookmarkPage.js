import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;

function constructBookmarkedList(data) {
    console.log(data)
    var bookmarkedBooks = '';
    for (let i = 0; i < data.length; i++) {
        let obj = {
            // sb deta yha nikallene, uske baad obj.variableName Niche Html me kr dena
        }
        bookmarkedBooks +=
            `
            <div class="bookItem">
                <div class="coverImgHolder">
                    <a href="book.html"><img loading="lazy" src=${data[i].cover_image} alt=""></a>
                </div>
                <div class="cartBookInfo">
                    <p class="cartBookName">${data[i].name}</p>
                ${data[i].author_details.map(author_name => `<p class="authorName">${author_name.name}</p>`)}

                    <div class="priceRating">
                        <p class="cartBookPrice">Rs ${data[i].lowest_price.price}</p>
                        <p class="cartBookRating"><i class="fa fa-star"></i> ${data[i].rating}</p>
                    </div>
                    <div class="options bookOptions">
                        <div class="qty addToCart">
                            <button class="addToCartBtn"><i class="fa fa-cart-plus"
                                    style="color: white; font-size: 1.1em;"></i>&nbsp;&nbsp;Add to cart</button>
                        </div>
                        <button id=${data[i].ISBN} class="deleteBookmark" style="background-color: #673AB7; color: white; padding: 8px;"><i
                        class="fa fa-trash" style="color: white;"></i>&nbsp;&nbsp;Remove</button>
                    </div>
                </div>
            </div>
        `
    }
    return (
        `
        <div class="bookList">
            ${bookmarkedBooks}
        </div>
    `
    )
}


let NameOfUser = "Priyansh Singh"; // ye data kaise nikalna hai api se wo dekhlena
let userId = 1;

async function constructBookmarkPage(urlOne, isAuthenticated) {
    utility.enableLoader(rootElement, loader);

    let bookmarkedListHtml = await constructSection(urlOne, constructBookmarkedList);
    let topBarHtml = constructTopBar('Bookmarked', 'index.html', 'cart.html');
    let sidebarHtml = constructSidebar(isAuthenticated, userId, NameOfUser);

    contentWrapper = `
            <div class ="contentWrapper">
                    ${topBarHtml}
                    ${bookmarkedListHtml}
                    <h4 id="NoBookmarkedMsg">No Bookmarked Book</h4>
            </div>
    `
    rootElement.innerHTML = sidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader);
    utility.loadUtilityJs();
    utility.manageBookNameLength();
    utility.toggleButton("deleteBookmark", "fa-bookmark", "fa-bookmark-o", "Bookmarked", "Bookmark");
    utility.toggleButton("addToCartBtn", "fa-check", "fa-cart-plus", "Added", "Add to Cart");
}

constructBookmarkPage(`${window.location.protocol}//${window.location.host}/api/cart/bookmark`, true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));
