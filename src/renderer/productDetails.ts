const prodDetailsDiv = document.getElementById("product_details_page");
const inCartCountDetails = document.getElementById("cart-items");

let detailPageCartItems: any = [];
let setRemoved = false;

const getProductDetails =  () => {
    //@ts-ignore
    indexBridge.getDetailsInDetailPage();
    window.addEventListener("message", (e) => {
        console.log("Detailed product", e.data);
        if(e?.data?.productDetails){
            let product = e?.data?.productDetails;
            const productDetail = document.createElement("div");
            const addToCartBtn = document.createElement("button");
            const filteredInitial = e?.data?.cartItems?.filter((one: any) => one.id === e?.data?.productDetails.id);
            const filteredAfter = detailPageCartItems?.filter((one: any) => one.id === e?.data?.productDetails.id);
            addToCartBtn.innerHTML = `<ion-icon name="cart"></ion-icon> ${filteredInitial.length > 0 ? "REMOVE FROM CART" : "ADD TO CART"}`;
            addToCartBtn.classList.add("addtocart_details")
            addToCartBtn.onclick = async function(){
                if(filteredInitial.length === 0 || (setRemoved && filteredAfter.length === 0)){
                    //@ts-ignore
                    const cartItemsInner = await indexBridge.addToCartItems(e?.data?.productDetails); inCartCountDetails?.innerHTML = cartItemsInner.length; addToCartBtn.innerHTML = `<ion-icon name="cart"></ion-icon> REMOVE FROM CART`;
                    detailPageCartItems = cartItemsInner;
                    setRemoved = false;
                } else {
                    //@ts-ignore
                    const cartItemsInner = await indexBridge.removeFromCartItems(e?.data?.productDetails); inCartCountDetails?.innerHTML = cartItemsInner.length; addToCartBtn.innerHTML = `<ion-icon name="cart"></ion-icon> ADD TO CART`;
                    detailPageCartItems = cartItemsInner;
                    setRemoved = true;
                }
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
            prodDetailsDiv?.appendChild(productDetail);
            const productDetails = productDetail.querySelector(".product_details");
            productDetails?.appendChild(addToCartBtn);
        };
        if(e?.data?.cartItems){
            //@ts-ignore
            inCartCountDetails?.innerHTML = e?.data?.cartItems.length
        }
    })
}




getProductDetails();

