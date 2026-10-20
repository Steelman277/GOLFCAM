'use server'

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function generateToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '1d')
    .sign(secret);
}

export async function decryptToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function storeToken(name: string, payload: any) {
  try {
    const expires = new Date(Date.now() + 2419200 * 1000);
    const value = await generateToken({ data: payload, expires: expires });
    const cookieStore = await cookies();
    cookieStore.set(name, value, { expires, httpOnly: true });
    return ({ result: true, message: 'Token stored successfully' });
  } catch (error) {
    return ({ result: false, message: 'Token could not be stored' });
  }
}

export async function getToken(name: string) {
  try {
    const cookieStore = await cookies();
    const value = cookieStore.get(name)?.value;
    if (value) {
      const token = await decryptToken(value);
      if (token) {
        return token.data;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function deleteToken(name: string) {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(name);
        return ({ result: true, message: 'Token deleted successfully' });
    } catch (error) {
        return ({ result: false, message: 'Token could not be deleted' }); 
    }
}

export async function updateToken(name: string) {
    try {
        const cookieStore = await cookies();
        const value = cookieStore.get(name)?.value;
        if (value) {
            const token = await decryptToken(value);
            if (token) {
                const expires = new Date(Date.now() + 2419200 * 1000);
                const newToken = await generateToken({ data: token.data, expires: expires });
                cookieStore.set(name, newToken, { expires, httpOnly: true });
                return ({ result: true, message: 'Token updated successfully' });
            }
        }
        
        // If the token is not found, delete it
        cookieStore.delete(name);
        return ({ result: true, message: 'Token deleted successfully' });
    } catch (error) {
        return ({ result: false, message: 'Token could not be updated' }); 
    }
}