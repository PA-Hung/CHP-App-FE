import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAccount } from '../../utils/api'

// First, create the thunk
export const fetchAccount = createAsyncThunk(
    'auth/fetchAccount',
    async () => {
        const response = await getAccount()
        return response.data
    }
)

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: "",
    user: {
        _id: "",
        phone: "",
        name: "",
        role: ""
    },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user._id = action?.payload?._id;
            state.user.name = action.payload.name;
            state.user.phone = action.payload.phone;
            state.user.role = action?.payload?.role;
        },
        setLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                _id: "",
                phone: "",
                name: "",
                role: ","
            }
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? "";
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchAccount.pending, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = true;
            }
        })
        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user._id = action?.payload?.user?._id;
                state.user.phone = action.payload.user?.phone;
                state.user.name = action.payload.user?.name;
                state.user.role = action?.payload?.user?.role;
            }
        })
        builder.addCase(fetchAccount.rejected, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        })
    },
})

export const {
    setActiveMenu, setUserLoginInfo, setLogoutAction, setRefreshTokenAction
} = authSlice.actions;

export default authSlice.reducer