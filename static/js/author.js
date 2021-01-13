var rellax = new Rellax('.rellax');
var authorInfoContainer = document.getElementsByClassName('authorInfoContainer')[0];
window.onscroll = () => {
    if (window.scrollY > 0 && window.scrollY < 20) {
        authorInfoContainer.style.opacity = 0.9;
    } else if (window.scrollY >= 20 && window.scrollY < 40) {
        authorInfoContainer.style.opacity = 0.8;
    } else if (window.scrollY >= 40 && window.scrollY < 60) {
        authorInfoContainer.style.opacity = 0.7;
    } else if (window.scrollY >= 60 && window.scrollY < 80) {
        authorInfoContainer.style.opacity = 0.6;
    } else if (window.scrollY >= 80 && window.scrollY < 100) {
        authorInfoContainer.style.opacity = 0.5;
    } else if (window.scrollY >= 100 && window.scrollY < 120) {
        authorInfoContainer.style.opacity = 0.4;
    } else if (window.scrollY >= 120 && window.scrollY < 140) {
        authorInfoContainer.style.opacity = 0.3;
    } else if (window.scrollY >= 140 && window.scrollY < 160) {
        authorInfoContainer.style.opacity = 0.2;
    } else if (window.scrollY >= 160 && window.scrollY < 170) {
        authorInfoContainer.style.opacity = 0.1;
    } else if (window.scrollY >= 170) {
        authorInfoContainer.style.opacity = 0;
    } else {
        authorInfoContainer.style.opacity = 1;
    }
}

const authorBookFormatter = (imageSrc, Book_name, price, rating, id) => {
    return `
                    <div class="homepageBook">
                    <div class="coverImgHolder">
                        <a href=/book/${id}><img src=${imageSrc} alt=""/></a>
                    </div>
                    <p class="bookName">${Book_name}</p>
                    <div class="ratingAndPrice">
                        <h6 class="homepageBookPrice">${price}</h6>
                        <h6 class="homepageBookRating">${rating}&#9733;</h6>
                    </div>
                </div>
        `
}

window.onload = async () => {

    const host = window.location.host;
    const author_id = window.location.pathname.split('/')[2];
    const url = `http://${host}/api/authors/${author_id}`;
    const res = await axios.get(url);
    const data = await res.data;
    const els = document.getElementsByClassName('authorInfoContainer')[0];

    const {id, name, info, image} = data;
    els.style.background = `url(${image})`
    const res2 = await axios.get(`http://${host}/api/authors/${author_id}/books`);
    const data2 = await res2.data;
    document.getElementById('author-info').innerText = info;
    document.getElementById('author-name').innerText = name;

    const books_section = document.getElementById('author-books').innerHTML;

    for (let i = 0; i < data2.length; i++) {
        const {cover_image, id, name, price, rating} = data2[i];
        document.getElementById('author-books').innerHTML = books_section + authorBookFormatter(cover_image, name, price, rating, id)
    }

}

