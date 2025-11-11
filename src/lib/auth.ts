import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export interface JWTPayload {
  email: string;
  token: string;
}

export async function authUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("minitoken")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode("1234");
    const { payload } = await jwtVerify<JWTPayload>(token, secret);

    return {
      email: payload.email,
      token,
    };
  } catch (error) {
    console.log("토큰 검증실패 : ", error);

    return null;
  }
}
