import {v7 as uuidv7} from 'uuid';

export class Identifier {
  static generate() {
    return uuidv7();
  }
}
