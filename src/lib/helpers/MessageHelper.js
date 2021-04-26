export function getdays(messagetime) {
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    let todaybool = false;
    let yesterdaybool = false;
    if (messagetime.getDate() === today.getDate() && messagetime.getMonth() === today.getMonth()) {
        todaybool = true;
    }
    if (messagetime.getDate() === yesterday.getDate() && messagetime.getMonth() === yesterday.getMonth()) {
        yesterdaybool = true;
    }

    if (todaybool) return "Today";
    else if (yesterdaybool) return "Yesterday";
    else return null;
}

export function geturl(message) {
    let exactprefix,
        messageendindex = "",
        messageafterurl = "",
        messagebeforeurl = "",
        messageurl = "",
        newmessage = [];
    let prefixes = ["www.", "https://", "http://", "ftp://"];
    prefixes.map((prefix) => {
        if (message.includes(prefix)) {
            exactprefix = prefix;
        }
        return null;
    });
    if (exactprefix) {
        for (let index = message.indexOf(exactprefix); index < message.length; index++) {
            if (message[index] === " ") {
                break;
            } else {
                messageurl += message[index];
                messageendindex = index;
            }
        }
        for (let index = 0; index < message.indexOf(exactprefix); index++) {
            messagebeforeurl += message[index];
        }
        for (let index = messageendindex + 1; index < message.length; index++) {
            messageafterurl += message[index];
        }
    }
    newmessage.push(messageurl);
    newmessage.push(messagebeforeurl);
    newmessage.push(messageafterurl);
    if (exactprefix) {
        return newmessage;
    } else {
        return null;
    }
}

export function messagetimefunc(t) {
    let minute = t.getMinutes();
    let seconds = t.getSeconds();
    if (minute < 10) {
        minute = "0" + t.getMinutes();
    }
    if (seconds < 10) seconds = "0" + t.getSeconds();
    return minute + ":" + seconds;
}
