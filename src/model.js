import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    email: String,
    username: String,
    pass: String,
    nama: String,
    stasiun: String,
    nip: String,
    statUser: String,
    editor: String
})

const metaSchema = mongoose.Schema({
    alat: String,
    lokasi: String,
    merk: String,
    tahun: Number,
})

const dataSchema = mongoose.Schema({
    alat: String,
    lokasi: String,
    merk: String,
    tahun: Number,
    kondisi: String,
    catatan: String,
    foto: String
})

const user = mongoose.model('User', userSchema)
const meta = mongoose.model('Meta', metaSchema)
const data = mongoose.model('Data', dataSchema)

export {
    user,
    meta,
    data
}