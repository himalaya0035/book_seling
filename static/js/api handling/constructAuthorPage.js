import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;
var sectionBottom;
var authorName;
var authorImgUrl;

const authorID = window.location.pathname.split('/')[2]
const baseURL = `${window.location.protocol}//${window.location.host}/api`;
const authorDataURL = `${baseURL}/authors/${authorID}`;
const authorBooksURL = `${baseURL}/books/all?name=&author__name=&genre__name=&ISBN=&author__id=${authorID}`;

function constructAuthorDesc(data) {
    // yha pe data nikalna 
    // NOTE : author ka name and author ki Img url line 9 and 10 pe jo global variable hai wha BHI store krna,
    // dusri jgeh bhi istemal krna hai unko
    // matlab yha teen variable nikalne, authorDesc, authorName, authorImgUrl
    authorName = data.name; // abhi ke liye toh aise kr dia
    authorImgUrl = data.image;
    return (
        `
            <div class="bookDesc" style="margin-bottom: 0px;">
                <div class="shapesHeading" style="transform: translateX(-15px); width: 50%; margin-bottom: 10px;">
                    <h5>About</h5>
                </div>
                <p id="about">${data.info}</p>
            </div>
    
        `
    )
}

function constructAuthorBooksSection(data) {
    // Author books ki array ki length  nikalana yha
    var authorBooks = "";
    for (let i = 0; i < data.length; i++) { // ye 5 bs sample ke liye liya hai maine, array length ayega yha
        let obj = {
            // pichle section ki treh yha bhi data break krna, data[i].jsonKey
            // uske baad niche html me ${obj.variableName} aise put krdena
            // imageUrl = data[i].authorImg      example
        };
        authorBooks += `
        <div class="homepageBook">
            <div class="coverImgHolder">
               <a href=/book/${data[i].ISBN}><img src=${data[i].cover_image} alt="" /></a>
            </div>
            <p class="bookName">${data[i].name}</p>
            <div class="ratingAndPrice">
                <h6 class="homepageBookPrice">Rs ${data[i].lowest_price.price}</h6>
                <h6 class="homepageBookRating">${data[i].rating}&#9733;</h6>
            </div>
        </div>
      `;
    }
    return (`
          <div class ="booksSection authorBooks">
              <div class="headerRow">
                  <h4>Author's Books</h4>
              </div>
              <div class="booksHolder">${authorBooks}</div>
          `
    )
}

let NameOfUser;
let isAuthenticated = false;

async function constructAuthorPage(urlone, urlTwo) {
    utility.enableLoader(rootElement, loader);

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }


    let getAuthorDescHtml = await constructSection(urlone, constructAuthorDesc);
    let getAuthorBooksHtml = await constructSection(urlTwo, constructAuthorBooksSection);
    let mobilesidebarHtml = constructSidebar(isAuthenticated, NameOfUser); // is function ko phle component.js me check krle, tab arguements jo diye wo smj jayega
    let topBarHtml = constructTopBar(authorName, "/", undefined); // jo bhi django ke according link ho wo daal diyo
    let authorInfoContainer = ` <div class="authorInfoContainer" style="background: url(${authorImgUrl}); background-position: top; background-size: cover"></div>`
    sectionBottom = `
            <div class="sectionBottom rellax" data-rellax-speed="0">
                ${getAuthorDescHtml}
                ${getAuthorBooksHtml}
            </div>
    `
    contentWrapper = `<div class="contentWraper">
                            ${topBarHtml}
                            ${authorInfoContainer}
                            ${sectionBottom}
                     </div>`
    rootElement.innerHTML = mobilesidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader);
    utility.addScrollEffect();
    utility.manageAboutSection(authorName);
    utility.loadUtilityJs();
}

constructAuthorPage(authorDataURL, authorBooksURL, true)
    .then(() => console.log("promise resolved"))
    .catch((err) => console.log(err.message));
