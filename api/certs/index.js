const fs = require('fs');
const path = require('path');
const devcert = require('devcert');

(async function() {
  const { cert, key } = await devcert.certificateFor(['localhost']);

	fs.writeFileSync(path.join(__dirname, 'tls.key'), key);
	fs.writeFileSync(path.join(__dirname, 'tls.cert'), cert);

  console.log('Done.');
  process.exit(0);
})();
