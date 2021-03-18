import bcrypt from 'bcrypt'
import path from 'path'
import multer from 'multer'

const salt = bcrypt.genSaltSync(10);
// const parse = parseString.parseString

import {
    data,
    meta,
    user
} from './model'


// ------- Meta ---------

// Add data meta
export const addmeta = (request, response) => {
    const newData = new meta(request.body)

    newData.save((error, data) => {
        if (error) {
            return response.json({
                'success': false,
                'message': 'Gagal menambah data!',
                error
            })
        }
        return response.json({
            'success': true,
            'message': 'Berhasil Menambahkan data',
            data
        })
    })
}


// ------- Data ---------

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

export const savephoto = multer({ storage: diskStorage }).single('photos')
// Add Data
export const adddata = (request, response) => {
    let dat = request.body
    dat['foto']= '/uploads/' + request.file.filename
    const newData = new data(dat)
    newData.save((error, data) => {
        if (error) {
            return response.json({
                'success': false,
                'message': 'Gagal menambah data!',
                error
            })
        }
        return response.json({
            'success': true,
            'message': 'Berhasil Menambahkan data',
            data
        })
    })

}

// get data (user, admin(all))

// update data (user, admin(all))

// delete data (user, admin(all))


// ------- Users ---------

// Add data User / Register
export const adduser = (request, response) => {
    let email = request.body.email
    let username = request.body.username
    let pass = bcrypt.hashSync(request.body.pass, salt)
    let editEmail = request.body.editor.email
    let editPass = request.body.editor.pass
    let editStatUser = request.body.editor.statUser
    let dat = {
        "email":email,
        "username":username,
        "pass":pass,
        "nama": request.body.nama,
        "stasiun": request.body.stasiun,
        "nip": request.body.nip,
        "statUser": request.body.statUser,
        "editor": request.body.editor.username
    }

    let superAdm = {
        email:'nanda.winata@gmail.com',
        pass: 'f522f1ac6d067bd00514ce54b93981e0f64dc3d3f5bd3a279f610baa854cb96d'
    }

    const simpanData = () => {
        user.find({ email: email }).exec((error, data) => {
            if(data[0] == null){
                user.find({ username : username}).exec((error, data) => {
                    if(data[0] == null){
                        const newData = new user(dat)
                        newData.save((error, data) => {
                            if (error) {
                                return response.json({
                                    'success': false,
                                    'message': 'Gagal menambah user!',
                                    error
                                })
                            }
                            return response.json({
                                'success': true,
                                'message': 'Berhasil Menambahkan user',
                                data
                            })
                        })
                    }
                    else{
                        return response.json({
                            'success': false,
                            'message': 'Username tidak tersedia',
                        })
                    }
                })
            }
            else{
                return response.json({
                    'success': false,
                    'message': 'Email sudah terdaftar',
                })
            }
        })
    }

    // --- manage izin add user ---
    // (hanya super admin dan admin saja yg boleh add user)
    user.findOne({ email: editEmail }).exec((error, data) => {
        if((data !=null) && (editStatUser == 'Admin') && (data.email == editEmail && bcrypt.compareSync(editPass, data.pass))){
            simpanData()
        }
        else if((data == null) && (editEmail == superAdm.email && superAdm.pass == editPass)){
            simpanData()
        }else {
            return response.json({
                'success': false,
                'message': 'Tidak diizinkan',
            })
        }
    })
}

// get data user all (hanya admin)

export const getuser = (request, response) => {
    let userData = request.body
    user.findOne({ email: userData.email}).exec((error, data) => {
        if(data!=null){
            if( bcrypt.compareSync(userData.pass, data.pass) && (data.statUser == 'Admin')){
                user.find().exec((error, data) => {
                    return response.json({
                        'success': true,
                        'message': 'Berhasil Mengambil data',
                        data
                    })
                })
            }else{
                return response.json({
                    'success': false,
                    'message': 'Tidak diizinkan'
                })
            }
        }else{
            return response.json({
                'success': false,
                'message': 'Tidak diizinkan'
            })
        }
        
    })
}

// update user
export const edituser = (request, response) => {
    let editor = request.body.editor
    let email = request.body.email //email user yg mau diganti
    let dataUpd = request.body.dataUpd
    user.findOne({ email: editor.email}).exec((error, data) => {
        if(data != null){
            // admin -> bisa update siapa saja
            if(bcrypt.compareSync(editor.pass, data.pass) && data.statUser == "Admin"){
                dataUpd['editor'] = data.username
                dataUpd['pass'] = bcrypt.hashSync(dataUpd.pass, salt)
                user.findOneAndUpdate({email:email}, dataUpd, {new:true}, (err, dat)=>{
                    return response.json({
                        'success': true,
                        'message': 'Berhasil Update Data',
                        dat
                    })
                })
            }
            // user -> bisa update dirinya sendiri
            else if(bcrypt.compareSync(editor.pass, data.pass) && data.statUser == "User"){
                dataUpd['editor'] = data.username
                dataUpd['pass'] = bcrypt.hashSync(dataUpd.pass, salt)
                user.findOneAndUpdate({email:editor.email}, dataUpd, {new:true}, (err, dat)=>{
                    return response.json({
                        'success': true,
                        'message': 'Berhasil Update Data',
                        dat
                    })
                })
            }else{
                return response.json({
                    'success': false,
                    'message': 'Tidak diizinkan1',
                })
            }
        }else{
            return response.json({
                'success': false,
                'message': 'Tidak diizinkan',
            })
        }
        
    })
}

// delete user
export const deluser = (request, response) => {
    let email = request.body.email
    let editor = request.body.editor
    user.findOne({email:editor.email}).exec((error, data) => {
        if(data != null){
            // admin
            if(bcrypt.compareSync(editor.pass, data.pass) && data.statUser == "Admin"){
                user.findOneAndRemove({email:email}, (err, dat)=>{
                    return response.json({
                        'success': true,
                        'message': 'User berhasil dihapus',
                        dat
                    })
                })
            }
            else if(bcrypt.compareSync(editor.pass, data.pass) && data.statUser == "User"){
                user.findOneAndRemove({email:editor.email}, (err, dat)=>{
                    return response.json({
                        'success': true,
                        'message': 'User berhasil dihapus',
                        dat
                    })
                })
            }else{
                return response.json({
                    'success': false,
                    'message': 'Tidak diizinkan1',
                })
            }
        }else{
            return response.json({
                'success': false,
                'message': 'Tidak diizinkan1',
            })
        }
    })
}

// login user

export const loginuser = (request, response) => {
    let email = request.body.email
    let pass = request.body.pass

    user.find({ email: email }).exec((error, data) => {
        if(data[0] == null){
            return response.json({
                'success': false,
                'message': 'Email Belum Terdaftar',

            })
        }
        else{
            if(bcrypt.compareSync(pass, data[0].pass)){
                return response.json({
                    'success': true,
                    'message': 'Login Berhasil',
                    data
                })
            }else{
                return response.json({
                    'success': false,
                    'message': 'Login Gagal',
                })
            }
        }
    })
}