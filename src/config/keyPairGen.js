const crypto = require('crypto');
const fileSystem = require('fs');

function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  fileSystem.writeFileSync(
    __dirname + '/crypto/id_rsa_pub.pem',
    keyPair.publicKey
  );

  fileSystem.writeFileSync(
    __dirname + '/crypto/id_rsa_priv.pem',
    keyPair.privateKey
  );
}

genKeyPair();
