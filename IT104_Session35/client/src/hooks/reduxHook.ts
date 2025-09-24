import { useDispatch, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from '../stores';
import { useSelector } from 'react-redux';

export const atminDispatch: () => AppDispatch = useDispatch;
export const atminSelector: TypedUseSelectorHook<RootState> = useSelector;
