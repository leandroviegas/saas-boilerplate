import { createAuthClient } from "better-auth/client"
import { jwtClient, twoFactorClient, usernameClient, multiSessionClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`,
    plugins: [
        jwtClient(),
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = '/auth/2fa';
            },
        }),
        usernameClient(),
        multiSessionClient()
    ]
})
