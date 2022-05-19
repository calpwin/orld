import { configureStore } from '@reduxjs/toolkit'
import { editorReducer } from '../features/ui-editor/editor.state'

export default configureStore({
  reducer: {
      editor: editorReducer,      
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})