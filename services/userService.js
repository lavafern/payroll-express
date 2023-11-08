const prisma = require("./prisma.service")
const bcrypt = require('bcrypt')


module.exports = {
    findAllService : async () => {
        try {
            const allUser = await prisma.user.findMany()
            if (allUser.length < 1) return "no user"
            return allUser
        } catch (err) {
            throw err
        }
    },

    findUserByIdService : async (id) => {
        try {
            id = Number(id)
            const checkId = await prisma.user.findUnique({
                where : {
                    id
                },
                include : {
                    userLogin : {
                        select : {
                            email : true
                        }
                    }
                }
            })

            if (!checkId) throw new Error("no user found",{cause : 400})

            return checkId
        } catch (err) {
            throw err
        }
    },
    userRegisterService : async (data) => {

        try {

            const {email,name,number,role,job,salary} = data
            if(!email || !name || !number || !role || !job || !salary) throw new Error("data ada yang kosong", {cause : 400})

            const password = await bcrypt.hash('123456', 10)

            const checkEmail = await prisma.userLogin.findUnique({
                where: {
                  email: email
                }
              })
            console.log('sadddddddddddddddddd',checkEmail);

            if (checkEmail) throw new Error("email sudah digunakan")

            const newUser = await prisma.user.create({
                data : {
                    name : name,
                    phone_number : number,
                    role : role,
                    job_title : job,
                    salary : salary,
                    userLogin : {
                        create : {
                            email : email,
                            password : password
                        }
                    }
                }
            })
            return newUser
        } catch (err) {
            console.log('errrr',err);
            throw err
        }

    },

    loginAttemp : async (email,password) => {
        try {
            if (!email || !password) throw new Error("email atau password salah", {cause : 401})

            const foundUser = await prisma.userLogin.findUnique({
                where : {
                    email 
                }
            })

            if (!foundUser) throw new Error("email atau password salah", {cause : 401})

            const realPassword = foundUser.password

            const checkPassword = await bcrypt.compare(password,realPassword)

            if (!checkPassword) throw new Error("email atau password salah", {cause : 401})

            return foundUser



        } catch (err) {
            throw err
        }
    },

    changePasswordService : async (id,oldPassword,newPassword,newPasswordValidation) => {
        try {
            if (newPassword!==newPasswordValidation) throw new Error('password gagal diganti, password baru dan validasi password baru harus sama', {cause : 401})
            const foundUser = await prisma.userLogin.findUnique({
                where : {
                    userId : id
                }
            })
            if (!foundUser) throw new Error("user tidak ditemukan", {cause : 401})
            const realPassword = foundUser.password
            
            const checkPassword = await bcrypt.compare(oldPassword,realPassword)            
            if (!checkPassword) throw new Error('password gagal diganti, password salah', {cause : 401})

            const newPasswordEncrypted = await bcrypt.hash(newPassword, 10)

            await prisma.userLogin.update({
                where: {
                    userId: id,
                  },
                  data: {
                    password: newPasswordEncrypted,
                  },
            })

            return 


        } catch (err) {
            throw err
        }
    },

    updateProfileService : async (id,name,phone_number) => {
        try {
            if (!name || !phone_number) throw new Error("tidak boleh ada kolom yang kosong")
            if (isNaN(Number(phone_number))) throw new Error("nomor telepon harus angka")
            const foundUser = await prisma.userLogin.findUnique({
                where : {
                    userId : id
                }
            })
            if (!foundUser) throw new Error("user tidak ditemukan", {cause : 401})

            const updatedData = await prisma.user.update({
                where : {
                    id : id
                },
                data : {
                    name : name,
                    phone_number : phone_number
                }
            })

            return updatedData
        } catch (err) {
            throw err
        }
    }
    
}