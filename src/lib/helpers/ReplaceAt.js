export default function (string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}
