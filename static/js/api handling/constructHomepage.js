import {constructSection} from "./constructSection.js";
import {constructHomepageTopBar, constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const baseURL =  `${window.location.protocol}//${window.location.host}/api`;
const url1 = `${baseURL}/books/best-sellers`;
const url2 = `${baseURL}/books/recommended`;
const url3 = `${baseURL}/authors/top`;
const url4 = `${baseURL}/books/new`;
const url5 = `${baseURL}/books/popular`;

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;

function constructBooksSlider(data, sectionName) {

    var sliderBooks = "";
    for (let i = 0; i < data.length; i++) {
        sliderBooks += `
        <div class="homepageBook">
            <div class="coverImgHolder">
                <a href="book.html" aria-label="view Book"><img src=${data[i].cover_image} loading="lazy" alt="" /></a>
            </div>
            <p class="bookName">${data[i].name}</p>
            <div class="ratingAndPrice">
                <h6 class="homepageBookPrice">Rs ${data[i].lowest_price}</h6>
                <h6 class="homepageBookRating">${data[i].rating}&#9733;</h6>
            </div>
        </div>
      `;
    }
    return (`
          <div class ="booksSection">
              <div class="headerRow">
                  <h4>${sectionName}</h4>
                  <a href="sections.html" aria-label="view ${sectionName} section">More</a>
              </div>
             <div class="booksHolder">${sliderBooks}</div>
          </div>
          `
    )
}

function constructAuthorsSlider(data) {
    var sliderAuthors = "";
    console.log("author data -> ", data)
    for (let i = 0; i < data.length; i++) { // ye 9 bs sample ke liye liya hai maine, array length ayega yha
        console.log(data[i].id)
        sliderAuthors += `
      <div class="authorBox">
        <div class="authorImgHolder">
            <a href="/author/${data.id}" aria-label="view Author"><img loading="lazy" src=${data[i].image} height="135" width="90" alt="" /></a>
        </div>
        <p class="homepageAuthorName">${data[i].name}</p>
        <a href="/author/${data[i].id}" aria-label="view Author" class="viewAuthor">View</a>
    </div>
      `;
    }
    return (
        `
        <div class="" style="padding: 10px; padding-left: 5px;">
            <div class="headerRow">
                <h4>Top Authors</h4>
            </div>
            <div class="authorsHolder">
                <div class="authorsScroller">
                 ${sliderAuthors}
                </div>
            </div>
         </div>   
        `
    )
}

let NameOfUser = "Priyansh Singh"; // ye data kaise nikalna hai api se wo dekhlena
let userId = 1;


async function constructHomepage(urlOne, urlTwo, urlThree, urlFour, urlFive, isAuthenticated) {
    utility.enableLoader(rootElement, loader)

    let bestSellersHtml = await constructSection(urlOne, constructBooksSlider, 'Best Sellers');
    let recommendedHtml = await constructSection(urlTwo, constructBooksSlider, 'Recommended For You');
    let newReleasesHtml = await constructSection(urlFour, constructBooksSlider, 'New Releases');
    let popularHtml = await constructSection(urlFive, constructBooksSlider, 'Popular');
    let topAuthorsHtml = await constructSection(urlThree, constructAuthorsSlider);
    let topBarHtml = constructHomepageTopBar();
    let mobilesidebarHtml = constructSidebar(isAuthenticated, userId, NameOfUser);

    contentWrapper = `<div class ="contentWrapper">
         ${topBarHtml}
         ${bestSellersHtml}
         ${recommendedHtml}
         ${topAuthorsHtml}
         ${newReleasesHtml}
         ${popularHtml}
        </div>
    `
    const searchResults = `
    <div id="searchResults">
    
    </div>
    `
    rootElement.innerHTML = searchResults + mobilesidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader)
    utility.loadUtilityJs();
    utility.manageSearchResults();
}

console.log(url3)
constructHomepage(url1, url2, url3, url4, url5, true)
    .then(() => console.log("promise resolved"))
    .catch((err) => console.log(err.message));
