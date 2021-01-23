import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";
import {validationUtility} from "./validationUtility.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;
var profileBannerImgUrl;

function constructProfileForm(data) {
    console.log(data)
    // requires fields FirstName, lastname, address, contact and email
    // sb fields nikalke input tags ki value me daal diyo
    // ${data.first_name}
    console.log(data.address)
    return (
        `
        <div class="sectionBottom rellax" data-rellax-speed="0">
        <div class="container-fluid" style="padding-top: 0px">
            <div class="row justify-content-center">
                <div class="col-11 col-sm-10 col-md-10 col-lg-6 col-xl-5 text-center p-0 mt-3 mb-2">
                    <div class="card px-0 pt-4 pb-0 mt-3 mb-3">
                        <form id="msform">
                            <!-- progressbar -->

                            <!-- fieldsets -->
                            <fieldset>
                                <div class="form-card">
                                    <div class="row">
                                        <div class="col-12">
                                            <h4 class="fs-title">Profile Info</h4>
                                            <p>Update Profile if necessary</p>
                                        </div>
                                        <div class="row">
                                            <div class="col-12" style="margin-left: 18px">
                                                <h6 id="message" style="color: rgb(243, 51, 51)"></h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12" style="margin-bottom: 12px;">
                                            <h6 id="message" style="color: rgb(243, 51, 51)"></h6>
                                        </div>
                                    </div>
                                    <label class="fieldlabels">FirstName :</label>
                                    <input type="text" name="firstName" placeholder="First Name" id="fname"
                                        class="loginField sectionFirst" value=${data.user.first_name}>
                                    <label class="fieldlabels">Last Name : </label>
                                    <input type="text" class="sectionFirst" name="lname" placeholder="Last Name" value=${data.user.last_name}>
                                    <label class="fieldlabels">Email: </label>
                                    <input type="email" name="email" placeholder="Email Id" id="email"
                                        class="sectionFirst" value=${data.user.email}>
                                    <label class="fieldlabels">Contact No :</label>
                                    <input type="number" name="pwd" placeholder="Contact No" id="contact"
                                        class="loginField sectionFirst" />
                                    <label class="fieldlabels">Delivery Address : (Min 30 characters)</label>
                                    <textarea name="DeliveryAddress" placeholder="Delivery Address"
                                        id="address" class="loginField sectionFirst" >${data.address}</textarea>
                                </div>
                                <input type="button" name="save" class="next action-button" id="saveBtn" value="Save" />
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
    )

}

let NameOfUser = "Priyansh Singh"; // ye data kaise nikalna hai api se wo dekhlena
let userId = 1;

async function constructProfilePage(urlone, isAuthenticated) {
    utility.enableLoader(rootElement, loader);

    let profileFormHtml = await constructSection(urlone, constructProfileForm);
    let mobilesidebarHtml = constructSidebar(isAuthenticated, userId, NameOfUser); // is function ko phle component.js me check krle, tab arguements jo diye wo smj jayega
    let topBarHtml = constructTopBar(NameOfUser, "index.html", undefined); // jo bhi django ke according link ho wo daal diyo
    let authorInfoContainer = `<div class="authorInfoContainer profileCoverImg" style=""></div>`

    contentWrapper = `<div class="contentWrapper">
                    ${topBarHtml}
                    ${authorInfoContainer}
                    ${profileFormHtml}
    </div>`

    rootElement.innerHTML = mobilesidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader);
    validationUtility();
    utility.loadUtilityJs();
    utility.addScrollEffect();

}

constructProfilePage(`${window.location.protocol}//${window.location.host}/api/accounts/profile`, true)
    .then(() => console.log("prmoise resolved"))
    .catch((err) => console.log(err.message));