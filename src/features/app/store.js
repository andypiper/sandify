import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import machineReducer from "@/features/machine/machineSlice"
import exporterReducer from "@/features/exporter/exporterSlice"
import previewReducer from "@/features/preview/previewSlice"
import fontsReducer from "@/features/fonts/fontsSlice"
import layersReducer from "@/features/layers/layersSlice"
import { loadState, saveState } from "@/common/localStorage"
import appReducer from "./appSlice"

/*
const customizedMiddleware = getDefaultMiddleware({
  immutableCheck: {
    ignoredPaths: ['importer.vertices']
  },
  serializableCheck: {
    ignoredPaths: ['importer.vertices']
  }
})
*/

// set both to true when running locally if you want to preserve your shape
// settings across page loads; don't forget to toggle false when done testing!
const usePersistedState = true
const persistState = true

// if you want to save a multiple temporary states, use these keys. The first time
// you save a new state, change persistSaveKey. Make a change, then change
// persistInitKey to the same value. It's like doing a "save as"
const persistInitKey = "state"
const persistSaveKey = "state"

const persistedState =
  typeof jest === "undefined" && usePersistedState
    ? loadState(persistInitKey) || undefined
    : undefined
// reset some values
persistedState.fonts.loaded = false

const store = configureStore({
  reducer: combineReducers({
    main: combineReducers({
      app: appReducer,
      layers: layersReducer,
      exporter: exporterReducer,
      machine: machineReducer,
      preview: previewReducer,
    }),
    fonts: fontsReducer,
  }),
  preloadedState: persistedState,
})

if (persistState) {
  store.subscribe(() => {
    saveState(store.getState(), persistSaveKey)
  })
}

export default store
