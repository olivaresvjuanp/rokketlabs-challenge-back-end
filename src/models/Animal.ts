import mongoose from 'mongoose';

import { formatCommonName } from '../helpers';

const Schema = mongoose.Schema;

const animalSchema = new Schema({
  photoUrl: {
    type: String,
    required: true,
    default: '/public/images/animals-photos/default.jpg'
  },
  commonName: {
    type: String,
    required: true
  },
  formattedCommonName: {
    type: String,
    required: true,
    unique: true
  },
  scientificName: {
    type: String,
    required: true
  },
  habitat: {
    type: String,
    required: true
  }
});

export const Animal = mongoose.model('Animal', animalSchema);
