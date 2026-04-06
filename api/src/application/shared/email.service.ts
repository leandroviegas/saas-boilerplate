import { AbstractService } from "@/domain/shared/abstract.service";
import { PrismaTransactionContext } from "@/infrastructure/database/prisma/transaction-context";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { SystemVariableService } from "@/application/shared/system-variable.service";

export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
}

export class EmailService extends AbstractService {
    systemVariableService!: SystemVariableService;

    constructor(transaction: PrismaTransactionContext) {
        super(transaction);

        this.systemVariableService = new SystemVariableService(transaction);
    }

    async getTransporter() {
        const emailConfig = await this.systemVariableService.getEmailConfig();

        const transporter = nodemailer.createTransport({
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
                user: emailConfig.user,
                pass: emailConfig.password,
            },
            tls: {
                rejectUnauthorized: emailConfig.rejectUnauthorized,
            },
        } as SMTPTransport.Options);

        return { transporter };
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        const emailConfig = await this.systemVariableService.getEmailConfig();
        const { transporter } = await this.getTransporter();

        try {
            const mailOptions = {
                from: options.from ?? emailConfig.from ?? undefined,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            throw new Error("failed to send email");
        }
    }
}