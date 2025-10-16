# Work Schedule API Documentation

## Overview

The Work Schedule API provides comprehensive functionality for managing employee work schedules, including flexible working hours, multiple shifts, and user assignments. All endpoints support audit logging and follow RESTful conventions.

## Base URL
```
/workschedule
```

## Authentication
All endpoints require authentication. Include the user's authentication token in the request headers.

---

## Endpoints

### 1. Create Work Schedule
**POST** `/workschedule`

Creates a new work schedule with one or more shifts.

#### Request Body
```json
{
  "name": "Standard Office Hours",
  "description": "Regular 9-to-5 office schedule with lunch break",
  "isFlexible": false,
  "flexibleHoursRequired": null,
  "isGeneralTemplate": true,
  "specificUserId": null,
  "shifts": [
    {
      "name": "Morning Shift",
      "startTime": "09:00",
      "endTime": "17:00",
      "workingDays": 62,
      "breakDurationMinutes": 60
    }
  ]
}
```

#### Request Body (Flexible Schedule Example)
```json
{
  "name": "Flexible Remote Work",
  "description": "Flexible 40-hour work week",
  "isFlexible": true,
  "flexibleHoursRequired": 40.0,
  "isGeneralTemplate": true,
  "specificUserId": null,
  "shifts": [
    {
      "name": "Flexible Hours",
      "startTime": "08:00",
      "endTime": "18:00",
      "workingDays": 62,
      "breakDurationMinutes": 60
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Work schedule created successfully",
  "data": {
    "id": 1,
    "name": "Standard Office Hours",
    "description": "Regular 9-to-5 office schedule with lunch break",
    "isFlexible": false,
    "flexibleHoursRequired": null,
    "isGeneralTemplate": true,
    "specificUserId": null,
    "specificUser": null,
    "shifts": [
      {
        "id": 1,
        "name": "Morning Shift",
        "startTime": "09:00",
        "endTime": "17:00",
        "workingDays": 62,
        "workingDaysArray": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "breakDurationMinutes": 60,
        "workScheduleId": 1,
        "totalHours": 7.0,
        "workingDaysCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "createdBy": "admin",
        "updatedAt": "2024-01-15T10:30:00Z",
        "updatedBy": "admin",
        "isDeleted": false
      }
    ],
    "assignments": [],
    "totalWeeklyHours": 35.0,
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "admin",
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": "admin",
    "isDeleted": false
  }
}
```

#### Validation Errors (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Name": ["Work schedule name is required"],
    "Shifts": ["At least one shift is required"],
    "Shifts[0].StartTime": ["Start time must be before end time"]
  }
}
```

---

### 2. Get All Work Schedules
**GET** `/workschedule`

Retrieves a paginated list of work schedules with optional filtering.

#### Query Parameters
- `pageNumber` (int, optional): Page number (default: 1)
- `pageSize` (int, optional): Items per page (default: 10, max: 100)
- `sortColumn` (string, optional): Column to sort by
- `sortDirection` (string, optional): "asc" or "desc" (default: "asc")
- `name` (string, optional): Filter by schedule name
- `isFlexible` (bool, optional): Filter by flexibility
- `isGeneralTemplate` (bool, optional): Filter by template type
- `specificUserId` (int, optional): Filter by specific user

#### Request Example
```
GET /workschedule?pageNumber=1&pageSize=10&isGeneralTemplate=true&sortColumn=name&sortDirection=asc
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Work schedules retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Standard Office Hours",
        "description": "Regular 9-to-5 office schedule with lunch break",
        "isFlexible": false,
        "flexibleHoursRequired": null,
        "isGeneralTemplate": true,
        "specificUserId": null,
        "specificUser": null,
        "shifts": [
          {
            "id": 1,
            "name": "Morning Shift",
            "startTime": "09:00",
            "endTime": "17:00",
            "workingDays": 62,
            "workingDaysArray": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "breakDurationMinutes": 60,
            "workScheduleId": 1,
            "totalHours": 7.0,
            "workingDaysCount": 5
          }
        ],
        "assignments": [],
        "totalWeeklyHours": 35.0,
        "createdAt": "2024-01-15T10:30:00Z",
        "createdBy": "admin"
      }
    ],
    "totalCount": 1,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

---

### 3. Get Work Schedule by ID
**GET** `/workschedule/{id}`

Retrieves a specific work schedule with all its shifts and user assignments.

#### Request Example
```
GET /workschedule/1
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Work schedule retrieved successfully",
  "data": {
    "id": 1,
    "name": "Standard Office Hours",
    "description": "Regular 9-to-5 office schedule with lunch break",
    "isFlexible": false,
    "flexibleHoursRequired": null,
    "isGeneralTemplate": true,
    "specificUserId": null,
    "specificUser": null,
    "shifts": [
      {
        "id": 1,
        "name": "Morning Shift",
        "startTime": "09:00",
        "endTime": "17:00",
        "workingDays": 62,
        "workingDaysArray": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "breakDurationMinutes": 60,
        "workScheduleId": 1,
        "totalHours": 7.0,
        "workingDaysCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "createdBy": "admin",
        "updatedAt": "2024-01-15T10:30:00Z",
        "updatedBy": "admin",
        "isDeleted": false
      }
    ],
    "assignments": [],
    "totalWeeklyHours": 35.0,
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "admin",
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": "admin",
    "isDeleted": false
  }
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Work schedule not found",
  "data": null
}
```

---

### 4. Update Work Schedule
**PUT** `/workschedule/{id}`

Updates an existing work schedule and its shifts.

#### Request Body
```json
{
  "id": 1,
  "name": "Updated Office Hours",
  "description": "Updated description with new break times",
  "isFlexible": false,
  "flexibleHoursRequired": null,
  "isGeneralTemplate": true,
  "specificUserId": null,
  "shifts": [
    {
      "id": 1,
      "name": "Updated Morning Shift",
      "startTime": "08:30",
      "endTime": "17:30",
      "workingDays": 62,
      "breakDurationMinutes": 90
    },
    {
      "name": "New Afternoon Shift",
      "startTime": "13:00",
      "endTime": "21:00",
      "workingDays": 96,
      "breakDurationMinutes": 30
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Work schedule updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Office Hours",
    "description": "Updated description with new break times",
    "isFlexible": false,
    "flexibleHoursRequired": null,
    "isGeneralTemplate": true,
    "specificUserId": null,
    "specificUser": null,
    "shifts": [
      {
        "id": 1,
        "name": "Updated Morning Shift",
        "startTime": "08:30",
        "endTime": "17:30",
        "workingDays": 62,
        "workingDaysArray": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "breakDurationMinutes": 90,
        "workScheduleId": 1,
        "totalHours": 7.5,
        "workingDaysCount": 5,
        "updatedAt": "2024-01-15T11:45:00Z",
        "updatedBy": "admin"
      },
      {
        "id": 2,
        "name": "New Afternoon Shift",
        "startTime": "13:00",
        "endTime": "21:00",
        "workingDays": 96,
        "workingDaysArray": ["Friday", "Saturday"],
        "breakDurationMinutes": 30,
        "workScheduleId": 1,
        "totalHours": 7.5,
        "workingDaysCount": 2,
        "createdAt": "2024-01-15T11:45:00Z",
        "createdBy": "admin"
      }
    ],
    "assignments": [],
    "totalWeeklyHours": 52.5,
    "updatedAt": "2024-01-15T11:45:00Z",
    "updatedBy": "admin"
  }
}
```

---

### 5. Delete Work Schedule
**DELETE** `/workschedule/{id}`

Soft deletes a work schedule and all its associated shifts.

#### Request Example
```
DELETE /workschedule/1
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Work schedule deleted successfully",
  "data": null
}
```

#### Response (404 Not Found)
```json
{
  "success": false,
  "message": "Work schedule not found",
  "data": null
}
```

---

### 6. Get General Templates
**GET** `/workschedule/templates`

Retrieves only general template work schedules (not user-specific).

#### Query Parameters
- `pageNumber` (int, optional): Page number (default: 1)
- `pageSize` (int, optional): Items per page (default: 10)
- `sortColumn` (string, optional): Column to sort by
- `sortDirection` (string, optional): "asc" or "desc"

#### Request Example
```
GET /workschedule/templates?pageNumber=1&pageSize=20
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "General templates retrieved successfully",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Standard Office Hours",
        "description": "Regular 9-to-5 office schedule",
        "isFlexible": false,
        "flexibleHoursRequired": null,
        "isGeneralTemplate": true,
        "specificUserId": null,
        "shifts": [
          {
            "id": 1,
            "name": "Morning Shift",
            "startTime": "09:00",
            "endTime": "17:00",
            "workingDays": 62,
            "workingDaysArray": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "breakDurationMinutes": 60,
            "totalHours": 7.0,
            "workingDaysCount": 5
          }
        ],
        "totalWeeklyHours": 35.0
      }
    ],
    "totalCount": 1,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

---

### 7. Assign Users to Work Schedule
**POST** `/workschedule/{id}/assign-users`

Assigns multiple users to a work schedule with specific effective dates.

#### Request Body
```json
{
  "assignments": [
    {
      "userId": 101,
      "effectiveDate": "2024-02-01T00:00:00Z",
      "expiryDate": "2024-12-31T23:59:59Z",
      "isPrimary": true,
      "notes": "Primary work schedule for full-time employee"
    },
    {
      "userId": 102,
      "effectiveDate": "2024-02-01T00:00:00Z",
      "expiryDate": null,
      "isPrimary": false,
      "notes": "Secondary schedule for part-time coverage"
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Users assigned to work schedule successfully",
  "data": {
    "workScheduleId": 1,
    "assignedUsers": [
      {
        "id": 1,
        "userId": 101,
        "workScheduleId": 1,
        "effectiveDate": "2024-02-01T00:00:00Z",
        "expiryDate": "2024-12-31T23:59:59Z",
        "isPrimary": true,
        "notes": "Primary work schedule for full-time employee",
        "user": {
          "id": 101,
          "username": "john.doe",
          "email": "john.doe@company.com",
          "firstName": "John",
          "lastName": "Doe"
        },
        "createdAt": "2024-01-15T12:00:00Z",
        "createdBy": "admin"
      },
      {
        "id": 2,
        "userId": 102,
        "workScheduleId": 1,
        "effectiveDate": "2024-02-01T00:00:00Z",
        "expiryDate": null,
        "isPrimary": false,
        "notes": "Secondary schedule for part-time coverage",
        "user": {
          "id": 102,
          "username": "jane.smith",
          "email": "jane.smith@company.com",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "createdAt": "2024-01-15T12:00:00Z",
        "createdBy": "admin"
      }
    ]
  }
}
```

---

### 8. Validate Work Schedule
**POST** `/workschedule/validate`

Validates a work schedule configuration without creating it.

#### Request Body
```json
{
  "name": "Test Schedule",
  "description": "Testing validation",
  "isFlexible": true,
  "flexibleHoursRequired": 40.0,
  "isGeneralTemplate": true,
  "specificUserId": null,
  "shifts": [
    {
      "name": "Flexible Shift",
      "startTime": "08:00",
      "endTime": "18:00",
      "workingDays": 62,
      "breakDurationMinutes": 60
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Work schedule validation successful",
  "data": {
    "isValid": true,
    "validationErrors": [],
    "estimatedWeeklyHours": 45.0,
    "totalShifts": 1,
    "flexibilityStatus": "Flexible schedule with 40.0 required hours per week",
    "workingDaysBreakdown": {
      "Monday": 1,
      "Tuesday": 1,
      "Wednesday": 1,
      "Thursday": 1,
      "Friday": 1,
      "Saturday": 0,
      "Sunday": 0
    }
  }
}
```

#### Response (400 Bad Request - Validation Failed)
```json
{
  "success": false,
  "message": "Work schedule validation failed",
  "data": {
    "isValid": false,
    "validationErrors": [
      "Shift 'Invalid Shift': Start time must be before end time",
      "Flexible hours required must be specified when schedule is flexible"
    ],
    "estimatedWeeklyHours": 0,
    "totalShifts": 1,
    "flexibilityStatus": "Invalid flexible schedule configuration",
    "workingDaysBreakdown": {}
  }
}
```

---

## Creation Validation Rules

### Work Schedule Validation

When creating or updating a work schedule, the following validation rules are enforced:

#### Basic Information Validation
- **Name**: Required, 2-100 characters, must be unique within the system
- **Description**: Optional, maximum 500 characters
- **IsFlexible**: Boolean flag indicating if the schedule supports flexible hours
- **FlexibleHoursRequired**: Required when `IsFlexible` is true, must be between 0.1 and 168 hours per week
- **IsGeneralTemplate**: Boolean flag indicating if this is a general template or user-specific
- **SpecificUserId**: Required when `IsGeneralTemplate` is false, must be null when `IsGeneralTemplate` is true

#### Shift Validation Rules

Each shift must comply with the following rules:

##### Basic Shift Information
- **Name**: Required, 2-100 characters, must be unique within the work schedule
- **StartTime**: Required, must be in "HH:mm" format (00:00 to 23:59)
- **EndTime**: Required, must be in "HH:mm" format (00:00 to 23:59)
- **WorkingDays**: Required, must be between 1 and 127 (at least one day selected)
- **BreakDurationMinutes**: Optional, must be between 0 and 1440 minutes if specified

##### Time Validation
- **Start Time < End Time**: Start time must be before end time
- **Valid Time Format**: Times must be in 24-hour "HH:mm" format
- **Reasonable Duration**: Shift duration should be reasonable (typically 1-24 hours)

##### Working Days Validation
- **At Least One Day**: Must select at least one working day (bit value > 0)
- **Valid Bit Flags**: Working days value must not exceed 127 (all days = 1+2+4+8+16+32+64)

#### Business Logic Validation

##### Flexible Schedule Rules
```json
// Valid flexible schedule
{
  "isFlexible": true,
  "flexibleHoursRequired": 40.0  // Required when flexible
}

// Invalid flexible schedule
{
  "isFlexible": true,
  "flexibleHoursRequired": null  // ERROR: Must specify hours when flexible
}

// Valid non-flexible schedule
{
  "isFlexible": false,
  "flexibleHoursRequired": null  // Should be null when not flexible
}
```

##### User-Specific Schedule Rules
```json
// Valid general template
{
  "isGeneralTemplate": true,
  "specificUserId": null  // Must be null for general templates
}

// Valid user-specific schedule
{
  "isGeneralTemplate": false,
  "specificUserId": 123  // Required for user-specific schedules
}

// Invalid configuration
{
  "isGeneralTemplate": true,
  "specificUserId": 123  // ERROR: Cannot specify user for general template
}
```

##### Shift Collection Rules
- **Minimum Shifts**: At least one shift is required
- **Unique Names**: All shift names within a schedule must be unique (case-insensitive)
- **No Overlapping Times**: Shifts with overlapping working days should not have conflicting time ranges

#### Validation Error Examples

##### Missing Required Fields
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Name": ["Work schedule name is required"],
    "Shifts": ["At least one shift is required"]
  }
}
```

##### Invalid Time Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Shifts[0].StartTime": ["Invalid start time format. Use HH:mm format (e.g., '09:00')"],
    "Shifts[0].EndTime": ["Invalid end time format. Use HH:mm format (e.g., '17:00')"]
  }
}
```

##### Time Logic Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Shifts[0].StartTime": ["Start time must be before end time"],
    "Shifts[0].EndTime": ["Start time must be before end time"]
  }
}
```

##### Flexible Schedule Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "FlexibleHoursRequired": [
      "Flexible hours required must be specified and greater than 0 when schedule is flexible"
    ]
  }
}
```

##### User Assignment Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "SpecificUserId": [
      "Specific user ID is required when schedule is not a general template"
    ]
  }
}
```

##### Duplicate Names
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Shifts[1].Name": ["Duplicate shift name 'Morning Shift' found"]
  }
}
```

##### Working Days Validation
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Shifts[0].WorkingDays": ["At least one working day must be selected"]
  }
}
```

##### Break Duration Validation
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "Shifts[0].BreakDurationMinutes": [
      "Break duration must be between 0 and 1440 minutes"
    ]
  }
}
```

#### Advanced Validation Rules

##### Shift Overlap Detection
The system checks for potential conflicts when shifts have overlapping working days:

```json
// Potentially conflicting shifts
{
  "shifts": [
    {
      "name": "Morning Shift",
      "startTime": "08:00",
      "endTime": "16:00",
      "workingDays": 62  // Monday-Friday
    },
    {
      "name": "Afternoon Shift", 
      "startTime": "14:00",  // Overlaps with morning shift
      "endTime": "22:00",
      "workingDays": 32      // Friday only - conflict on Friday
    }
  ]
}
```

##### Business Hours Validation
- **Reasonable Hours**: System warns if shifts exceed 12 hours duration
- **Break Requirements**: For shifts longer than 6 hours, break duration is recommended
- **Weekly Limits**: Total weekly hours should not exceed reasonable limits (typically 60-80 hours)

#### Validation Response Format

All validation errors follow a consistent format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "PropertyName": ["Error message 1", "Error message 2"],
    "Shifts[index].PropertyName": ["Shift-specific error message"]
  }
}
```

#### Pre-Creation Validation Endpoint

Use the validation endpoint to check your data before creation:

```bash
POST /workschedule/validate
```

This endpoint performs all validation checks without creating the actual record, allowing you to verify your data structure and business rules compliance.

---

## Working Days Bit Flags

The `workingDays` field uses bit flags to represent multiple days:

| Day | Bit Value |
|-----|-----------|
| Sunday | 1 |
| Monday | 2 |
| Tuesday | 4 |
| Wednesday | 8 |
| Thursday | 16 |
| Friday | 32 |
| Saturday | 64 |

### Examples:
- **Monday to Friday**: `2 + 4 + 8 + 16 + 32 = 62`
- **Weekend only**: `1 + 64 = 65`
- **Monday, Wednesday, Friday**: `2 + 8 + 32 = 42`
- **All days**: `1 + 2 + 4 + 8 + 16 + 32 + 64 = 127`

---

## Time Format

All time fields (`startTime`, `endTime`) use **HH:mm** format (24-hour):
- `"09:00"` for 9:00 AM
- `"17:30"` for 5:30 PM
- `"23:45"` for 11:45 PM

---

## Error Responses

### Common HTTP Status Codes

- **400 Bad Request**: Validation errors, invalid data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Business rule violation (e.g., duplicate names)
- **500 Internal Server Error**: Server-side errors

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "FieldName": ["Error message 1", "Error message 2"]
  }
}
```