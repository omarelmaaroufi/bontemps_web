const gerechten = require('../db_apis/gerechten.js');

async function get(req, res, next) {
    try {
        const context = {};

        context.id = parseInt(req.params.id, 10);
        context.skip = parseInt(req.query.skip, 10);
        context.limit = parseInt(req.query.limit, 10);
        context.sort = req.query.sort;
        // context.department_id = parseInt(req.query.department_id, 10);
        // context.manager_id = parseInt(req.query.manager_id, 10);

        const rows = await gerechten.find(context);

        if (req.params.id) {
            if (rows.length === 1) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).end();
            }
        } else {
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
}

module.exports.get = get;

function getGerechtFromRec(req) {
    const gerecht = {
        naam: req.body.naam,
        soort: req.body.soort,
        prijs: req.body.prijs,
        bijzonderheden: req.body.bijzonderheden
    };

    return gerecht;
}

async function post(req, res, next) {
    try {
        let gerecht = getGerechtFromRec(req);

        gerechten = await gerechten.create(gerecht);

        res.status(201).json(gerecht);
    } catch (err) {
        next(err);
    }
}

module.exports.post = post;

async function put(req, res, next) {
    try {
        let gerecht = getGerechtFromRec(req);

        gerecht.id = parseInt(req.params.id, 10);


        gerecht = await gerechten.update(gerecht);

        if (gerecht !== null) {
            res.status(200).json(gerecht);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
}

module.exports.put = put;

async function del(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);

        const success = await gerecht.delete(id);

        if (success) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
}

module.exports.delete = del;