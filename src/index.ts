import axios from "axios";
import {app, ipcMain, BrowserWindow} from "electron";
import path from "path"

let mainWindow : BrowserWindow;
let productDetails: any;
let cartItems: any = [];
let createdOrderResponse: any = {}

app.on("ready", createWindow);

function createWindow() : void {
    mainWindow = new BrowserWindow({
        width: 1400, height: 800, webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        },
        show: false
    })
    mainWindow.loadFile("./index.html");
    // mainWindow.loadURL("https://www.google.com");
    mainWindow.on("ready-to-show", () => mainWindow.show())
    mainWindow.webContents.openDevTools();
}

ipcMain.handle("getInitialData", async (channel, data) => {
    return cartItems;
})

ipcMain.handle("fetchWithAxios", async (channel, data) => {
    const response = await axios.get("https://dummyjson.com/products");
    console.log(response.data.products, response.data.products.length, cartItems.length, "response.data.length, cartItems.length");
    return {response: response.data.products, cartItems};
    
})
ipcMain.handle("productDetails", async (channel, id) => {
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    return response.data;
})
ipcMain.handle("goToDetails", (channel, resp) => {
    mainWindow.loadFile("./productDetails.html");
    mainWindow.on("ready-to-show", () => mainWindow.show())
    productDetails = resp;
})
ipcMain.handle("goToHome", (channel, resp) => {
    mainWindow.loadFile("./index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show())
})
ipcMain.handle("goToCart", (channel, resp) => {
    mainWindow.loadFile("./cart.html");
    mainWindow.on("ready-to-show", () => mainWindow.show())
});
ipcMain.handle("goToBack", (channel, page) => {
    mainWindow.loadFile(page);
    mainWindow.on("ready-to-show", () => mainWindow.show())
});
ipcMain.handle("goToAnyPage", (channel, page) => {
    mainWindow.loadFile(`./${page}.html`);
    mainWindow.on("ready-to-show", () => mainWindow.show())
})
ipcMain.handle("uhhm", (event) => {
    event.sender.send("ok", {productDetails, cartItems});
});
ipcMain.handle("addToCart", async (channel, item) => {
    const filtered = cartItems.filter((one: any) => one.id === item.id);
    if(filtered.length === 0){
        await cartItems.push(item);
        console.log(cartItems.length, "cartItems");
        return cartItems;
    } else {
        console.log("Product is already in cart");
    }
});
ipcMain.handle("removeFromCart", async (channel, item) => {
    const filtered = cartItems.filter((one: any) => one.id !== item.id);
    cartItems = filtered;  
    console.log(cartItems.length, "cartItems");
    return cartItems;
});
ipcMain.handle("addQuantity", (channel, item, count) => {
    cartItems.forEach((element: any) => {
        if(element.id === item.id){
            element.quantity = count;
        }
    });
    console.log(cartItems.filter((one:any) => one.id === item.id), "filyered");
})
ipcMain.handle("createOrder", async () => {

    let totalAmount = 0;
    let tempObj: any = {};

    cartItems.forEach((item: any) => {
        totalAmount = totalAmount + item.price;
    });

    let count = 1;

    cartItems.forEach((item: any) => {
        Object.keys(item).forEach(key => {
            if(((typeof item[key] === "string" && key === "title") || (typeof item[key] === "string" && key === "description") || (typeof item[key] === "number" && key === "price") || (key === "quantity")) && (Object.keys(tempObj).length < 15)){
                tempObj[`${key}_${count}`] = item[key].length > 255 ? item[key].slice(0, 255) : item[key];
            }
        });
        count = count + 1;
    });

    console.log(tempObj, "tempObj");
    
    
    await axios.post("https://api.razorpay.com/v1/orders", {
        "amount": totalAmount * 80,
        "currency": "INR",
        "receipt": "abhimanyu soni",
        "notes": tempObj
    }, {
        auth: {
            username: "rzp_test_zBVcnUz8M3xAEp",
            password: "0AbvBgPb9cI5tnaLAcoZNqXQ"
        },
    }).then((res) => {
        console.log(res.data, "create order response");
        createdOrderResponse = res.data;
        return res.data;
    }).catch((err) => {
        console.log(err, "create order error");
        return err;
    })
    return createdOrderResponse
})

ipcMain.handle("getCreatedOrderData", async () => {
    return createdOrderResponse;
})

ipcMain.handle("resetDataAfterOrderSuccess", () => {
    cartItems = [];
    createdOrderResponse = {};
    productDetails = {}
})