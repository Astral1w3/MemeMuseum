const app = require('./app');
const port = 3000;

app.listen(port, () => {
    console.log(`App in esecuzione su http://localhost:${port}`);
});