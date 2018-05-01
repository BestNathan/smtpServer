const SMTPServer = require('smtp-server').SMTPServer
const parser = require('mailparser').simpleParser
const handler = require('./emailHandler')

const auth = new Set(['nathan', 'chuan', 'kuxiao'])

const server = new SMTPServer({
    disabledCommands: ['AUTH', 'STARTTLS'],
    onConnect(session, callback) {
        //console.log('onConnection: ' + session.remoteAddress)
        return callback()
    },
    onClose(session) {
        //console.log('onClose: ' + session.remoteAddress)
    },
    onMailFrom(address, session, callback) {
        if (~address.address.indexOf('weixinteam')) {
            return callback()
        }
        return callback(
            new Error('this server is only recieve mail from wx team')
        )
    },
    onRcptTo(address, session, callback) {
        try {
            let user = address.address.split('@')[0].split('.')[1]
            if (!user || !auth.has(user)) {
                return callback(new Error('no auth'))
            }
            return callback()
        } catch (error) {
            return callback(error)
        }
    },
    onData(stream, session, callback) {
        parser(stream).then(mail => {
            let message = mail['html']
            let subject = mail['subject']
            if (subject == '微信注册确认') {
                //console.log('recieve eamil binding')
                handler
                    .handleBind(message)
                    .then(() => {
                        //console.log('url request finish')
                    })
                    .catch(e => {
                        //console.log('url request has an error: ' + e.message)
                    })
            }
        })
        stream.on('end', callback)
    }
})

server.on('error', err => {
    console.log('Error occurred')
    console.log(err)
})

module.exports = server
