var AdminMenu = new Vue({
  el: "#admin",
  data: {
    enable: true,
    page: 1,
    main: {
      inputGlobal: "",
    },
    player: {
      inputId: null,
      inputMessage: "",
      inputDim: null,
      inputPunishTime: null,
      inputPubishReason: "",
    },
    // ── Report tab state ──────────────────────────────────────────────────────
    report: {
      AdminLevel: 0,
      Reports: [],
      selectedTicketId: -1,
      chatMessages: [],
      chatInput: "",
      currentPlayerName: "",
      currentTicketStatus: 0,
    },
    history: {
      records: [],
      showInput: false, // controls the overlay
      inputVal: "", // bound to the text field
    },
  },
  computed: {
    activeReports() {
      return this.report.Reports.filter((r) => parseInt(r[8]) !== 2);
    },
    closedReports() {
      return this.report.Reports.filter((r) => parseInt(r[8]) === 2);
    },
  },
  methods: {
    Open() {
      this.enable = true;
      this.page = 0;
      mp.trigger("openAdminPanel");
    },
    changePage(index) {
      this.page = index;
      if (index === 7) {
        this.history.records = [];
        this.history.inputVal = "";
        this.history.showInput = true; // show the overlay inside AdminMenu
      }
    },
    useCommand(commandName) {
      mp.invoke("command", commandName);
    },
    Close() {
      this.enable = false;
      mp.trigger("closeAdminPanel");
    },

    // ── Report helpers (called by HTML template) ──────────────────────────────
    reportSelectTicket(r) {
      if (!r) return;
      this.report.selectedTicketId = parseInt(r[0]) || -1;
      this.report.currentPlayerName = r[1] || "";
      this.report.currentTicketStatus = parseInt(r[8]) || 0;
      this.report.chatMessages = [];
      if (this.report.selectedTicketId > 0) {
        mp.trigger("Report:AdminSelectTicket", this.report.selectedTicketId);
      }
    },
    reportGoBack() {
      this.report.selectedTicketId = -1;
      this.report.chatMessages = [];
      this.report.currentPlayerName = "";
      this.report.chatInput = "";
    },
    reportSendMessage() {
      var text = (this.report.chatInput || "").trim();
      if (!text || this.report.selectedTicketId < 0) return;
      mp.trigger(
        "Report:AdminSendChatMessage",
        this.report.selectedTicketId,
        text,
      );
      this.report.chatInput = "";
    },
    reportSetStatus(status) {
      if (this.report.selectedTicketId < 0) return;
      var s = parseInt(status) || 0;
      if (s === 1) {
        mp.trigger("Report:AdminSelectTicket", this.report.selectedTicketId);
        return;
      }
      mp.trigger(
        "Report:AdminSetTicketStatus",
        this.report.selectedTicketId,
        s,
      );
      if (s === 2) {
        this.report.selectedTicketId = -1;
        this.report.chatMessages = [];
        this.report.currentPlayerName = "";
        this.report.currentTicketStatus = 2;
      }
    },
    reportIsAdmin(msg) {
      return parseInt(msg[1]) === 1;
    },
    reportStatusText(status) {
      var v = parseInt(status);
      if (v === 2) return "Closed";
      if (v === 1) return "In Questions";
      return "Open";
    },
    reportStatusClass(status) {
      var v = parseInt(status);
      if (v === 2) return "r-badge--closed";
      if (v === 1) return "r-badge--questions";
      return "r-badge--open";
    },
    historySearch() {
      var uuid = (this.history.inputVal || "").trim();
      if (!uuid) return;
      this.history.showInput = false;
      mp.trigger("AdminHistory:Search", uuid);
    },
    historyReceive(jsonData) {
      try {
        this.history.records = JSON.parse(jsonData || "[]");
      } catch (e) {
        this.history.records = [];
      }
    },
    historyCancel() {
      this.history.showInput = false;
      this.history.inputVal = "";
    },
    historyKeydown(event) {
      if (event.keyCode === 13) this.historySearch(); // Enter confirms
      if (event.keyCode === 27) this.historyCancel(); // Escape cancels
    },

    // ── Called from client-side events (mp.events) ────────────────────────────
    InitReports(adminLevel, data) {
      this.report.AdminLevel = parseInt(adminLevel) || 0;
      this.report.Reports = JSON.parse(data || "[]");

      if (this.report.selectedTicketId !== -1) {
        var sel = this.report.Reports.find(
          (r) => r[0] === this.report.selectedTicketId,
        );
        if (!sel) {
          this.report.selectedTicketId = -1;
          this.report.chatMessages = [];
          this.report.currentPlayerName = "";
          this.report.currentTicketStatus = 0;
        } else {
          this.report.currentPlayerName = sel[1] || "";
          this.report.currentTicketStatus = parseInt(sel[8]) || 0;
        }
      }
    },
    SetTicketMessages(ticketId, data, status, playerId, playerName) {
      var id = parseInt(ticketId) || -1;
      if (id !== this.report.selectedTicketId) return;
      this.report.chatMessages = JSON.parse(data || "[]");
      this.report.currentTicketStatus = parseInt(status) || 0;
      this.report.currentPlayerName =
        playerName || this.report.currentPlayerName;
    },
    AppendTicketMessage(ticketId, data) {
      var id = parseInt(ticketId) || -1;
      if (id !== this.report.selectedTicketId) return;
      var message = JSON.parse(data || "[]");
      if (Array.isArray(message) && message.length > 0) {
        this.report.chatMessages.push(message);
      }
    },
  },
});
