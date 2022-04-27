// Dummy data
let messages = [{ id: 1, name: "Lorem ipsum dolor", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pretium nec ipsum nec elementum." }];

class MessagesService {
    async getMessages(req, res) {
        res.send({
            ok: true,
            result: messages
        });
    }

    async addMessage(req, res) {
        messages.push({id: messages.length + 1, name: req.body.name, content: req.body.content});
        // Send response
        res.status(200).send({
            ok: true,
            result: messages
        });
    }


    async updateMessage(req, res) {
        // Update the message
        // Code not implemented
        // Send response
        res.status(200).send({
            ok: true,
            result: messages
        });
    }

    async deleteMessage(req, res) {
        // Delete the message
        messages = messages.filter((message) => {
            message.id !== req.body.id
        });

        // Send response
        res.status(200).send({
            ok: true,
            result: messages
        });
    }
}

// Export the router
export default new MessagesService();