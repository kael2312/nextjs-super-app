import {cookies} from "next/headers";
import authApiRequest from "@/apiRequests/auth";
import jwt from "jsonwebtoken";
import {HttpError} from "@/lib/http";

export async function POST(request: Request){
    // Get refreshToken from cookies
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    // If not return 401
    if(!refreshToken){
        return Response.json({
            message: 'Refresh token not found',
        },{
            status: 401,
        })
    }
    // Call back-end's api refresh-token
    try {
        const {payload} = await authApiRequest.serverRefreshToken({refreshToken})
        // Get response and set new access-token, refresh-token to cookies
        const decodeAccessToken = jwt.decode(payload.data.accessToken) as {exp: number}
        const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as {exp: number}

        cookieStore.set('accessToken', payload.data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodeAccessToken.exp * 1000
        })

        cookieStore.set('refreshToken', payload.data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            expires: decodeRefreshToken.exp * 1000
        })
        return Response.json(payload)
    } catch  {
        return Response.json({
            message: 'Có lôỗi xaảy ra',
            status: 401
        })
    }
}