import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
//initialState
const initialState = {
    colors: [],
    color: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

//create color action
export const createColorsAction = createAsyncThunk(
  "color/create",
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
                `${baseURL}/colors`, 
                { name },
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
//fetch color action
export const fetchColorsAction = createAsyncThunk(
  "color/fetchAll",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const {data} = await axios.get( `${baseURL}/colors` );
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

//slice
const colorsSlice = createSlice({
    name: "product",
    initialState,
    extraReducers: (builder) => {
        // create colors
        builder.addCase(createColorsAction.pending, (state) => {
                state.loading = true;
        })
        builder.addCase(createColorsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.color = action.payload;
                state.colors.push(action.payload);
                state.isAdded = true;
        })
        builder.addCase(createColorsAction.rejected, (state, action) => {
                state.loading = false;
                state.color = null;
                state.isAdded = false;
                state.error = action.payload;
        });
        // fetch all colors
        builder.addCase(fetchColorsAction.pending, (state) => {
                state.loading = true;
        })
        builder.addCase(fetchColorsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.colors = action.payload;
                state.isAdded = true;
        })
        builder.addCase(fetchColorsAction.rejected, (state, action) => {
                state.loading = false;
                state.colors = null;
                state.isAdded = false;
                state.error = action.payload;
        });
    },
});

//generate the reducer
const colorsReducer = colorsSlice.reducer;
export default colorsReducer;
