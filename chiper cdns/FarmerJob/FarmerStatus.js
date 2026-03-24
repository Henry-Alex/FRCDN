var FarmerStats = new Vue({
    el: '.Main',
 
    
    data: {
      //farmer job stats
      showfarm:false,
       bartype:0,
       max:0,
       current:10,

       //house raid
       isFamilyHouse:false,
       familyraidstart:false,
       raidtimemax:600,
       raidtimecurrent:0,
       houseid:10,

       //atmrob
       ShowAtmRob:false,
       RobHead:"ATM Robbery",
      RobMax:120,
      Robtime:0,

      //fibraid
      ShowRaidBar:false,
      raidbarfill:0,
      raidbarwidths:0,
      raidstarttimer:null,
      RaidOn:"Ballas",
      Players:[],
      orgcount:0,
      onraidcount:0,
      RaidID:-1,
      
      gangtgs:[
        "None",
        "FAMILY",
        "BALLAS",
        "VAGOS",
        "MARABUNTA",
        "BLOOD",
        "CITY",
        "POLICE",
        "EMS",
        "FIB",
        "LCN",
        "MAFIA",
        "YAKUZA",
        "ARMENIAN",
        "ARMY",
        "LSNEWS",
        "THELOST",
        "MERRYWEATHER",
        "SHERIFF",//18
        "Black-Market",//19
        "AIRCRAFT PROTECTION",
        "MAFIA SOS",
        "PRISON CONTROL",
      ]
    },
    computed:{
      getraidaray()
      {
          return this.players;
      },
    },
    
    methods : {

      StartFibRaid(raidonid)
      {

        this.raidbarfill = 0;
        this.RaidOn = this.gangtgs[raidonid];
        this.ShowRaidBar = true;
        this.RaidID = raidonid;
      },
      StopFibRaid()
      {
          this.Players = [];
          this.ShowRaidBar = false;
          //clearInterval(this.raidstarttimer);
          this.raidbarfill = 0;
      },
      FibRaidUpdate(data, time)
      {
        this.raidbarfill = time;
        this.raidbarwidths = (this.raidbarfill * 100) / 600;
        this.Players = [];
          let d = JSON.parse(data);
          for (let i = 0; i < d.length; i++) {
            let dd = {fractionname:this.gangtgs[d[i].Key],fractionid:d[i].Key,count:d[i].Value}
            this.Players.push(dd);
          }
          
      },
      FarmStatusBar(type, max, current)
      {
          this.max = max;
          this.current = current;
          this.bartype = type;
      }
    },
});
 
 //let update =  '[{"Key":9,"Value":1}]'
 //FarmerStats.FibRaidUpdate(update)

// setTimeout(() => {
//   update =  '[{"Key":1,"Value":2},{"Key":3,"Value":4},{"Key":4,"Value":5},{"Key":5,"Value":6},{"Key":6,"Value":7},{"Key":7,"Value":8},{"Key":8,"Value":9},{"Key":9,"Value":10}]'
//   FarmerStats.FibRaidUpdate(update)
// }, 1000);

// setTimeout(() => {
//   update =  '[{"Key":1,"Value":10},{"Key":3,"Value":22},{"Key":4,"Value":5},{"Key":5,"Value":6},{"Key":6,"Value":7},{"Key":7,"Value":8},{"Key":8,"Value":9},{"Key":9,"Value":10}]'
//   FarmerStats.FibRaidUpdate(update)
// }, 5000);