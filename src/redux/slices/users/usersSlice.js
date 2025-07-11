import {createAsyncThunk, createSlice, createAction} from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {resetErrAction, resetSuccessAction} from "../globalActions/globalActions";
const initialState = {
    loading: false,
    error: null,
    users: [],
    user: null,
    profile: {},
    userAuth: {
        loading: false,
        error: null,
        userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
    }
}
//actions ------------------------------------------------>
//register action
export const registerUserAction = createAsyncThunk("users/register", async ({email, password, fullname}, {rejectWithValue, getState, dispatch}) =>{
    try{
        //make the http request
        const {data} = await axios.post(`${baseURL}/users/register`,{
            email,
            password,
            fullname
        })
        return data;
    } catch(error) {
        return rejectWithValue(error?.response?.data)
    }
})
//login action
export const loginUserAction = createAsyncThunk("users/login", async ({email, password}, {rejectWithValue, getState, dispatch}) =>{
    try{
        //make the http request
        const {data} = await axios.post(`${baseURL}/users/login`,{
            email,
            password
        })
        localStorage.setItem("userInfo", JSON.stringify(data));
        return data;
    } catch(error) {
        return rejectWithValue(error?.response?.data)
    }
})
// ------------------------------------------------------------>
//users slice
const usersSlice = createSlice({
    name: "users",
    initialState,
    extraReducers: (builder)=>{
        //handle actions
        //login
        builder.addCase(loginUserAction.pending, (state, action)=>{
            state.userAuth.loading = true;
            state.userAuth.error = null;
        })
        builder.addCase(loginUserAction.fulfilled, (state, action)=>{
            state.userAuth.userInfo = action.payload;
            state.userAuth.error = null;
            state.userAuth.loading = false;
        })
        builder.addCase(loginUserAction.rejected, (state, action)=>{
            state.userAuth.error = action.payload;
            state.userAuth.loading = false;
        })
        //register
        builder.addCase(registerUserAction.pending, (state, action)=>{
            state.loading = true;
            state.error = null;
        })
        builder.addCase(registerUserAction.fulfilled, (state, action)=>{
            state.user = action.payload.data;
            state.error = null;
            state.loading = false;
        })
        builder.addCase(registerUserAction.rejected, (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        })
        //reset error action
        builder.addCase(resetErrAction.pending, (state) => {
            state.error = null;
            state.userAuth.error = null;
        });
        //reset success action
        builder.addCase(resetSuccessAction.pending, (state) => {
            return initialState;
        });
    }
});

// generate reducer
const usersReducer = usersSlice.reducer;

export default usersReducer;