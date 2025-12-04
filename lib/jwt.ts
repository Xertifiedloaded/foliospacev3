import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "your-secret"
const EXPIRY = process.env.JWT_EXPIRY || "7d"

export interface TokenPayload {
  userId: string
  email: string
  username: string 
  name: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}
