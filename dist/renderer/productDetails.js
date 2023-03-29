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
const prodDetailsDiv = document.getElementById("product_details_page");
const inCartCountDetails = document.getElementById("cart-items");
let detailPageCartItems = [];
let setRemoved = false;
const getProductDetails = () => {
    //@ts-ignore
    indexBridge.getDetailsInDetailPage();
    window.addEventListener("message", (e) => {
        var _a, _b, _c, _d, _e, _f;
        console.log("Detailed product", e.data);
        if ((_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.productDetails) {
            let product = (_b = e === null || e === void 0 ? void 0 : e.data) === null || _b === void 0 ? void 0 : _b.productDetails;
            const productDetail = document.createElement("div");
            const addToCartBtn = document.createElement("button");
            const filteredInitial = (_d = (_c = e === null || e === void 0 ? void 0 : e.data) === null || _c === void 0 ? void 0 : _c.cartItems) === null || _d === void 0 ? void 0 : _d.filter((one) => { var _a; return one.id === ((_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.productDetails.id); });
            const filteredAfter = detailPageCartItems === null || detailPageCartItems === void 0 ? void 0 : detailPageCartItems.filter((one) => { var _a; return one.id === ((_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.productDetails.id); });
            addToCartBtn.innerHTML = `<ion-icon name="cart"></ion-icon> ${filteredInitial.length > 0 ? "REMOVE FROM CART" : "ADD TO CART"}`;
            addToCartBtn.classList.add("addtocart_details");
            addToCartBtn.onclick = function () {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function* () {
                    if (filteredInitial.length === 0 || (setRemoved && filteredAfter.length === 0)) {
                        //@ts-ignore
                        const cartItemsInner = yield indexBridge.addToCartItems((_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.productDetails);
                        inCartCountDetails === null || inCartCountDetails === void 0 ? void 0 : inCartCountDetails.innerHTML = cartItemsInner.length;
                        addToCartBtn.innerHTML = `<ion-icon name="cart"></ion-icon> REMOVE FROM CART`;
                        detailPageCartItems = cartItemsInner;
                        setRemoved = false;
                    }
                    else {
                        //@ts-ignore
                        const cartItemsInner = yield indexBridge.removeFromCartItems((_b = e === null || e === void 0 ? void 0 : e.data) === null || _b === void 0 ? void 0 : _b.productDetails);
                        inCartCountDetails === null || inCartCountDetails === void 0 ? void 0 : inCartCountDetails.innerHTML = cartItemsInner.length;
                        addToCartBtn.innerHTML = `<ion-icon name="cart"></ion-icon> ADD TO CART`;
                        detailPageCartItems = cartItemsInner;
                        setRemoved = true;
                    }
                });
            };
            productDetail.classList.add("product_detail_wrapper");
            productDetail.innerHTML = `
                <div class="prod_img"><img width="300" src=${product.images[0]} ></div>
                <div class="product_details">
                    <div class="title">${product.title}</div>
                    <div class="rating-count">
                        <div class="rating ${product.rating >= 3.5 ? "good" : product.rating < 3.5 && product.rating > 2.5 ? "average" : "ok"}">${product.rating} <ion-icon name="star"></ion-icon></div>
                    </div>
                    <div class="price">$${product.price}</div>
                    <div class="desc">${product.description}</div> 
                    <div class="offers">
                        <ul>
                            <li><ion-icon name="pricetag"></ion-icon><strong>Bank Offer</strong> 5% Cashback on Flipkart Axis Bank Card <a href="javascript:void(0)">T&C</a></li>
                            <li><ion-icon name="pricetag"></ion-icon>Buy this Product and Get Extra ₹500 Off on Bikes & Scooters <a href="javascript:void(0)">T&C</a></li>
                            <li><ion-icon name="pricetag"></ion-icon><strong>Partner Offer</strong> Buy this product and get upto ₹500 off <a href="javascript:void(0)">Know More</a></li>
                            <li><ion-icon name="pricetag"></ion-icon><strong>Combo Offer</strong> Buy 3 items save 3%; Buy 4 save 4%; Buy 5+ save 5%See all products <a href="javascript:void(0)">T&C</a></li>
                        </ul>
                    </div>
                </div>
            `;
            prodDetailsDiv === null || prodDetailsDiv === void 0 ? void 0 : prodDetailsDiv.appendChild(productDetail);
            const productDetails = productDetail.querySelector(".product_details");
            productDetails === null || productDetails === void 0 ? void 0 : productDetails.appendChild(addToCartBtn);
        }
        ;
        if ((_e = e === null || e === void 0 ? void 0 : e.data) === null || _e === void 0 ? void 0 : _e.cartItems) {
            //@ts-ignore
            inCartCountDetails === null || inCartCountDetails === void 0 ? void 0 : inCartCountDetails.innerHTML = (_f = e === null || e === void 0 ? void 0 : e.data) === null || _f === void 0 ? void 0 : _f.cartItems.length;
        }
    });
};
getProductDetails();
