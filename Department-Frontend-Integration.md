# Department Frontend Integration Guide

This guide provides the essential information for integrating with the Department API endpoints.

## Base URL
- **Base URL**: `/api/Department`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token required

## Data Models

### Department Response (DepartmentDTO)
```json
{
  "id": 1,
  "name": "Human Resources",
  "description": "Manages employee relations and policies",
  "code": "HR",
  "managerId": 5,
  "manager": {
    "id": 5,
    "fullName": "John Smith",
    "email": "john.smith@company.com",
    "username": "jsmith"
  },
  "parentDepartmentId": null,
  "parentDepartment": null,
  "subDepartments": [
    {
      "id": 10,
      "name": "Recruitment",
      "code": "HR_REC",
      "description": "Handles hiring processes"
    }
  ],
  "budget": 150000.00,
  "location": "Building A, Floor 3",
  "contactEmail": "hr@company.com",
  "contactPhone": "+1-555-0123",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:00Z",
  "isActive": true
}
```

### Create Department Request
```json
{
  "name": "Marketing",
  "description": "Handles marketing and promotions",
  "code": "MKT",
  "managerId": 8,
  "parentDepartmentId": null,
  "budget": 75000.00,
  "location": "Building B, Floor 2",
  "contactEmail": "marketing@company.com",
  "contactPhone": "+1-555-0456"
}
```

### Update Department Request
```json
{
  "id": 1,
  "name": "Human Resources",
  "description": "Updated description",
  "code": "HR",
  "managerId": 5,
  "parentDepartmentId": null,
  "budget": 160000.00,
  "location": "Building A, Floor 3",
  "contactEmail": "hr@company.com",
  "contactPhone": "+1-555-0123"
}
```

## API Endpoints

### 1. Get All Departments (Paginated)
- **Method**: `GET`
- **Endpoint**: `/api/Department`
- **Query Parameters**:
  - `pageNumber` (int, default: 1) - Page number
  - `pageSize` (int, default: 10) - Items per page
  - `name` (string, optional) - Filter by name (partial match)
  - `code` (string, optional) - Filter by code (partial match)
  - `managerId` (int, optional) - Filter by manager ID
  - `parentDepartmentId` (int, optional) - Filter by parent department
  - `topLevelOnly` (bool, optional) - Only top-level departments
  - `includeSubDepartments` (bool, default: false) - Include child departments
  - `includeManager` (bool, default: true) - Include manager details
  - `includeParent` (bool, default: true) - Include parent details
  - `minBudget` (decimal, optional) - Minimum budget filter
  - `maxBudget` (decimal, optional) - Maximum budget filter

**Example Request**:
```
GET /api/Department?pageNumber=1&pageSize=20&name=HR&includeSubDepartments=true
```

**Response**: Paginated list of departments

### 2. Get Department by ID
- **Method**: `GET`
- **Endpoint**: `/api/Department/{id}`
- **Path Parameters**:
  - `id` (int, required) - Department ID
- **Query Parameters**:
  - `includeSubDepartments` (bool, default: false) - Include child departments

**Example Request**:
```
GET /api/Department/1?includeSubDepartments=true
```

**Response**: Single department with details

### 3. Get Department by Code
- **Method**: `GET`
- **Endpoint**: `/api/Department/by-code/{code}`
- **Path Parameters**:
  - `code` (string, required) - Department code

**Example Request**:
```
GET /api/Department/by-code/HR
```

**Response**: Single department with details

### 4. Get Department Hierarchy
- **Method**: `GET`
- **Endpoint**: `/api/Department/hierarchy`
- **Description**: Returns all top-level departments with their complete sub-department tree

**Example Request**:
```
GET /api/Department/hierarchy
```

**Response**: Hierarchical list of departments

### 5. Get Sub-departments
- **Method**: `GET`
- **Endpoint**: `/api/Department/{id}/sub-departments`
- **Path Parameters**:
  - `id` (int, required) - Parent department ID

**Example Request**:
```
GET /api/Department/1/sub-departments
```

**Response**: List of child departments

### 6. Get Top-level Departments
- **Method**: `GET`
- **Endpoint**: `/api/Department/top-level`
- **Query Parameters**: Same as Get All Departments
- **Description**: Returns only departments without parent departments

**Example Request**:
```
GET /api/Department/top-level?pageSize=50
```

**Response**: Paginated list of top-level departments

### 7. Get Departments with Budget
- **Method**: `GET`
- **Endpoint**: `/api/Department/with-budget`
- **Query Parameters**: Same as Get All Departments
- **Description**: Returns only departments that have budget allocated (budget > 0)

**Example Request**:
```
GET /api/Department/with-budget?minBudget=10000
```

**Response**: Paginated list of departments with budget

### 8. Create Department
- **Method**: `POST`
- **Endpoint**: `/api/Department`
- **Body**: CreateDepartmentRequest (JSON)

**Example Request**:
```json
POST /api/Department
{
  "name": "IT Support",
  "code": "IT_SUP",
  "description": "Technical support team",
  "managerId": 12,
  "parentDepartmentId": 3,
  "budget": 50000.00,
  "location": "Building C, Floor 1",
  "contactEmail": "support@company.com"
}
```

**Response**: Created department details
**Status Codes**: 201 (Created), 400 (Bad Request), 409 (Conflict - duplicate code)

### 9. Update Department
- **Method**: `PUT`
- **Endpoint**: `/api/Department/{id}`
- **Path Parameters**:
  - `id` (int, required) - Department ID
- **Body**: UpdateDepartmentRequest (JSON)

**Example Request**:
```json
PUT /api/Department/5
{
  "id": 5,
  "name": "IT Support Updated",
  "code": "IT_SUP",
  "description": "Updated technical support team",
  "managerId": 12,
  "budget": 55000.00
}
```

**Response**: Updated department details
**Status Codes**: 200 (OK), 400 (Bad Request), 404 (Not Found), 409 (Conflict)

### 10. Delete Department
- **Method**: `DELETE`
- **Endpoint**: `/api/Department/{id}`
- **Path Parameters**:
  - `id` (int, required) - Department ID

**Example Request**:
```
DELETE /api/Department/5
```

**Response**: No content
**Status Codes**: 204 (No Content), 404 (Not Found), 409 (Conflict - has dependencies)

## Validation Rules

### Department Name
- **Required**: Yes
- **Length**: 2-100 characters
- **Format**: Any text

### Department Code
- **Required**: Yes
- **Length**: 2-10 characters
- **Format**: Uppercase letters, numbers, and underscores only (A-Z, 0-9, _)
- **Unique**: Must be unique across all departments

### Manager ID
- **Required**: No
- **Type**: Integer
- **Validation**: Must be a valid user ID if provided

### Parent Department ID
- **Required**: No
- **Type**: Integer
- **Validation**: Must be a valid department ID if provided
- **Rule**: Cannot create circular references (department cannot be its own parent/ancestor)

### Budget
- **Required**: No
- **Type**: Decimal
- **Range**: Must be >= 0 if provided

### Contact Email
- **Required**: No
- **Format**: Valid email address format
- **Length**: Max 100 characters

### Contact Phone
- **Required**: No
- **Format**: Valid phone number format
- **Length**: Max 20 characters

### Location
- **Required**: No
- **Length**: Max 200 characters

### Description
- **Required**: No
- **Length**: Max 500 characters

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Department not found
- **409 Conflict**: Duplicate department code or circular reference

### Error Response Format
```json
{
  "error": "Department code 'HR' already exists"
}
```

### Validation Error Response
```json
{
  "errors": {
    "Name": ["Department name is required"],
    "Code": ["Department code must contain only uppercase letters, numbers, and underscores"]
  }
}
```

## Usage Examples

### Frontend Implementation Requirements

#### 1. Department List Page
- Display paginated departments with search/filter
- Show department hierarchy (parent-child relationships)
- Include manager information
- Allow sorting by name, code, budget
- Provide actions: View, Edit, Delete, Add Sub-department

#### 2. Department Form (Create/Edit)
- Validate all required fields
- Department code format validation
- Manager selection dropdown (from users)
- Parent department selection (hierarchical dropdown)
- Budget input with decimal validation
- Contact information fields

#### 3. Department Hierarchy View
- Tree structure display
- Expandable/collapsible nodes
- Drag-and-drop for reorganization (if permitted)
- Visual indicators for departments with/without managers

#### 4. Department Selection Components
- Dropdown with search capability
- Hierarchical selection (show parent > child structure)
- Filter options (active only, with budget, etc.)

### Recommended UI Features

#### Search and Filtering
- Text search across name and description
- Filter by manager
- Filter by parent department
- Budget range filters
- Active/inactive status filter

#### Data Display
- Hierarchical tree view option
- Flat list view with parent indication
- Card view for detailed information
- Export functionality (CSV, Excel)

#### Permissions
- View departments: All authenticated users
- Create departments: HR Admin, System Admin
- Edit departments: Department Manager, HR Admin, System Admin
- Delete departments: HR Admin, System Admin (with confirmation)

---

**Last Updated**: October 2025  
**API Version**: v1.0
