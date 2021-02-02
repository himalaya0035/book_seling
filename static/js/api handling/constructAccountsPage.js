import {constructSection} from "./constructSection.js";
import {constructSidebar, constructTopBar} from "./component.js";
import * as utility from "./utilities.js";

const rootElement = document.getElementById("rootElement");
var loader = document.getElementById("loader");
var contentWrapper;


let NameOfUser;
let isAuthenticated = false;

async function constructAccountsPage() {
    utility.enableLoader(rootElement, loader);

    try {
        NameOfUser = await constructSection('/api/accounts/profile', utility.getUser);
        isAuthenticated = true;
    } catch (e) {
        NameOfUser = 'Guest';
    }

    let topBarHtml = constructTopBar('Accounts', '/');
    let sidebarHtml = constructSidebar(isAuthenticated, NameOfUser);
    contentWrapper = `
        <div class="contentWrapper">
            ${topBarHtml}
            <div class="accountOptions">
            <div><a  href="passwordReset.html" class="changePassword">Change Password</a></div>
            <div><a  href="#"  class="updateEmail myBtn" >Update email</a></div>
            <div><a  href="#" class="deleteAccount myBtn">Delete Account</a></div>
        </div>
        <div class="accountNote">
            <h5><i class="fa fa-paperclip"></i> Note : </h5>
            <p>
                For Secuirity Reasons We recommend changing password from time to time.
                We also strongly recommend using a strong password, by strong password we mean a passowrd which contains : 
               
            </p>
            <ul>
                <li>At least 8 characters—the more characters, the better</li>
                <li>A mixture of both uppercase and lowercase letters</li>
                <li>  A mixture of letters and numbers</li>
                <li> Inclusion of at least one special character, e.g., ! @ # ? ]</li>
            </ul>
        </div>
        <div class="accountNote warning">
            <h5><i class="fa fa-exclamation-circle"></i> Warning : </h5>
            <p>
               Account once deleted can not be brought back !
            </p>
        </div>
        </div>
          <!-- modal starts here -->
          <div id="myModal" class="modal">

          <!-- Modal content -->
          <div class="modal-content">
            <div class="modal-header" >

              <h5>Update Email Address</h5>
              <span class="close">&times;</span>
            </div>
            <div class="modal-body">
              <h6 style="color:red;" id="message"></h6>
              <label for="confirmPasswordDelete">Confirm Password For Updation</label>
              <input type="password" id="confirmPasswordDelete2" placeholder = "Enter Password" autocomplete="on" style="margin-bottom:12px;">
              <label for="emailAddress">New Email Address : </label>
              <input type="email" id="emailAddress" placeholder = "New Email Address">
         
            </div>
            <div class="modal-footer">
              <button id="updateEmailBtn" type="submit" >Update Email</button>
            </div>
          </div>
        
        </div>
          <!-- modal ends here -->
          <!-- modal starts here -->
          <div id="myModal2" class="modal">

          <!-- Modal content -->
          <div class="modal-content" >
          <div class="modal-header" style="background-color:#F32013;" >
          <h5>Delete Account</h5>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <form>
          <h6 id="message2" style="color:red;"></h6>
          <label for="confirmPasswordDelete">Confirm Password For Deletion</label>
          <input type="password" id="confirmPasswordDelete" placeholder = "Enter Password" autocomplete="on">
          </form>
        </div>
        <div class="modal-footer" style="background-color:#F32013;">
          <button id="deleteAccountBtn" >Delete Account</button>
        </div>
          </div>
        
        </div>
          <!-- modal ends here -->
    `
    rootElement.innerHTML = sidebarHtml + contentWrapper;
    utility.disableLoader(rootElement, loader);
    utility.loadUtilityJs();
    utility.loadAccountModalJs();
}

constructAccountsPage()