// dom nodes
let root = document.getElementById("root");
let cart = document.getElementById("cart");
let cartListRoot = document.getElementById("cart-list-container");
let home = document.getElementById("home")
let filterContainer = document.querySelector('.filter');
let category = document.getElementById('category');

let cards;
let products;
let filterInputs;

let shop = []
let categoris = []
let selected = [];



// functions 

fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(res => data = res)
    .then(Json => render(Json))
        
    .catch(() => alert("failed to fetch products"));

fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(json => categoris = json)
    .then(json => renderFilter());



function render(item) {

    let template = item.map(product => {

        if ((product.title).length >= 19) {
            product.title = product.title.slice(0, 19)
            product.title += "..."
        }
        return `
        <div class="card" id="${product.id}">
            <img src="${product.image}" alt="">

            <div class="card__desc">
                <h4>${product.title}</h4>
                <p>${product.price} $</p>
               
            </div>
        </div>

        `
    }).join("");

    root.innerHTML = template;

    cards = document.querySelectorAll(".card");
    for (const card of cards) {
        card.addEventListener("click", singleProductRequest);
    }
}


function renderFilter() {

    let temp = categoris.map((category, index) => {

        return `
        <li>
              <label for="${index}">${category}</label>
              <input class="filter-input" type="checkbox" value="${category}" id="${index}">
        </li>
        `
    }).join('')

    category.innerHTML = temp;

    filterInputs = document.querySelectorAll('.filter-input')
    for (const inp of filterInputs) {
        inp.addEventListener('change', filter)
    }
}

function filter() {
    let checked = [];
    let filtered = [];
    let temp = [];

    for (const inp of filterInputs) {
        if (inp.checked) checked.push(inp.value)
    }

    if (!checked.length) checked = categoris;

    for (let i = 0; i < categoris.length; i++) {
        if (checked.includes(categoris[i])) {
            fetch(`https://fakestoreapi.com/products/category/${categoris[i]}`)
                .then(res => res.json())
                .then(json => filtered = json)
                .then(json => temp.push(...filtered))
                .then(json => render(temp))
        }

    }


}


function singleProductRequest() {
    let id = this.getAttribute("id")
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(json => renderSingleProduct(json))
        .catch(() => console.log("failed to fetch single product"));

}

function renderSingleProduct(item) {

    root.classList.add("single-product");
    root.innerHTML = `
    <img src=${item.image}>
    <div class="single-product__desc" id="${item.id}">
        <h3 class="single-product__desc__category">category : <span id="category">${item.category}</span></h3>
        <h3 class="single-product__desc__detail">${item.title}</h3>
        <p>${item.description}</p>
        <h3 class="single-product__desc__detail">price: ${item.price} $</h3>
        <button class="single-product__desc__btn">add to cart</button>
    </div>
    `
    root.classList.add("single-product");

    products = document.querySelector(".single-product__desc__btn");
    for (const product of products) {
        product.addEventListener("click", addToCart)
    }

}

function renderCartList(list) {
    let template = list.map(item => {
        return `
        <div class="cart__item">
            <img src="${item.image}" alt="" class="cart__item__image">
            <div class="cart__item__desc">
                <h2 class="cart__item__desc__title">${item.title}</h2>
                <span class="cart__item__desc__price">${item.price} $</span>
            </div>
        </div>
        `
    }).join("")

    cartListRoot.innerHTML = template
}
function ShowCart() {
   let ids = [];
   fetch('https://fakestoreapi.com/carts/5')
   .then(res => res.json())
   .then(json => json.products.forEach(item => {
    ids.push(item.productID);
   }))
   .then(function req (){
    fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(json => json.filter(item => {
        return ids.includes(item.id)
    }))
    .then(data => render(data))
   })
 
}


function Home() {
    root.innerHTML = ""
    root.classList.remove("single-product")
    root.classList.add("root")
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(json => render(json));


}


// events

home.addEventListener("click", Home);
cart.addEventListener("click", ShowCart);
