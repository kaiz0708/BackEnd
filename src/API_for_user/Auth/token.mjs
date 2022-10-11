import jwt from 'jsonwebtoken'
let CreateToken = (User , Secret , Tokenlife) => {
    const token = jwt.sign(User , Secret , {
        algorithm : "HS256",
        expiresIn : Tokenlife
    })
    return token
}

let VerifyToken = (Token , Secret) => {
    const decode = jwt.verify(Token ,Secret)
    return decode
}


const obj = {
    CreateToken,
    VerifyToken
}

export default obj