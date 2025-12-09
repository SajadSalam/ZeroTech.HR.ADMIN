export interface AssignForm {
    type: AssignType
    employeeIds: number[]
}

export enum AssignType { 
    Creator = "Creator",
    Auditor = "Auditor"
}