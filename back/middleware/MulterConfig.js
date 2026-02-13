import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

//import.meta.url restituisce il percorso del file attuale, sotto forma di URL web. es file:///C:/Users/Astral/MemeMuseum/back/middleware/MulterConfig.js
//fileURLToPath elimina "file:///C:""
const __filename = fileURLToPath(import.meta.url);
//Questo elimina MulterConfig.js e lascia solo la cartella
const __dirname = path.dirname(__filename);
//tutto cio va fatto per accedere alla cartella public facendo ../public/uploads partendo dalla cartella middleware che e' contenuta in __dirname

//normalmente multer funziona con la memoria ram, con diskStorage creiamo un oggetto che usa il disco
const storage = multer.diskStorage({
    //destination e' una funzione che viene eseguita per ogni file caricato e prende in input la richiesta HTTP, le info del file e una funzione di callback
    destination: (req, file, cb) => {
        // indica dove salvare i file: cartella 'back/public/uploads'
        //il primo parametro e' per gli errori, il secondo e' per il percorso
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    //filename e' una funzione per modificare il nome di un file
    filename: (req, file, cb) => {
        // genera un nome unico per evitare sovrascritture
        // es: 178923423-nomefile.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // estensione (.jpg, .png)
        cb(null, uniqueSuffix + ext);
    }
});

// accetta solo immagini e video
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true); //accetta
    } else {
        cb(new Error('Only video and images!'), false); // rifiuta
    }
};

export const uploadMulter = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});