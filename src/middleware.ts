import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import {decodeToken} from "@/lib/utils";
import {Role} from "@/constants/type";

const managePaths = ['/manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, guestPaths]
const unAuthPaths = ['/login']


export function middleware(request: NextRequest){
    const {pathname} = request.nextUrl
    // pathname example: /manage/dashboard
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    // 1. Nếu chưa đăng nhập thì không cho vào private path
    if(privatePaths.some((path) => pathname.startsWith(<string>path)) && !refreshToken){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. trường hợp đã đăng nhập
    if(refreshToken){
        // 2.1 Nếu cố tình vào trang login sẽ redirect về trang chủ
        if(unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken){
            return NextResponse.redirect(new URL('/', request.url));
        }

        // 2.2 Đã đăng nhập nhưng accessToken hết hạn
        if(privatePaths.some((path) => pathname.startsWith(<string>path)) && !accessToken && refreshToken){
            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', request.cookies.get('refreshToken')?.value ?? '')
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url);
        }

        // 2.3 Vào không đúng role thì sẽ redirect về trang chủ
        const role = decodeToken(refreshToken).role
        if((role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))) ||
            (role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path)))
        ){
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/manage/:path*', '/guest/:paths*', '/login'],
}