import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export interface PermissionsState {
  permissionsDetails: string[];
}
const initialState: PermissionsState = {
  permissionsDetails: ['EDIT_WITHDRAWAL_REQUEST', 'APPROVE_WITHDRAWAL_REQUEST']
};

export const permissionsSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermissionDetails: (state: PermissionsState, action: PayloadAction<any>) => {
      state.permissionsDetails = action.payload;
    }
  }
});
export const { setPermissionDetails } = permissionsSlice.actions;
export const permissionsReducer = permissionsSlice.reducer;
