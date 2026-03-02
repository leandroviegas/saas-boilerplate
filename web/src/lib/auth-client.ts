import { createAuthClient } from "better-auth/client"
import { jwtClient, twoFactorClient, usernameClient, multiSessionClient, organizationClient } from "better-auth/client/plugins"
import { env } from "./config";

export const authClient = createAuthClient({
    baseURL: `${env.NEXT_PUBLIC_API_URL}/auth`,
    plugins: [
        jwtClient(),
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = '/auth/2fa';
            },
        }),
        usernameClient(),
        multiSessionClient(),
        organizationClient()
    ]
})
''