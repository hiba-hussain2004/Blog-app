const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const usermodel = require("./models/users")
const postModel = require("./models/posts")
let app = Express()
app.use(Express.json())
app.use(Cors())
Mongoose.connect("mongodb://hiba:hiba2004@ac-sdbjr8i-shard-00-00.qlrxeq6.mongodb.net:27017,ac-sdbjr8i-shard-00-01.qlrxeq6.mongodb.net:27017,ac-sdbjr8i-shard-00-02.qlrxeq6.mongodb.net:27017/blogdb?ssl=true&replicaSet=atlas-q5ignz-shard-0&authSource=admin&appName=Cluster0")

//create a post
app.post("/create", async (req, res) => {
    let input = req.body

    let token = req.headers.token

    jwt.verify(token, "blogApp", async (error, decoded) => {

        if (decoded && decoded.email) {
            let result = new postModel(input)
            await result.save()
            res.json({ "status": "success" })

        } else {
            res.json({ "status": "invalid Authentication" })
        }

    })




})


//view all post

app.post("/viewall", (req, res) => {

    let token = req.headers.token

    jwt.verify(token, "blogApp", (error, decoded) => {

        if (decoded && decoded.email) {

            postModel.find().then(
                (items) => {
                    res.json(items)
                }
            ).catch(
                (error) => {
                    res.json({ "status": "error" })
                }
            )




        } else {
            res.json({ "status": "invalid Authentication" })
        }

    })
})
//vie my post
app.post("/viewmypost", (req, res) => {

        let input = req.body
    let token = req.headers.token

    jwt.verify(token, "blogApp", (error, decoded) => {

        if (decoded && decoded.email) {

            postModel.find(input).then(
                (items) => {
                    res.json(items)
                }
            ).catch(
                (error) => {
                    res.json({ "status": "error" })
                }
            )




        } else {
            res.json({ "status": "invalid Authentication" })
        }

    })
})

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    console.log(input)



    usermodel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {

                res.json({ "status": "email ID already exist" })
            } else {

                let result = new usermodel(input)
                result.save()
                res.json({ "status": "success" })
            }
        }
    ).catch(
        (error) => {

        }
    )


})

app.listen(3030, () => {
    console.log("Server started")
})