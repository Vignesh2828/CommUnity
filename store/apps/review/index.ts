import { combineReducers, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../httpClient';


interface ReviewData {
    service_id: number
    rating : string 
    review_text : string 
    image_urls: string[];
}


export const POST_REVIEW = createAsyncThunk('nhsf/POST_REVIEW', async ({addReviewData} : {addReviewData :ReviewData}) => {
    const response = await axiosInstance.post(`/api/services/reviews`, addReviewData);

    return response.data; 
});

export interface GetReviewData {
    service_id: number
    review_id : number
    rating : string 
    review_text : string 
    image_urls: string[];
}

interface AddReviewState {
    data : GetReviewData[]
    loading : boolean
    error : string | null
}

export const GET_REVIEWS = createAsyncThunk('nhsf/GET_REVIEWS', async ({service_id} : {service_id:number}) => {
    const response = await axiosInstance.get(`/api/services/${service_id}/reviews`);

    return response.data; 
});

const review_list = createSlice({
    name: 'services_list',
    initialState: {
        data: [],
        loading: false,
        error: null,
    } as AddReviewState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(GET_REVIEWS.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.data = []; 
            })
            .addCase(GET_REVIEWS.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.error = null;
            })
            .addCase(GET_REVIEWS.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            });
    },
});

const rootReducers = combineReducers({
   review : review_list.reducer
});

export default rootReducers;
