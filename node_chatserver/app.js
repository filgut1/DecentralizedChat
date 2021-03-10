const httpDB = require('http').createServer().listen(3001);
const Gun = require('gun');
Gun.log.verbose = true;

// Add listener
Gun.on('opt', function (ctx) {
    if (ctx.once) {
      return
    }
    // Check all incoming traffic
    // Do some sort of validation on the msg
    ctx.on('in', function (msg) {
        var to = this.to
        // restrict put
        to.next(msg)
    });
});

const gunDB = Gun({web: httpDB});

gunDB.on('out', { get: { '#': { '*': '' } } });
