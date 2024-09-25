import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TabNameService {
  name: string = 'G4Vista';
  // chromosome$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // titleservice: Title = new Title('G4Vista');
  setName(name: string) {
    this.name = name;
    // this.titleservice.setTitle(name);
  }
  getName() {
    return this.name;
  }

  // setChromosome(chromosome: string){
  //   this.chromosome = chromosome;
  // }
  // getChromosome(){
  //   return this.chromosome;
  // }

  // constructor() { }
}
