import pgp from 'pg-promise'

const pgpinitializer = pgp();

import { URI } from './index.js'

const db = pgpinitializer(URI);

export default db;