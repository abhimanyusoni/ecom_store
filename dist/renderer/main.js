"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const productListDiv = document.getElementById("product_list");
const inCartCount = document.getElementById("cart-items");
//@ts-ignore
let cartItems = [];
let initialFetchedProducts;
const checkIfInCart = (item) => {
    //@ts-ignore
    if (cartItems.includes(item)) {
        return true;
    }
    else {
        return false;
    }
};
const addToCartItems = (item) => {
    cartItems.push(item);
    //@ts-ignore
    inCartCount === null || inCartCount === void 0 ? void 0 : inCartCount.innerHTML = cartItems.length;
    indexBridge.addToCartItems(item);
};
const removeFromTheCart = (item) => {
    //@ts-ignore
    const filtered = cartItems.filter((one) => one.id !== item.id);
    cartItems = filtered;
    //@ts-ignore
    inCartCount === null || inCartCount === void 0 ? void 0 : inCartCount.innerHTML = cartItems.length;
    indexBridge.removeFromCartItems(item);
};
const fetchDetailedProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const response = yield indexBridge.fetchProductDetailData(id);
    //@ts-ignore
    indexBridge.goToDetailsPage(response);
    localStorage.setItem("lastPageVisited", "./index.html");
});
const fetchAsyncData = () => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const loader = document.createElement("div");
    loader.setAttribute("class", "loader");
    loader.innerHTML = `<ion-icon name="reload-sharp"></ion-icon>`;
    productListDiv === null || productListDiv === void 0 ? void 0 : productListDiv.appendChild(loader);
    //@ts-expect-error
    const response = yield indexBridge.fetchAsyncData();
    console.log(response, "dskjbsdjkdsbfdsjkfbsdfdsfs");
    if (response && response.cartItems) {
        productListDiv === null || productListDiv === void 0 ? void 0 : productListDiv.removeChild(loader);
        //@ts-ignore
        inCartCount === null || inCartCount === void 0 ? void 0 : inCartCount.innerHTML = response.cartItems.length;
        cartItems = response.cartItems;
    }
    initialFetchedProducts = response.response;
    initialFetchedProducts.forEach((element) => {
        const newDiv = document.createElement("div");
        const btnShow = document.createElement("button");
        const prodTitle = document.createElement("div");
        prodTitle.innerHTML = element.title;
        prodTitle.setAttribute("class", "title");
        prodTitle.onclick = function () {
            fetchDetailedProduct(element.id);
        };
        btnShow.setAttribute("type", "submit");
        btnShow.setAttribute("class", "add_to_cart");
        const filtered = response.cartItems.filter((one) => one.id === element.id);
        btnShow.innerText = filtered.length > 0 ? "Remove from Cart" : "Add to Cart";
        btnShow.onclick = function () {
            //@ts-ignore
            const filtered = cartItems.filter((one) => one.id === element.id);
            if (filtered.length === 0) {
                addToCartItems(element);
                if (checkIfInCart(element) === true) {
                    btnShow.innerText = "Remove from Cart";
                    btnShow.classList.add("already-added");
                }
            }
            else {
                removeFromTheCart(element);
                if (checkIfInCart(element) === false) {
                    btnShow.innerText = "Add to Cart";
                    btnShow.classList.remove("already-added");
                }
            }
        };
        newDiv.classList.add("product_one");
        newDiv.innerHTML = `
        <div class="image">
            <img width="120" src=${element.images[0]}>
        </div>
        <div class="product_details">
            <div class="rating-count">
                <div class="rating ${element.rating >= 3.5 ? "good" : element.rating < 3.5 && element.rating > 2.5 ? "average" : "ok"}">${element.rating} <ion-icon name="star"></ion-icon></div>
            </div>
            <div class="desc">${element.description}</div>        
        </div>
        <div class="product_pricing">
            <div class="price">$${element.price}</div>
        </div>
        `;
        newDiv.appendChild(btnShow);
        newDiv.appendChild(prodTitle);
        productListDiv === null || productListDiv === void 0 ? void 0 : productListDiv.appendChild(newDiv);
        const productDetails = newDiv.querySelector(".product_details");
        const productImg = newDiv.querySelector(".image");
        productDetails === null || productDetails === void 0 ? void 0 : productDetails.insertBefore(prodTitle, productDetails.firstChild);
        //@ts-ignore
        productImg.onclick = function () {
            fetchDetailedProduct(element.id);
        };
    });
});
fetchAsyncData();
