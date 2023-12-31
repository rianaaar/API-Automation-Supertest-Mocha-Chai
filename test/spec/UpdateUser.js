const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;
const userData = require("../../data/userData")
const resCreateUser = require("./CreateUser")
const getToken = require("./GetToken")

describe("Update user data", function(){
    this.timeout(10000);
    let auth = null
    let userId = null
    before(async function() {
        // runs before each test in this block
        const resGetToken = await getToken(userData.USER_DATA.email, userData.USER_DATA.password)
        auth = await resGetToken.body.data.accessToken
        //console.log(auth)
        const responseCreateUser = await resCreateUser(userData.USER_DATA.userName,userData.USER_DATA.userEmail,userData.USER_DATA.userPassword,auth)
        //console.log(responseCreateUser.body)
        userId = await responseCreateUser.body.data.userId
        //console.log(userId)
    }),
    it("Update valid user", async function(){        
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
                        
        //console.log(response)
        expect(await response.statusCode).to.eql(200)
        expect(await response.body.message).to.eql("User berhasil diupdate")
        expect(await response.body.data.name).to.eql("kasir1 update")
    }),
    it("Update invalid user", async function(){        
        const response = await request
                                    .put("/users/"+123)
                                    .send({
                                        "name": "kasir1 update",
                                        "email": userData.USER_DATA.userEmail
                                    })
                                    .set({
                                        Authorization : 'Bearer ' + auth,
                                        Accept : "application/json"
                                    });
                        
        //console.log(response)
        expect(await response.statusCode).to.eql(404)
        expect(await response.body.message).to.eql("id tidak valid")
    })
})