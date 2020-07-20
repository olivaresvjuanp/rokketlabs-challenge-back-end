import {
  Router,
  Request,
  Response
} from 'express';

import { formatCommonName } from '../../helpers';
import { Animal } from '../../models/Animal';

const router = Router();

router.get('/get-animals/:page', (req: Request, res: Response) => {
  console.debug('GET: /api/animals/:page', 'params', req.params);

  const page = parseInt(req.params.page);

  if (isNaN(page))
    res.sendStatus(400);
  else {
    Animal
      .find()
      .limit(5)
      .skip((page * 5) - 5)
      .then(animals => {
        console.log('length', animals.length);

        res.json({
          data: {
            animals
          }
        });
      })
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  }
});

router.get('/get-animal-details/:id', (req: Request, res: Response) => {
  console.debug('GET: /api/animals/get-animal-details/:id', 'params', req.params);

  const id = parseInt(req.params.id);

  if (isNaN(id))
    res.sendStatus(400);
  else {
    Animal.findOne({ id })
      .then(animal => {
        if (animal) {
          res.json({
            data: {
              // ...
            }
          });
        } else
          res.sendStatus(404);
      })
      .catch(error => {
        console.error(error);
        res.sendStatus(500);
      });
  }
});

router.get('/get-count', (req: Request, res: Response) => {
  console.debug('GET: /api/animals/get-count');

  Animal.estimatedDocumentCount((error, count) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.json({
        data: {
          count
        }
      });
    }
  });
});

router.post('/', (req: Request, res: Response) => {
  console.debug('POST: /api/animals', 'body', req.body);

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
          .then(animal => {
            res.json({
              data: {
                animal
              }
            });
          })
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
  console.debug('DELETE: /api/animals/:id', 'params', req.params);

  const id = parseInt(req.params.id);

  if (isNaN(id))
    res.sendStatus(400);
  else {
    Animal.findOne({ id })
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
  }
});

router.patch('/', (req: Request, res: Response) => {
  console.debug('PATCH: /api/animals', 'body', req.body);

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
          .then(animal => {
            res.json({
              data: {
                animal
              }
            });
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

export { router as animals };
