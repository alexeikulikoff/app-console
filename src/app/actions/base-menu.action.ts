import { createAction, props } from '@ngrx/store';

export const bindMenuRole = createAction(
  'Bind Menu and Role',
  props<{ menuId: string; roleId: string }>()
);

