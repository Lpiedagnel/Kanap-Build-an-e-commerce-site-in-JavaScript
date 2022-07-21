// VARIABLES //

const items = document.getElementById("items")
const apiUrl = "http://localhost:3000/api/products"

// FUNCTIONS //

/**
 * Render all products on index. This function must be use after a Api call.
 * @param { Object } data - Json Data get by API Call
 */
function renderProduct(data) {
    for (let i = 0; i < data.length; i++) {

        let link = document.createElement('a')
        link.href = `./product.html?id=${data[i]._id}`
        items.appendChild(link)

        let article = document.createElement('article')
        link.appendChild(article)

        let img = document.createElement('img')
        img.src = data[i].imageUrl
        img.alt = data[i].altTxt
        article.appendChild(img)

        let title = document.createElement('h3')
        title.innerText = data[i].name
        article.appendChild(title)

        let p = document.createElement('p')
        p.innerText = data[i].description
        article.appendChild(p)
    }
}

/**
 * API Call to get products
 * @param { String } url - URL of the API we want to fetch to get products
 * @return { Promise }
 */

function fetchProduct(url) {
    fetch(url)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            renderProduct(value)
        })
        .catch(function(err) {
            console.log(err)
        })
    }

fetchProduct(apiUrl);