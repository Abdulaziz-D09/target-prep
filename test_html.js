const fs = require('fs');
fs.writeFileSync('test.html', `
<html>
<body style="background-color: red;">
  <h1>Test Image</h1>
  <img src="public/math-bank/3f5a3602.png" />
</body>
</html>
`);
