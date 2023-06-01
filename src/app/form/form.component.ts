import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  formValues = {
    firstName : '',
    lastName : '',
    country : '',
    state : '',
    city : '',
    zipCode : ''
  }
  countries: string[] =[];
  states: string[] = [];
  cities: string[] = [];
  bool: boolean = false;
  constructor(private http: HttpClient) { 
    this.getCountries();
  }
  form = new FormGroup({
    firstName: new FormControl ('',[ Validators.required]),
    lastName: new FormControl ('',[ Validators.required]),
    country: new FormControl ('',[ Validators.required]),
    state: new FormControl ('',[ Validators.required]),
    city: new FormControl ('',[ Validators.required]),
    zipCode: new FormControl ('',[ Validators.required, Validators.pattern(/^\d{5}$/)])
  });
  rooturl = 'https://countriesnow.space/api/v0.1/countries'
  
  

  getControl(field:string){
    return this.form.get(field) as FormControl;
  }

  getCountries(){
    this.http.get(this.rooturl).subscribe((response: any) =>{
      for(let i of response.data){
        this.countries.push(i.country);
      }
    })
  }
  
  onCountryChange(){
    this.http.post('https://countriesnow.space/api/v0.1/countries/states',{country: this.getControl('country').value}).subscribe((response:any) =>{
      if(response.data.states.length == 0){
        this.states[0] = 'Nostatesavailable';
      }
      else{
        for(let i of response.data.states){
          this.states.push(i.name);
        }
      }
      
      console.log(this.states);
    })
  }

  getCities(){
    this.http.post('https://countriesnow.space/api/v0.1/countries/state/cities',{country: this.getControl('country').value,state : this.getControl('state').value}).subscribe((response:any) =>{
     
      if(response.data.length == 0){
        this.cities[0] = 'Nocitiesavailable';
      }
      else{
        this.cities = response.data;
      }
      
      console.log(this.cities);
    },
    (error)=>{
      this.cities[0] = 'NocitiesAvailable';
      console.log(error);
    })
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.bool = true;
      this.formValues.firstName = this.getControl('firstName').value;
      this.formValues.lastName = this.getControl('lastName').value;
      this.formValues.country = this.getControl('country').value;
      this.formValues.state = this.getControl('state').value;
      this.formValues.city = this.getControl('city').value;
      this.formValues.zipCode = this.getControl('zipCode').value;
      console.log(this.formValues);
      this.form.reset();
    } 
  }
  
}
