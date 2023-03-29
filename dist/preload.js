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
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let indexBridge = {
    getAllInitialData: () => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield electron_1.ipcRenderer.invoke("getInitialData");
        return result;
    }),
    fetchAsyncData: () => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield electron_1.ipcRenderer.invoke("fetchWithAxios");
        return result;
    }),
    fetchProductDetailData: (id) => __awaiter(void 0, void 0, void 0, function* () {
        let result = yield electron_1.ipcRenderer.invoke("productDetails", id);
        return result;
    }),
    goToDetailsPage: (response) => {
        electron_1.ipcRenderer.invoke("goToDetails", response);
    },
    goToBackPage: (lastPage) => {
        electron_1.ipcRenderer.invoke("goToBack", lastPage);
    },
    goToAnyPage: (page) => {
        electron_1.ipcRenderer.invoke("goToAnyPage", page);
    },
    getDetailsInDetailPage: () => {
        const cartItems = electron_1.ipcRenderer.invoke("uhhm");
        electron_1.ipcRenderer.once("ok", (data, resp) => {
            window.postMessage(resp);
        });
        return cartItems;
    },
    addToCartItems: (item) => __awaiter(void 0, void 0, void 0, function* () {
        const cartItems = yield electron_1.ipcRenderer.invoke("addToCart", item);
        return cartItems;
    }),
    removeFromCartItems: (item) => __awaiter(void 0, void 0, void 0, function* () {
        const cartItems = yield electron_1.ipcRenderer.invoke("removeFromCart", item);
        return cartItems;
    }),
    addQuantity: (item, count) => {
        electron_1.ipcRenderer.invoke("addQuantity", item, count);
    },
    createOrder: () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield electron_1.ipcRenderer.invoke("createOrder");
        console.log(data, "created order data in preload");
        return data;
    }),
    getCreatedOrderData: () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield electron_1.ipcRenderer.invoke("getCreatedOrderData");
        return data;
    }),
    resetDataAfterOrderSuccess: () => {
        electron_1.ipcRenderer.invoke("resetDataAfterOrderSuccess");
    }
};
electron_1.contextBridge.exposeInMainWorld("indexBridge", indexBridge);
