// middleware.js

import { NextRequest, NextResponse } from 'next/server';
import { toast } from './components/ui/use-toast';
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login';

  const sessionToken = request.cookies.get('token')?.value || '';

  // TODO: instead of userdetails return teaminformation 
  if(isPublicPath && sessionToken){
    const res = await fetch('https://pmt-u972l.ondigitalocean.app/userdetails/', {
      method: 'POST',
      headers: {
        Authorization: `Token ${sessionToken}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      // If a user session exists, redirect to the main page
      const role = data.role;
      localStorage.setItem("role",role)
      toast({
        title: 'Already Logged In',
        description: `Redirecting you back`,
        
      })
    return NextResponse.redirect(new URL('/', request.nextUrl));
    }
  }

  if(!isPublicPath && !sessionToken){
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
  
}

// Then apply the middleware
export const config = {
  matcher: ['/', '/login']
};
