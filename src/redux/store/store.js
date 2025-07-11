import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import productsReducer from "../slices/products/productsSlice";
import categoriesReducer from "../slices/categories/categoriesSlice";
import brandsReducer from "../slices/categories/brandsSlice";
import colorsReducer from "../slices/categories/colorsSlice";

//store
const store = configureStore({
    reducer: {
        users: usersReducer,
        products: productsReducer,
        categories: categoriesReducer,
        brands: brandsReducer,
        colors: colorsReducer,
    },
    devTools: {
        name: "My Redux App",    // Custom name for the DevTools instance
        maxAge: 50,              // Maximum actions to be stored in history
        trace: true,             // Enable stack trace for actions
        traceLimit: 25,          // Limit the depth of trace
    },
});
export default store;