const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {

    const token =
        req.cookies.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({
            message: "Token is missing"
        });
    }

    const istokenblacklisted = await tokenBlacklistModel.findOne({ token });

    if (istokenblacklisted) {
        return res.status(400).json({
            message: "Token is Invalid"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED:", decoded);
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(400).json({
            message: "Token invalid"
        });
    }
}

module.exports = { authUser };