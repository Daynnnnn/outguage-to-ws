import 'dotenv/config'
import Pusher from "pusher"
import struct from 'python-struct';
import udp from 'dgram';

let pusherConfig = {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
}

if (process.env.PUSHER_HOST != null) {
    pusherConfig['host'] = process.env.PUSHER_HOST;
    pusherConfig['port'] = process.env.PUSHER_PORT ?? 443;
} else {
    pusherConfig['cluster'] = process.env.PUSHER_APP_CLUSTER;
}

const PusherClient = new Pusher(pusherConfig);

const socket = udp.createSocket('udp4');

socket.on('message',function(msg, info){
    let parsedMessage = parseBuffer(msg);

    PusherClient.trigger('outguage-stream', 'payload', JSON.stringify(parsedMessage))
});

socket.bind(4444);

function parseBuffer(msg) {
    // TODO: Do this without python struct shim
    // Thanks to this guy for the format string: https://www.beamng.com/threads/outgauge-support-specifications.82507/#post-1377441
    let data = struct.unpack('I4sH2c7f2I3f16s16si', msg);

    return {
        time: data[0],
        car: data[1],
        flags: data[2],
        gear: getGear(msg.slice(10, 11)[0]),
        player_id: data[4],
        speed: mPerSecondToMPH(data[5]),
        rpm: data[6],
        turbo: barToPSI(data[7]),
        engine_temprature: data[8],
        fuel_remaining: data[9],
        oil: {
            pressure: data[10],
            temprature: data[11],
        },
        dash_lights: {
            availible: data[12],
            on: data[13],
        },
        throttle: data[14],
        brake: data[15],
        clutch: data[16],
        display_1: data[17],
        display_2: data[18],
        id: data[19],
    };
}

function mPerSecondToMPH(MPS) {
    return Math.round(MPS * 2.23694);
}

function barToPSI(bar) {
    return Math.round(bar * 14.5038 * 100) / 100;
}

function getGear(gear) {
    if (gear == 0) {
        return 'R';
    }

    if (gear == 1) {
        return 'N';
    }

    return gear - 1;
}
