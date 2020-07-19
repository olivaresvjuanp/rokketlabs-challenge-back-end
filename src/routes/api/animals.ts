import {
  Router,
  Request,
  Response
} from 'express';

import { formatCommonName } from '../../helpers';
import { Animal } from '../../models/Animal';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  Animal.estimatedDocumentCount((error, count) => {
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

router.get('/:id', (req: Request, res: Response) => {
  Animal.findOne({ id: req.params.id })
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

  const formattedCommonName = formatCommonName(commonName);

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
          .catch(error => {
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

router.delete('/:id', (req: Request, res: Response) => {
  Animal.findOne({ id: req.params.id })
    .then(animal => {
      if (animal) {
        animal
          .remove()
          .then((): void => {
            // I could use "res.json({ success: true });", but I think I just need to send HTTP 200 (in this case).
            res.sendStatus(200);
          })
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

router.patch('/', (req: Request, res: Response) => {
  const {
    id,
    photoUrl,
    habitat
  } = req.body;

  Animal.findOne({ id })
    .then(animal => {
      if (animal) {
        if (photoUrl)
          animal.photoUrl = photoUrl;

        if (habitat)
          animal.habitat = habitat;

        animal
          .save()
          .then(() => { res.sendStatus(200); })
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

export { router as animals };
