import { combineReducers, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../httpClient';

export interface Service {
    service_id: number;
    name: string;
    description: string;
    latitude: string,
    longitude: string,
    city : string,
    price: string;
    image_urls: string[];
    category : string
    created_at: string;
    modified_at: string;
}

interface ServicesListState {
    data: Service[];
    loading: boolean;
    error: string | null;
}

export const GET_SERVICES = createAsyncThunk('nhsf/GET_SERVICES', async () => {
    const response = await axiosInstance.get(`/api/services`);

    return response.data; 
});

const services_list = createSlice({
    name: 'services_list',
    initialState: {
        data: [],
        loading: false,
        error: null,
    } as ServicesListState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(GET_SERVICES.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GET_SERVICES.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.error = null;
            })
            .addCase(GET_SERVICES.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            });
    },
});


export const GET_SERVICES_BY_CATEGORY = createAsyncThunk('nhsf/GET_SERVICES_BY_CATEGORY', async (category:string) => {
    const response = await axiosInstance.get(`/api/services/category/${category}`);

    return response.data; 
});

const services_list_category = createSlice({
    name: 'services_list',
    initialState: {
        data: [],
        loading: false,
        error: null,
    } as ServicesListState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(GET_SERVICES_BY_CATEGORY.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GET_SERVICES_BY_CATEGORY.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.error = null;
            })
            .addCase(GET_SERVICES_BY_CATEGORY.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            });
    },
});

interface ParticularService {
    data : {
        service_id: number;
    name: string;
    description: string;
    latitude: string,
    longitude: string,
    city : string,
    price: string;
    image_urls: string[];
    category : string
    created_at: string;
    modified_at: string;
    }
    loading :boolean
    error : string | null
    
}

export const GET_SERVICES_BY_ID = createAsyncThunk('nhsf/GET_SERVICES_BY_ID', async (id:number) => {
    const response = await axiosInstance.get(`/api/services/${id}`);

    return response.data; 
});

const services_list_particular = createSlice({
    name: 'services_list',
    initialState: {
        data: {},
        loading: false,
        error: null,
    } as ParticularService,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(GET_SERVICES_BY_ID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GET_SERVICES_BY_ID.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.error = null;
            })
            .addCase(GET_SERVICES_BY_ID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? null;
            });
    },
});

interface AddserviceState {
    name: string;
    description: string;
    latitude: string,
    longitude: string,
    city : string,
    price: string;
    image_urls: string[];
}

export const ADD_SERVICE = createAsyncThunk('nhsf/ADD_SERVICE', async ({serviceData}:{serviceData:AddserviceState}) => {
    const response = await axiosInstance.post(`/api/services`, serviceData)

    return response.data
})

const rootReducers = combineReducers({
    serviceList: services_list.reducer,
    servicesListParticular : services_list_particular.reducer,
    serviceListCategory : services_list_category.reducer
});

export default rootReducers;
