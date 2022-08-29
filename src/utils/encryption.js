import JSEncrypt from 'jsencrypt'

import RSAUtils from '@/utils/security'

// export function encryption(algorithm = 'RSA', pkbase64, data) {
export function encryption(pkbase64, modulus, exponent, data) {
  var result = ''
  var hisu_Password = data
  //判断pkbase64是否为空，
  if (pkbase64 == '' || typeof pkbase64 == 'undefined' || pkbase64 == null || pkbase64 == 'undefined') {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRXTUVWXYZ'
    var hisu_suffix = ''
    for (var i = 0; i < 4; i++) {
      var na = parseInt(Math.random() * 62)
      hisu_suffix += chars.charAt(na)
    }

    var key = RSAUtils.getKeyPair(exponent, '', modulus)
    console.log('key:', key)
    var newPassword = hisu_Password + hisu_suffix

    result = RSAUtils.encryptedString(key, newPassword)
  } else {
    //密码前面添加4位长度
    var newPassword = PrefixZero(hisu_Password.length * 2, 4) + stringToHex(hisu_Password)
    //使用标准RSA算法处理
    var encrypt = new JSEncrypt()
    encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + pkbase64 + '-----END PUBLIC KEY-----')
    result = encrypt.encrypt(stringToHex(newPassword))
  }

  return result
}

function PrefixZero(num, n) {
  return (Array(n).join(0) + num).slice(-n)
}

function stringToHex(str) {
  var val = ''
  for (var i = 0; i < str.length; i++) {
    var temp = str.charCodeAt(i).toString(16)
    if (temp.length == 1) {
      val += '0' + temp
    } else {
      val += temp
    }
  }
  return val.toUpperCase()
}
//JSEncrypt加密方法
function encryptedData(publicKey, password) {
  //new一个对象
  let encrypt = new JSEncrypt()
  //设置公钥
  encrypt.setPublicKey(publicKey)
  //password是要加密的数据,此处不用注意+号,因为rsa自己本身已经base64转码了,不存在+,全部是二进制数据
  let result = encrypt.encrypt(password)
  return result
}
