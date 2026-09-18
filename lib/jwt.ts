import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "jss_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  sub: string; // user id
  role: "OWNER" | "EMPLOYEE";
  name: string;
  email: string;
};

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set a long random value in your environment (see .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.sub === "string" &&
      (payload.role === "OWNER" || payload.role === "EMPLOYEE") &&
      typeof payload.name === "string" &&
      typeof payload.email === "string"
    ) {
      return {
        sub: payload.sub,
        role: payload.role,
        name: payload.name,
        email: payload.email,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
