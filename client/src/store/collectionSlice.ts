import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllCollections } from '../pages/tools/utils/fetchCollections';

export type Collection = {
  title: string;
  thumbnail?: string;
  id: number;
  ownerId?: string;
};

type collectionState = {
  collections: Collection[];
  currentCollection: Collection;
  loading: boolean;
  error: string | null;
};

const initialState: collectionState = {
  collections: [],
  currentCollection: { title: '', id: -1 },
  loading: false,
  error: null,
};

export const fetchCollectionsAsync = createAsyncThunk<Collection[], string>(
  'collections/fetchCollections',
  async (accessToken: string, thunkAPI) => {
    try {
      const { response, json } = await fetchAllCollections(accessToken);
      return json.data as unknown as Collection[];
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch collections');
    }
  }
);
const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    createCollection: (state, action: PayloadAction<Collection>) => {
      console.log("PAYLOAD:",action.payload);
      state.collections = [...state.collections, action.payload];
    },

    retrieveCollection: (state, action: PayloadAction<Collection>) => {
      state.currentCollection = action.payload;
    },

    retrieveAllCollections: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload;
    },
    clearAllCollections: (state) => {
      state.collections = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollectionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload as unknown as Collection[];
      })
      .addCase(fetchCollectionsAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { createCollection, retrieveCollection, clearAllCollections, retrieveAllCollections } =
collectionSlice.actions;

export default collectionSlice.reducer;
