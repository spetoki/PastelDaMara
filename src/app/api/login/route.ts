import {NextResponse} from 'next/server';
import {sign} from 'jsonwebtoken';
import {cookies} from 'next/headers';

const SECRET_KEY = process.env.ACCESS_KEY || 'default-secret-key-for-dev';
const ACCESS_KEY = process.env.ACCESS_KEY || '1234';

export async function POST(request: Request) {
  try {
    const {key} = await request.json();

    if (key === ACCESS_KEY) {
      // Create a token
      const token = sign({authorized: true}, SECRET_KEY, {expiresIn: '1d'});

      // Set the token in an HTTP-only cookie
      cookies().set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return NextResponse.json({success: true}, {status: 200});
    } else {
      return NextResponse.json(
        {success: false, message: 'Chave de acesso inválida.'},
        {status: 401}
      );
    }
  } catch (error) {
    return NextResponse.json(
      {success: false, message: 'Ocorreu um erro no servidor.'},
      {status: 500}
    );
  }
}

export async function DELETE() {
  try {
    cookies().delete('auth-token');
    return NextResponse.json({success: true, message: 'Logout realizado com sucesso.'}, {status: 200});
  } catch (error) {
    return NextResponse.json({success: false, message: 'Ocorreu um erro no servidor.'}, {status: 500});
  }
}
