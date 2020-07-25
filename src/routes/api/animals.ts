import {
  Router,
  Request,
  Response
} from 'express';
import {
  checkSchema,
  validationResult
} from 'express-validator';

import { formatCommonName } from '../../helpers';
import { Animal } from '../../models/Animal';

const router = Router();

const customValidationResult = validationResult.withDefaults({
  formatter: error => error.param
});

router.get('/get-animals/:page', checkSchema({
  page: {
    in: 'params',
    isNumeric: true,
    toInt: true
  }
}), (req, res: Response) => {
  console.log(`GET: /api/animals/get-animals/:page - typeof :page = ${typeof req.params.page} (IP: ${req.ip}).`);

  const result = customValidationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      data: {
        errors: result.array()
      }
    });

    return;
  }

  Animal
    .find()
    .limit(5)
    .skip((req.params.page * 5) - 5)
    .then(animals => {
      res.json({
        payload: {
          animals
        }
      });
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.get('/get-animal-details/:id', checkSchema({
  id: {
    in: 'params',
    isNumeric: true,
    toInt: true
  }
}), (req: Request, res: Response) => {
  console.log(`GET: /api/animals/get-animal-details/:id - typeof :id = ${typeof req.params.id} (IP: ${req.ip}).`);

  const result = customValidationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      data: {
        errors: result.array()
      }
    });

    return;
  }

  Animal.findOne({ id: req.params.id })
    .then(animal => {
      if (animal) {
        res.json({
          payload: {
            animal
          }
        });
      } else
        res.sendStatus(404);
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.get('/get-count', (req: Request, res: Response) => {
  console.log(`GET: /api/animals/get-count (IP: ${req.ip}).`);

  Animal.estimatedDocumentCount((error, count) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      res.json({
        payload: {
          count
        }
      });
    }
  });
});

router.post('/', checkSchema({
  photoUrl: {
    in: 'body',
    isURL: {
      options: {
        protocols: ['http', 'https'],
        require_valid_protocol: true,
        require_protocol: true
      }
    }
  },
  commonName: {
    in: 'body',
    custom: {
      options: commonName => {
        return Animal.findOne({ formattedCommonName: formatCommonName(commonName) })
          .then(animal => {
            if (animal)
              return Promise.reject();
          });
      }
    },
    isLength: {
      options: {
        min: 1,
        max: 32
      }
    },
    isString: true,
  },
  scientificName: {
    in: 'body',
    isLength: {
      options: {
        min: 1,
        max: 32
      }
    },
    isString: true
  },
  habitat: {
    in: 'body',
    isLength: {
      options: {
        min: 16,
        max: 1000
      }
    },
    isString: true
  }
}), (req: Request, res: Response) => {
  console.log('POST: /api/animals - req.body:', req.body, `(IP: ${req.ip}).`);

  const result = customValidationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      payload: {
        errors: result.array()
      }
    });

    return;
  }

  const {
    photoUrl,
    commonName,
    scientificName,
    habitat
  } = req.body;

  new Animal({
    photoUrl,
    commonName,
    formattedCommonName: formatCommonName(commonName),
    scientificName,
    habitat
  })
    .save()
    .then(animal => {
      res.json({
        payload: { animal }
      });
    })
    .catch(error => {
      console.error(error);
      res.sendStatus(500);
    });
});

router.delete('/:id', checkSchema({
  id: {
    in: 'params',
    isNumeric: true,
    toInt: true
  }
}), (req, res: Response) => {
  console.log(`DELETE: /api/animals/:id - typeof :id = ${typeof req.params.id} (IP: ${req.ip}).`);

  const result = customValidationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      data: {
        errors: result.array()
      }
    });

    return;
  }

  Animal.findOne({ id: req.params.id })
    .then(animal => {
      if (animal) {
        animal
          .remove()
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

router.patch('/', checkSchema({
  id: {
    in: 'body',
    exists: true,
    isInt: true,
    toInt: true
  },
  photoUrl: {
    in: 'body',
    exists: true,
    isURL: {
      options: {
        protocols: ['http', 'https'],
        require_valid_protocol: true,
        require_protocol: true
      }
    }
  },
  habitat: {
    in: 'body',
    exists: true,
    isLength: {
      options: {
        min: 16,
        max: 1000
      }
    },
    isString: true
  }
}), (req, res: Response) => {
  console.log('PATCH: /api/animals - req.body:', req.body, `(IP: ${req.ip}).`);

  const result = customValidationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({
      payload: {
        errors: result.array()
      }
    });

    return;
  }

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
              payload: {
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
