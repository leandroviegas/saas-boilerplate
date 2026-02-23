import { AbstractService } from "@/services/abstract.service";
import { ExtendedPrismaClient } from "@/plugins/prisma";
import nodemailer from "nodemailer";
import { emailConfig } from "@/config";

export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
}

export class EmailService extends AbstractService {
    private transporter: nodemailer.Transporter;

    constructor(prisma: ExtendedPrismaClient) {
        super(prisma);

        this.transporter = nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure, // true for 465, false for other ports
            auth: {
                user: emailConfig.user,
                pass: emailConfig.password,
            },
            tls: {
                rejectUnauthorized: emailConfig.rejectUnauthorized,
            },
        });
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            const mailOptions = {
                from: options.from || emailConfig.from,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error("failed to send email");
        }
    }
}