import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
//initialState
const initialState = {
    brands: [],
    brand: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

//create brand action
export const createBrandsAction = createAsyncThunk(
  "brand/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name } = payload;
            // make request to server
            // token- authenication
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const {data} = await axios.post(
                `${baseURL}/brands`, 
                { name },
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
//fetch brand action
export const fetchBrandsAction = createAsyncThunk(
  "brand/fetchAll",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const {data} = await axios.get( `${baseURL}/brands` );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

//slice
const brandsSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        // create brands
        builder.addCase(createBrandsAction.pending, (state) => {
                state.loading = true;
        })
        builder.addCase(createBrandsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.brand = action.payload;
                state.brands.push(action.payload);
                state.isAdded = true;
        })
        builder.addCase(createBrandsAction.rejected, (state, action) => {
                state.loading = false;
                state.brand = null;
                state.isAdded = false;
                state.error = action.payload;
        });
        // fetch all brands
        builder.addCase(fetchBrandsAction.pending, (state) => {
                state.loading = true;
        })
        builder.addCase(fetchBrandsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
                state.isAdded = true;
        })
        builder.addCase(fetchBrandsAction.rejected, (state, action) => {
                state.loading = false;
                state.brands = null;
                state.isAdded = false;
                state.error = action.payload;
        });
    },
});

//generate the reducer
const brandsReducer = brandsSlice.reducer;
export default brandsReducer;
