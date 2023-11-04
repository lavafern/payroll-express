const jwt = require('jsonwebtoken');

async function authMiddleware(req,res,next) {

    const authHeaders = req.cookies['accesToken']
    const token = authHeaders ?? undefined

    try {
        const user = await jwt.verify(token,process.env.ACCES_TOKEN_SECRET)
        req.user = user
        console.log('acces token match, authenticated!');
        next()
    } catch {
        const refreshToken = req.cookies['refreshToken']
        try {
            console.log('acces token is expired, checks refresh token!');
            const userVerif = await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            console.log('refresh token match! and generate new acces token----------------');
            const user = {
                userId : userVerif.userId,
                email : userVerif.email,
            }
            const accesToken = generateToken(user,'acces')
            res.cookie("accesToken",accesToken, {httpOnly : true})
            if (req.method === 'POST') {
                return res.redirect(307, `${req.url}`)
            } 
            return res.redirect(`${req.url}`)
        } catch (err) {
            console.log('refresh token not match');
            res.clearCookie("accesToken");
            res.redirect('/login')
        }
    }

}

function generateToken(user,tokenType) {
    try {

        if (tokenType === 'acces') {
            return jwt.sign(user,process.env.ACCES_TOKEN_SECRET, {expiresIn : '1s'})
        } else if (tokenType === 'refresh') {
            return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn : '30d'})
        } else {
            return new Error('Unkown token type')
        }

    }catch (err) {
        console.log(err);
    }

}

module.exports = {authMiddleware, generateToken}
