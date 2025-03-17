export enum MunicipalityType {
  RURAL_MUNICIPALITY = 'RURAL_MUNICIPALITY',
  MUNICIPALITY = 'MUNICIPALITY',
  SUB_METROPOLITAN = 'SUB_METROPOLITAN',
  METROPOLITAN = 'METROPOLITAN',
}

export interface District {
  code: string;
  name: string;
  nameNepali: string;
  municipalityCount: number;
}

export interface Municipality {
  code: string;
  name: string;
  nameNepali: string;
  type: MunicipalityType;
  area: number;
  population?: number;
  latitude: number;
  longitude: number;
  totalWards: number;
  district: District;
}
