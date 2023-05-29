import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addToCollection,
  fetchAllProjects,
  removeFromCollection,
} from '../pages/tools/utils/fetchProjects';

export type Project = {
  title: string;
  thumbnail?: string;
  project: string;
  id: number;
  collectionId?: number;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type projectsState = {
  collections: [];
  loading: boolean;
  projects: Project[];
  currentProject: Project;
  error: string | null;
};

const initialState: projectsState = {
  collections: [],
  projects: [],
  loading: false,
  currentProject: { title: '', project: '', id: -1 },
  error: null,
};

export const fetchProjectsAsync = createAsyncThunk<Project[], string>(
  'projects/fetchProjects',
  async (accessToken: string, thunkAPI) => {
    try {
      const { response, json } = await fetchAllProjects(accessToken);
      return json.data as unknown as Project[];
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch projects');
    }
  }
);

export const addToCollectionAsync = createAsyncThunk<
  Project,
  { accessToken: string; collectionId: number; projectId: number }
>(
  'projects/addToCollection',
  async ({ accessToken, collectionId, projectId }, thunkAPI) => {
    try {
      const { response, json } = await addToCollection(
        accessToken,
        collectionId,
        projectId
      );
      return json.data as unknown as Project;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to add to collection');
    }
  }
);

export const removeFromCollectionAsync = createAsyncThunk<
  Project,
  { accessToken: string; projectId: number }
>(
  'projects/removeFromCollection',
  async ({ accessToken, projectId }, thunkAPI) => {
    try {
      const { response, json } = await removeFromCollection(
        accessToken,
        projectId
      );
      return json.data as unknown as Project;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to remove from collection');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action: PayloadAction<Project>) => {
      console.log(action.payload);
      state.projects = [...state.projects, action.payload];
    },

    retrieveProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },

    retrieveAllProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    clearAllProjects: (state) => {
      state.projects = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCollectionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCollectionAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload as unknown as Project[];
      })
      .addCase(addToCollectionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, collectionId: action.payload.collectionId };
          }
          return item;
        });
      })
      .addCase(removeFromCollectionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, collectionId: action.payload.collectionId };
          }
          return item;
        });
      })
      .addCase(fetchProjectsAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addToCollectionAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCollectionAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  createProject,
  retrieveAllProjects,
  retrieveProject,
  clearAllProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;