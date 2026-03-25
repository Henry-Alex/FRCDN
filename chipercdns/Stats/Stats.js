var StatsUI = new Vue({
    el: '.StatsUIMain',
 
    
    data: {
        JailTime:0,
        JailedBy:"",
        Reason:"",
    },
    methods : {
        JailUpdate(time, arrby, reason)
        {
            this.JailTime = time;
            this.JailedBy = arrby;
            this.Reason = reason;
        },
        setTimes(totalSeconds) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(seconds)}`;
        },
        padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        },
    },
});

