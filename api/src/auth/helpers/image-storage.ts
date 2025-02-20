
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { from, Observable, of, switchMap } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

const fs = require('fs');
const FileType = require('file-type');

// Crée le dossier './images' si nécessaire
const dir = './images';
if (!existsSync(dir)) {
    mkdirSync(dir);
}

type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: ValidFileExtension[] = ['jpeg', 'jpg', 'png'];
const validMimeTypes: ValidMimeType[] = ['image/jpeg', 'image/jpg', 'image/png'];

export const saveImageToStorage = {
    storage: diskStorage({
        destination: dir, // Le répertoire vers un dossier local
        filename: (req, file, cb) => {
            const fileExtension: string = path.extname(file.originalname).toLowerCase().replace('.', '');
            const fileName: string = uuidv4() + '.' + fileExtension;
            cb(null, fileName); // Nom unique pour chaque fichier
        },
    }),
    fileFilter: (req, file, cb) => {
        if (validMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            // Lever une BadRequestException pour qu'elle soit interceptée correctement
            return cb(new BadRequestException(`Type de fichier non autorisé. Types valides: ${validMimeTypes.join(', ')}`), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de taille de fichier à 5 Mo
    },
};

// Vérifier si le fichier est de type valide
export const isFileExtensionSafe = (fullFilePath: string): Observable<boolean> => {
    return from(FileType.fromFile(fullFilePath)).pipe(
        switchMap((fileExtensionAndMimeType: { ext: ValidFileExtension; mime: ValidMimeType }) => {
            if (!fileExtensionAndMimeType) return of(false);

            const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext);
            const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime);
            const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
            return of(isFileLegit);
        })
    );
};

// Supprimer un fichier
export const removeFile = (fullFilePath: string): void => {
    try {
        fs.unlinkSync(fullFilePath);
    } catch (err) {
        console.error(`Erreur lors de la suppression du fichier ${fullFilePath}:`, err);
    }
};
