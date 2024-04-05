import mailer from "nodemailer";
import { mailingService, mailingUser, mailingPassword, mailingPort } from "../configs/config.js";

export default class MailingService {
    constructor() {
        this.client = mailer.createTransport({
            service: mailingService,
            port: mailingPort,
            auth: {
                user: mailingUser,
                pass: mailingPassword
            }
        })
    }

    sendSimpleMail = async ({from, to, subject, html, attachments = []}) => {
        const result = await this.client.sendMail({from, to, subject, html, attachments});
        return result;
    };
}