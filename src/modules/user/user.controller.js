function dashboard(req, res) {
    res.status(200).send("Welcome to our dashboar!");
}

module.exports.dashboard = dashboard;