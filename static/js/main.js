var sidebarToggler = document.getElementsByClassName("sidebarToggler")[0];
var sidebar = document.getElementsByClassName("mobileSidebar")[0];
var cross = document.getElementsByClassName("cross")[0];
// var i = sidebarToggler.getElementsByTagName('i')[0];
sidebarToggler.addEventListener('click', function () {
    sidebar.classList.toggle('sidebarActive');
})
cross.addEventListener('click', function () {
    sidebar.classList.toggle('sidebarActive');
})

var bookNames = document.getElementsByClassName("bookName");

for (i = 0; i < bookNames.length; i++) {
    if (bookNames[i].innerText.length > 23 ) {
        bookNames[i].innerText = bookNames[i].innerText.substring(0, 25) + ' ...';
    }
}



 function toggleButton(mainElementClass,toBeReplacedClass,checkClass,buttonInitialText,buttonFinalText){
    var commonElement = document.getElementsByClassName(mainElementClass);
    for (i=0;i<commonElement.length;i++){
        commonElement[i].addEventListener('click',(e)=>{
            var ele = e.target;
            var child = ele.getElementsByTagName('i')[0];
            if (child.classList.contains(checkClass)){
               ele.innerHTML  = `<i class ="fa ${toBeReplacedClass}" style="color:white;"></i>` + ` ${buttonInitialText}`;
            }
            else {
               ele.innerHTML  = `<i class ="fa ${checkClass}" style="color:white;"></i>` + ` ${buttonFinalText}`;   
            }
            // api call here
            if (window.location.href.indexOf('bookmarked') > -1 && mainElementClass === 'bookmark'){
               let bookItem = ele.closest('.bookItem');
               bookItem.remove();
               //api call here
                if (document.getElementsByClassName('bookList')[0].innerText.length === 0){
                    document.getElementById('NoBookmarkedMsg').style.display = 'block';
                }
            }
            
        })
    }
 }
toggleButton('bookmark','fa-bookmark','fa-bookmark-o','Bookmarked','Bookmark');
toggleButton('addToCartBtn','fa-check','fa-cart-plus','Added','Add to cart');
