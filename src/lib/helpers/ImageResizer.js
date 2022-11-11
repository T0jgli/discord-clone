import Resizer from "react-image-file-resizer";

export default function (file) {
    return new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            250,
            250,
            "WEBP",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "file"
        );
    });
}
