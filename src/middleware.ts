import {NextRequest} from "next/dist/server/web/spec-extension/request";
import {NextResponse} from "next/dist/server/web/spec-extension/response";
import {decodeToken} from "@/lib/utils";
import {Role} from "@/constants/type";

const managePaths = ['/manage']
const guestPaths = ['/guest']
const onlyOwnerPaths = ['/vi/manage/accounts', '/en/manage/accounts']
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
        // Guest nhưng cố vào route owner
        const isGuestGoToManagePath =
            role === Role.Guest &&
            managePaths.some((path) => pathname.startsWith(path))
        // Không phải Guest nhưng cố vào route guest
        const isNotGuestGoToGuestPath =
            role !== Role.Guest &&
            guestPaths.some((path) => pathname.startsWith(path))
        // Không phải Owner nhưng cố tình truy cập vào các route dành cho owner
        const isNotOwnerGoToOwnerPath =
            role !== Role.Owner &&
            onlyOwnerPaths.some((path) => pathname.startsWith(path))
        if (
            isGuestGoToManagePath ||
            isNotGuestGoToGuestPath ||
            isNotOwnerGoToOwnerPath
        ){
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/manage/:path*', '/guest/:paths*', '/login'],
}