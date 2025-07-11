import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
//initialState
const initialState = {
    categories: [],
    category: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

//create category action
export const createCategoriesAction = createAsyncThunk(
  "category/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, image } = payload;
            // formData
            const formData = new FormData();
            formData.append('name',name)
            formData.append('image',image)
            // token- authenication
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            const {data} = await axios.post(
                `${baseURL}/categories`, 
                { name },
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
//fetch category action
export const fetchCategoriesAction = createAsyncThunk(
  "category/fetchAll",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const {data} = await axios.get( `${baseURL}/categories` );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

//slice
const categoriesSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        // create categories
        builder.addCase(createCategoriesAction.pending, (state) => {
                state.loading = true;
        })
        builder.addCase(createCategoriesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload;
                state.categories.push(action.payload);
                state.isAdded = true;
        })
        builder.addCase(createCategoriesAction.rejected, (state, action) => {
                state.loading = false;
                state.category = null;
                state.isAdded = false;
                state.error = action.payload;
        });
        // fetch all categories
        builder.addCase(fetchCategoriesAction.pending, (state) => {
                state.loading = true;
        })
        builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
                state.isAdded = true;
        })
        builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
                state.loading = false;
                state.categories = null;
                state.isAdded = false;
                state.error = action.payload;
        });
    },
});

//generate the reducer
const categoriesReducer = categoriesSlice.reducer;
export default categoriesReducer;
