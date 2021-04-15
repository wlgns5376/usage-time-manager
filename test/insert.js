let DataStore = require('nedb');


let usersdb = new DataStore({ filename: '../data/users-test.db', autoload: true });

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getTimeAtText(time) {

    const hour = Math.floor(time/3600);
    const minute = Math.floor(time%3600/60);

    return hour+':'+ (minute >= 10 ? minute : '0'+minute);
}

let users = [];
let starttime = (new Date().getTime());

for( let i = 0; i < 100000; i++ ){
    starttime = starttime + (getRandomInt(1, 9) * 10000);
    users.push({
        name: 'user'+i,
        student: 1,
        adult: 0,
        accompanied: 0,
        climb: 1,
        shoes: 1,
        starttime: starttime,
        endtime: starttime + (getRandomInt(1, 9) * 100000),
        usagetime: getTimeAtText(3600 + (getRandomInt(0, 5)*100)),
        amount: getRandomInt(1, 20)*10000,
        status: 2
    });
}

usersdb.insert(users);