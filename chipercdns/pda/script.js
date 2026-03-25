var PDA_APP = new Vue({
  el: "#pda-app",
  data: {
    query: "",
    lastQuery: "",
    searching: false,
    notFound: false,
    result: null,
    activeNav: 0,
    activeTab: "search",
    resultContext: "search",
    issueWarrantOpen: false,
    warrantStars: 1,
    warrantReason: "",
    vehicleWarrantOpen: false,
    vehiclePlate: "",
    vehicleWarrantReason: "",
    citizenBlacklistOpen: false,
    citizenBlacklistReason: "",
    wantedQuery: "",
    wantedList: [],
    wantedLoading: false,
    wantedLoaded: false,
    canClearWanted: false,
    clearingWantedUuid: null,
    blacklistQuery: "",
    blacklistList: [],
    blacklistLoading: false,
    canManageBlacklist: false,
    removingBlacklistUuid: null,
    tabs: [
      "information",
      "Player Transport",
      "previously Committed crime",
      "penalties received",
    ],
  },
  computed: {
    filteredWantedList() {
      const search = this.wantedQuery.trim().toLowerCase();

      if (!search) return this.wantedList;

      return this.wantedList.filter((player) => {
        const haystack = [
          player.name,
          player.phone,
          String(player.uuid),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    },
    filteredBlacklistList() {
      const search = this.blacklistQuery.trim().toLowerCase();

      if (!search) return this.blacklistList;

      return this.blacklistList.filter((entry) => {
        const haystack = [
          entry.name,
          entry.reason,
          String(entry.uuid),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    },
  },
  methods: {
    closeActionForms() {
      this.issueWarrantOpen = false;
      this.warrantStars = 1;
      this.warrantReason = "";
      this.vehicleWarrantOpen = false;
      this.vehiclePlate = "";
      this.vehicleWarrantReason = "";
      this.citizenBlacklistOpen = false;
      this.citizenBlacklistReason = "";
    },

    doSearch() {
      const q = this.query.trim();
      if (!q) return;

      if (this.activeTab !== "issue") this.activeTab = "search";
      this.resultContext = this.activeTab;
      this.searching = true;
      this.notFound = false;
      this.result = null;
      this.lastQuery = q;
      this.closeActionForms();

      mp.trigger("pda.search", q);
    },

    receiveResult(data) {
      data.vehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
      data.previousCrimes = Array.isArray(data.previousCrimes)
        ? data.previousCrimes
        : [];
      data.penaltiesReceived = Array.isArray(data.penaltiesReceived)
        ? data.penaltiesReceived
        : [];
      data.vehicles = data.vehicles.map((vehicle) => ({
        modelName: vehicle.modelName || vehicle.ModelName || "Unknown vehicle",
        plate: vehicle.plate || vehicle.Plate || "",
      }));
      data.matchedVehiclePlate =
        data.matchedVehiclePlate ||
        data.MatchedVehiclePlate ||
        data.searchPlate ||
        "";

      this.result = data;
      this.notFound = false;
      this.searching = false;
      this.activeNav = 0;
      this.closeActionForms();
    },

    setNotFound() {
      this.notFound = true;
      this.result = null;
      this.searching = false;
      this.closeActionForms();
    },

    resetPDA() {
      this.result = null;
      this.notFound = false;
      this.query = "";
      this.activeNav = 0;
      this.activeTab = "search";
      this.resultContext = "search";
      this.closeActionForms();
      this.wantedQuery = "";
      this.wantedList = [];
      this.wantedLoading = false;
      this.wantedLoaded = false;
      this.canClearWanted = false;
      this.clearingWantedUuid = null;
      this.blacklistQuery = "";
      this.blacklistList = [];
      this.blacklistLoading = false;
      this.canManageBlacklist = false;
      this.removingBlacklistUuid = null;
    },

    backToSearch() {
      this.result = null;
      this.notFound = false;
      this.searching = false;
      this.activeNav = 0;
      this.activeTab = this.resultContext === "issue" ? "issue" : "search";
      this.closeActionForms();
    },

    switchToSearch() {
      this.resultContext = "search";
      this.backToSearch();
    },

    switchToIssue() {
      this.resultContext = "issue";
      this.result = null;
      this.notFound = false;
      this.searching = false;
      this.activeNav = 0;
      this.activeTab = "issue";
      this.closeActionForms();
    },

    switchToWantedBase() {
      this.activeTab = "wantedBase";
      this.result = null;
      this.notFound = false;
      this.searching = false;
      this.closeActionForms();
      this.wantedQuery = "";
      this.loadWantedList();
    },

    switchToBlacklist() {
      this.activeTab = "blacklist";
      this.result = null;
      this.notFound = false;
      this.searching = false;
      this.closeActionForms();
      this.blacklistQuery = "";
      this.loadBlacklist();
    },

    loadWantedList() {
      this.wantedLoading = true;
      this.wantedLoaded = true;
      this.clearingWantedUuid = null;
      mp.trigger("pda.loadWantedList");
    },

    receiveWantedList(payload) {
      const rawPlayers = Array.isArray(payload && payload.players)
        ? payload.players
        : [];

      this.wantedList = rawPlayers
        .map((player) => ({
          uuid: Number(player.uuid || player.Uuid || 0),
          name: player.name || player.Name || "Unknown",
          phone: player.phone || player.Phone || "Not available",
          stars: Number(player.stars || player.Stars || 0),
          reason: player.reason || player.Reason || "No reason provided",
        }))
        .filter((player) => player.uuid > 0);

      this.canClearWanted = !!(payload && payload.canClearWanted);
      this.wantedLoading = false;
      this.wantedLoaded = true;
      this.clearingWantedUuid = null;
    },

    clearWanted(player) {
      if (!player || !player.uuid) return;

      if (!this.canClearWanted) {
        alert("You do not have permission to clear wanted records.");
        return;
      }

      this.clearingWantedUuid = player.uuid;
      mp.trigger("pda.clearWanted", player.uuid);
    },

    loadBlacklist() {
      this.blacklistLoading = true;
      mp.trigger("pda.loadCitizenBlacklist");
    },

    receiveBlacklistList(payload) {
      const rawEntries = Array.isArray(payload && payload.entries)
        ? payload.entries
        : [];

      this.blacklistList = rawEntries
        .map((entry) => ({
          uuid: Number(entry.uuid || entry.Uuid || 0),
          name: entry.name || entry.Name || "Unknown",
          reason: entry.reason || entry.Reason || "No reason provided",
          issuerName: entry.issuerName || entry.IssuerName || "Unknown",
          date: entry.date || entry.Date || "",
        }))
        .filter((entry) => entry.uuid > 0);

      this.canManageBlacklist = !!(payload && payload.canManageBlacklist);
      this.blacklistLoading = false;
      this.removingBlacklistUuid = null;
    },

    removeCitizenBlacklist(entry) {
      if (!entry || !entry.uuid) return;

      if (!this.canManageBlacklist) {
        alert("You do not have permission to remove blacklist entries.");
        return;
      }

      this.removingBlacklistUuid = entry.uuid;
      mp.trigger("pda.removeCitizenBlacklist", entry.uuid);
    },

    handleWantedClearResult(success, message) {
      this.clearingWantedUuid = null;
      alert(message || (success ? "Wanted cleared." : "Could not clear wanted."));

      if (success) this.loadWantedList();
    },

    openIssueWarrant() {
      if (!this.result || !this.result.uuid) return;

      this.issueWarrantOpen = true;
      this.warrantStars = 1;
      this.warrantReason = "";
      this.vehicleWarrantOpen = false;
      this.citizenBlacklistOpen = false;
    },

    cancelWarrant() {
      this.closeActionForms();
      this.activeNav = 0;

      if (!this.result) this.resetPDA();
    },

    submitWarrant() {
      if (!this.result || !this.result.uuid) {
        alert("No target selected");
        return;
      }

      if (!this.warrantReason || this.warrantReason.trim().length === 0) {
        alert("Reason is required");
        return;
      }

      if (
        !Number.isInteger(this.warrantStars) ||
        this.warrantStars < 1 ||
        this.warrantStars > 6
      ) {
        alert("Stars must be between 1 and 6");
        return;
      }

      mp.trigger(
        "pda.issueWarrant",
        this.result.uuid,
        this.warrantStars,
        this.warrantReason.trim(),
      );

      this.issueWarrantOpen = false;
      alert("Warrant requested. Check the result in game.");
    },

    openVehicleWarrant() {
      if (!this.result) return;

      this.closeActionForms();
      this.vehicleWarrantOpen = true;
      this.vehiclePlate =
        this.result.matchedVehiclePlate ||
        (this.result.vehicles[0] && this.result.vehicles[0].plate) ||
        "";
    },

    submitVehicleWarrant() {
      const plate = this.vehiclePlate.trim();
      const reason = this.vehicleWarrantReason.trim();

      if (!plate) {
        alert("Vehicle plate is required");
        return;
      }

      if (!reason) {
        alert("Reason is required");
        return;
      }

      mp.trigger("pda.issueVehicleWarrant", plate, reason);
      this.vehicleWarrantOpen = false;
      this.vehicleWarrantReason = "";
      alert("Vehicle warrant requested. Check the result in game.");
    },

    openCitizenBlacklist() {
      if (!this.result || !this.result.uuid) return;

      this.closeActionForms();
      this.citizenBlacklistOpen = true;
      this.citizenBlacklistReason = "";
    },

    submitCitizenBlacklist() {
      if (!this.result || !this.result.uuid) {
        alert("No target selected");
        return;
      }

      const reason = this.citizenBlacklistReason.trim();
      if (!reason) {
        alert("Reason is required");
        return;
      }

      mp.trigger("pda.blacklistCitizen", this.result.uuid, reason);
    },

    handleCitizenBlacklistResult(success, message) {
      alert(
        message || (success ? "Citizen blacklisted." : "Could not blacklist citizen."),
      );

      if (!success) return;

      this.citizenBlacklistOpen = false;
      this.citizenBlacklistReason = "";
      this.loadBlacklist();
    },

    handleCitizenBlacklistRemoveResult(success, message) {
      this.removingBlacklistUuid = null;
      alert(
        message ||
          (success
            ? "Citizen removed from blacklist."
            : "Could not remove blacklist entry."),
      );

      if (success) this.loadBlacklist();
    },

    sendGlobalCall() {
      mp.trigger("pda.globalCall");
    },

    sendLocalCall() {
      mp.trigger("pda.localCall");
    },

    onInputFocus(focused) {
      mp.trigger("inputFocus", focused);
    },
  },
});

window.PDA_APP = PDA_APP;

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    mp.trigger("pda.close");
  }
});
