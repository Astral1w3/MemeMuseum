import app from './app.js';
import { PORT } from './config/index.js'

app.listen(PORT, () => {
    console.log(`App in esecuzione su http://localhost:${PORT}`);
});