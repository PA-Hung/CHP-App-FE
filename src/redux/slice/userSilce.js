import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUsers } from '../../utils/api'

// First, create the thunk
export const fetchListUsers = createAsyncThunk(
    'users/fetchListUsers',
    async () => {
        const response = await getUsers()
        return response
    }
)

const initialState = {
    isFetching: true,
    meta: {
        current: 1,
        pageSize: 2,
        pages: 0,
        total: 0
    },
    result: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchListUsers.pending, (state, action) => {
            // Add user to the state array
            state.isFetching = true;
        })
        builder.addCase(fetchListUsers.fulfilled, (state, action) => {
            // Add user to the state array
            console.log('action.payload', action.payload);
            state.result = action.payload.data.result;
            state.meta = action.payload.data.meta


        })
        builder.addCase(fetchListUsers.rejected, (state, action) => {
            // Add user to the state array
            state.isFetching = false;
        })
    },
})

// Action creators are generated for each case reducer function


export default userSlice.reducer