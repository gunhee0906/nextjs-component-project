import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
// useDispatch에 AppDispatch 타입을 명시
export const useAppDispatch : () => AppDispatch = useDispatch;
// useSelector에 RootState 타입을 명시
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;