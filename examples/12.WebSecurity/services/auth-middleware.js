// Import dependencies
import jwt from "jsonwebtoken";

export function auth (req, res, next) {
    let token = req.header("Authorization");
    if (!token) return res.status(401).send({
        ok: false,
        error: "Access denied. No token provided"
    });

    try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, "jwtPrivateKey");
        req.user = decoded;
    } catch (error) {
        return res.status(401).send({
            ok: false,
            error: "Token expired"
        });
    }

    next();
}

export function admin(req, res, next) {
    if (!req.user.roles.includes("admin")) return res.status(403).send({
        ok: false,
        error: "Access denied."
    });

    next();
}

export function editor(req, res, next) {
    if (!req.user.roles.includes("editor")) return res.status(403).send({
        ok: false,
        error: "Access denied."
    });

    next();
}

export function viewer(req, res, next) {
    if (!req.user.roles.includes("viewer")) return res.status(403).send({
        ok: false,
        error: "Access denied."
    });

    next();
}