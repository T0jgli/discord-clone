export default function (messages) {
    let tempfiles = [];
    let tempimages = [];
    messages.forEach((message) => {
        if (message.filename) {
            tempfiles.push(message.filename);
        }
        if (message.imagename) {
            tempimages.push(message.imagename);
        }
    });

    return [tempfiles, tempimages];
}
