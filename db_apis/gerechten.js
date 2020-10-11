const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
    `select id "id",
    soort "soort",
    naam "naam",
    prijs "prijs",
    bijzonderheden "bijzonderheden"
  from gerechten`;

const sortableColumns = ['id', 'soort', 'naam', 'prijs', 'bijzonderheden'];

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.id) {
        binds.id = context.id;

        query += '\nand id = :id';
    }


    if (context.sort === undefined) {
        query += '\norder by 1 asc';
    } else {
        let [column, order] = context.sort.split(':');

        if (!sortableColumns.includes(column)) {
            throw new Error('Invalid "sort" column');
        }

        if (order === undefined) {
            order = 'asc';
        }

        if (order !== 'asc' && order !== 'desc') {
            throw new Error('Invalid "sort" order');
        }

        query += `\norder by "${column}" ${order}`;
    }

    if (context.skip) {
        binds.row_offset = context.skip;

        query += '\noffset :row_offset rows';
    }

    const limit = (context.limit > 0) ? context.limit : 30;

    binds.row_limit = limit;

    query += '\nfetch next :row_limit rows only';

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports.find = find;

const createSql =
    `insert into gerechten (
    id,
    soort,
    naam,
    prijs,
    bijzonderheden
  ) values (
    :id,
    :soort,
    :naam,
    :prijs,
    :bijzonderheden
  ) returning id
  into :id`;

async function create(ger) {
    const gerecht = Object.assign({}, ger);

    gerecht.id = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
    }

    const result = await database.simpleExecute(createSql, gerecht);

    gerecht.id = result.outBinds.id[0];

    return gerecht;
}

module.exports.create = create;

const updateSql =
    `update gerechten
  set naam = :naam,
    prijs = :prijs,
    bijzonderheden = :bijzonderheden
  where id = :id`;

async function update(ger) {
    const gerecht = Object.assign({}, ger);
    const result = await database.simpleExecute(updateSql, gerecht);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return gerecht;
    } else {
        return null;
    }
}

module.exports.update = update;

const deleteSql =
    `begin
    delete from gerechten
    where id = :id;
    :rowcount := sql%rowcount;
  end;`

async function del(id) {
    const binds = {
        id: id,
        rowcount: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER
        }
    }
    const result = await database.simpleExecute(deleteSql, binds);

    return result.outBinds.rowcount === 1;
}

module.exports.delete = del;