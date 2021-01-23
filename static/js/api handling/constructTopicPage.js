import { constructSection } from "./constructSection.js";
import { constructSidebar, constructTopBar } from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;
var topicName;

function constructBookList(data){
    // jo bhi topic ho like bestseller or new releases wo line number 8 pe topicName waale variable me store krna
    topicName = 'Best Sellers'; // abhi ke liye aise kr diya hai
    var sectionBooks = '';
    for (let i=0;i<5;i++){
        let obj = {
            // sb deta yha nikallene, uske baad obj.variableName Niche Html me kr dena
        }
        sectionBooks += 
        `
        <div class="bookItemContainer">
            <div class="bookItem">
                <div class="coverImgHolder">
                    <a href="book.html"><img loading="lazy" src="images/book2.jpg" alt=""></a>
                </div>
                <div class="cartBookInfo">
                    <p class="cartBookName">The Subtle art of not giving a fuck</p>
                    <p class="authorName">Mark Manson</p>
                    <div class="priceRating">
                        <p class="cartBookPrice">Rs 394</p>
                        <p class="cartBookRating"><i class="fa fa-star"></i> 4.5</p>
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
            <div class="pillsScroller bookGenres" style="padding-left:10px ;">
                <a href="genre.html" class="pill">Self Help</a>
                <a href="genre.html" class="pill">Non Fiction</a>
                <a href="genre.html" class="pill">Pyschology</a>
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

async function constructTopicPage(urlOne,isAuthenticated){
    utility.enableLoader(rootElement,loader);

    let bookListHtml = await constructSection(urlOne,constructBookList);
    let mobilesidebarHtml = constructSidebar(isAuthenticated, userId, NameOfUser); // is function ko phle component.js me check krle, tab arguements jo diye wo smj jayega
    let topBarHtml = constructTopBar(topicName, "index.html","cart.html");
    contentWrapper = `
            <div class="contentWrapper">
                ${topBarHtml}
                ${bookListHtml}
            </div>
    `
    rootElement.innerHTML = mobilesidebarHtml + contentWrapper;

    utility.disableLoader(rootElement,loader);
    utility.loadUtilityJs();    
    utility.toggleButton("bookmark","fa-bookmark","fa-bookmark-o", "Bookmarked","Bookmark");
    utility.toggleButton("addToCartBtn","fa-check","fa-cart-plus","Added","Add to Cart");
}

constructTopicPage("https://jsonplaceholder.typicode.com/todos/1",true)
  .then(() => console.log("prmoise resolved"))
  .catch((err) => console.log(err.message));