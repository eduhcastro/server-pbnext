module.exports = function(app,Master,pool){
app.post('/login', async (req, res) => {
    var Token = req.body.authorization
    var CheckToken = Master.State(Token)
    console.log({
       Action: "Login",
       Token: Token,
       Check: CheckToken != 1 ? "Authorized": "Not authorized"
    })
    if (CheckToken == 1) {
       res.status(403)
       res.json({
          objects: {},
          status: {
             server: true,
             error: true,
             errormsg: "Invalid Token",
             errorcod: 103
          }
       })
       res.end();
       return;
    }
    var Login = CheckToken.userID
    if (await Master.TryConnect(pool) != 1) {
       res.status(403)
       res.json({
          objects: {},
          status: {
             server: false,
             error: true,
             errormsg: "Server Offline",
             errorcod: 99
          }
       })
       res.end();
    }
    else {
      const PlayerInfo = await Master.Login(Login, pool);
      if (PlayerInfo == 99) {
         res.status(400)
         res.json({
            objects: {
               player: null
            },
            status: {
               server: true,
               error: true,
               errormsg: "Incorret Pass/User",
               errorcod: 102
            }
         })
         res.end();
      }
      else {
         res.status(200)
         res.json({
            objects: {
               player: PlayerInfo
            },
            status: {
               server: true,
               error: false,
               errormsg: null,
               errorcod: 0
            }
         });
         res.end();
      }
    }
 })
}