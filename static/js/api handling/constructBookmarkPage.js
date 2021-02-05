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
                            <button class="addToCartBtn" id="${data[i].lowest_price.id}"><i class="fa fa-cart-plus"
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


let NameOfUser;
let isAuthenticated = false;

async function constructBookmarkPage(urlOne) {
    utility.enableLoader(rootElement, loader);


    utility.enableLoader(rootElement, loader)
    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }

    let bookmarkedListHtml = await constructSection(urlOne, constructBookmarkedList);
    let topBarHtml = constructTopBar('Bookmarked', '/', '/cart');
    let sidebarHtml = constructSidebar(isAuthenticated, NameOfUser);

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
