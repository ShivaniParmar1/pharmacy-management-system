const Joi = require("joi")
const knex = require("../config/mysql_db.js")
const fun = require("../helpers/functions.js")
const constants = require("../helpers/constants.js")

const create = async (req, res) => {
    try {
        // if (!req.validate("materials", "create")) {
        //     return false
        // }

        const schema = Joi.object({
            name: Joi.string().required()
        }).unknown(true)

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.json({
                error: true,
                message: "Field error.",
                data: error
            })
        }

        const { name } = value

        const data = {
            name
        }
        const files = req.files
        if (files) {
            const filePath = `${constants.indexPath}/uploads/`
            const imageFile = files.logo

            const uploadStatus = await fun.uploadFile(filePath, imageFile)
            data.logo = uploadStatus.data
        }



        const insertId = await knex("channels").insert(data)
        if (!insertId) {
            res.json({
                error: true,
                message: "Inserting in the database Failed"
            })
            return res.end()
        }
        res.json({
            error: false,
            message: "Added successfully.",
            data: {
                insertId
            }
        })
        return res.end()
    } catch (error) {
        fun.sendErrorLog(req, error)
        res.json({
            error: true,
            message: "Something went wrong.",
            data: { error: JSON.stringify(error) }
        })
        return res.end()
    }
}

const paginate = async (req, res) => {
    try {
        const tableName = "channels"
        const searchFrom = ["name"]

        const schema = Joi.object({
            offset: Joi.number().default(0),
            limit: Joi.number().default(50),
            sort: Joi.string().default("id"),
            order: Joi.string().valid("asc", "desc").default("desc"),
            status: Joi.string().valid("0", "1", "").default(""),
            search: Joi.string().allow('', null).default(null),
        }).unknown(true)

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.json({
                error: true,
                message: "Field error.",
                data: error
            })
        }

        let { offset, limit, order, sort, search, status } = value;
        let results = knex(tableName)
        if (status != undefined && status != "") {
            total = results.where("status", status)
        }
        results = results.where(function () {
            if (search != undefined && search != "") {
                searchFrom.forEach(element => {
                    this.orWhereILike(element, `%${search}%`)
                })
            }
        })
        const total = await results.count("id as total").first()
        let rows = knex(tableName)
        if (status != undefined && status != "") {
            rows.where('status', status)
        }
        rows = rows.where(function () {
            if (search != undefined && search != "") {
                searchFrom.forEach(element => {
                    this.orWhereILike(element, `%${search}%`)
                })
            }
        })
        rows = await rows.orderBy(sort, order).limit(limit).offset(offset)
        let data_rows = [];

        if (order === "desc") {
            let sr = offset + 1;
            await rows.forEach(row => {
                row.sr = sr;
                delete row.password;
                data_rows.push(row);
                sr++;

            });
        } else {
            let sr = total.total - (limit * offset)
            await rows.forEach(row => {
                row.sr = sr;
                delete row.password;
                data_rows.push(row);
                sr--;
            });
        }
        data_rows = data_rows.map(row => {
            if (row.logo) {
                row.logo = fun.getStaticUrl(row.logo)
                return row
            }
            return row
        });
        res.status(200).json({
            error: false,
            message: "retrieved successfully.",
            data: {
                rows: data_rows,
                total: total.total,
            }
        });
    } catch (error) {
        fun.sendErrorLog(req, error)
        res.json({
            error: true,
            message: "Something went wrong.",
            data: { error: JSON.stringify(error) }
        })
        return res.end()
    }
}

const update = async (req, res) => {
    try {
        const tableName = "channels"
        const schema = Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required()
        }).unknown(true)

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.json({
                error: true,
                message: "Field error.",
                data: error
            })
        }

        const { id, name } = value
        const data = {
            id,
            name
        }
        const files = req.files

        const filePath = `${constants.indexPath}/uploads/`
        const imageFile = files.logo

        const uploadStatus = await fun.uploadFile(filePath, imageFile)
        data.logo = uploadStatus.data

        const insertId = await knex(tableName).update(data).where({ id })
        if (!insertId) {
            res.json({
                error: true,
                message: "Update in the database Failed"
            })
            return res.end()
        }
        res.json({
            error: false,
            message: "Company type Updated successfully.",
            data: {
                insertId
            }
        })
        return res.end()
    } catch (error) {
        fun.sendErrorLog(req, error)
        res.json({
            error: true,
            message: "Something went wrong.",
            data: { error: JSON.stringify(error) }
        })
        return res.end()
    }
}
const deletec = async (req, res) => {
    try {
        const tableName = "channels"

        const schema = Joi.object({
            id: Joi.number().required()
        }).unknown(true)

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.json({
                error: true,
                message: "Field error.",
                data: error
            })
        }

        const { id } = value

        const check = await knex(tableName).where({ id }).del()
        if (!check) {
            res.json({
                error: true,
                message: "Delete Failed."
            })
            return res.end()
        }
        res.json({
            error: false,
            message: "Deleted Successfully."
        })
        return res.end()
    } catch (error) {
        fun.sendErrorLog(req, error)
        res.json({
            error: true,
            message: "Something went wrong.",
            data: { error: JSON.stringify(error) }
        })
        return res.end()
    }
}

const config = async (req, res) => {
    const { id, ...data } = req.body
    await knex("channels").where({ id }).update({ config: JSON.stringify(data) })
    return res.json({
        error: false,
        message: "Configurations Updated Successfully"
    })
}

const getConfig = async (req, res) => {
    const { id } = req.body
    let data = await knex("channels").where({ id })
    if (data.length === 0) {
        return res.json({
            error: true,
            message: "Channel not found."
        })
    }
    data = data[0]
    try {
        data.config = JSON.parse(data.config)
    } catch (err) {
        data.config = {}
    }
    return res.json({
        error: false,
        message: "config received successfully",
        data
    })

}



module.exports = {
    paginate,
    create,
    update,
    deletec,
    config,
    getConfig
}
