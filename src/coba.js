var bcrypt = require('bcrypt');
const { json } = require('body-parser');

var salt = bcrypt.genSaltSync(10);
// hash password dengan salt 
var hash = bcrypt.hashSync("f522f1ac6d067bd00514ce54b93981e0f64dc3d3f5bd3a279f610baa854cb96d", salt);
// console.log(hash)
// compare password hash
var cek = bcrypt.compareSync("f522f1ac6d067bd00514ce54b93981e0f64dc3d3f5bd3a279f610baa854cb96d", hash)
// console.log(cek)


// var data = require('./dat.json')

// console.log(data['SukarnoHatta']['AWOS'])
let nama = {
    "nama":"nanda",
    "kelas":"insa"
}
nama['npt'] = "asaaaa"

console.log(nama)
