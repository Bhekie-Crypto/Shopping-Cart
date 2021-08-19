//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const btns = document.querySelector("bag-btn");
checkOutBtn = document.querySelector(".checkout-btn")

//cart
let cart = [];

//buttons
buttonsDOM = [];

//getting products
class Products {
  async getProducts() {
    try{

    let response = await fetch("list");
      let products = await response.json();
      products = products.map(item => {
        const title = item.title;
        const price = item.price;
        const id = item.id;
        const image = item.image;
        const insideCart = item.insideCart;
        return {title, price, id, image, insideCart};
        
    });

      return products;


    } catch (error) {
      console.log(error);
    } 
  }
  
}


// display products
class UI{
  displayProducts(products) {
    
         let html = "";
         products.forEach(order => {
                 html += `
             <article class="product">
             <div class="img-container">
                 <img src=${order.image} alt="product" class="product-img">
                 <button class="bag-btn" data-id=${order.id}>
                     <i class="fas fa-shopping-cart"></i>
                     add to bag
                 </button>
             </div>
             <h3>${order.title}</h3>
             <h4>$${order.price}</h4>
         </article>
             `;
         });
         productsDOM.innerHTML = html;
     }
     getBagButtons() {
         const buttons = [...document.querySelectorAll(".bag-btn")];
          buttonsDOM = buttons;
         
          buttons.forEach(button => {
             let id = button.dataset.id;
             let inCart = cart.find(item => item.id === id);
            
             function getById(id, cart) {
              return cart.filter(function(obj) {
                if(obj.id == id) {
                  return obj 
                }
              })[0]
            }
            inCart = getById(id, cart);
             if(inCart) {
                 button.innerText = "In Cart";
                 button.disabled = true;
               
             } 
             
                 button.addEventListener("click", event => {
                     event.target.innerText = "In Cart";
                     event.target.disabled = true;
 
                     //get product from products
                     let cartItem = {...Storage.getProduct(id)};
                    
                     //add product to the cart
                     cart = [...cart,cartItem];
                     
                     //save cart to the local storage
                     Storage.saveCart(cart);
                     //set cart value
                     this.setCartValues(cart);
                     //display cart item
                     this.addCartItem(cartItem);
                     //show the cart
                     this.showCart();
                 });
         });
     }

    
 setCartValues() {
     let tempTotal = 0;
     let itemsTotal = 0;
     cart.map(item => {
         tempTotal += item.price * item.insideCart;
         itemsTotal += item.insideCart;
        
     })
     cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
     cartItems.innerText = itemsTotal;
    
     
 }
addCartItem(item) {
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.innerHTML = ` <img src=${item.image} alt="">
      
  <div>
      <h4>${item.title}</h4>
      <h5>$${item.price}</h5>
      <span class="remove-item" data-id=${item.id}>remove</span>
  </div>
  <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="item-amount">${item.insideCart}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
  </div>
  `;
  cartContent.appendChild(div);
 
}
showCart(){
  cartOverlay.classList.add('transparentBcg');
  cartDOM.classList.add('showCart');
}
setUpAPP(){
  cart = Storage.getCart();
  this.setCartValues(cart);
  this.populateCart(cart);
  cartBtn.addEventListener("click", this.showCart);
  closeCartBtn.addEventListener("click", this.hideCart)
}
populateCart(cart) {
  cart.forEach(item => this.addCartItem(item));
}
hideCart(){
  cartOverlay.classList.remove('transparentBcg');
  cartDOM.classList.remove('showCart');   
}
cartLogic() {
  //clear cart button
  clearCartBtn.addEventListener("click", () => {
      this.clearCart();
  });

   //move to checkout
   checkOutBtn.addEventListener("click", () => {
   
    location.href = "checkout";
});

   //cart functionality
   cartContent.addEventListener("click", event => {

    
       if(event.target.classList.contains("remove-item")) {
          let removeItem = event.target;
          let id = removeItem.dataset.id;
          let tempItem = cart.find(item => item.id === id);
          function getById(id, cart) {
            return cart.filter(function(obj) {
              if(obj.id == id) {
                return obj 
              }
            })[0]
          }
        
          tempItem = getById(id, cart);
         
         
           
          tempItem.insideCart = tempItem.insideCart - 1;
          
          cartContent.removeChild(removeItem.parentElement.parentElement);
          this.removeItem(id);
        
       } else if(event.target.classList.contains("fa-chevron-up")) {
          let addAmount = event.target;
          let id = addAmount.dataset.id;
          let tempItem = cart.find(item => item.id === id);
          function getById(id, cart) {
            return cart.filter(function(obj) {
              if(obj.id == id) {
                return obj 
              }
            })[0]
          }
        
          tempItem = getById(id, cart);
         
          tempItem.insideCart = tempItem.insideCart + 1;
          Storage.saveCart(cart);
          this.setCartValues(cart);
          addAmount.nextElementSibling.innerText = tempItem.insideCart;
       } else if (event.target.classList.contains("fa-chevron-down")) {
           let lowerAmount = event.target;
           let id = lowerAmount.dataset.id;
           let tempItem = cart.find(item => item.id === id);
           function getById(id, cart) {
            return cart.filter(function(obj) {
              if(obj.id == id) {
                return obj 
              }
            })[0]
          }
        
          tempItem = getById(id, cart);

           tempItem.insideCart = tempItem.insideCart - 1;
           if (tempItem.insideCart >= 1) {
              Storage.saveCart(cart);
              this.setCartValues(cart);
              lowerAmount.previousElementSibling.innerText = tempItem.insideCart;
           } else {
               cartContent.removeChild(lowerAmount.parentElement.parentElement);
               this.removeItem(id);
           }

       }
   })
}     
clearCart() {
  let cartItems = cart.map(item => item.id);
  cartItems.forEach(id => this.removeItem(id));
  while(cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0])
  }
  this.hideCart();
  
}

removeItem(id){
  let button = this.getSingleButton(id);
  button.disabled = false;
  button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
  cart = cart.filter(button => button.id !== id);
  let customCart = [];
  if(cart.length !== 0)
  {
    for(let key in cart)
    {
      if(cart[key]['insideCart'] === 1)
      {
        customCart.push(cart[key])
      }
    }
  }
  this.setCartValues(customCart);
  Storage.saveCart(customCart);
  // location.reload();
}

getSingleButton(id) {
  let res = "";
   buttonsDOM.forEach(button => {
    button.dataset.id = id;
    let inCart = cart.find(item => item.id === id);
   
    function getById(id, cart) {
     return cart.filter(function(obj) {
       if(obj.id == id) {
         return obj 
       }
     })[0]
   }
   inCart = getById(id, cart);
  
    if(inCart) {
       res = button;
       
    } 
    
  })
  return res;
 }
}

//local storage
class Storage{
  static saveProducts(products) {

      localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
      let products = JSON.parse(localStorage.getItem("products"));
   
      function getById(id, products) {
        return products.filter(function(obj) {
          if(obj.id == id) {
            return obj 
          }
        })[0]
      }
    
     products = getById(id, products);
     return products
   
  }
  static saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
  }
  static removeCart(cart) {
    localStorage.removeItem(''+cart+'');
}
  static getCart(){
      return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[]
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //set up app
  ui.setUpAPP();
  //get all products
  products.getProducts().then(products => {
  ui.displayProducts(products);
  Storage.saveProducts(products);
  }).then(() => {
      ui.getBagButtons();
      ui.cartLogic();
  });
});


