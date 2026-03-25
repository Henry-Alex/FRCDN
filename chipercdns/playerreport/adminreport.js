// const Report = new Vue({
//   el: ".main",
//   data: {
//     optionselected: 0,
//     reportData: [],
//     historyData: [],
//     reportinput: "",
//     tickets: [],
//     messagesByTicket: {},
//     selectedTicketId: 0,
//   },
//   watch: {
//     optionselected(value) {
//       if (parseInt(value) === 1) {
//         this.rebuildHistoryList();
//       }
//     },
//   },
//   methods: {
//     fetchData(data) {
//       const parsed = JSON.parse(data || "{}");

//       // Backward compatibility if old array payload is used.
//       if (Array.isArray(parsed)) {
//         const chatRows = [];
//         const historyRows = [];

//         parsed.forEach((row, index) => {
//           const ticketId = row[0] || index + 1;
//           const adminName = row[1] || "Admin";
//           const adminMessage = row[2] || "";
//           const playerName = row[3] || "Player";
//           const playerMessage = row[4] || "";
//           const adminTime = row[5] || "";
//           const playerTime = row[6] || adminTime;

//           if (adminMessage) {
//             chatRows.push({
//               senderType: 1,
//               senderName: adminName,
//               message: adminMessage,
//               time: adminTime,
//             });
//           }

//           if (playerMessage) {
//             chatRows.push({
//               senderType: 0,
//               senderName: playerName,
//               message: playerMessage,
//               time: playerTime,
//             });
//           }

//           historyRows.push({
//             ticketId: ticketId,
//             adminName: adminName,
//             statusText: "History",
//             updatedAt: playerTime || adminTime || "",
//             lastMessage: playerMessage || adminMessage || "No messages yet.",
//           });
//         });

//         this.reportData = chatRows;
//         this.historyData = historyRows;
//         return;
//       }

//       this.tickets = Array.isArray(parsed.tickets) ? parsed.tickets : [];
//       this.messagesByTicket = parsed.messages || {};

//       const preferredId = parseInt(parsed.activeTicketId) || 0;
//       if (
//         preferredId > 0 &&
//         this.tickets.some((ticket) => ticket[0] === preferredId)
//       ) {
//         this.selectedTicketId = preferredId;
//       } else if (
//         this.selectedTicketId > 0 &&
//         this.tickets.some((ticket) => ticket[0] === this.selectedTicketId)
//       ) {
//         // keep existing selection
//       } else if (this.tickets.length > 0) {
//         this.selectedTicketId = this.tickets[0][0];
//       } else {
//         this.selectedTicketId = 0;
//       }

//       this.rebuildMessageList();
//       this.rebuildHistoryList();
//     },
//     rebuildMessageList() {
//       const list = this.messagesByTicket[`${this.selectedTicketId}`] || [];
//       this.reportData = list.map((row) => ({
//         senderType: parseInt(row[1]) || 0,
//         senderName: row[3] || "",
//         message: row[4] || "",
//         time: row[5] || "",
//       }));
//     },
//     rebuildHistoryList() {
//       let rows = this.tickets.map((ticket) => ({
//         ticketId: ticket[0],
//         adminName: ticket[2] || "Unassigned",
//         statusText: ticket[4] || "Open",
//         updatedAt: ticket[6] || ticket[5] || "",
//         lastMessage: ticket[8] || "No messages yet.",
//       }));

//       // Fallback: if ticket metadata is missing, derive basic history from available message groups.
//       if (
//         rows.length === 0 &&
//         this.messagesByTicket &&
//         typeof this.messagesByTicket === "object"
//       ) {
//         rows = Object.keys(this.messagesByTicket)
//           .map((key) => {
//             const ticketId = parseInt(key) || 0;
//             const list = Array.isArray(this.messagesByTicket[key])
//               ? this.messagesByTicket[key]
//               : [];
//             const last = list.length > 0 ? list[list.length - 1] : null;
//             return {
//               ticketId: ticketId,
//               adminName: "Unassigned",
//               statusText: "History",
//               updatedAt: last ? last[5] || "" : "",
//               lastMessage: last
//                 ? last[4] || "No messages yet."
//                 : "No messages yet.",
//             };
//           })
//           .sort((a, b) => b.ticketId - a.ticketId);
//       }

//       this.historyData = rows;
//     },
//     sendReport() {
//       const text = (this.reportinput || "").trim();
//       if (text.length < 1) return;

//       mp.trigger("adminreport:sendReport", text, this.selectedTicketId || 0);
//       this.reportinput = "";
//     },
//   },
// });
// 1;

// const Report = new Vue({
//   el: ".main",
//   data: {
//     optionselected: 0,
//     reportData: [],
//     historyData: [],
//     reportinput: "",
//     tickets: [],
//     messagesByTicket: {},
//     selectedTicketId: 0,
//   },
//   computed: {
//     // True when the currently selected ticket is still open (status != 2)
//     selectedTicketClosed() {
//       if (this.selectedTicketId <= 0) return false;
//       const t = this.tickets.find((t) => t[0] === this.selectedTicketId);
//       return t ? parseInt(t[3]) === 2 : false;
//     },
//   },
//   watch: {
//     optionselected(value) {
//       if (parseInt(value) === 1) {
//         this.rebuildHistoryList();
//       }
//     },
//   },
//   methods: {
//     fetchData(data) {
//       const parsed = JSON.parse(data || "{}");

//       // Backward compatibility — old array payload
//       if (Array.isArray(parsed)) {
//         const chatRows = [];
//         const historyRows = [];
//         parsed.forEach((row, index) => {
//           const ticketId = row[0] || index + 1;
//           const adminName = row[1] || "Admin";
//           const adminMessage = row[2] || "";
//           const playerName = row[3] || "Player";
//           const playerMessage = row[4] || "";
//           const adminTime = row[5] || "";
//           const playerTime = row[6] || adminTime;
//           if (adminMessage) chatRows.push({ senderType: 1, senderName: adminName, message: adminMessage, time: adminTime });
//           if (playerMessage) chatRows.push({ senderType: 0, senderName: playerName, message: playerMessage, time: playerTime });
//           historyRows.push({ ticketId, adminName, statusText: "History", updatedAt: playerTime || adminTime || "", lastMessage: playerMessage || adminMessage || "No messages yet." });
//         });
//         this.reportData = chatRows;
//         this.historyData = historyRows;
//         return;
//       }

//       this.tickets = Array.isArray(parsed.tickets) ? parsed.tickets : [];
//       this.messagesByTicket = parsed.messages || {};

//       const preferredId = parseInt(parsed.activeTicketId) || 0;

//       // Check if the currently selected ticket is still open after this server push.
//       // If the admin closed it, status becomes 2 — we must reset so the player
//       // does not keep seeing stale messages in a now-closed ticket.
//       const selectedStillOpen =
//         this.selectedTicketId > 0 &&
//         this.tickets.some(
//           (t) => t[0] === this.selectedTicketId && parseInt(t[3]) !== 2
//         );

//       if (preferredId > 0 && this.tickets.some((t) => t[0] === preferredId)) {
//         // Server told us which ticket to show (the active/open one)
//         this.selectedTicketId = preferredId;
//       } else if (selectedStillOpen) {
//         // Keep current selection — ticket is still open, just refresh messages
//       } else {
//         // Current selection is gone or closed — pick first open ticket if any
//         const firstOpen = this.tickets.find((t) => parseInt(t[3]) !== 2);
//         this.selectedTicketId = firstOpen ? firstOpen[0] : 0;
//       }

//       // Always rebuild message list so newly sent/received messages appear immediately
//       this.rebuildMessageList();
//       this.rebuildHistoryList();
//     },

//     rebuildMessageList() {
//       const list = this.messagesByTicket[`${this.selectedTicketId}`] || [];
//       this.reportData = list.map((row) => ({
//         senderType: parseInt(row[1]) || 0,
//         senderName: row[3] || "",
//         message: row[4] || "",
//         time: row[5] || "",
//       }));
//     },

//     rebuildHistoryList() {
//       let rows = this.tickets.map((ticket) => ({
//         ticketId: ticket[0],
//         adminName: ticket[2] || "Unassigned",
//         statusText: ticket[4] || "Open",
//         updatedAt: ticket[6] || ticket[5] || "",
//         lastMessage: ticket[8] || "No messages yet.",
//       }));

//       if (rows.length === 0 && this.messagesByTicket && typeof this.messagesByTicket === "object") {
//         rows = Object.keys(this.messagesByTicket)
//           .map((key) => {
//             const ticketId = parseInt(key) || 0;
//             const list = Array.isArray(this.messagesByTicket[key]) ? this.messagesByTicket[key] : [];
//             const last = list.length > 0 ? list[list.length - 1] : null;
//             return {
//               ticketId,
//               adminName: "Unassigned",
//               statusText: "History",
//               updatedAt: last ? last[5] || "" : "",
//               lastMessage: last ? last[4] || "No messages yet." : "No messages yet.",
//             };
//           })
//           .sort((a, b) => b.ticketId - a.ticketId);
//       }

//       this.historyData = rows;
//     },

//     sendReport() {
//       // Block sending if the active ticket is already closed
//       if (this.selectedTicketClosed) return;

//       const text = (this.reportinput || "").trim();
//       if (text.length < 1) return;

//       mp.trigger("adminreport:sendReport", text, this.selectedTicketId || 0);
//       this.reportinput = "";
//     },
//   },
// });
// 1;

const Report = new Vue({
  el: ".main",
  data: {
    optionselected: 0,
    reportData: [],
    historyData: [],
    reportinput: "",
    tickets: [],
    messagesByTicket: {},
    selectedTicketId: 0,
    playerName: "", // populated on first fetchData so optimistic msgs show the right name
  },
  computed: {
    selectedTicketClosed() {
      if (this.selectedTicketId <= 0) return false;
      const t = this.tickets.find((t) => t[0] === this.selectedTicketId);
      return t ? parseInt(t[3]) === 2 : false;
    },
  },
  watch: {
    optionselected(value) {
      if (parseInt(value) === 1) {
        this.rebuildHistoryList();
      }
    },
  },
  methods: {
    fetchData(data) {
      const parsed = JSON.parse(data || "{}");

      // Backward compatibility — old array payload
      if (Array.isArray(parsed)) {
        const chatRows = [];
        const historyRows = [];
        parsed.forEach((row, index) => {
          const ticketId = row[0] || index + 1;
          const adminName = row[1] || "Admin";
          const adminMessage = row[2] || "";
          const playerName = row[3] || "Player";
          const playerMessage = row[4] || "";
          const adminTime = row[5] || "";
          const playerTime = row[6] || adminTime;
          if (adminMessage)
            chatRows.push({
              senderType: 1,
              senderName: adminName,
              message: adminMessage,
              time: adminTime,
            });
          if (playerMessage)
            chatRows.push({
              senderType: 0,
              senderName: playerName,
              message: playerMessage,
              time: playerTime,
            });
          historyRows.push({
            ticketId,
            adminName,
            statusText: "History",
            updatedAt: playerTime || adminTime || "",
            lastMessage: playerMessage || adminMessage || "No messages yet.",
          });
        });
        this.reportData = chatRows;
        this.historyData = historyRows;
        return;
      }

      this.tickets = Array.isArray(parsed.tickets) ? parsed.tickets : [];
      this.messagesByTicket = parsed.messages || {};

      // Grab the player's own name from ticket metadata for optimistic messages
      if (this.tickets.length > 0 && !this.playerName) {
        this.playerName = this.tickets[0][1] || "";
      }

      const preferredId = parseInt(parsed.activeTicketId) || 0;

      // If currently selected ticket was closed by admin, reset it
      const selectedStillOpen =
        this.selectedTicketId > 0 &&
        this.tickets.some(
          (t) => t[0] === this.selectedTicketId && parseInt(t[3]) !== 2,
        );

      if (preferredId > 0 && this.tickets.some((t) => t[0] === preferredId)) {
        this.selectedTicketId = preferredId;
      } else if (selectedStillOpen) {
        // keep — ticket still open, just refresh messages below
      } else {
        const firstOpen = this.tickets.find((t) => parseInt(t[3]) !== 2);
        this.selectedTicketId = firstOpen ? firstOpen[0] : 0;
      }

      // Always rebuild so new messages from server are immediately visible
      this.rebuildMessageList();
      this.rebuildHistoryList();
    },

    rebuildMessageList() {
      const list = this.messagesByTicket[`${this.selectedTicketId}`] || [];
      this.reportData = list.map((row) => ({
        senderType: parseInt(row[1]) || 0,
        senderName: row[3] || "",
        message: row[4] || "",
        time: row[5] || "",
      }));
    },

    rebuildHistoryList() {
      let rows = this.tickets.map((ticket) => ({
        ticketId: ticket[0],
        adminName: ticket[2] || "Unassigned",
        statusText: ticket[4] || "Open",
        updatedAt: ticket[6] || ticket[5] || "",
        lastMessage: ticket[8] || "No messages yet.",
      }));

      if (
        rows.length === 0 &&
        this.messagesByTicket &&
        typeof this.messagesByTicket === "object"
      ) {
        rows = Object.keys(this.messagesByTicket)
          .map((key) => {
            const ticketId = parseInt(key) || 0;
            const list = Array.isArray(this.messagesByTicket[key])
              ? this.messagesByTicket[key]
              : [];
            const last = list.length > 0 ? list[list.length - 1] : null;
            return {
              ticketId,
              adminName: "Unassigned",
              statusText: "History",
              updatedAt: last ? last[5] || "" : "",
              lastMessage: last
                ? last[4] || "No messages yet."
                : "No messages yet.",
            };
          })
          .sort((a, b) => b.ticketId - a.ticketId);
      }

      this.historyData = rows;
    },

    sendReport() {
      if (this.selectedTicketClosed) return;
      const text = (this.reportinput || "").trim();
      if (text.length < 1) return;

      // ── Optimistic update ───────────────────────────────────────────────────
      // Append the message to the chat immediately so the player sees their
      // own bubble right away, without waiting for the server round-trip.
      // The server will push back the authoritative state via Client:GetPlayerReportData
      // which will replace reportData with the confirmed version.
      const now = new Date();
      const timeStr = now.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      this.reportData.push({
        senderType: 0,
        senderName: this.playerName || "You",
        message: text,
        time: timeStr,
      });
      // ───────────────────────────────────────────────────────────────────────

      mp.trigger("adminreport:sendReport", text, this.selectedTicketId || 0);
      this.reportinput = "";
    },
  },
});
1;
