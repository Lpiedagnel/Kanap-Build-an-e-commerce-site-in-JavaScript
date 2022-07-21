// VARIABLES

const orderIdSpan = document.getElementById("orderId")

// FUNCTIONS

/** Get order ID with URLSearchParams */
function getOrderId() {
    const params = new URLSearchParams(document.location.search)
    const orderId = params.get("orderid");
    orderIdSpan.innerText = orderId
}

getOrderId()