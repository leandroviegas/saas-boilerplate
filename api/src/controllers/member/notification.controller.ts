import { Elysia, t } from 'elysia';
import { notificationService } from "@/services";
import { NotificationSchema } from "@/schemas/models/notification.schema";
import { paginationSchema, metaSchema } from "@/schemas/pagination";
import { authMiddleware } from "@/middleware/auth.middleware";

const GetNotificationsResponse = t.Object({
    code: t.String(),
    data: t.Array(NotificationSchema),
    meta: metaSchema
});

const MarkAsReadResponse = t.Object({
    code: t.String(),
    data: NotificationSchema
});

const MarkAllReadResponse = t.Object({
    code: t.String()
});

export const memberNotificationController = new Elysia({
    prefix: '/notification',
    detail: { tags: ['Member Notifications'] }
})
    .use(authMiddleware)
    .get('/', async ({ query, user }) => {
        if (!user) throw new Error("User not found");
        const { data, meta } = await notificationService.findAllByUserId(user.id, query);

        return {
            code: 'get-notifications',
            data,
            meta
        };
    }, {
        query: t.Intersect([paginationSchema]),
        response: GetNotificationsResponse
    })


    .patch('/:id/read', async ({ params: { id }, user }) => {
        if (!user) throw new Error("User not found");
        const data = await notificationService.markAsRead(id, user.id);

        return {
            code: 'mark-notification-read',
            data
        };
    }, {
        params: t.Object({ id: t.String() }),
        response: MarkAsReadResponse
    })


    .patch('/read-all', async ({ user }) => {
        if (!user) throw new Error("User not found");
        await notificationService.markAllAsRead(user.id);

        return {
            code: 'mark-all-notifications-read'
        };
    }, {
        response: MarkAllReadResponse
    })


    .delete('/:id', async ({ params: { id }, user, set }) => {
        if (!user) throw new Error("User not found");
        await notificationService.delete(id, user.id);
        set.status = 204;
        return;
    }, {
        params: t.Object({ id: t.String() })
    })

    
    .delete('/', async ({ user, set }) => {
        if (!user) throw new Error("User not found");
        await notificationService.deleteAll(user.id);
        set.status = 204;
        return;
    }, {
    });
