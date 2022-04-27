// Import dependencies
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function login(req, res) {
    // Dummy data
    const users = [{ email: "test@secure.dev", password: "$2b$15$qYpMH.873ULzsZH.ih5Dc.54TfcLvUPY9cKAKcCd1K4G0RjwyMbZe", roles: ["admin", "editor", "viewer"] }];

    // Get to user from the database, if the user is not there return error
    let user = users.find(u => u.email === req.body.email);
    if (!user) throw new Error("Invalid email or password.");

    // Compare the password with the password in the database
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) throw new Error("Invalid email or password.");

    const token = jwt.sign({
        id: user.email,
        roles: user.roles,
    }, "jwtPrivateKey", { expiresIn: "15m" });

    res.send({
        ok: true,
        id_token: token
    });
}