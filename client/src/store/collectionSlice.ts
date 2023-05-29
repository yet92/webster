import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchAllCollections,
  fetchOneCollection,
  removeCollection,
} from '../pages/tools/utils/fetchCollections';
import { Project } from './projectsSlice';

export type Collection = {
  title: string;
  projects: Project[];
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
  currentCollection: { title: '', id: -1, projects: [] },
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

export const fetchOneCollectionAsync = createAsyncThunk<
  Collection,
  { accessToken: string; id: number }
>('collections/fetchOneCollection', async ({ accessToken, id }, thunkAPI) => {
  try {
    const { response, json } = await fetchOneCollection(accessToken, id);
    return json.data as unknown as Collection;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch collections');
  }
});

export const removeCollectionAsync = createAsyncThunk<
  number,
  { accessToken: string; id: number }
>('collections/removeCollection', async ({ accessToken, id }, thunkAPI) => {
  try {
    await removeCollection(accessToken, id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch collections');
  }
});

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    createCollection: (state, action: PayloadAction<Collection>) => {
      state.collections = [...state.collections, action.payload];
    },
    removeProjFromCollection: (state, action: PayloadAction<Project>) => {
      state.currentCollection = {
        ...state.currentCollection,
        projects: state.currentCollection.projects.filter(
          (project) => project.id !== action.payload.id
        ),
      };
    },

    retrieveCollection: (state, action: PayloadAction<Collection>) => {
      state.currentCollection = action.payload;
    },

    retrieveAllCollections: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload;
    },
    clearAllCollections: (state) => {
      state.collections = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOneCollectionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCollectionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollectionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload as unknown as Collection[];
      })
      .addCase(fetchOneCollectionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCollection = action.payload as unknown as Collection;
      })
      .addCase(removeCollectionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = state.collections.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(fetchCollectionsAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchOneCollectionAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeCollectionAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  createCollection,
  retrieveCollection,
  clearAllCollections,
  retrieveAllCollections,
  removeProjFromCollection,
} = collectionSlice.actions;

export default collectionSlice.reducer;
