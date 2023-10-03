const jwt = require('jsonwebtoken');

async function authMiddleware(req,res,next) {
    const authHeaders = req.cookies['accesToken']
    const token = authHeaders ?? undefined

    try {
        const user = await jwt.verify(token,process.env.ACCES_TOKEN_SECRET)
        req.user = user
        next()
    } catch {
        const refreshToken = req.cookies['refreshToken']
        try {
            const userVerif = await jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            console.log('refresh match and generate new acces token');
            const user = {
                userid : userVerif.userid,
                name : userVerif.name,
                phone_number : userVerif.phone_number,
                email: userVerif.email,
                role : userVerif.role,
                job_title : userVerif.job_title,
                salary : userVerif.salary
            }
            const accesToken = generateToken(user,'acces')
            res.cookie("accesToken",accesToken, {httpOnly : true})
            res.redirect('/home')
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
            return jwt.sign(user,process.env.ACCES_TOKEN_SECRET, {expiresIn : '2s'})
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
