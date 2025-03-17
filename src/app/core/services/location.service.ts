import { Injectable } from '@angular/core';
import { ProvinceService } from './province.service';
import { DistrictService } from './district.service';
import { MunicipalityService } from './municipality.service';
import { WardService } from './ward.service';
import { Observable } from 'rxjs';
import {
  Province,
  District,
  Municipality,
  Ward,
  LocationSearchParams,
} from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  constructor(
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private municipalityService: MunicipalityService,
    private wardService: WardService
  ) {}

  getProvinces(params: LocationSearchParams): Observable<Province[]> {
    return this.provinceService.searchProvinces(params);
  }

  getDistricts(params: LocationSearchParams): Observable<District[]> {
    return this.districtService.searchDistricts(params);
  }

  getMunicipalities(params: LocationSearchParams): Observable<Municipality[]> {
    return this.municipalityService.searchMunicipalities(params);
  }

  getWards(params: LocationSearchParams): Observable<Ward[]> {
    return this.wardService.searchWards(params);
  }
}
