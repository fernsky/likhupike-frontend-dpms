import { UserType } from '@app/core/models/user-type.enum';
import { OfficeSection, ElectedPosition } from '@app/core/models/office.enum';

export interface LocationInfo {
  provinceCode: string;
  districtCode: string;
  municipalityCode: string;
  wardNumber?: number;
}

export interface EmployeeInfo extends LocationInfo {
  officeSection: OfficeSection;
  isWardOffice: boolean;
}

export interface ElectedRepInfo extends LocationInfo {
  position: ElectedPosition;
}

export interface RegisterFormState {
  currentStep: number;
  totalSteps: number;
  formData: {
    fullNameNepali: string;
    fullName: string;
    phoneNumber: string;
    isFromWard: boolean;
    userType: UserType;
    email: string;
    password: string;
    location?: LocationInfo;
    employeeInfo?: EmployeeInfo;
    electedRepInfo?: ElectedRepInfo;
  };
  isValid: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
  };
  security: {
    persistSensitiveData: boolean;
    lastActivity: number;
    sessionTimeout: number;
  };
}

export const initialRegisterFormState: RegisterFormState = {
  currentStep: 1,
  totalSteps: 4,
  formData: {
    fullNameNepali: '',
    fullName: '',
    phoneNumber: '',
    isFromWard: false,
    userType: UserType.CITIZEN,
    email: '',
    password: '',
    location: undefined,
    employeeInfo: undefined,
    electedRepInfo: undefined,
  },
  isValid: {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  },
  security: {
    persistSensitiveData: false,
    lastActivity: Date.now(),
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
};
