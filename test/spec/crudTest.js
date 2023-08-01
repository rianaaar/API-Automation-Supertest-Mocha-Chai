const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;
const userData = require("../../data/userData")
//const resCreateUser = require("./CreateUser")
const getToken = require("./GetToken")

describe("CRUD data user", function(){
    this.timeout(10000);
    let userId = null
    let auth = null
    before(async function() {
        // runs before each test in this block
        const resGetToken = await getToken(userData.USER_DATA.email, userData.USER_DATA.password)
        auth = await resGetToken.body.data.accessToken
    }),
    it("Create user", async function(){
        const response = await request
                                        .post("/users")
                                        .send({
                                            "name": userData.USER_DATA.userName,
                                            "email": userData.USER_DATA.userEmail,
                                            "password": userData.USER_DATA.userPassword
                                        })
                                        .set({
                                            Authorization : 'Bearer ' + auth,
                                            Accept : "application/json"
                                        });               
        userId = await response.body.data.userId
        expect(await response.statusCode).to.eql(201)
        expect(await response.body.status).to.eql("success")
        expect(await response.body.data.name).to.eql(userData.USER_DATA.userName)
    }),
    it("Get user detail", async function(){
        const response = await request
                                    .get("/users/"+userId)
                                    .set({
                                        Authorization : 'Bearer ' + auth,
                                        Accept : "application/json"
                                    });
        expect(await response.statusCode).to.eql(200)
        expect(await response.body.data.user.id).to.eql(userId)
        expect(await response.body.data.user.email).to.eql(userData.USER_DATA.userEmail)
    }),
    it("Update username", async function(){        
        const response = await request
                                    .put("/users/"+userId)
                                    .send({
                                        "name": "kasir1 update",
                                        "email": userData.USER_DATA.userEmail
                                    })
                                    .set({
                                        Authorization : 'Bearer ' + auth,
                                        Accept : "application/json"
                                    });
        expect(await response.statusCode).to.eql(200)
        expect(await response.body.message).to.eql("User berhasil diupdate")
        expect(await response.body.data.name).to.eql("kasir1 update")
    }),
    it("Delete user", async function(){
        const response = await request
                                    .delete("/users/"+userId)
                                    .set({
                                        Authorization : 'Bearer ' + auth,
                                        Accept : "application/json"
                                    });                      
        //console.log(response)
        expect(await response.statusCode).to.eql(200)
        expect(await response.body.message).to.eql("User berhasil dihapus")
    }),
    it("Get detail deleted user", async function(){
        const response = await request
                                    .get("/users/"+userId)
                                    .set({
                                        Authorization : 'Bearer ' + auth,
                                        Accept : "application/json"
                                    });                      
        //console.log(response)
        expect(await response.statusCode).to.eql(404)
        expect(await response.body.message).to.eql("User tidak ditemukan")
    })
})