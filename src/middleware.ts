import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";


const privatePaths = ['/manage']
const unAuthPaths = ['/login']


export function middleware(request: NextRequest){
    const {pathname} = request.nextUrl
    const isAuth = Boolean(request.cookies.get('accessToken')?.value)

    if(privatePaths.some((path) => pathname.startsWith(path)) && !isAuth){
        return NextResponse.redirect(new URL('login', request.url));
    }

    if(unAuthPaths.some((path) => pathname.startsWith(path)) && !isAuth){
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/manage/:path*', '/login'],
}