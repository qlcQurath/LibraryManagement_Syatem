import { Injectable } from '@angular/core';
import { v4 as uuid4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UuidService {
  private uuid : string;

  constructor() { 
    //generate UUID if not already present
  this.uuid = localStorage.getItem('uuid') || '';   // Provide a default value ('') if getItem returns null
  if(!this.uuid){
    this.uuid = uuid4();
    localStorage.setItem('uuid', this.uuid);
  }
  }
  
  getUuid(): string{
    return this.uuid;
  }

  clearUuid(): void{
    localStorage.removeItem('uuid');
  }
}
