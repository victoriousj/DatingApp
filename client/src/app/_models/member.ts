import { Photo } from './photo';

export interface Member {
    username: string;
    gender: string;
    age: string;
    knownAs: string;
    created: Date;
    lastActive: Date;
    introduction: string;
    lookingFor: string;
    interests: string;
    city: string;
    country: string;
    photoUrl: string;
    photos: Photo[];
}
