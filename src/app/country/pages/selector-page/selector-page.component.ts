import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit{

  public countriesByRegion:SmallCountry[]=[];
  public borders : SmallCountry[]=[];


  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })


  constructor(
    private fb: FormBuilder,
    private countriesService:CountriesService,
  ) { }


  ngOnInit(): void {

    this.onRegionChanged();
    this.onCountryChanged();

  }


  get regions():Region[]{
    return this.countriesService.regions;
  }


  onRegionChanged():void{
    this.myForm.get('region')!.valueChanges  //obtiene el valor de region del formulario identificando cuando cambia
    .pipe(
      tap(()=>this.myForm.get('country')!.setValue('')), // limpia el campo y muestra nuevamente el msg de --Seleccione País --
      tap (()=> this.borders=[]),
      switchMap(region=>this.countriesService.getCountriesByRegion(region))
    )
    .subscribe(value=>{
      this.countriesByRegion=value;
    })
  }



  onCountryChanged():void{
    this.myForm.get('country')!.valueChanges  //obtiene el valor de region del formulario identificando cuando cambia
    .pipe(
      tap(()=>this.myForm.get('border')!.setValue('')), // limpia el campo y muestra nuevamente el msg de --Seleccione País --
      filter((value:string)=>value.length>0),
      switchMap(alphaCode=>this.countriesService.getCountryByAlphaCode(alphaCode)),
      switchMap((country)=>this.countriesService.getCountryBordersByCodes(country.borders)),
    )
    .subscribe(value=>{
       this.borders=value;
    })

  }









}
