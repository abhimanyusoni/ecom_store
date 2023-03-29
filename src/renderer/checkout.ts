const checkoutButton = document.getElementById("checkout_button");
const formName = <HTMLInputElement>document.getElementById("form_name");
const formEmail = <HTMLInputElement>document.getElementById("form_email");
const formNumber = <HTMLInputElement>document.getElementById("form_number");
const formAddress1 = <HTMLInputElement>document.getElementById("form_address1");
const formAddress2 = <HTMLInputElement>document.getElementById("form_address2");
const formLandmark = <HTMLInputElement>document.getElementById("form_landmark");
const formPincode = <HTMLInputElement>document.getElementById("form_pincode");

formName.onchange = () => {
    const errField = document.getElementById("err_name");
    if(formName.value){
        //@ts-ignore
        errField?.innerText = ""
    } else {
        //@ts-ignore
        errField?.innerText = "Please fill the name."
    }
}
formEmail.onchange = () => {
    const errField = document.getElementById("err_email");
    if(formEmail.value){
        //@ts-ignore
        errField?.innerText = ""
    } else {
        //@ts-ignore
        errField?.innerText = "Please fill the email."
    }
}
formNumber.onchange = () => {
    const errField = document.getElementById("err_phone");
    if(formNumber.value){
        //@ts-ignore
        errField?.innerText = ""
    } else {
        //@ts-ignore
        errField?.innerText = "Please fill the phone."
    }
}
formAddress1.onchange = () => {
    const errField = document.getElementById("err_address1");
    if(formAddress1.value){
        //@ts-ignore
        errField?.innerText = ""
    } else {
        //@ts-ignore
        errField?.innerText = "Please fill the address1."
    }
}
formAddress2.onchange = () => {
    const errField = document.getElementById("err_address2");
    if(formAddress2.value){
        //@ts-ignore
        errField?.innerText = ""
    } else {
        //@ts-ignore
        errField?.innerText = "Please fill the address2."
    }
}
formLandmark.onchange = () => {
    const errField = document.getElementById("err_landmark");
    if(formLandmark.value){
        //@ts-ignore
        errField?.innerText = ""
    } else {
        //@ts-ignore
        errField?.innerText = "Please fill the landmark."
    }
}
formPincode.onchange = () => {
    const errField = document.getElementById("err_pincode");
    if(formPincode.value){
        //@ts-ignore
        errField?.innerText = ""
    } else {
        //@ts-ignore
        errField?.innerText = "Please fill the pincode."
    }
}

const handleSubmitForm = (e: any) => {
    e.preventDefault();
    const dataToSend = {
        name: formName.value,
        email: formEmail.value,
        phone: formNumber.value,
        address1: formAddress1.value,
        address2: formAddress2.value,
        landmark: formLandmark.value,
        pincode: formPincode.value,
    }

    Object.entries(dataToSend).forEach(entry => {
        const errField = document.getElementById(`err_${entry[0]}`);

        if(entry[1] === "" || entry[1] === null || entry[1] === undefined){
            //@ts-ignore
            errField?.innerText = `Please fill the ${entry[0]}.`;
        } else {
            //@ts-ignore
            errField?.innerText = "";
        }
    });

    if(formName.value && formEmail.value && formNumber.value && formAddress1.value && formAddress2.value && formLandmark.value && formPincode.value){
        console.log(dataToSend, "form data");
    }

}

let options: any = {};

const createItemResponse = async () => {
    //@ts-ignore
    const data = await indexBridge.getCreatedOrderData(); const cartItems = await indexBridge.getAllInitialData();

    const cartCount = document.getElementById("cart-items");
    //@ts-ignore
    cartCount?.innerHTML = cartItems.length;

    console.log(data, "createdOrderResp in checkout page");  

    options.key = "rzp_test_zBVcnUz8M3xAEp", // Enter the Key ID generated from the Dashboard
    options.amount = data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    options.currency = data.currency,
    options.name = "Flipkart Pay", //your business name
    options.description = "Test Transaction",
    options.image = "https://example.com/your_logo",
    options.order_id = data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    options.callback_url = "https://eneqd3r9zrjok.x.pipedream.net/",
    options.notes = {
        address: "Razorpay Corporate Office",
    },
    options.theme = {
        color: "#3399cc",
    },
    // Your Razorpay Payment ID is, ${response.razorpay_payment_id}, order ID is, ${response.razorpay_order_id} and Razorpay Signature is, ${response.razorpay_signature}
    options.handler = function (response: any){
        alert("PAYMENT SUCCESSFULL !!");
        //@ts-ignore
        indexBridge.goToAnyPage("paymentSuccess");
    }

    console.log(options, "options");

    checkoutButton?.addEventListener("click", async function (e) {
        e.preventDefault();
        handleSubmitForm(e);
        if(formName.value && formEmail.value && formNumber.value && formAddress1.value && formAddress2.value && formLandmark.value && formPincode.value){
            options.prefill = {
                name: formName.value !== "" ? formName.value : "", //your customer's name
                email: formEmail.value !== "" ? formEmail.value : "",
                contact: formNumber.value !== "" ? formNumber.value : "",
            };
            //@ts-ignore
            let rzp1 = new Razorpay(options);
            //@ts-ignore
            await rzp1.open();
            await rzp1.on("payment.success", function(response: any){
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);
            })   
        }
    })
    
}

createItemResponse();