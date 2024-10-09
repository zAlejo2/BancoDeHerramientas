import multer from 'multer';
import path from 'path';

let contador = 0;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = 'baja-'+contador;
        contador++;
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

export default upload;