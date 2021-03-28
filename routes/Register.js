module.exports = function(app,Master,pool){
    app.post('/register', async (req, res) => {
        var Token = req.body.authorization
        var CheckToken = Master.State(Token)
        console.log({
            Action: "Register",
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
        var Pass = CheckToken.PassWord
        var Mail = CheckToken.Email
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
          const PlayerInfo = await Master.WhatUser(Login, pool);
          if (PlayerInfo == 99) {
             const PlayerRegister = await Master.Register(Login,Pass,Mail,pool);
               if(PlayerRegister == 99){
                  res.status(400)
                  res.json({
                     objects: {
                        login: Login
                     },
                     status: {
                        server: true,
                        error: false,
                        errormsg: null,
                        errorcod: 0
                     }
                  })
                  res.end();
               }else{
                  res.status(400)
                  res.json({
                     objects: {
                        login: null
                     },
                     status: {
                        server: true,
                        error: true,
                        errormsg: "Erro Interno",
                        errorcod: 204
                     }
                  })
                  res.end();
               }
          }
          else {
             res.status(400)
             res.json({
               objects: {
                  login: null
               },
               status: {
                  server: true,
                  error: true,
                  errormsg: "User exist",
                  errorcod: 201
               }
            })
            res.end();
          }
        }
     })
    }