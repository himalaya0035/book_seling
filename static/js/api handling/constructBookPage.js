import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const bookID = window.location.pathname.split('/')[2];
const bookDataURL = `/api/books/${bookID}`;
const similarBookDataURL = `/api/books/${bookID}/similar`;

const rootElement = document.getElementById("rootElement");
let loader = document.getElementById("loader");
let contentWrapper;
let bookName;

function constructItemAndDescSection(data) {
    bookName = data.name;
    const genre1 = data.genre_names[0];
    const genre2 = data.genre_names[1];

    return `
        <div class="bookItem">
        <div class="coverImgHolder">
            <img src=${data.cover_image} alt="">
        </div>
        <div class="cartBookInfo">
            <p class="cartBookName">${data.name}</p>
            
            <div>
                ${data.author_details.map(author_detail => `<p style="cursor:pointer;" class="authorName" onclick="window.location.replace('/author/${author_detail.id}')">${author_detail.name}</p>`)}
            </div>
            <div class="priceRating">
                <p class="cartBookPrice">Rs ${data.lowest_price.price} ( <a href="#" class="myBtn" style="text-decoration:none; color:#673AB7;">See All Offers</a> )</p>
                <p class="cartBookRating"><i class="fa fa-star"></i>${data.rating}</p>
            </div>
            <div class="options bookOptions">
                <div class="qty addToCart">
                    <button class="addToCartBtn" id=${data.lowest_price.id}><i class="fa fa-cart-plus"
                            style="color: white; font-size: 1.1em;"></i>&nbsp;&nbsp;Add to cart</button>
                </div>
                <button class="bookmark" style="background-color: #673AB7; color: white; padding: 8px;" id=${data.ISBN}><i
                        class="fa fa-bookmark-o" style="color: white;"></i>&nbsp;&nbsp;Bookmark</button>
            </div>
        </div>
    </div>
    <div class="pillsScroller bookGenres" style="padding-left:10px ;">
    
    <div>
        <a href=/genre/${genre1.replace(' ', '%20')}/books class="pill">${data.genre_names[0]}</a>
        ${data.genre_names[1] ? `<a href=/genre/${genre2.replace(' ', '%20')}/books class="pill">${data.genre_names[1]}</a>` : ``}
        </div>
       
    
    </div>
    <div class="bookDesc">
        <div class="shapesHeading" style="transform: translateX(-15px); width: 50%; margin-bottom: 10px;">
            <h5>About</h5>
        </div>
        <p id="about">${data.info}</p>
    </div>
        `;
}

function constructSimilarBooksSection(data) {
    let similarBooks = "";
    data = data.filter(el => el.ISBN !== bookID)
    for (let i = 0; i < data.length; i++) {

        similarBooks +=
            `
        <div class="homepageBook">
            <div class="coverImgHolder">
                <a href=/book/${data[i].ISBN}><img src=${data[i].cover_image} alt="" /></a>
            </div>
            <p class="bookName">${data[i].name}</p>
            <div class="ratingAndPrice">
                <h6 class="homepageBookPrice">Rs ${data[i].lowest_price}</h6>
                <h6 class="homepageBookRating">${data[i].rating}&#9733;</h6>
            </div>
        </div>
        `

    }
    return (`
        <div class ="booksSection" >
            <div class="headerRow">
                <h4>Similar Books</h4>
            </div>
            <div class="booksHolder">${similarBooks}</div>
        `
    )
}

function constructAllOffers(data) {
    let sectionBooks = '';
    for (let i = 0; i < data.length; i++) {
        sectionBooks +=
            `
        <div class="offer" style="margin-bottom:12px; border-bottom:1px dashed #808080; padding-bottom:5px;">
            <p style="font-size:14px; color:#808080;">Offer From : </p>
           
                <p style="font-family:'Poppins'; line-height:15px; margin-top:5px;">${data[i].seller.firm_name}</p>
                <p style="font-family:'Poppins'; margin-bottom:8px;">Seller Rating : <i class="fa fa-star" style="color:#673AB7;"></i> ${data[i].seller.rating} </p>
           
            <div style="display:flex;justify-content:space-between;align-items:flex-end; margin-top:0px; margin-bottom:5px;">
                <p><span style="font-family:'Poppins'"> Rs. ${data[i].price} </span></p>
                <button id=${data[i].id} class="addToCartBtn2" style="background:#673AB7; border:none; color:white; padding:4px;"><i class="fa fa-cart-plus" style="color: white; font-size: 1.1em;"></i>&nbsp;&nbsp;Add to cart</button>
            </div>
        </div>
        `
    }
    return (
        `
        <div class="bookList">
           
            </div>
            ${sectionBooks}
        </div>
    `
    )
}

let NameOfUser;
let isAuthenticated = false;

async function contsructBookPage(bookDataUrl, similarBooksUrl) {
    utility.enableLoader(rootElement, loader);

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }

    let booksInfoAndDescHtml = constructSection(bookDataUrl, constructItemAndDescSection);
    let similarBooksSectionHtml = constructSection(similarBooksUrl, constructSimilarBooksSection);
    let allOffersHtml = constructSection(`/api/cart/deals/${bookID}`, constructAllOffers)
    let mobilesidebarHtml = constructSidebar(isAuthenticated, NameOfUser); // is function ko phle component.js me check krle, tab arguements jo diye wo smj jayega
    let topBarHtml = constructTopBar("Book", "/", "/cart"); // jo bhi django ke according link ho wo daal diyo
    Promise.all([booksInfoAndDescHtml, similarBooksSectionHtml, allOffersHtml])
        .then(value => {
            let offersModal = `
    <div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
        <div class="modal-header" >

        <h5 style="letter-spacing:1px;">All offers</h5>
        <span class="close">&times;</span>
        </div>
        <div class="modal-body">
         ${value[2]}
        </div>
        
    </div>

    </div>
   `

            contentWrapper = `<div class="contentWrapper"> ${topBarHtml} ${value[0]} ${value[1]}</div>`;
            rootElement.innerHTML = mobilesidebarHtml + contentWrapper + offersModal;

            utility.disableLoader(rootElement, loader);

            utility.loadUtilityJs();
            utility.manageBookNameLength()
            utility.manageAboutSection(bookName);
            utility.addDealToCart();
            utility.toggleButton("bookmark", "fa-bookmark", "fa-bookmark-o", "Bookmarked", "Bookmark");
            utility.toggleButton("addToCartBtn", "fa-check", "fa-cart-plus", "Added", "Add to Cart");
            utility.loadAccountModalJs();
        })
}

contsructBookPage(bookDataURL, similarBookDataURL, true)
    .then(() => console.log("promise resolved"))
    .catch((err) => console.log(err.message));