var DASHB = new Vue({
  el: ".DashMain",

  data: {
    Name: "Shourya Singh",
    LVL: 1,
    VIP: 0,
    Job: "CashCollector",
    Admin: 0,
  },
  methods: {
    OpenType(otype) {
      mp.trigger("CloseDashBoardUI", otype);
    },
  },
});
