module.exports = async () => {
    process.on("uncaughtException", (err,origin) => {
        console.error(err),
        console.error(origin)
    })
    process.on("uncaughtExceptionMonitor", (err,origin) => {
        console.error(err),
        console.error(origin)
    })
    process.on("unhandledRejection", (err,origin) => {
        console.error(err),
        console.error(origin)
    })
}