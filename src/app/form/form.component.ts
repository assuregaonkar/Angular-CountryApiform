import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


// const fname = document.getElementById('firstName');
// const lname = document.getElementById('lastName');
// const countryValue = document.getElementById('country');
// const stateValue = document.getElementById('state');
// const cityValue = document.getElementById('city');
// const zipCodeValue = document.getElementById('zipCode');
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  
  countries: string[] =[];
  states: string[] = [];
  cities: string[] = [];
  bool: boolean = false;
  constructor(private formBuilder: FormBuilder, private http: HttpClient) { 
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
      for(let i of response.data.states){
        this.states.push(i.name);
      }
      console.log(this.states);
    })
  }
  getCities(){
    this.http.post('https://countriesnow.space/api/v0.1/countries/state/cities',{country: this.getControl('country').value,state : this.getControl('state').value}).subscribe((response:any) =>{
      this.cities = response.data;
      console.log(this.cities);
    })
  }
  onSubmit() {
    if (this.form.valid) {
      this.bool = true;
      console.log(this.form.value);
    } 
  }
  
}
