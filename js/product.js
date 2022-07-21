// VARIABLES

// Inside the DOM

const productTitle = document.getElementById('title')
const productPrice = document.getElementById('price')
const productDescription = document.getElementById('description')
const productColors = document.getElementById('colors')
const quantity = document.getElementById('quantity')
const itemImg = document.querySelector('.item__img')
const addToCartBtn = document.getElementById('addToCart')

// Outside the DOM
const productId = new URL(window.location.href).searchParams.get("id")
const apiUrl = "http://localhost:3000/api/products/"


// FUNCTIONS

/**
 * Get cart on localstorage or create one
 * @return { array }
 */
function getCart() {
    if (localStorage.getItem("cart") == null) {
        let cart = []
        return cart
    } else {
       let cart = localStorage.getItem("cart")
       cart = JSON.parse(cart)
       return cart
    }
}
let cart = getCart()

/**
 * Render products info. Must be use after Api Call.
 * @param { object } data - Data Json of the Product.
 */
function renderInfo(data) {
    productTitle.innerText = data.name
    productPrice.innerText = data.price
    productDescription.innerText = data.description

    // Add colors
    for (let i = 0; i < data.colors.length; i++) {
        const option = document.createElement('option')
        option.text = data.colors[i]
        productColors.appendChild(option)
    }

    // Add item IMG
    const img = document.createElement('img')
    img.src = data.imageUrl
    img.alt = data.altTxt
    itemImg.appendChild(img)
}


/**
 * API Call to get product info
 * @param { string } url - The URL of the API we want to fetch.
 * @param { string } id - The ID of product we want.
 * @return { Promise }
 */
function fetchInfo(url, id) {
    fetch(url + id)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            renderInfo(value)
        })
        .catch(function(err) {
            console.log(err)
        })
    }
fetchInfo(apiUrl, productId)


/** Reset value after adding to cart, prevent the user to spamming the button */
function resetValue() {
    quantity.value = 0
    productColors.value = ""
}



addToCartBtn.addEventListener('click', addToCart)
/** Add the product to cart after click */
function addToCart () {
    // If value missing, send error
    if (quantity.value == 0 || !productColors.value) {
        window.alert("Vous devez choisir une couleur et une quantité avant d'ajouter au panier.")
        return

    // If values not missing, create variables
    } else {
        let quantityValue = parseInt(quantity.value)
        let colorValue = productColors.value
        let purchase = {
            id: productId, 
            quantity: quantityValue, 
            color: colorValue
        }

        // If cart empty, just send information
        if (cart.length == 0) {
            cart.push(purchase)
            localStorage.setItem("cart", JSON.stringify(cart));
            resetValue() 
            window.alert("Produit(s) ajouté(s) au panier !")
            return

        // If not empty, start comparison
        } else {
            for (i = 0; i < cart.length; i++) {
                let idStored = cart[i]["id"]
                let quantityStored = cart[i]["quantity"]
                let colorStored = cart[i]["color"]

            // If id and color already exist, just add quantity
            if (idStored == productId && colorStored == colorValue) {
                cart[i]["quantity"] = quantityStored + quantityValue
                localStorage.setItem("cart", JSON.stringify(cart))
                window.alert("Ce produit a déjà été ajouté avec cette couleur. Nous ajoutons la quantité demandée dans le panier !")
                resetValue()
                return
            } 
        }
    }
    // If cart doesn't contain a product with same ID and color, create a new element
    cart.push(purchase)
    localStorage.setItem("cart", JSON.stringify(cart));
    window.alert("Produit(s) ajouté(s) au panier !")
    resetValue() 
    return
    }   
}