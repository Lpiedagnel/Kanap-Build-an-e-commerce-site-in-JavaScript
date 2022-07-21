// VARIABLES

// Inside the DOM
// Cart variables
const cartItems = document.getElementById("cart__items")
const totalQuantity = document.getElementById("totalQuantity")
const totalPriceSpan = document.getElementById("totalPrice")

// Form variables
const firstName = document.getElementById("firstName")
const firstNameError = document.getElementById("firstNameErrorMsg")
const lastName = document.getElementById("lastName")
const lastNameError = document.getElementById("lastNameErrorMsg")
const address = document.getElementById("address")
const addressError = document.getElementById("addressErrorMsg")
const city = document.getElementById("city")
const cityError = document.getElementById("cityErrorMsg")
const email = document.getElementById("email")
const emailError = document.getElementById("emailErrorMsg")
const order = document.getElementById("order")
const form = document.querySelector(".cart__order__form")

// Outside the DOM
let contact = {}
const apiUrl = "http://localhost:3000/api/products/"

// RegEx variables
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.\'-]{2,35}$/
const cityRegex = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]{1,30}$/
const addressRegex = /^([0-9a-zA-Z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{5,50})$/g

// Verification variables
let firstNameTest = false
let lastNameTest = false
let addressTest = false
let cityTest = false
let emailTest = false

// Local Storage variables
let cart = localStorage.getItem("cart")
cart = JSON.parse(cart)
console.log(cart)


// FUNCTIONS

/**
 * Get info for each product on the cart
 * @param { array } cart - The cart inside the localStorage.
 */
function getProducts(cart) {
    for (i = 0; i < cart.length; i++ ) {
        let productId = cart[i].id
        let productColors = cart[i].color
        let productQuantity = cart[i].quantity
        getProductInfo(apiUrl, productId, productColors, productQuantity)
    }
}

/**
 * API Call to get info for a specific product. This function must be use after we got the products on cart.
 * @param { String } url - URL of the API we want to fetch.
 * @param { String } id - The ID of the current product.
 * @param { String } colors - The color the user want to purchase.
 * @param { Number } quantity - The quantity of products the user want to purchase.
 * @return { Promise }
 */
function getProductInfo(url, id, colors, quantity) {
    fetch(url + id)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        renderProduct(value, colors, quantity)
    })
    .catch(function(err) {
        console.log(err)
    })
}


/**
 * Render the informations of product. This function is use after the API Call.
 * @param { Object } value - Data Json of the product.
 * @param { String } colors - The color the user want to purchase.
 * @param { Number } quantity - The quantity of products the user want to purchase.
 */
function renderProduct(value, colors, quantity) {

    let article = document.createElement('article')
    article.className = "cart__item"
    article.setAttribute("data-id", `${value._id}`)
    article.setAttribute("data-color", `${colors}`)
    cartItems.appendChild(article)

    let divImg = document.createElement('div')
    divImg.className = "cart__item__img"
    article.appendChild(divImg)

    let img = document.createElement('img')
    img.src = value.imageUrl
    img.alt = value.altTxt
    divImg.appendChild(img)

    let divContent = document.createElement('div')
    divContent.className = "cart__item__content"
    article.appendChild(divContent)

    let divDescription = document.createElement('div')
    divDescription.className = "cart__item__content__description"
    divContent.appendChild(divDescription)

    let title = document.createElement('h2')
    title.innerText = value.name
    divDescription.appendChild(title)

    let colorParagraph = document.createElement('p')
    colorParagraph.innerText = colors
    divDescription.appendChild(colorParagraph)

    let priceParagraph = document.createElement('p')
    priceParagraph.innerText = value.price + ' €'
    divDescription.appendChild(priceParagraph)

    let divSettings = document.createElement('div')
    divSettings.classList = "cart__item__content__settings"
    divContent.appendChild(divSettings)

    let divQuantity = document.createElement('div')
    divQuantity.classList = "cart__item__content__setting__quantity"
    divSettings.appendChild(divQuantity)

    let quantityParagraph = document.createElement('p')
    quantityParagraph.innerText = "Qté : "
    divQuantity.appendChild(quantityParagraph)

    let quantityInput = document.createElement('input')
    quantityInput.type = "number"
    quantityInput.classList = "itemQuantity"
    quantityInput.setAttribute("name", "itemQuantity")
    quantityInput.setAttribute("min", 1)
    quantityInput.setAttribute("max", 100)
    quantityInput.setAttribute("value", `${quantity}`)
    quantityInput.onchange = function() {
        modifyQuantity(this, value.price, quantity)
    } 
    divQuantity.appendChild(quantityInput)

    let deleteDiv = document.createElement('div')
    deleteDiv.classList = "cart__item__content__settings__delete"
    divSettings.appendChild(deleteDiv)

    let deleteParagraph = document.createElement('p')
    deleteParagraph.classList = "deleteItem"
    deleteParagraph.onclick = function() {
        deleteItem(this, value.price, value.price)
    }
    deleteParagraph.innerText = "Supprimer"
    deleteDiv.appendChild(deleteParagraph)

    // Render price
    let currentTotalPrice = Number(totalPriceSpan.innerText)
    let newTotalPrice = currentTotalPrice + (value.price * quantity)
    totalPriceSpan.innerText = newTotalPrice
}

getProducts(cart)


/**
 * Modify quantity
 * @param { HTMLElement } element - The product we want to modify.
 * @param { Number } price - The price of the product.
 * @return { Number }
 */
function modifyQuantity(element, price) {
    // Gets Elements
    const newQuantity = element.value
    const article = element.closest('article')
    const id = article.getAttribute('data-id')
    const color = article.getAttribute('data-color')
    // Check which object is concerned
    for (i = 0; i < cart.length; i++) {
        let idStored = cart[i]["id"]
        let colorStored = cart[i]["color"]

        if (idStored == id && colorStored == color) {
            let quantityStored = cart[i]["quantity"]
            // Get current total price
            let currentTotalPrice = Number(totalPriceSpan.innerText)
            // Update totalPrice
            currentTotalPrice += (price * (newQuantity - quantityStored))
            totalPriceSpan.innerText = currentTotalPrice
            
            cart[i]["quantity"] = newQuantity
            localStorage.setItem("cart", JSON.stringify(cart))
            console.log(cart)
            return
        }
    }
}


/**
 * Delete item
 * @param { HTMLElement } element - The product we want to deletefrom.
 * @param { Number } price - The price we have to delete.
 * @return { Array }
 */
function deleteItem(element, price) {

    const article = element.closest('article')
    const id = article.getAttribute('data-id')
    const color = article.getAttribute('data-color')
    article.remove()

    // Delete from localstorage
    for (i = 0; i < cart.length; i++) {
        let idStored = cart[i]["id"]
        let colorStored = cart[i]["color"]

        if (idStored == id && colorStored == color) {
            // Update price
            let totalPrice = price * cart[i]["quantity"]
            let currentTotalPrice = Number(totalPriceSpan.innerText)
            currentTotalPrice -= totalPrice
            totalPriceSpan.innerText = currentTotalPrice

            // Delete from the cart
            cart.splice(i, 1)
            localStorage.setItem("cart", JSON.stringify(cart))
            console.log(cart)
            return
        }
    }
}


/**
 * Check user input with Regex
 * @param { HTMLElement } input - The current field.
 * @param { HTMLElement } err - The space to display error message.
 * @param { String} regex - The regex we have to use to verify the user input.
 * @return { Boolean }
 */
function checkUserInput(input, err, regex) {
    if (regex.test(input) === true) {
        err.innerText = ""
        return true
    } else {
       err.innerText = "Les informations rentrées sont invalides !"
       return false
    }
}

// Add events listener for each field on form
firstName.addEventListener('change', function() {
    firstNameTest = checkUserInput(this.value, firstNameError, nameRegex)
})
lastName.addEventListener('change', function() {
    lastNameTest = checkUserInput(this.value, lastNameError, nameRegex)
})
address.addEventListener('change', function() {
    addressTest = checkUserInput(this.value, addressError, addressRegex)
})
city.addEventListener('change', function() {
    cityTest = checkUserInput(this.value, cityError, cityRegex)
})
email.addEventListener('change', function() {
    emailTest = checkUserInput(this.value, emailError, emailRegex)
})


/**
 * Checking all user inputs on contact form after click to submit cart
 * @param { Event } e - The current event
 */
form.addEventListener('submit', function(e) {
    e.preventDefault()
    // Check if cart has values
    if (cart.length == 0) {
        window.alert("Le panier est vide.")
        return
    } else {
        // Check if form has any error before send info
        if (!firstNameTest || !lastNameTest || !addressTest || !cityTest || !emailTest) {
            window.alert("Veuillez remplir le formulaire de contact.")
            return
        } else {
            sendInfo()
        }
    }
})


/**
 * Get only ID for each product on cart
 * @param { Array } cart - The cart inside the localStorage.
 * @return { Array }
 */
 function getIds(cart) {
    let products = []
    for (i = 0; i < cart.length; i++) {
        products.push(cart[i].id)
    }
    return products
}


/**
 * Get contact info from user inputs.
 * @return { Array }
 */
function getContactInfo() {
    contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
    }
    return contact
}


/** API Post to send contact informations and id of products */
function sendInfo() {
    // Get contact info and ID of products
    const contact = getContactInfo()
    const products = getIds(cart)
    // API Post
    fetch(apiUrl + "order", {
        method: "POST",
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({contact:contact, products:products})
        })
        .then(response => response.json())

        .then(function(json) {
            sendConfirmation(json)
        })

        .catch(function(err) {
            console.log(err)
        }
    )
}


/**
 * After send the informations with SendInfo(), send the user to the confirmation page after create URL
 * @param { Object } json - The JSON obtained after the Fetch POST
 */
function sendConfirmation(json) {
    const orderId = json.orderId

    // Create URL by getting the current location and delete the /cart.html to replace it with /confirmation.html
    const baseUrl = window.location.href
    baseUrl.split('/cart.html').slice(-2).join('/')
    const confirmationUrl = new URL("confirmation.html", baseUrl)
    confirmationUrl.searchParams.append("orderid", orderId)
    location.href = confirmationUrl.href
}

console.log(window.location.origin)
console.log(window.location.pathname)