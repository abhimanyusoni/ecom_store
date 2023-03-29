import { IpcRenderer, contextBridge, ipcRenderer } from "electron";
import { cpus } from "os";

let indexBridge = {
  getAllInitialData: async () => {
    let result = await ipcRenderer.invoke("getInitialData");
    return result;
  },
  fetchAsyncData: async () => {
    let result = await ipcRenderer.invoke("fetchWithAxios");
    return result;
  },
  fetchProductDetailData: async (id: number) => {
    let result = await ipcRenderer.invoke("productDetails", id);
    return result;
  },
  goToDetailsPage: (response: any) => {
    ipcRenderer.invoke("goToDetails", response);
  },
  goToBackPage: (lastPage: any) => {
    ipcRenderer.invoke("goToBack", lastPage);
  },
  goToAnyPage: (page: any) => {
    ipcRenderer.invoke("goToAnyPage", page)
  },
  getDetailsInDetailPage: () => {
    const cartItems = ipcRenderer.invoke("uhhm");
    ipcRenderer.once("ok", (data, resp) => {
      window.postMessage(resp);
    });
    return cartItems;
  },
  addToCartItems: async (item: any) => {
    const cartItems = await ipcRenderer.invoke("addToCart", item);
    return cartItems;
  },
  removeFromCartItems: async (item: any) => {
    const cartItems = await ipcRenderer.invoke("removeFromCart", item);
    return cartItems;
  },
  addQuantity: (item: any, count: any) => {
    ipcRenderer.invoke("addQuantity", item, count);
  },
  createOrder: async () => {
    const data = await ipcRenderer.invoke("createOrder");
    console.log(data, "created order data in preload");
    return data;
  },
  getCreatedOrderData: async () => {
    const data = await ipcRenderer.invoke("getCreatedOrderData");
    return data;
  },
  resetDataAfterOrderSuccess: () => {
    ipcRenderer.invoke("resetDataAfterOrderSuccess")
  }
}

contextBridge.exposeInMainWorld("indexBridge", indexBridge);
