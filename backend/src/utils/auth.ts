import bcrypt from "bcryptjs"
import jwt, { type SignOptions } from "jsonwebtoken"
import { ApiError } from "./api"

export type AuthRole = "ADMIN" | "TEACHER"

export type AuthUser = {
  id: string
  role: AuthRole
  email?: string
  username?: string
}

const jwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new ApiError(500, "JWT_SECRET is not configured")
  }
  return secret
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(user: AuthUser) {
  const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"] }
  return jwt.sign(user, jwtSecret(), options)
}

export function verifyToken(token: string): AuthUser {
  try {
    return jwt.verify(token, jwtSecret()) as AuthUser
  } catch {
    throw new ApiError(401, "Invalid or expired token")
  }
}

export function readBearerToken(request: Request) {
  const header = request.headers.get("authorization")
  if (header?.startsWith("Bearer ")) {
    return header.slice(7)
  }
  return null
}

export function authCookie(token: string) {
  const secure = process.env.NODE_ENV === "production"
  return `bffp_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure ? "; Secure" : ""}`
}

export function clearAuthCookie() {
  return "bffp_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
}
