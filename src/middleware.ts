import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";


const privatePaths = ['/manage']
const unAuthPaths = ['/login']


export function middleware(request: NextRequest){
    const {pathname} = request.nextUrl
    // pathname example: /manage/dashboard
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    // Nếu chưa đăng nhập thì không cho vào private path
    if(privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Đăng nhập rồi thì không cho vào trang login nữa
    if(unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken){
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Đã đăng nhập nhưng accessToken hết hạn
    if(privatePaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken){
        const url = new URL('/logout', request.url)
        url.searchParams.set('refreshToken', request.cookies.get('refreshToken')?.value ?? '')
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/manage/:path*', '/login'],
}