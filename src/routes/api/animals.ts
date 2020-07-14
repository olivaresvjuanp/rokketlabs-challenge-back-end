import {
  Router,
  Request,
  Response
} from 'express';

import { Animal } from '../../models/Animal';
import { formatCommonName } from '../../helpers';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  Animal.estimatedDocumentCount((error, count: number): void => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      Animal.find()
        .then(animals => {
          res.json({
            count,
            animals
          });
        })
        .catch(error => {
          console.error(error);
          res.sendStatus(500);
        });
    }
  });
});

router.get('/:commonName', (req: Request, res: Response) => {
  Animal.findOne({ formattedCommonName: formatCommonName(req.params.commonName) })
    .then(animal => {
      if (animal)
        res.json(animal);
      else
        res.sendStatus(404);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.post('/', (req: Request, res: Response) => {
  const {
    photoUrl,
    commonName,
    scientificName,
    habitat
  } = req.body;

  const formattedCommonName: string = formatCommonName(commonName);

  Animal.findOne({ formattedCommonName })
    .then(animal => {
      if (animal)
        res.sendStatus(400);
      else {
        new Animal({
          photoUrl,
          commonName,
          formattedCommonName,
          scientificName,
          habitat
        })
          .save()
          .then(animal => { res.json(animal); })
          .catch(error => { // TODO: Handle validation errors.
            console.error(error);
            res.sendStatus(500);
          });
      }
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.delete('/:commonName', (req: Request, res: Response) => {
  Animal.findOne({ formattedCommonName: formatCommonName(req.params.commonName) })
    .then(animal => {
      if (animal) {
        animal
          .remove()
          .then((): void => { res.sendStatus(200); }) // I could use "res.json({ success: true });", but I think I just need to send HTTP 200 (in this case).
          .catch(error => {
            console.error(error);
            res.sendStatus(500);
          });
      } else
        res.sendStatus(404);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.patch('/:commonName', (req: Request, res: Response) => {
  Animal.findOne({ formattedCommonName: formatCommonName(req.params.commonName) })
    .then(animal => {
      if (animal) {
        const {
          photoUrl,
          scientificName,
          habitat
        } = req.body;

        if (photoUrl)
          animal.photoUrl = photoUrl;

        if (scientificName)
          animal.scientificName = scientificName;

        if (habitat)
          animal.habitat = habitat;

        animal
          .save()
          .then(animal => { res.json(animal); })
          .catch(error => { // TODO: Handle validation errors.
            console.error(error);
            res.sendStatus(500);
          });
      } else
        res.sendStatus(404);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

export { router as animals };
