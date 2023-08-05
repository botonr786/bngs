"use strict"

const {userdeletecronjob} = require("./controller/superAdmin.controller")
var cron = require("node-cron")


exports.croninit = async (processs) => {
    cron.schedule("0 */30 * * * *", () => {
      userdeletecronjob()
    })
};

