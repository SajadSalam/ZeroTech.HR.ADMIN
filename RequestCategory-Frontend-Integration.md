# Request Category Frontend Integration Guide

This guide provides the essential information for integrating with the Request Category API endpoints.

## Base URL
- **Base URL**: `/api/RequestCategory`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token required

## Data Models

### Request Category Response (RequestCategoryDTO)
```json
{
  "id": 1,
  "name": "Leave Requests",
  "description": "All types of leave and time-off requests",
  "code": "LEAVE",
  "colorCode": "#4CAF50",
  "iconClass": "fas fa-calendar-alt",
  "displayOrder": 1,
  "isEnabled": true,
  "requestTypeCount": 5,
  "requestTypes": [
    {
      "id": 1,
      "name": "Annual Leave",
      "code": "ANNUAL_LEAVE",
      "categoryId": 1,
      "isEnabled": true,
      "requiresApproval": true
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:00Z",
  "isActive": true
}
```

### Create Request Category Request
```json
{
  "name": "Training Requests",
  "description": "Training and development requests",
  "code": "TRAINING",
  "colorCode": "#2196F3",
  "iconClass": "fas fa-graduation-cap",
  "displayOrder": 3,
  "isEnabled": true
}
```

### Update Request Category Request
```json
{
  "id": 1,
  "name": "Leave Requests Updated",
  "description": "Updated description for leave requests",
  "code": "LEAVE",
  "colorCode": "#4CAF50",
  "isEnabled": true
}
```

## API Endpoints

### 1. Get All Request Categories
- **Method**: `GET`
- **Endpoint**: `/api/RequestCategory`
- **Description**: Returns all request categories (enabled and disabled)

**Example Request**:
```
GET /api/RequestCategory
```

**Response**: List of all request categories

### 2. Get Enabled Request Categories
- **Method**: `GET`
- **Endpoint**: `/api/RequestCategory/enabled`
- **Description**: Returns only enabled request categories

**Example Request**:
```
GET /api/RequestCategory/enabled
```

**Response**: List of enabled request categories only

### 3. Get Categories with Request Type Counts
- **Method**: `GET`
- **Endpoint**: `/api/RequestCategory/with-counts`
- **Description**: Returns categories with the count of request types in each category

**Example Request**:
```
GET /api/RequestCategory/with-counts
```

**Response**: List of categories with `requestTypeCount` populated

### 4. Get Request Category by ID
- **Method**: `GET`
- **Endpoint**: `/api/RequestCategory/{id}`
- **Path Parameters**:
  - `id` (int, required) - Category ID

**Example Request**:
```
GET /api/RequestCategory/1
```

**Response**: Single request category with full details

### 5. Get Request Category by Code
- **Method**: `GET`
- **Endpoint**: `/api/RequestCategory/by-code/{code}`
- **Path Parameters**:
  - `code` (string, required) - Category code

**Example Request**:
```
GET /api/RequestCategory/by-code/LEAVE
```

**Response**: Single request category with full details

### 6. Get Category with Request Types
- **Method**: `GET`
- **Endpoint**: `/api/RequestCategory/{id}/with-request-types`
- **Path Parameters**:
  - `id` (int, required) - Category ID
- **Description**: Returns category with all its request types included

**Example Request**:
```
GET /api/RequestCategory/1/with-request-types
```

**Response**: Category with `requestTypes` array populated

### 7. Create Request Category
- **Method**: `POST`
- **Endpoint**: `/api/RequestCategory`
- **Body**: CreateRequestCategoryRequest (JSON)

**Example Request**:
```json
POST /api/RequestCategory
{
  "name": "Equipment Requests",
  "description": "Requests for equipment and supplies",
  "code": "EQUIPMENT",
  "colorCode": "#FF9800",
  "iconClass": "fas fa-tools",
  "displayOrder": 4,
  "isEnabled": true
}
```

**Response**: Created request category details
**Status Codes**: 201 (Created), 400 (Bad Request), 500 (Server Error)

### 8. Update Request Category
- **Method**: `PUT`
- **Endpoint**: `/api/RequestCategory/{id}`
- **Path Parameters**:
  - `id` (int, required) - Category ID
- **Body**: UpdateRequestCategoryRequest (JSON)

**Example Request**:
```json
PUT /api/RequestCategory/1
{
  "id": 1,
  "name": "Leave & Time Off",
  "description": "All leave and time-off related requests",
  "colorCode": "#4CAF50",
  "isEnabled": true
}
```

**Response**: Updated request category details
**Status Codes**: 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Server Error)

### 9. Delete Request Category
- **Method**: `DELETE`
- **Endpoint**: `/api/RequestCategory/{id}`
- **Path Parameters**:
  - `id` (int, required) - Category ID

**Example Request**:
```
DELETE /api/RequestCategory/1
```

**Response**: No content
**Status Codes**: 204 (No Content), 400 (Bad Request), 404 (Not Found), 500 (Server Error)

## Validation Rules

### Category Name
- **Required**: Yes
- **Length**: Max 100 characters
- **Format**: Any text

### Category Code
- **Required**: Yes
- **Length**: Max 50 characters
- **Format**: Uppercase letters, numbers, and underscores only (A-Z, 0-9, _)
- **Unique**: Must be unique across all categories

### Description
- **Required**: No
- **Length**: Max 500 characters

### Color Code
- **Required**: No
- **Format**: Valid hex color (e.g., #FF0000)
- **Length**: Exactly 7 characters including #

### Icon Class
- **Required**: No
- **Length**: Max 50 characters
- **Format**: CSS class name (e.g., fas fa-calendar)

### Display Order
- **Required**: No
- **Type**: Integer
- **Range**: Must be >= 0
- **Default**: 0

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Request category not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "Category code 'LEAVE' already exists"
}
```

### Validation Error Response
```json
{
  "errors": {
    "Name": ["Category name is required"],
    "Code": ["Category code must contain only uppercase letters, numbers, and underscores"]
  }
}
```

## Usage Examples

### Frontend Implementation Requirements

#### 1. Category Management Page
- Display all categories in a grid or list
- Show enabled/disabled status with visual indicators
- Display request type count for each category
- Sort by display order
- Actions: View, Edit, Delete, Enable/Disable

#### 2. Category Form (Create/Edit)
- Validate all required fields
- Code format validation (uppercase, numbers, underscores)
- Color picker for color code selection
- Icon selector with preview
- Display order input with sorting preview
- Enable/disable toggle

#### 3. Category Selection Components
- Dropdown for category selection in forms
- Visual display with colors and icons
- Filter by enabled status
- Sort by display order

#### 4. Category Dashboard
- Overview cards showing category statistics
- Request type count per category
- Visual representation with colors and icons
- Quick actions for common operations

### Recommended UI Features

#### Display Options
- Card view with colors, icons, and counts
- List view with detailed information
- Grid layout for category overview
- Enabled/disabled status indicators

#### Visual Elements
- Use category colors for consistent theming
- Display icons for easy recognition
- Show request type counts as badges
- Visual sorting by display order

#### Management Features
- Drag-and-drop reordering by display order
- Bulk enable/disable operations
- Quick edit inline for basic properties
- Category usage analytics

#### Form Components
- Color picker with preset color palette
- Icon selector with search functionality
- Code generator based on name
- Display order with visual preview

### Common Use Cases

#### Category Setup
1. Create main categories (Leave, Training, Equipment, etc.)
2. Set appropriate colors and icons
3. Configure display order for logical grouping
4. Enable categories for use

#### Category Organization
1. Use display order to control category sequence
2. Group related request types under appropriate categories
3. Use consistent color schemes for related categories
4. Choose meaningful icons for quick identification

#### Category Filtering
1. Filter request types by category
2. Show only enabled categories in user interfaces
3. Group requests by category in reports
4. Use categories for permission management

## Permissions

### View Categories
- **Who**: All authenticated users
- **Purpose**: View available categories for request creation

### Manage Categories
- **Who**: HR Admin, System Admin
- **Purpose**: Create, edit, delete, enable/disable categories

### Category Configuration
- **Who**: System Admin
- **Purpose**: Advanced configuration, system-level changes

---

**Last Updated**: October 2025  
**API Version**: v1.0
