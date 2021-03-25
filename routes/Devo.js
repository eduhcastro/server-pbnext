app.get('/user', async (req, res) => {
    res.status(400)
    res.json({
       objects: {},
       status: {
          server: true,
          error: true,
          errormsg: "Incorret method",
          errorcod: 101
       }
    }).end()
 })
 
 app.post('/user', async (req, res) => {
    var Login = Master.Decode(req.body.name)
    var Auth = req.body.auth
    console.log({
       user: req.body.name,
       userdecry: Login,
       token: Auth
    })
    if (Master.State(Auth) == 1) {
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
          res.status(400)
          res.json({
             objects: {
                player: null
             },
             status: {
                server: true,
                error: true,
                errormsg: "Not Found",
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