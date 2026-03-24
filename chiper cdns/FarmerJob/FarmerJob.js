var Farmerjob = new Vue({
    el: '.Main',
 
    
    data: {
        menu:-1,
        skill:1,
        leave:false,
        farmid: 0,
        TotalPartsRepair:[0, 0, 0],
        repairProgress:-1,
        repairpart:-1,
        repairTimer:null,
        vehmoney:12,
        footmoney:6,
        cloud:"https://cdn.jsdelivr.net/gh/shourya90/cdnforgg@main"
    },
   // cloud:"https://cdn-redage.gtaverrp.com/cloud/inventoryItems/items/"
    methods : {
        CancleVehiclerepair()
        {
            this.repairProgress = -1;
            clearTimeout(this.repairTimer);
        },
        Vehiclerepair(part)
        { 
            this.repairProgress = part;
            this.repairpart = part;
            clearTimeout(this.repairTimer);
            this.repairTimer = setTimeout(() => {
                this.TotalPartsRepair[part] = 1;
                this.repairProgress = -1;
                if(this.TotalPartsRepair[0] == 1 && this.TotalPartsRepair[1] == 1 && this.TotalPartsRepair[2] == 1)
                {
                    mp.trigger("FarmVehicleRepaired");
                }
            }, 5000);
           
        },
      Open(skill, farmid, footmoney, vehmoney)
      {
            this.vehmoney = vehmoney;
            this.footmoney = footmoney;
            this.farmid = farmid;
            this.skill = skill;
            this.menu = 0; 
           
            
      },
      StartFarmerJob(type)
      {
         mp.trigger("StartFarmerJob", type);
      },
      LeaveFarmerJob()
      {
        mp.trigger("LeaveFarmerJob");
      },
      RepairMenu()
      {
        this.menu = 1;  
      }
    },
});

