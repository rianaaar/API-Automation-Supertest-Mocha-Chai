const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;
const userData = require("../../data/userData")

async function getUserToken(email,password){
    const response = await request
                        .post("/authentications")
                        .send({
                            "email": email,
                            "password": password
                        });
    return response
  }
  
describe("Login", function(){
    it("Get token", async function(){
        const response = await getUserToken(userData.USER_DATA.email, userData.USER_DATA.password)
        //console.log(response)
        expect(await response.statusCode).to.eql(201)
        expect(await response.body.data.user.email).to.eql(userData.USER_DATA.email)
    })
})

module.exports = getUserToken