
const customerName = document.querySelector("#customer_name");
const customerSurname = document.querySelector("#customer_surname");
const customerEmail = document.querySelector("#customer_email");
const phoneNumber = document.querySelector("#phone_number");
const delivery = document.querySelector("#delivery");
const addressLatitude = document.querySelector("#address_latitude");
const addressLongitude = document.querySelector("#address_longitude");
const totalItems = document.querySelector("#total_items");
const subtotalPrice = document.querySelector("#subtotal_price");
const taxtotalPrice = document.querySelector("#taxtotal_price");
const totalPrice = document.querySelector("#total_price");
const addBtn = document.querySelector("#submit");
const paymentContents = document.querySelector(".payment-item");
const continueBtn = document.querySelector("#reset");
const totalCheckoutItems = document.querySelector(".total_items_number");
const spnSubTotalPrice = document.querySelector(".subtotal_price_spn");
const spnTotalPrice = document.querySelector(".total_price_spn");
const taxTotal = document.querySelector(".taxtotal_price_spn");
const cartItems = document.querySelector(".cart-items");

var stripePublicKey = document.getElementById("token").value;

addBtn.onclick = function() {
    
    var stripeHandler = StripeCheckout.configure({
        key: stripePublicKey,
        locale: "en",
        token: function(token){
            console.log(token.id)
            var paymentCart = JSON.parse(localStorage.getItem("cart"));
            var itemesId = paymentCart.map(function(cart) {
                return cart.id;  
                })
                
        let tempTotal = 0;
            let itemsTotal = 0;
            let taxTotal = 0;
            paymentCart.map(item => {
                tempTotal += item.price * item.insideCart;
                itemsTotal += item.insideCart;
                taxTotal = tempTotal * (10 / 100)
                overAllTotal = taxTotal + tempTotal;

            let id = item.id;
            })
            let result = paymentCart.reduce((total, cart) =>(total + cart.insideCart), 0);
            let totalPrice = parseFloat(overAllTotal).toFixed( 2 );
            let answer = totalPrice * 100;
            console.log(answer)
    
            const name = customerName.value;
            const surname = customerSurname.value;
            const email = customerEmail.value;
            const contact = phoneNumber.value;
            const deliver = delivery.value;
            const latitude = addressLatitude.value;
            const longitude = addressLongitude.value;
            const items = result;
            const subtotal = parseFloat(tempTotal).toFixed( 2 );
            const tax = parseFloat(taxTotal).toFixed( 2 );
            const totals = parseFloat(overAllTotal).toFixed( 2 );
            const total = answer;

            addressLongitude.value = "";
            addressLatitude.value = "";
            delivery.value = "";
            phoneNumber.value = "";
            customerEmail.value = "";
            customerSurname.value = "";
            customerName.value = "";
            
        
            fetch("http://localhost:5023/createOrder", {
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ name: name, surname: surname, email: email, contact: contact,
                                        deliver: deliver, latitude: latitude, longitude: longitude, 
                                        items: items, subtotal: subtotal, tax: tax, total: total, 
                                            stripeTokenId: token.id, itemesId: itemesId, totals: totals})
            })
            .then(response => {
                if(response) {
                location.href = "/complete";
                } else if (error){
                    throw error;
                }
            })
            
            
        }
    })

    var priceElement = document.getElementsByClassName("total_price_spn")[0]
    var price = parseFloat(priceElement.innerText.replace("R", ""))
    stripeHandler.open({
        amount: price
    })

}

continueBtn.addEventListener("click", () => {
   
    location.href = "/";
});
cartItems.addEventListener("click", () => {
   
    location.href = "/";
});


    const paymentContent = document.querySelector(".payment-container");
    var paymentCart = JSON.parse(localStorage.getItem("cart"));
    
    const totalSubPrice = paymentCart.map((cart) => 
    (cart.insideCart * cart.price));

function  displayProducts(paymentCart) {
    let html = "";
    paymentCart.forEach(order => {
        var num = order.price * order.insideCart;
        var fixedNum = parseFloat(num).toFixed( 2 );
        html += `
        <div class="payment-item">
            <div class="row">
                <div class="col-md-3">
                    <img src=${order.image} alt="">
                </div>
                <div class="col-md-3">
                    <p class="item-title">${order.title}</p>
                </div>
                <div class="col-md-2">
                    <p class="checkout-card"><small>R${order.price}</small></p>
                </div>
                <div class="col-md-3">
                    <p class="checkout-card"><small>R${fixedNum}</small></p>
                </div>
                <div class="col-md-1 total_items">
                    <span class="">${order.insideCart}</span>
                </div>
            </div>
        </div> 
            `;
    });
        paymentContent.innerHTML = html;        
}

function setCartValues() {
    let tempTotal = 0;
    let itemsTotal = 0;
    paymentCart.map(item => {
        tempTotal += item.price * item.insideCart;
        itemsTotal += item.insideCart;
        tax = tempTotal * (10 / 100)
        overAllTotal = tax + tempTotal;
        
    })
    const totalIncart = paymentCart.reduce((total, cart) => 
            (total + cart.insideCart), 0);
    
    cartItems.innerText = itemsTotal;
    spnSubTotalPrice.innerHTML = parseFloat(tempTotal.toFixed(2));
    spnTotalPrice.innerHTML = parseFloat(overAllTotal.toFixed(2));
    taxTotal.innerHTML = parseFloat(tax.toFixed(2));
    totalCheckoutItems.innerText = totalIncart;  
}

document.addEventListener("DOMContentLoaded", function() {
    displayProducts(paymentCart);
    setCartValues();  
});