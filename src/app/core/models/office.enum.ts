export enum OfficeSection {
  GENERAL_ADMINISTRATION = 'GENERAL_ADMINISTRATION',
  REVENUE_FINANCIAL = 'REVENUE_FINANCIAL',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  SOCIAL_DEVELOPMENT = 'SOCIAL_DEVELOPMENT',
  ECONOMIC_DEVELOPMENT = 'ECONOMIC_DEVELOPMENT',
  PLANNING_DEVELOPMENT = 'PLANNING_DEVELOPMENT',
  ENVIRONMENT_DISASTER = 'ENVIRONMENT_DISASTER',
  LEGAL_INFORMATION = 'LEGAL_INFORMATION',
  OTHER = 'OTHER',
}

export const OFFICE_SECTION_TRANSLATION_KEYS = {
  [OfficeSection.GENERAL_ADMINISTRATION]:
    'registration.officeSection.generalAdmin',
  [OfficeSection.REVENUE_FINANCIAL]:
    'registration.officeSection.revenueFinancial',
  [OfficeSection.INFRASTRUCTURE]: 'registration.officeSection.infrastructure',
  [OfficeSection.SOCIAL_DEVELOPMENT]: 'registration.officeSection.socialDev',
  [OfficeSection.ECONOMIC_DEVELOPMENT]:
    'registration.officeSection.economicDev',
  [OfficeSection.PLANNING_DEVELOPMENT]:
    'registration.officeSection.planningDev',
  [OfficeSection.ENVIRONMENT_DISASTER]:
    'registration.officeSection.envDisaster',
  [OfficeSection.LEGAL_INFORMATION]: 'registration.officeSection.legalInfo',
  [OfficeSection.OTHER]: 'registration.officeSection.other',
} as const;

export enum ElectedPosition {
  CHAIRPERSON = 'CHAIRPERSON',
  VICE_CHAIRPERSON = 'VICE_CHAIRPERSON',
  WARD_CHAIRPERSON = 'WARD_CHAIRPERSON',
  WARD_MEMBER = 'WARD_MEMBER',
}

export const ELECTED_POSITION_TRANSLATION_KEYS = {
  [ElectedPosition.CHAIRPERSON]: 'registration.electedPosition.chairperson',
  [ElectedPosition.VICE_CHAIRPERSON]:
    'registration.electedPosition.viceChairperson',
  [ElectedPosition.WARD_CHAIRPERSON]:
    'registration.electedPosition.wardChairperson',
  [ElectedPosition.WARD_MEMBER]: 'registration.electedPosition.wardMember',
} as const;
