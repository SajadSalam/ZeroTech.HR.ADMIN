# Payroll System API Documentation

## Overview

The Payroll System provides attendance-based payroll calculation and management capabilities. It uses a batch-based approach where payroll is calculated for groups of employees over specific time periods (e.g., monthly payroll).

### Key Features
- **Batch-based Processing**: Organize payroll by periods (e.g., "Payroll 2025 - OCT")
- **Attendance Integration**: Calculates based on actual attendance data
- **Flexible Calculations**: Adapts to employee work schedules and shifts
- **Automatic Deductions**: Handles absences, missing attendance, and late arrivals
- **Overtime Support**: Configurable overtime calculation
- **Audit Trail**: Full tracking of who created/modified records

---

## Base URL

```
/api/Payroll
```

---

## Authentication

All endpoints require JWT Bearer token authentication.

```http
Authorization: Bearer {your_jwt_token}
```

---

## Endpoints

### 1. Create Payroll Batch

Creates a new payroll batch for a specific period.

**Endpoint:**
```http
POST /api/Payroll/batch
```

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Payroll 2025 - OCT",
  "periodStartDate": "2025-10-01",
  "periodEndDate": "2025-10-31",
  "notes": "October monthly payroll"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Title of the payroll batch (max 200 chars) |
| `periodStartDate` | date | Yes | Start date of the payroll period |
| `periodEndDate` | date | Yes | End date of the payroll period |
| `notes` | string | No | Additional notes (max 1000 chars) |

**Success Response (201 Created):**
```json
{
  "id": 1,
  "title": "Payroll 2025 - OCT",
  "periodStartDate": "2025-10-01",
  "periodEndDate": "2025-10-31",
  "status": "Draft",
  "statusDisplay": "Draft",
  "totalEmployees": 0,
  "processedCount": 0,
  "totalGrossPay": 0.00,
  "totalNetPay": 0.00,
  "totalDeductions": 0.00,
  "processedAt": null,
  "processedByUserId": null,
  "processedByUserName": null,
  "notes": "October monthly payroll",
  "completionPercentage": 0.00,
  "isEditable": true,
  "periodDays": 31,
  "employeePayrolls": [],
  "createdAt": "2025-10-01T10:00:00Z",
  "createdByUserId": 5,
  "createdBy": "admin",
  "createdByUserName": "Admin User",
  "updatedAt": null,
  "updatedByUserId": null,
  "updatedBy": null,
  "updatedByUserName": null,
  "isActive": true
}
```

**Error Responses:**

**400 Bad Request** - Invalid data
```json
{
  "error": "Period end date must be after or equal to start date"
}
```

**409 Conflict** - Batch already exists
```json
{
  "error": "A payroll batch already exists for this period"
}
```

---

### 2. Get All Payroll Batches (Paginated)

Retrieves a paginated list of all payroll batches with optional filtering and sorting.

**Endpoint:**
```http
GET /api/Payroll/batch
```

**Request Headers:**
```http
Authorization: Bearer {token}
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pageNumber` | integer | No | 1 | Page number (1-based) |
| `pageSize` | integer | No | 10 | Number of items per page (max 100) |
| `status` | string | No | null | Filter by status (Draft, Calculating, Calculated, Approved, Paid, Cancelled) |
| `startDate` | date | No | null | Filter batches with period start date >= this date |
| `endDate` | date | No | null | Filter batches with period end date <= this date |
| `searchTerm` | string | No | null | Search in batch title |
| `sortBy` | string | No | "createdAt" | Sort field (createdAt, periodStartDate, title, status) |
| `sortOrder` | string | No | "desc" | Sort order (asc, desc) |

**Example Request:**
```http
GET /api/Payroll/batch?pageNumber=1&pageSize=10&status=Calculated&sortBy=periodStartDate&sortOrder=desc
```

**Success Response (200 OK):**
```json
{
  "items": [
    {
      "id": 5,
      "title": "Payroll 2025 - OCT",
      "periodStartDate": "2025-10-01",
      "periodEndDate": "2025-10-31",
      "status": "Calculated",
      "statusDisplay": "Calculated",
      "totalEmployees": 50,
      "processedCount": 50,
      "totalGrossPay": 150000.00,
      "totalNetPay": 142500.00,
      "totalDeductions": 7500.00,
      "processedAt": "2025-10-01T11:30:00Z",
      "processedByUserId": 5,
      "processedByUserName": "Admin User",
      "notes": "October monthly payroll",
      "completionPercentage": 100.00,
      "isEditable": false,
      "periodDays": 31,
      "createdAt": "2025-10-01T10:00:00Z",
      "createdByUserId": 5,
      "createdBy": "admin",
      "createdByUserName": "Admin User",
      "isActive": true
    },
    {
      "id": 4,
      "title": "Payroll 2025 - SEP",
      "periodStartDate": "2025-09-01",
      "periodEndDate": "2025-09-30",
      "status": "Paid",
      "statusDisplay": "Paid",
      "totalEmployees": 50,
      "processedCount": 50,
      "totalGrossPay": 148000.00,
      "totalNetPay": 141200.00,
      "totalDeductions": 6800.00,
      "processedAt": "2025-09-01T11:30:00Z",
      "processedByUserId": 5,
      "processedByUserName": "Admin User",
      "notes": "September monthly payroll",
      "completionPercentage": 100.00,
      "isEditable": false,
      "periodDays": 30,
      "createdAt": "2025-09-01T10:00:00Z",
      "createdByUserId": 5,
      "createdBy": "admin",
      "createdByUserName": "Admin User",
      "isActive": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 12,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Response Fields:**

**Items Array:**
Each item is a `PayrollBatchSummaryDTO` without the `employeePayrolls` collection for performance.

**Pagination Object:**

| Field | Type | Description |
|-------|------|-------------|
| `currentPage` | integer | Current page number |
| `pageSize` | integer | Items per page |
| `totalItems` | integer | Total number of batches matching the filter |
| `totalPages` | integer | Total number of pages |
| `hasNextPage` | boolean | Whether there is a next page |
| `hasPreviousPage` | boolean | Whether there is a previous page |

**Empty Result Response (200 OK):**
```json
{
  "items": [],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

**Filtering Examples:**

**Get all draft batches:**
```http
GET /api/Payroll/batch?status=Draft
```

**Get batches from specific period:**
```http
GET /api/Payroll/batch?startDate=2025-01-01&endDate=2025-12-31
```

**Search by title:**
```http
GET /api/Payroll/batch?searchTerm=October
```

**Get paid batches sorted by date (newest first):**
```http
GET /api/Payroll/batch?status=Paid&sortBy=periodStartDate&sortOrder=desc&pageSize=20
```

---

### 3. Calculate Payroll Batch

Calculates payroll for all or selected employees in a batch based on their attendance records.

**Endpoint:**
```http
POST /api/Payroll/batch/{batchId}/calculate
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchId` | integer | Yes | ID of the payroll batch to calculate |

**Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body (Optional):**
```json
{
  "batchId": 1,
  "employeeIds": [10, 15, 20],
  "overtimeMultiplier": 1.5,
  "lateDeductionFactor": 0.5,
  "recalculateExisting": false
}
```

**Request Fields:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `batchId` | integer | Yes | - | Payroll batch ID (from URL) |
| `employeeIds` | array | No | null | List of specific employee IDs to calculate. If null/empty, calculates all active employees |
| `overtimeMultiplier` | decimal | No | 1.5 | Overtime pay multiplier (1.0-3.0) |
| `lateDeductionFactor` | decimal | No | 0.5 | Late arrival deduction factor (0.0-1.0) |
| `recalculateExisting` | boolean | No | false | Whether to recalculate existing payrolls |

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Payroll 2025 - OCT",
  "periodStartDate": "2025-10-01",
  "periodEndDate": "2025-10-31",
  "status": "Calculated",
  "statusDisplay": "Calculated",
  "totalEmployees": 50,
  "processedCount": 50,
  "totalGrossPay": 150000.00,
  "totalNetPay": 142500.00,
  "totalDeductions": 7500.00,
  "processedAt": "2025-10-01T11:30:00Z",
  "processedByUserId": 5,
  "processedByUserName": "Admin User",
  "notes": "October monthly payroll",
  "completionPercentage": 100.00,
  "isEditable": false,
  "periodDays": 31,
  "employeePayrolls": [
    {
      "id": 1,
      "payrollBatchId": 1,
      "payrollBatchTitle": "Payroll 2025 - OCT",
      "employeeId": 10,
      "employeeNumber": "EMP001",
      "employeeName": "John Doe",
      "departmentName": "Engineering",
      "jobTitle": "Senior Developer",
      "baseSalary": 3000.00,
      "scheduledWorkingDays": 23,
      "actualWorkingDays": 20,
      "absentDays": 3,
      "lateDays": 2,
      "regularHours": 160.00,
      "overtimeHours": 5.00,
      "overtimePay": 127.88,
      "totalLateMinutes": 45,
      "lateDeductions": 6.39,
      "absenceDeductions": 391.30,
      "totalDeductions": 397.69,
      "grossPay": 3127.88,
      "netPay": 2730.19,
      "dailyRate": 130.43,
      "hourlyRate": 16.30,
      "overtimeMultiplier": 1.5,
      "status": "Calculated",
      "statusDisplay": "Calculated",
      "notes": null,
      "isEditable": false,
      "deductionPercentage": 12.72,
      "attendanceRate": 86.96,
      "createdAt": "2025-10-01T11:30:00Z",
      "createdByUserId": 5,
      "createdBy": "admin",
      "createdByUserName": "Admin User",
      "isActive": true
    }
  ],
  "createdAt": "2025-10-01T10:00:00Z",
  "isActive": true
}
```

**Calculation Logic:**

The system calculates payroll using the following formulas:

1. **Rate Calculations:**
   - `Daily Rate = Base Salary ÷ Scheduled Working Days in Period`
   - `Hourly Rate = Daily Rate ÷ Hours Per Day (from work schedule)`

2. **Income Calculations:**
   - `Overtime Pay = Overtime Hours × Hourly Rate × Overtime Multiplier`
   - `Gross Pay = Base Salary + Overtime Pay`

3. **Deduction Calculations:**
   - `Absence Deduction = Total Absent Days × Daily Rate`
   - `Late Deduction = (Total Late Minutes ÷ 60) × Hourly Rate × Late Deduction Factor`
   - `Total Deductions = Absence Deduction + Late Deduction`

4. **Final Calculation:**
   - `Net Pay = Gross Pay - Total Deductions`

**Absent Days Calculation:**
- Days marked as absent in attendance summary
- Days with no check-in/check-out records
- Missing attendance records for scheduled working days
- **Holidays are excluded from absent day calculations**

**Error Responses:**

**400 Bad Request** - Invalid batch ID
```json
{
  "error": "Payroll batch not found"
}
```

**409 Conflict** - Cannot recalculate
```json
{
  "error": "Cannot recalculate a paid batch"
}
```

---

### 4. Get Payroll Batch Details

Retrieves detailed information about a payroll batch including all employee payrolls.

**Endpoint:**
```http
GET /api/Payroll/batch/{batchId}
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchId` | integer | Yes | ID of the payroll batch |

**Request Headers:**
```http
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Payroll 2025 - OCT",
  "periodStartDate": "2025-10-01",
  "periodEndDate": "2025-10-31",
  "status": "Calculated",
  "statusDisplay": "Calculated",
  "totalEmployees": 50,
  "processedCount": 50,
  "totalGrossPay": 150000.00,
  "totalNetPay": 142500.00,
  "totalDeductions": 7500.00,
  "processedAt": "2025-10-01T11:30:00Z",
  "processedByUserId": 5,
  "processedByUserName": "Admin User",
  "notes": "October monthly payroll",
  "completionPercentage": 100.00,
  "isEditable": false,
  "periodDays": 31,
  "employeePayrolls": [
    {
      "id": 1,
      "payrollBatchId": 1,
      "employeeId": 10,
      "employeeNumber": "EMP001",
      "employeeName": "John Doe",
      "departmentName": "Engineering",
      "jobTitle": "Senior Developer",
      "baseSalary": 3000.00,
      "scheduledWorkingDays": 23,
      "actualWorkingDays": 20,
      "absentDays": 3,
      "lateDays": 2,
      "regularHours": 160.00,
      "overtimeHours": 5.00,
      "overtimePay": 127.88,
      "totalLateMinutes": 45,
      "lateDeductions": 6.39,
      "absenceDeductions": 391.30,
      "totalDeductions": 397.69,
      "grossPay": 3127.88,
      "netPay": 2730.19,
      "dailyRate": 130.43,
      "hourlyRate": 16.30,
      "overtimeMultiplier": 1.5,
      "status": "Calculated",
      "statusDisplay": "Calculated",
      "deductionPercentage": 12.72,
      "attendanceRate": 86.96,
      "isEditable": false
    }
  ],
  "createdAt": "2025-10-01T10:00:00Z",
  "isActive": true
}
```

**Error Responses:**

**404 Not Found** - Batch doesn't exist
```json
{
  "error": "Payroll batch with ID 999 not found"
}
```

---

### 5. Get Employee Payroll History

Retrieves the payroll history for a specific employee across all batches.

**Endpoint:**
```http
GET /api/Payroll/employee/{employeeId}
```

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `employeeId` | integer | Yes | ID of the employee |

**Request Headers:**
```http
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
[
  {
    "id": 150,
    "payrollBatchId": 5,
    "payrollBatchTitle": "Payroll 2025 - OCT",
    "employeeId": 10,
    "employeeNumber": "EMP001",
    "employeeName": "John Doe",
    "departmentName": "Engineering",
    "jobTitle": "Senior Developer",
    "baseSalary": 3000.00,
    "scheduledWorkingDays": 23,
    "actualWorkingDays": 20,
    "absentDays": 3,
    "lateDays": 2,
    "regularHours": 160.00,
    "overtimeHours": 5.00,
    "overtimePay": 127.88,
    "totalLateMinutes": 45,
    "lateDeductions": 6.39,
    "absenceDeductions": 391.30,
    "totalDeductions": 397.69,
    "grossPay": 3127.88,
    "netPay": 2730.19,
    "dailyRate": 130.43,
    "hourlyRate": 16.30,
    "overtimeMultiplier": 1.5,
    "status": "Calculated",
    "statusDisplay": "Calculated",
    "deductionPercentage": 12.72,
    "attendanceRate": 86.96,
    "createdAt": "2025-10-01T11:30:00Z",
    "isActive": true
  },
  {
    "id": 100,
    "payrollBatchId": 4,
    "payrollBatchTitle": "Payroll 2025 - SEP",
    "employeeId": 10,
    "employeeNumber": "EMP001",
    "employeeName": "John Doe",
    "departmentName": "Engineering",
    "jobTitle": "Senior Developer",
    "baseSalary": 3000.00,
    "scheduledWorkingDays": 22,
    "actualWorkingDays": 22,
    "absentDays": 0,
    "lateDays": 1,
    "regularHours": 176.00,
    "overtimeHours": 8.00,
    "overtimePay": 204.55,
    "totalLateMinutes": 15,
    "lateDeductions": 3.41,
    "absenceDeductions": 0.00,
    "totalDeductions": 3.41,
    "grossPay": 3204.55,
    "netPay": 3201.14,
    "dailyRate": 136.36,
    "hourlyRate": 17.05,
    "overtimeMultiplier": 1.5,
    "status": "Paid",
    "statusDisplay": "Paid",
    "deductionPercentage": 0.11,
    "attendanceRate": 100.00,
    "createdAt": "2025-09-01T11:30:00Z",
    "isActive": true
  }
]
```

**Empty Response (200 OK):**
```json
[]
```

---

## Data Models

### PayrollBatch Status

| Status | Value | Description |
|--------|-------|-------------|
| Draft | 1 | Initial state, can be edited |
| Calculating | 2 | Calculation in progress |
| Calculated | 3 | Calculation completed |
| Approved | 4 | Batch approved for payment |
| Paid | 5 | Payment completed |
| Cancelled | 6 | Batch cancelled |

### Payroll Status

| Status | Value | Description |
|--------|-------|-------------|
| Draft | 1 | Initial state |
| Calculated | 2 | Calculation completed |
| Approved | 3 | Approved for payment |
| Paid | 4 | Payment completed |

---

## Business Rules

### 1. Payroll Calculation Rules

- **Scheduled Working Days**: Calculated based on employee's work schedule and shifts
- **Absent Days Include**:
  - Days marked as absent in attendance system
  - Days with no check-in/check-out records
  - Missing attendance records for scheduled work days
- **Holidays**: Not counted as absent days or scheduled working days
- **Work Schedule Integration**: Hours per day and working days per month are calculated from employee's assigned work schedule
- **Default Values**: If no work schedule exists, system assumes 8 hours/day and 5-day work week

### 2. Batch Rules

- Only one batch can exist for overlapping date ranges
- Paid batches cannot be recalculated
- Draft batches can be deleted
- Calculated batches can be approved

### 3. Rate Calculations

- **Daily Rate**: Always calculated as Base Salary ÷ Scheduled Working Days in the specific period
- **Hourly Rate**: Calculated using hours per day from employee's work schedule
- **Overtime Multiplier**: Configurable per calculation (default 1.5x)
- **Late Deduction Factor**: Configurable per calculation (default 0.5x hourly rate)

### 4. Attendance Integration

The system uses `AttendanceSummary` records which aggregate daily attendance data including:
- Regular hours worked
- Overtime hours
- Late arrivals and minutes
- Absences
- Holiday indicators

---

## Example Scenarios

### Scenario 1: Simple Monthly Payroll

**Employee Details:**
- Base Salary: $3,000
- Work Schedule: 8 hours/day, Monday-Friday
- Period: Oct 1-31 (23 scheduled working days)

**Attendance:**
- Days worked: 23
- Overtime hours: 0
- Late days: 0
- Absent days: 0

**Calculation:**
```
Daily Rate = $3,000 ÷ 23 = $130.43
Hourly Rate = $130.43 ÷ 8 = $16.30
Overtime Pay = 0
Absence Deduction = 0
Late Deduction = 0
Gross Pay = $3,000
Net Pay = $3,000
```

---

### Scenario 2: Payroll with Absences and Overtime

**Employee Details:**
- Base Salary: $3,000
- Work Schedule: 8 hours/day, Monday-Friday
- Period: Oct 1-31 (23 scheduled working days)

**Attendance:**
- Days with attendance records: 20 days
- Days marked absent: 2 days
- Days with no check-in/check-out: 1 day
- Overtime hours: 10 hours
- Late days: 3 (total 90 minutes)

**Calculation:**
```
Daily Rate = $3,000 ÷ 23 = $130.43
Hourly Rate = $130.43 ÷ 8 = $16.30

Overtime Pay = 10 × $16.30 × 1.5 = $244.50
Absence Deduction = (2 + 1) × $130.43 = $391.29
Late Deduction = (90 ÷ 60) × $16.30 × 0.5 = $12.23

Gross Pay = $3,000 + $244.50 = $3,244.50
Total Deductions = $391.29 + $12.23 = $403.52
Net Pay = $3,244.50 - $403.52 = $2,840.98
```

---

### Scenario 3: Custom Work Schedule (10-hour shifts)

**Employee Details:**
- Base Salary: $4,000
- Work Schedule: 10 hours/day, Sunday-Thursday (6-day work week)
- Period: Oct 1-31 (26 scheduled working days)

**Attendance:**
- Days worked: 24 days
- Absent days: 2 days
- Overtime hours: 15 hours
- Late minutes: 0

**Calculation:**
```
Daily Rate = $4,000 ÷ 26 = $153.85
Hourly Rate = $153.85 ÷ 10 = $15.38

Overtime Pay = 15 × $15.38 × 1.5 = $346.05
Absence Deduction = 2 × $153.85 = $307.70
Late Deduction = 0

Gross Pay = $4,000 + $346.05 = $4,346.05
Net Pay = $4,346.05 - $307.70 = $4,038.35
```

---

## Integration Points

### Required Data

The Payroll System depends on:

1. **Employee Data**
   - Base salary
   - Work schedule assignment
   - Active status

2. **Attendance Data**
   - AttendanceSummary records for the payroll period
   - Check-in/check-out records
   - Overtime calculations
   - Late arrival tracking

3. **Work Schedule Data**
   - Shift definitions
   - Working days configuration
   - Hours per shift

### Workflow

```
1. Create Payroll Batch
   ↓
2. System loads all active employees
   ↓
3. Calculate payroll per employee:
   - Load work schedule
   - Query attendance summaries
   - Calculate scheduled working days
   - Identify absent days (marked + missing)
   - Calculate rates and deductions
   - Generate payroll record
   ↓
4. Aggregate batch totals
   ↓
5. Update batch status to "Calculated"
   ↓
6. Review and approve batch
   ↓
7. Mark as "Paid"
```

---

## Error Handling

### Common Error Codes

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input data or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 404 | Not Found | Requested resource doesn't exist |
| 409 | Conflict | Business rule violation (e.g., duplicate batch) |
| 500 | Internal Server Error | Unexpected server error |

### Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Best Practices

### 1. Batch Creation
- Use descriptive titles with period information
- Create batches at the beginning of the payroll period
- Include notes for any special circumstances

### 2. Calculation
- Calculate at the end of the payroll period when all attendance is recorded
- Review sample payrolls before calculating full batch
- Use `employeeIds` parameter to test calculation on specific employees first

### 3. Verification
- Review `completionPercentage` to ensure all employees are processed
- Check `totalDeductions` for anomalies
- Verify individual payrolls with high deduction percentages

### 4. Recalculation
- Use `recalculateExisting: true` only when attendance data has been corrected
- Document reason for recalculation in batch notes

### 5. Status Management
- Only approve batches after thorough review
- Mark as paid only after actual payment processing
- Keep audit trail by updating batch notes

---

## Performance Considerations

- **Batch Size**: Calculating large batches (1000+ employees) may take several minutes
- **Concurrent Calculations**: Only one batch can be in "Calculating" status at a time per request
- **Database Load**: Attendance queries are optimized with indexes on date ranges and employee IDs
- **Caching**: Employee work schedules are loaded once per calculation

---

## Changelog

### Version 1.0.0
- Initial release
- Basic payroll calculation based on attendance
- Batch management
- Overtime and deduction support
- Missing attendance deduction logic

