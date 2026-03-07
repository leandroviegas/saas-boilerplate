import { Elysia } from 'elysia'
import { auth } from '@/auth'

export const authController = new Elysia({
  prefix: '/auth',
  detail: { tags: ['Auth'] }
})
  .all('/*', ({ request }) => auth.handler(request));