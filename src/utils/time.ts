import moment from "moment";

export const formatTime = (time?: number) => {
    if (!time) {
        return ''
    }

    return moment(time * 1000).format("YYYY-MM-DD HH:mm:ss")
}
