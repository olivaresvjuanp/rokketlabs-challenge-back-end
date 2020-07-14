import { Router } from 'express';

import { Animal } from '../../models/Animal';
import { formatCommonName } from '../../helpers';

const router = Router();

router.get('/', (req, res) => {
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

router.get('/:name', (req, res) => {
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

router.post('/', (req, res) => {
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

router.delete('/:name', (req, res) => {
});

router.patch('/:name', (req, res) => {
});

export { router as animals };
