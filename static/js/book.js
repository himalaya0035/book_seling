const addProductToCartButton = document.getElementsByClassName('addToCartBtn')[0]

const genreLoadHelper = (genreNames) => {
    console.log(genreNames)
    const el = document.getElementById('genre-names-list');
    for (let i = 0; i < genreNames.length; i++) {
        document.getElementById('genre-names-list').innerHTML = el.innerHTML + `<a href="genre.html" class="pill">${genreNames[i].name}</a>`
    }
}

const authorNameLoader = (authorNames) => {

    const el = document.getElementById('author-name-list');
    for (let i = 0; i < authorNames.length; i++) {
        document.getElementById('author-name-list').innerText = el.innerText + authorNames[i].name;
    }
}

window.onload = async () => {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const book_id = window.location.pathname.split('/')[2];
    const book_cover_image = document.getElementById("book-cover-image");

    const res = await axios.get(`${protocol}//${host}/api/books/${book_id}`);
    const data = await res.data;

    addProductToCartButton.addEventListener('click', async () => {
        const data = {
            book_id
        }
        let config = {
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            }
        }

        const res = await axios.post(`${protocol}//${host}/api/cart/add_to_cart`, data, config);
    })

    book_cover_image.src = data.cover_image
    document.getElementsByClassName('cartBookRating')[0].innerText = data.rating;
    document.getElementsByClassName('cartBookPrice')[0].innerText = data.price;
    document.getElementsByClassName('cartBookName')[0].innerText = data.name;
    genreLoadHelper(data.genre_names)
    authorNameLoader(data.author_details)
    document.getElementById('book-info-section').innerHTML = data.info
}