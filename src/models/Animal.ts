import mongoose from 'mongoose';

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

export interface AnimalDocument extends mongoose.Document {
  photoUrl: string;
  commonName: string;
  formattedCommonName: string;
  scientificName: string;
  habitat: string;
}

export const Animal = mongoose.model<AnimalDocument>('Animal', animalSchema);
