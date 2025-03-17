export enum UserType {
  CITIZEN = 'CITIZEN',
  LOCAL_LEVEL_EMPLOYEE = 'LOCAL_LEVEL_EMPLOYEE',
  ELECTED_REPRESENTATIVE = 'ELECTED_REPRESENTATIVE',
  OTHER = 'OTHER',
}

// Replace static labels with translation keys
export const USER_TYPE_TRANSLATION_KEYS = {
  [UserType.CITIZEN]: 'registration.userTypes.citizen',
  [UserType.LOCAL_LEVEL_EMPLOYEE]: 'registration.userTypes.localLevelEmployee',
  [UserType.ELECTED_REPRESENTATIVE]:
    'registration.userTypes.electedRepresentative',
  [UserType.OTHER]: 'registration.userTypes.other',
} as const;

export const USER_TYPE_LABELS = {
  [UserType.CITIZEN]: 'Citizen',
  [UserType.LOCAL_LEVEL_EMPLOYEE]: 'Local Level Employee',
  [UserType.ELECTED_REPRESENTATIVE]: 'Elected Representative',
  [UserType.OTHER]: 'Other',
};

/*
Citizen: Province -> District -> Municipality -> Ward
Local Level Employee: Province -> District -> Municipality

Office Section
- General Administration (Administration, Planning, Monitoring & Evaluation)
- Revenue & Financial Administration (Tax, Revenue, Budget)
- Infrastructure Development (Road, Water Supply, Electricity, Urban Development)
- Social Development (Helath, Education, Social Welfare)
- Economic Development (Agriculture, Industry, Tourism)
- Planning & Development (Urban & Rural Planning, Monitoring & Evaluation)
- Environment & Disaster Management (Disaster Management, Environment Conservation)
- Legal & Information (Legal, Information, Communication)
- Other (Other)

Local Level Representative: Province -> District -> Municipality

Elected Representative: Province -> District -> Municipality

Position:
- Chairperson
- Vice Chairperson
- Ward chairperson
- Ward member

Aka if ward chairperson or member is selectd select specific ward
*/
