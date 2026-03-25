var FarmerBuyer = new Vue({
    el: '.Main',
 
    
    data: {
       
        FarmItems:[],
        cloud:"https://cdn.jsdelivr.net/gh/shourya90/cdnforgg@main/cloud/inventoryItems/items/"
    },
   // cloud:"https://cdn-redage.gtaverrp.com/cloud/inventoryItems/items/"
    methods : {
       InitPlayerFarmItems(data)
       {
            this.FarmItems = [];
            let d  = JSON.parse(data);
            for (let i = 0; i < d.length; i++) {
               
                    let add = {id:d[i][0], name:d[i][1], amount:d[i][2], cost:d[i][3], sellingamount:1, totalsellingcost:d[i][3]};
                    this.FarmItems.push(add);
            }
       }, 
       SellItem(i)
       {
            let totalsellingcost = this.FarmItems[i].totalsellingcost;
            let sellingamount = this.FarmItems[i].sellingamount;
            mp.trigger("SellFarmItem", this.FarmItems[i].id, sellingamount, totalsellingcost);
            this.FarmItems[i].amount -= sellingamount;
       },
       Closemenu()
       {
            mp.trigger('destroyBrowser');
       },

    },
});




// let s = '[[393,"Wheat Plant",5,50],[394,"Wheat Seed",0,20],[395,"Pumkin Plant",2,55],[396,"Pumkin Seed",4,25],[397,"Flax Seed",3,20],[398,"Cumin",4,55],[399,"Coffee Been",5,55],[400,"Cabbage Plant",6,55]]'
// FarmerBuyer.InitPlayerFarmItems(s)