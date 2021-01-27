import {constructSection} from "./constructSection.js";
import {constructHomepageTopBar, constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const url1 = `/api/books/best-sellers`;
const url2 = `/api/books/recommended`;
const url3 = `/api/authors/top`;
const url4 = `/api/books/new`;
const url5 = `/api/books/popular`;

const rootElement = document.getElementById("rootElement");
let loader = document.getElementById("loader");
let contentWrapper;

function constructBooksSlider(data, sectionName) {

    let sliderBooks = "";
    for (let i = 0; i < data.length; i++) {
        sliderBooks += `
        <div class="homepageBook">
            <div class="coverImgHolder">
                <a href="/book/${data[i].ISBN}" aria-label="view Book"><img src=${data[i].cover_image} loading="lazy" alt="" /></a>
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
    let sliderAuthors = "";
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

let NameOfUser;
let isAuthenticated = false;
async function constructHomepage(urlOne, urlTwo, urlThree, urlFour, urlFive) {


    utility.enableLoader(rootElement, loader)
    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        console.log(NameOfUser);
        isAuthenticated = true;
    } catch (e){
        NameOfUser = 'Guest';
    }
    let bestSellersHtml = await constructSection(urlOne, constructBooksSlider, 'Best Sellers');
    let recommendedHtml = await constructSection(urlTwo, constructBooksSlider, 'Recommended For You');
    let newReleasesHtml = await constructSection(urlFour, constructBooksSlider, 'New Releases');
    let popularHtml = await constructSection(urlFive, constructBooksSlider, 'Popular');
    let topAuthorsHtml = await constructSection(urlThree, constructAuthorsSlider);
    let topBarHtml = constructHomepageTopBar();
    let mobilesidebarHtml = constructSidebar(isAuthenticated,NameOfUser);
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
