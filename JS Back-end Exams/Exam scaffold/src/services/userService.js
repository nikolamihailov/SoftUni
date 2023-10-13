const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("../lib/jwt");
const { SECRET } = require("../constants");

exports.register = async (userData) => {
    const { firstName, lastName, email } = userData;
    User.create(userData);
    const payload = { firstName, lastName, email };
    const token = await jwt.sign(payload, SECRET, { expiresIn: "1d" });
    return token;
};

exports.login = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid email or password");

    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect) throw new Error("Invalid email or password");

    const payload = { email, firstName: user.firstName, lastName: user.lastName };
    const token = await jwt.sign(payload, SECRET, { expiresIn: "1d" });
    return token;
};