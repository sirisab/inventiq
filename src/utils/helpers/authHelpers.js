import * as jose from "jose";

const JWT_SECRET = "SECRET"; // should be a env variable

const JWT_AUTH_EXP = "1h";

function encodedSecret() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function signJWT(payload) {
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(JWT_AUTH_EXP)
    .sign(encodedSecret());

  return token;
}

export async function verifyJWT(token) {
  const verified = await jose.jwtVerify(token, encodedSecret());

  return verified.payload;
}

export function getAuthHeader(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  return token;
}
