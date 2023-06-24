const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;
const userData = require("../../data/userData")
const getToken = require("./GetToken")
//const respGetToken = getToken.getUserToken
async function createUser(user_name,user_email,user_password,user_token){
    const response = await request
                        .post("/users")
                        .send({
                            "name": user_name,
                            "email": user_email,
                            "password": user_password
                        })
                        .set({
                            Authorization : 'Bearer ' + user_token,
                            Accept : "application/json"
                        });
    return response
}

describe("Post Create User", function(){
    this.timeout(10000);
    let auth = null
    before(async function() {
        // runs before each test in this block
        const resGetToken = await getToken(userData.USER_DATA.email, userData.USER_DATA.password)
        auth = await resGetToken.body.data.accessToken
        //console.log(auth)
    }),
    it("Create user use valid token", async function(){
        const response = await createUser(userData.USER_DATA.userName,userData.USER_DATA.userEmail,userData.USER_DATA.userPassword,auth)                 
        //console.log(response)
        expect(await response.statusCode).to.eql(201)
        expect(await response.body.status).to.eql("success")
        expect(await response.body.data.name).to.eql(userData.USER_DATA.userName)
    }),
    it("Create user use invalid token", async function(){
        const response = await createUser(userData.USER_DATA.userName,userData.USER_DATA.userEmail,userData.USER_DATA.userPassword,"zjakak")
        //console.log(response)
        expect(await response.statusCode).to.eql(401)
        expect(await response.body.message).to.eql("Invalid token structure")
        //console.log(response);
    })    
})
module.exports = createUser