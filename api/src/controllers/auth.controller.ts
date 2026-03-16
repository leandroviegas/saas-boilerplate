import { Elysia } from 'elysia'
import { auth } from '@/auth'

export const authController = new Elysia({
  prefix: '/auth',
  detail: { tags: ['Auth'] }
})
  .all('/*', async ({ request, headers, set }) => {
    const res = await auth.handler(request)

    res.headers.forEach((value, key) => {
      set.headers[key] = value
    })
    const cookies = res.headers.getSetCookie?.()
    
    if (cookies) set.headers['set-cookie'] = cookies
    set.status = res.status

    return await res.text()
  })