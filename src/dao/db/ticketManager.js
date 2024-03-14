import { ticketModel } from "../db/models/ticket.model.js";

export default class Ticket {

    getTickets = async () => {
        try {
            const result = await ticketModel.find();
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    getTicketById = async (id) => {
        try {
            const result = await ticketModel.findById(id);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    createTicket = async (ticket) => {
        try {
            const result = await ticketModel.create(ticket);
            return result;
        } catch (error) {
            console.error(error);
            return null; 
        }
    }
}

