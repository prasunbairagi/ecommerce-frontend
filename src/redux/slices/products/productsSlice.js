import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";
//initialState
const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

//create product action
export const createProductAction = createAsyncThunk(
  "product/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        console.log("create product action", payload);
        try {
            const { name, description, category, sizes, brand, colors, price, totalQty, file } = payload;
            //make request to server
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
            //FormData (object to keep key value pairs)
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("brand", brand);
            
            formData.append("price", price);
            formData.append("totalQty", totalQty);
            sizes.forEach((size) => {
                formData.append("sizes", size);
            });
            colors.forEach((color) => {
                formData.append("colors", color);
            });
            file.forEach((file) => {
                formData.append("file", file);
            });
            // formData.append("file", file[0]);
            const {data} = await axios.post(
                `${baseURL}/products`, 
                formData,
                config
            );
            return data;
        } catch (error) {
            console.log("create product action error", error);
            return rejectWithValue(error?.response?.data?.message || error.message);
        }
    }
);
//fetch products action
export const fetchProductsAction = createAsyncThunk(
    "product/list",
    async ({ page = 1, limit = 10 }, { rejectWithValue, getState }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const url = `${baseURL}/products?page=${page}&limit=${limit}`;
            const { data } = await axios.get(url, config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);
//fetch product action
export const fetchProductAction = createAsyncThunk(
    "product/details",
    async (productId, { rejectWithValue, getState, dispatch }) => {
        try {
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            };

            const { data } = await axios.get(
            `${baseURL}/products/${productId}`,
            config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);
//slice
const productsSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        // create product
        builder.addCase(createProductAction.pending, (state) => {
                state.loading = true;
        });
        builder.addCase(createProductAction.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
                state.products.push(action.payload);
                state.isAdded = true;
        });
        builder.addCase(createProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.isAdded = false;
            state.error = action.payload;
        });
        //fetch all
        builder.addCase(fetchProductsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProductsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
            state.isAdded = true;
        });
        builder.addCase(fetchProductsAction.rejected, (state, action) => {
            state.loading = false;
            state.products = null;
            state.isAdded = false;
            state.error = action.payload;
        });
        //fetch single product
        builder.addCase(fetchProductAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
            state.isAdded = true;
        });
        builder.addCase(fetchProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.isAdded = false;
            state.error = action.payload;
        });
        //reset success
        builder.addCase(resetSuccessAction.pending, (state, action) => {
                state.isAdded = false;
        });
        //reset error
        builder.addCase(resetErrAction.pending, (state, action) => {
                state.error = null;
        });
    },
});

// export const { resetStatusFlags } = productsSlice.actions;
//generate the reducer
const productsReducer = productsSlice.reducer;
export default productsReducer;