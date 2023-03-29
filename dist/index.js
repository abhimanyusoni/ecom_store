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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow;
let productDetails;
let cartItems = [];
let createdOrderResponse = {};
electron_1.app.on("ready", createWindow);
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400, height: 800, webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path_1.default.join(__dirname, "preload.js")
        },
        show: false
    });
    mainWindow.loadFile("./index.html");
    // mainWindow.loadURL("https://www.google.com");
    mainWindow.on("ready-to-show", () => mainWindow.show());
    mainWindow.webContents.openDevTools();
}
electron_1.ipcMain.handle("getInitialData", (channel, data) => __awaiter(void 0, void 0, void 0, function* () {
    return cartItems;
}));
electron_1.ipcMain.handle("fetchWithAxios", (channel, data) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get("https://dummyjson.com/products");
    console.log(response.data.products, response.data.products.length, cartItems.length, "response.data.length, cartItems.length");
    return { response: response.data.products, cartItems };
}));
electron_1.ipcMain.handle("productDetails", (channel, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`https://dummyjson.com/products/${id}`);
    return response.data;
}));
electron_1.ipcMain.handle("goToDetails", (channel, resp) => {
    mainWindow.loadFile("./productDetails.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
    productDetails = resp;
});
electron_1.ipcMain.handle("goToHome", (channel, resp) => {
    mainWindow.loadFile("./index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
});
electron_1.ipcMain.handle("goToCart", (channel, resp) => {
    mainWindow.loadFile("./cart.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
});
electron_1.ipcMain.handle("goToBack", (channel, page) => {
    mainWindow.loadFile(page);
    mainWindow.on("ready-to-show", () => mainWindow.show());
});
electron_1.ipcMain.handle("goToAnyPage", (channel, page) => {
    mainWindow.loadFile(`./${page}.html`);
    mainWindow.on("ready-to-show", () => mainWindow.show());
});
electron_1.ipcMain.handle("uhhm", (event) => {
    event.sender.send("ok", { productDetails, cartItems });
});
electron_1.ipcMain.handle("addToCart", (channel, item) => __awaiter(void 0, void 0, void 0, function* () {
    const filtered = cartItems.filter((one) => one.id === item.id);
    if (filtered.length === 0) {
        yield cartItems.push(item);
        console.log(cartItems.length, "cartItems");
        return cartItems;
    }
    else {
        console.log("Product is already in cart");
    }
}));
electron_1.ipcMain.handle("removeFromCart", (channel, item) => __awaiter(void 0, void 0, void 0, function* () {
    const filtered = cartItems.filter((one) => one.id !== item.id);
    cartItems = filtered;
    console.log(cartItems.length, "cartItems");
    return cartItems;
}));
electron_1.ipcMain.handle("addQuantity", (channel, item, count) => {
    cartItems.forEach((element) => {
        if (element.id === item.id) {
            element.quantity = count;
        }
    });
    console.log(cartItems.filter((one) => one.id === item.id), "filyered");
});
electron_1.ipcMain.handle("createOrder", () => __awaiter(void 0, void 0, void 0, function* () {
    let totalAmount = 0;
    let tempObj = {};
    cartItems.forEach((item) => {
        totalAmount = totalAmount + item.price;
    });
    let count = 1;
    cartItems.forEach((item) => {
        Object.keys(item).forEach(key => {
            if (((typeof item[key] === "string" && key === "title") || (typeof item[key] === "string" && key === "description") || (typeof item[key] === "number" && key === "price") || (key === "quantity")) && (Object.keys(tempObj).length < 15)) {
                tempObj[`${key}_${count}`] = item[key].length > 255 ? item[key].slice(0, 255) : item[key];
            }
        });
        count = count + 1;
    });
    console.log(tempObj, "tempObj");
    yield axios_1.default.post("https://api.razorpay.com/v1/orders", {
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
    });
    return createdOrderResponse;
}));
electron_1.ipcMain.handle("getCreatedOrderData", () => __awaiter(void 0, void 0, void 0, function* () {
    return createdOrderResponse;
}));
electron_1.ipcMain.handle("resetDataAfterOrderSuccess", () => {
    cartItems = [];
    createdOrderResponse = {};
    productDetails = {};
});
