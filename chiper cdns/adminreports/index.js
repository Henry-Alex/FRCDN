const Report = new Vue({
    el: '.main-bg',
    data: {
        AdminLevel: 0,
        Reports: [],
        selectedTicketId: -1,
        chatMessages: [],
        chatInput: '',
        currentPlayerName: '',
        currentTicketStatus: 0
    },
    computed: {
        activeReports() {
            return this.Reports.filter((report) => parseInt(report[8]) !== 2);
        },
        closedReports() {
            return this.Reports.filter((report) => parseInt(report[8]) === 2);
        }
    },
    methods: {
        InitReports(adminLevel, data) {
            this.AdminLevel = parseInt(adminLevel) || 0;
            this.Reports = JSON.parse(data || '[]');

            if (this.selectedTicketId !== -1) {
                const selected = this.Reports.find((report) => report[0] === this.selectedTicketId);
                if (!selected) {
                    this.selectedTicketId = -1;
                    this.chatMessages = [];
                    this.currentPlayerName = '';
                    this.currentTicketStatus = 0;
                } else {
                    this.currentPlayerName = selected[1] || '';
                    this.currentTicketStatus = parseInt(selected[8]) || 0;
                }
            }

            if (this.selectedTicketId === -1 && this.activeReports.length > 0) {
                this.selectReport(this.activeReports[0]);
            }
        },
        selectReport(report) {
            if (!report) return;
            this.selectedTicketId = parseInt(report[0]) || -1;
            this.currentPlayerName = report[1] || '';
            this.currentTicketStatus = parseInt(report[8]) || 0;
            this.chatMessages = [];
            if (this.selectedTicketId > 0) {
                mp.trigger('Report:AdminSelectTicket', this.selectedTicketId);
            }
        },
        SetTicketMessages(ticketId, data, status, playerId, playerName) {
            const id = parseInt(ticketId) || -1;
            if (id !== this.selectedTicketId) return;

            this.chatMessages = JSON.parse(data || '[]');
            this.currentTicketStatus = parseInt(status) || 0;
            this.currentPlayerName = playerName || this.currentPlayerName;
        },
        AppendTicketMessage(ticketId, data) {
            const id = parseInt(ticketId) || -1;
            if (id !== this.selectedTicketId) return;

            const message = JSON.parse(data || '[]');
            if (Array.isArray(message) && message.length > 0) {
                this.chatMessages.push(message);
            }
        },
        sendChatMessage() {
            const text = (this.chatInput || '').trim();
            if (!text || this.selectedTicketId < 0) return;

            mp.trigger('Report:AdminSendChatMessage', this.selectedTicketId, text);
            this.chatInput = '';
        },
        setTicketStatus(status) {
            if (this.selectedTicketId < 0) return;
            const parsedStatus = parseInt(status) || 0;
            if (parsedStatus === 1) {
                mp.trigger('Report:AdminSelectTicket', this.selectedTicketId);
                return;
            }

            mp.trigger('Report:AdminSetTicketStatus', this.selectedTicketId, parsedStatus);

            if (parsedStatus === 2) {
                this.selectedTicketId = -1;
                this.chatMessages = [];
                this.currentPlayerName = '';
                this.currentTicketStatus = 2;
            }
        },
        isAdminMessage(message) {
            return parseInt(message[1]) === 1;
        },
        statusText(status) {
            const value = parseInt(status);
            if (value === 2) return 'Closed';
            if (value === 1) return 'In Questions';
            return 'Open';
        },
        statusClass(status) {
            const value = parseInt(status);
            if (value === 2) return 'closed';
            if (value === 1) return 'questions';
            return 'open';
        },
        closePanel() {
            mp.trigger('adminreport:close');
        }
    }
});
