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
const cartMain = document.getElementById("cart_main");
const cartPageCartCount = document.getElementById("cart-items");
const totalBill = document.getElementById("total_bill");
let cartProducts = [];
let totalBillAmount = 0;
const fetchDetailedProductCart = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const response = yield indexBridge.fetchProductDetailData(id);
    //@ts-ignore
    indexBridge.goToDetailsPage(response);
    localStorage.setItem("lastPageVisited", "./cart.html");
});
const getInitialData = () => __awaiter(void 0, void 0, void 0, function* () {
    const checkCart = (cartProducts) => {
        if (cartProducts.length === 0) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("no_products_found");
            const button = document.createElement("button");
            button.onclick = function () {
                //@ts-ignore
                indexBridge.goToAnyPage("index");
            };
            button.innerHTML = `<ion-icon name="home"></ion-icon> Go to Home`;
            button.classList.add("gotohomebtn");
            newDiv.innerHTML = `
            <div>No products added in cart yet.</div>
            `;
            newDiv.appendChild(button);
            cartMain === null || cartMain === void 0 ? void 0 : cartMain.appendChild(newDiv);
            cartMain === null || cartMain === void 0 ? void 0 : cartMain.classList.add("cart_empty");
        }
        else {
            if (cartMain === null || cartMain === void 0 ? void 0 : cartMain.classList.contains("cart_empty")) {
                cartMain === null || cartMain === void 0 ? void 0 : cartMain.classList.remove("cart_empty");
            }
            else {
                return;
            }
        }
    };
    const removeFromTheCart = (item, quantity) => __awaiter(void 0, void 0, void 0, function* () {
        //@ts-ignore
        const filtered = cartProducts.filter((one) => one.id !== item.id);
        cartProducts = filtered;
        //@ts-ignore
        cartPageCartCount === null || cartPageCartCount === void 0 ? void 0 : cartPageCartCount.innerHTML = cartProducts.length;
        indexBridge.removeFromCartItems(item);
        const getProduct = document.getElementById(`product_${item.id}`);
        cartMain === null || cartMain === void 0 ? void 0 : cartMain.removeChild(getProduct);
        totalBillAmount = totalBillAmount - (item.price * quantity);
        //@ts-ignore
        totalBill === null || totalBill === void 0 ? void 0 : totalBill.innerHTML = `$${Math.round(totalBillAmount)}/- Only`;
        checkCart(cartProducts);
    });
    //@ts-ignore
    const data = yield indexBridge.getAllInitialData();
    console.log(data);
    cartProducts = data;
    //@ts-ignore
    cartPageCartCount === null || cartPageCartCount === void 0 ? void 0 : cartPageCartCount.innerHTML = data.length;
    if ((cartProducts === null || cartProducts === void 0 ? void 0 : cartProducts.length) > 0) {
        cartProducts.forEach((element) => {
            let tempCount = element.quantity ? element.quantity : 1;
            const newDiv = document.createElement("div");
            newDiv.id = `product_${element.id}`;
            const prodTitle = document.createElement("div");
            const btnShow = document.createElement("button");
            btnShow.setAttribute("type", "submit");
            btnShow.setAttribute("class", "add_to_cart");
            btnShow.innerText = "Remove from Cart";
            btnShow.onclick = function () {
                //@ts-ignore
                removeFromTheCart(element, tempCount);
            };
            prodTitle.innerHTML = element.title;
            prodTitle.setAttribute("class", "title");
            prodTitle.onclick = function () {
                fetchDetailedProductCart(element.id);
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
                <div class="quantity">
                    Quantity: <input min="1" type="number" value=${element.quantity ? element.quantity : 1} id=quantity_${element.id} />
                </div>        
            </div>
            <div class="product_pricing">
                <div class="price" id="price">$${element.quantity ? element.price * element.quantity : element.price}</div>
            </div>
            `;
            cartMain === null || cartMain === void 0 ? void 0 : cartMain.appendChild(newDiv);
            const productDetails = newDiv.querySelector(".product_details");
            productDetails === null || productDetails === void 0 ? void 0 : productDetails.insertBefore(prodTitle, productDetails.firstChild);
            productDetails === null || productDetails === void 0 ? void 0 : productDetails.appendChild(btnShow);
            totalBillAmount = totalBillAmount + (element.quantity ? element.price * element.quantity : element.price);
            const productQuantity = newDiv.querySelector(`#quantity_${element.id}`);
            const productPrice = newDiv.querySelector("#price");
            productQuantity.onchange = function () {
                const totalPrice = element.price * parseInt(this.value, 10);
                productPrice.innerHTML = `$${totalPrice}`;
                if (parseInt(this.value, 10) > tempCount) {
                    totalBillAmount = totalBillAmount + element.price;
                }
                else {
                    totalBillAmount = totalBillAmount - element.price;
                }
                //@ts-ignore 
                totalBill === null || totalBill === void 0 ? void 0 : totalBill.innerHTML = `$${Math.round(totalBillAmount)}/- Only`;
                tempCount = parseInt(this.value, 10);
                //@ts-ignore
                indexBridge.addQuantity(element, tempCount);
            };
        });
        //@ts-ignore
        totalBill === null || totalBill === void 0 ? void 0 : totalBill.innerHTML = `$${Math.round(totalBillAmount)}/- Only`;
    }
    else {
        checkCart(cartProducts);
    }
});
getInitialData();
