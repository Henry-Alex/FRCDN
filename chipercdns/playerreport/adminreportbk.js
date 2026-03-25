const Report = new Vue({
    el: '.main',
    data: {
        optionselected: 0,
        reportData: [],
        reportinput: "",
        tickets: [],
        messagesByTicket: {},
        selectedTicketId: 0
    },
    methods: {
        fetchData(data) {
            const parsed = JSON.parse(data || "{}");

            // Backward compatibility if old array payload is used.
            if (Array.isArray(parsed)) {
                this.reportData = parsed;
                return;
            }

            this.tickets = Array.isArray(parsed.tickets) ? parsed.tickets : [];
            this.messagesByTicket = parsed.messages || {};

            const preferredId = parseInt(parsed.activeTicketId) || 0;
            if (preferredId > 0 && this.tickets.some((ticket) => ticket[0] === preferredId)) {
                this.selectedTicketId = preferredId;
            } else if (this.selectedTicketId > 0 && this.tickets.some((ticket) => ticket[0] === this.selectedTicketId)) {
                // keep existing selection
            } else if (this.tickets.length > 0) {
                this.selectedTicketId = this.tickets[0][0];
            } else {
                this.selectedTicketId = 0;
            }

            this.rebuildMessageList();
        },
        rebuildMessageList() {
            const list = this.messagesByTicket[`${this.selectedTicketId}`] || [];
            this.reportData = list.map((row) => ({
                senderType: parseInt(row[1]) || 0,
                senderName: row[3] || "",
                message: row[4] || "",
                time: row[5] || ""
            }));
        },
        sendReport() {
            const text = (this.reportinput || "").trim();
            if (text.length < 1) return;

            mp.trigger("adminreport:sendReport", text, this.selectedTicketId || 0);
            this.reportinput = "";
        }
    }
});
