import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx : 클래스 이름을 조건부로 합치기 위한 라이브러리
// ex ] ("btn" , isActive && "btn-active" , "text-sm")
// isActive 의 값에 따라 "btn btn-active text-sm" or "btn text-sm"

// twMerge (tailwind-merge) : 클래스 이름의 중복을 제거
// 중복일 경우 , 마지막 것만 적용됨

// cn : clsx + twMerge
// >> 조건부 tailwind 클래스를 깔끔하게 합치고 중복을 자동으로 제거해주는 shadcn 기본 유틸 함수

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
