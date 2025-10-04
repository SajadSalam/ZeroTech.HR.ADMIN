# Request Type Frontend Integration Guide

This guide provides the essential information for integrating with the Request Type API endpoints.

## Base URL
- **Base URL**: `/RequestType`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token required

## Data Models

### Request Type Response (RequestTypeDTO)
```json
{
  "id": 1,
  "name": "Annual Leave",
  "description": "Annual vacation leave request",
  "code": "ANNUAL_LEAVE",
  "categoryId": 1,
  "category": {
    "id": 1,
    "name": "Leave",
    "code": "LEAVE"
  },
  "isEnabled": true,
  "requiresApproval": true,
  "allowsAttachments": true,
  "requiresAttachments": false,
  "maxAdvanceDays": 90,
  "minAdvanceDays": 1,
  "maxDurationDays": 30,
  "minDurationHours": 8.0,
  "affectsAttendance": true,
  "affectsPayroll": false,
  "isPaidTime": true,
  "validationRules": "{\"maxConsecutiveDays\": 14}",
  "customFields": "[{\"name\":\"reason\",\"type\":\"text\",\"required\":true}]",
  "notificationSettings": "{\"notifyManager\": true, \"notifyHR\": false}",
  "displayOrder": 1,
  "colorCode": "#4CAF50",
  "iconClass": "fas fa-calendar-alt",
  "allowedDepartments": [
    {
      "id": 10,
      "requestTypeId": 1,
      "departmentId": 5,
      "department": {
        "id": 5,
        "name": "Engineering"
      }
    }
  ],
  "allowedRoles": [
    {
      "id": 15,
      "requestTypeId": 1,
      "roleId": 3,
      "role": {
        "id": 3,
        "name": "Employee"
      }
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:00Z",
  "isActive": true
}
```

### Create Request Type Request
```json
{
  "name": "Sick Leave",
  "description": "Medical leave for illness",
  "code": "SICK_LEAVE",
  "categoryId": 1,
  "isEnabled": true,
  "requiresApproval": true,
  "allowsAttachments": true,
  "requiresAttachments": true,
  "maxAdvanceDays": 0,
  "minAdvanceDays": 0,
  "maxDurationDays": 5,
  "minDurationHours": 4.0,
  "affectsAttendance": true,
  "affectsPayroll": true,
  "isPaidTime": false,
  "displayOrder": 2,
  "colorCode": "#FF5722",
  "iconClass": "fas fa-user-md",
  "allowedDepartmentIds": [1, 2, 3],
  "allowedRoleIds": [2, 3]
}
```

### Update Request Type Request
```json
{
  "id": 1,
  "name": "Annual Leave Updated",
  "description": "Updated annual vacation leave request",
  "code": "ANNUAL_LEAVE",
  "categoryId": 1,
  "isEnabled": true,
  "requiresApproval": true,
  "maxDurationDays": 25
}
```

## API Endpoints

### 1. Get All Request Types
- **Method**: `GET`
- **Endpoint**: `/RequestType`
- **Description**: Returns all request types (enabled and disabled)

**Example Request**:
```
GET /RequestType
```

**Response**: List of all request types

### 2. Get Enabled Request Types
- **Method**: `GET`
- **Endpoint**: `/RequestType/enabled`
- **Description**: Returns only enabled request types

**Example Request**:
```
GET /RequestType/enabled
```

**Response**: List of enabled request types only

### 3. Get Request Type by ID
- **Method**: `GET`
- **Endpoint**: `/RequestType/{id}`
- **Path Parameters**:
  - `id` (int, required) - Request type ID

**Example Request**:
```
GET /RequestType/1
```

**Response**: Single request type with full details

### 4. Get Request Type by Code
- **Method**: `GET`
- **Endpoint**: `/RequestType/by-code/{code}`
- **Path Parameters**:
  - `code` (string, required) - Request type code

**Example Request**:
```
GET /RequestType/by-code/ANNUAL_LEAVE
```

**Response**: Single request type with full details

### 5. Get Request Types by Category
- **Method**: `GET`
- **Endpoint**: `/RequestType/by-category/{categoryId}`
- **Path Parameters**:
  - `categoryId` (int, required) - Category ID

**Example Request**:
```
GET /RequestType/by-category/1
```

**Response**: List of request types in the specified category

### 6. Get Request Type with Restrictions
- **Method**: `GET`
- **Endpoint**: `/RequestType/{id}/with-restrictions`
- **Path Parameters**:
  - `id` (int, required) - Request type ID
- **Description**: Returns request type with department and role restrictions

**Example Request**:
```
GET /RequestType/1/with-restrictions
```

**Response**: Request type with allowed departments and roles

### 7. Get Available Request Types for User
- **Method**: `GET`
- **Endpoint**: `/RequestType/available-for-user/{userId}`
- **Path Parameters**:
  - `userId` (int, required) - User ID
- **Description**: Returns request types available to a specific user based on their department and role

**Example Request**:
```
GET /RequestType/available-for-user/123
```

**Response**: List of request types available to the user

### 8. Get Available Request Types for Department
- **Method**: `GET`
- **Endpoint**: `/RequestType/available-for-department/{departmentId}`
- **Path Parameters**:
  - `departmentId` (int, required) - Department ID

**Example Request**:
```
GET /RequestType/available-for-department/5
```

**Response**: List of request types available to the department

### 9. Get Available Request Types for Role
- **Method**: `GET`
- **Endpoint**: `/RequestType/available-for-role/{roleId}`
- **Path Parameters**:
  - `roleId` (int, required) - Role ID

**Example Request**:
```
GET /RequestType/available-for-role/3
```

**Response**: List of request types available to the role

### 10. Create Request Type
- **Method**: `POST`
- **Endpoint**: `/RequestType`
- **Body**: CreateRequestTypeRequest (JSON)

**Example Request**:
```json
POST /RequestType
{
  "name": "Overtime Request",
  "code": "OVERTIME",
  "categoryId": 2,
  "requiresApproval": true,
  "affectsPayroll": true,
  "isPaidTime": true,
  "minDurationHours": 1.0,
  "colorCode": "#2196F3"
}
```

**Response**: Created request type details
**Status Codes**: 201 (Created), 400 (Bad Request), 500 (Server Error)

### 11. Update Request Type
- **Method**: `PUT`
- **Endpoint**: `/RequestType/{id}`
- **Path Parameters**:
  - `id` (int, required) - Request type ID
- **Body**: UpdateRequestTypeRequest (JSON)

**Example Request**:
```json
PUT /RequestType/1
{
  "id": 1,
  "name": "Annual Leave Updated",
  "maxDurationDays": 25,
  "isEnabled": true
}
```

**Response**: Updated request type details
**Status Codes**: 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Server Error)

### 12. Delete Request Type
- **Method**: `DELETE`
- **Endpoint**: `/RequestType/{id}`
- **Path Parameters**:
  - `id` (int, required) - Request type ID

**Example Request**:
```
DELETE /RequestType/1
```

**Response**: No content
**Status Codes**: 204 (No Content), 400 (Bad Request), 404 (Not Found), 500 (Server Error)

## Validation Rules

### Request Type Name
- **Required**: Yes
- **Length**: Max 100 characters
- **Format**: Any text

### Request Type Code
- **Required**: Yes
- **Length**: Max 50 characters
- **Format**: Uppercase letters, numbers, and underscores only (A-Z, 0-9, _)
- **Unique**: Must be unique across all request types

### Category ID
- **Required**: Yes
- **Type**: Integer
- **Range**: Must be > 0
- **Validation**: Must be a valid category ID

### Advance Days
- **Max Advance Days**: 0-365 days
- **Min Advance Days**: 0-365 days
- **Rule**: Min advance days cannot be greater than max advance days

### Duration
- **Max Duration Days**: 0-365 days
- **Min Duration Hours**: 0.5-24 hours

### Color Code
- **Required**: No
- **Format**: Valid hex color (e.g., #FF0000)
- **Length**: Exactly 7 characters including #

### Icon Class
- **Required**: No
- **Length**: Max 50 characters
- **Format**: CSS class name (e.g., fas fa-calendar)

### JSON Fields
- **Validation Rules**: Valid JSON format
- **Custom Fields**: Valid JSON array format
- **Notification Settings**: Valid JSON object format

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Request type not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "Request type code 'ANNUAL_LEAVE' already exists"
}
```

### Validation Error Response
```json
{
  "errors": {
    "Name": ["Request type name is required"],
    "Code": ["Request type code must contain only uppercase letters, numbers, and underscores"]
  }
}
```

## Usage Examples

### Frontend Implementation Requirements

#### 1. Request Type List Page
- Display all request types grouped by category
- Show enabled/disabled status
- Filter by category, enabled status
- Search by name or code
- Actions: View, Edit, Delete, Enable/Disable

#### 2. Request Type Form (Create/Edit)
- Validate all required fields
- Code format validation (uppercase, numbers, underscores)
- Category selection dropdown
- Duration and advance days validation
- Color picker for color code
- Icon selector for icon class
- Department and role restrictions (multi-select)

#### 3. Request Type Selection Components
- Dropdown filtered by user's available types
- Category-grouped selection
- Visual indicators (colors, icons)
- Show restrictions and requirements

#### 4. Request Type Configuration
- JSON editors for validation rules, custom fields, notifications
- Preview of custom fields
- Validation rule testing
- Notification settings configuration

### Recommended UI Features

#### Display Options
- Card view with colors and icons
- List view with detailed information
- Category-based grouping
- Enabled/disabled status indicators

#### Filtering and Search
- Filter by category
- Filter by enabled/disabled status
- Search by name or code
- Filter by approval requirement
- Filter by attachment settings

#### Configuration Management
- Visual form builders for custom fields
- Rule builder for validation rules
- Notification template editor
- Department/role restriction manager

#### Permissions
- View request types: All authenticated users
- Create request types: HR Admin, System Admin
- Edit request types: HR Admin, System Admin
- Delete request types: System Admin only
- Enable/disable: HR Admin, System Admin

---

**Last Updated**: October 2025  
**API Version**: v1.0
