const fs = require('fs')
const os = require('os')

const logger = (msg) => {
    let id = msg.from.id
    let text = msg.text
    let first_name = msg.from.first_name
    let date = Date.now()

    let data = `${date} - ${id} - ${first_name} - ${text}`

    fs.appendFile("server.log", data + os.EOL, (err) => {
        if (err) throw err;
      })
}

module.exports = logger