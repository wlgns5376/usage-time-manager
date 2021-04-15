export function caculateUsageTime(start){
    const current = (new Date()).getTime();

    return Math.floor((current-start)/1000);
}

export function numberFormat(num){
    var str = typeof num === 'string' ? num : num.toString();
    var objRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');

    while(objRegExp.test(str))  {
        str = str.replace(objRegExp, '$1,$2');
    }

    return str;
}

export function getSettings(){
    //const { remote } = window.require('electron');

    //return remote.require('electron-settings');

    return require('../settings.default');
}

export function calculateFee(user){
    let priceList = getSettings().prices;

    var fee = (user.student * priceList.student) + (user.adult * priceList.adult) + (user.accompanied * priceList.accompanied);
    fee += (user.drink * priceList.drink) + (user.shoes * priceList.shoes);

    if( user.starttime > 0 ){
        fee += (Math.floor(caculateUsageTime(user.starttime)/3600) * priceList.surcharge * (parseInt(user.student) + parseInt(user.adult)));
    }

    return fee;
}

export function zeroFill(num) {
    return num >= 10 ? num : '0'+num;
}

export function getTextByDate(date) {
    return [date.getFullYear(), zeroFill(date.getMonth()+1), zeroFill(date.getDate())].join('-');
}
