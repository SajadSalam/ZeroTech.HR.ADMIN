# Zone Frontend Integration Guide

This guide provides the essential information for integrating with the Zone API endpoints for geographical zone management.

## Base URL
- **Base URL**: `/Zone`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token required

## Data Models

### Zone Response (ZoneDTO)
```json
{
  "id": 1,
  "name": "Downtown Commercial District",
  "description": "Main commercial area with shops and offices",
  "polygonCoordinates": "{\"type\":\"Polygon\",\"coordinates\":[[[lng,lat],[lng,lat]...]]}",
  "zoneType": "Commercial",
  "color": "#FF5722",
  "opacity": 0.6,
  "areaSquareMeters": 125000.5,
  "formattedArea": "12.5 hectares",
  "centerLatitude": 40.7128,
  "centerLongitude": -74.0060,
  "priority": 8,
  "metadata": "{\"maxBuildings\": 50, \"parkingSpaces\": 200}",
  "isOperational": true,
  "polygon": {
    "type": "Polygon",
    "coordinates": [
      [
        [-74.0070, 40.7120],
        [-74.0050, 40.7120],
        [-74.0050, 40.7135],
        [-74.0070, 40.7135],
        [-74.0070, 40.7120]
      ]
    ]
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:00Z",
  "isActive": true
}
```

### Create Zone Request
```json
{
  "name": "Industrial Park Zone",
  "description": "Manufacturing and warehouse district",
  "polygonCoordinates": "{\"type\":\"Polygon\",\"coordinates\":[[[lng,lat],[lng,lat]...]]}",
  "zoneType": "Industrial",
  "color": "#9C27B0",
  "opacity": 0.7,
  "priority": 6,
  "metadata": "{\"maxHeight\": 25, \"noiseLevel\": \"high\"}",
  "isOperational": true
}
```

### Zone Statistics Response (ZoneStatsDTO)
```json
{
  "totalZones": 15,
  "operationalZones": 12,
  "inactiveZones": 3,
  "totalAreaSquareMeters": 2500000.0,
  "formattedTotalArea": "250 hectares",
  "zonesByType": {
    "Commercial": 5,
    "Residential": 6,
    "Industrial": 3,
    "Mixed-Use": 1
  },
  "zonesByPriority": {
    "10": 2,
    "8": 4,
    "5": 6,
    "3": 3
  },
  "largestZone": {
    "id": 5,
    "name": "Residential Complex A",
    "areaSquareMeters": 450000.0,
    "formattedArea": "45 hectares"
  },
  "smallestZone": {
    "id": 12,
    "name": "Small Commercial Plaza",
    "areaSquareMeters": 5000.0,
    "formattedArea": "0.5 hectares"
  }
}
```

## API Endpoints

### 1. Get All Zones
- **Method**: `GET`
- **Endpoint**: `/Zone`
- **Description**: Returns all zones without pagination

**Example Request**:
```
GET /Zone
```

**Response**: List of all zones

### 2. Get Paginated Zones
- **Method**: `GET`
- **Endpoint**: `/Zone/paged`
- **Query Parameters**: ZoneQueryRequest with filtering options

**Example Request**:
```
GET /Zone/paged?pageNumber=1&pageSize=10&zoneType=Commercial&isOperational=true
```

**Response**: Paginated list of zones with filtering

### 3. Get Zone by ID
- **Method**: `GET`
- **Endpoint**: `/Zone/{id}`
- **Path Parameters**:
  - `id` (int, required) - Zone ID

**Example Request**:
```
GET /Zone/1
```

**Response**: Single zone with full details

### 4. Create Zone
- **Method**: `POST`
- **Endpoint**: `/Zone`
- **Body**: CreateZoneRequest (JSON)

**Example Request**:
```json
POST /Zone
{
  "name": "New Shopping Center",
  "description": "Modern retail complex",
  "polygonCoordinates": "{\"type\":\"Polygon\",\"coordinates\":[...]}",
  "zoneType": "Commercial",
  "color": "#4CAF50",
  "priority": 7,
  "isOperational": true
}
```

**Response**: Created zone details
**Status Codes**: 201 (Created), 400 (Bad Request), 409 (Conflict), 500 (Server Error)

### 5. Update Zone
- **Method**: `PUT`
- **Endpoint**: `/Zone/{id}`
- **Path Parameters**:
  - `id` (int, required) - Zone ID
- **Body**: UpdateZoneRequest (JSON)

**Example Request**:
```json
PUT /Zone/1
{
  "id": 1,
  "name": "Updated Zone Name",
  "color": "#FF9800",
  "priority": 9,
  "isOperational": false
}
```

**Response**: Updated zone details
**Status Codes**: 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Server Error)

### 6. Delete Zone
- **Method**: `DELETE`
- **Endpoint**: `/Zone/{id}`
- **Path Parameters**:
  - `id` (int, required) - Zone ID

**Example Request**:
```
DELETE /Zone/1
```

**Response**: No content (soft delete)
**Status Codes**: 204 (No Content), 404 (Not Found), 500 (Server Error)

### 7. Find Zones Containing Point
- **Method**: `POST`
- **Endpoint**: `/Zone/point-in-zones`
- **Body**: PointInZoneRequest (JSON)
- **Description**: Find all zones that contain a specific GPS coordinate

**Example Request**:
```json
POST /Zone/point-in-zones
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "operationalOnly": true
}
```

**Response**: List of zones containing the point

### 8. Get Zone Statistics
- **Method**: `GET`
- **Endpoint**: `/Zone/stats`
- **Description**: Returns analytics and statistics about all zones

**Example Request**:
```
GET /Zone/stats
```

**Response**: Zone statistics and analytics data

### 9. Bulk Zone Operations
- **Method**: `POST`
- **Endpoint**: `/Zone/bulk-operation`
- **Body**: BulkZoneOperationRequest (JSON)
- **Description**: Perform operations on multiple zones at once

**Example Request**:
```json
POST /Zone/bulk-operation
{
  "zoneIds": [1, 2, 3, 4],
  "operation": "updatePriority",
  "parameters": {
    "priority": 8
  }
}
```

**Response**: Operation result with affected zone count
**Status Codes**: 200 (OK), 400 (Bad Request), 500 (Server Error)

## Query Parameters (for Paginated Zones)

### Basic Filtering
- `name` (string) - Filter by zone name (partial match)
- `description` (string) - Filter by description (partial match)
- `zoneType` (string) - Filter by zone type
- `isOperational` (boolean) - Filter by operational status
- `searchTerm` (string) - Search across name, description, and type

### Priority Filtering
- `minPriority` (int, 1-10) - Minimum priority level
- `maxPriority` (int, 1-10) - Maximum priority level

### Area Filtering
- `minAreaSquareMeters` (double) - Minimum area in square meters
- `maxAreaSquareMeters` (double) - Maximum area in square meters

### Geographic Filtering (Bounding Box)
- `northLatitude` (double, -90 to 90) - North boundary
- `southLatitude` (double, -90 to 90) - South boundary
- `eastLongitude` (double, -180 to 180) - East boundary
- `westLongitude` (double, -180 to 180) - West boundary

### Response Options
- `includePolygonCoordinates` (boolean, default: true) - Include polygon data
- `includeParsedPolygon` (boolean, default: false) - Include parsed polygon object

## Validation Rules

### Zone Name
- **Required**: Yes
- **Length**: 2-200 characters
- **Format**: Any text

### Polygon Coordinates
- **Required**: Yes
- **Format**: Valid GeoJSON Polygon string
- **Example**: `{"type":"Polygon","coordinates":[[[lng,lat],[lng,lat]...]]}`

### Zone Type
- **Required**: No
- **Length**: Max 50 characters
- **Common Values**: "Commercial", "Residential", "Industrial", "Mixed-Use", "Recreational"

### Color
- **Required**: No
- **Format**: Hex color code (#RRGGBB or #RGB)
- **Examples**: "#FF0000", "#F00", "#4CAF50"
- **Default**: "#3388ff"

### Opacity
- **Required**: No
- **Range**: 0.0 to 1.0
- **Default**: 0.5

### Priority
- **Required**: No
- **Range**: 1 to 10 (10 = highest priority)
- **Default**: 5

### Coordinates (for Point-in-Zone)
- **Latitude**: -90 to 90 degrees
- **Longitude**: -180 to 180 degrees

## Bulk Operations

### Available Operations
- **"activate"** - Set zones as operational
- **"deactivate"** - Set zones as non-operational
- **"delete"** - Soft delete zones
- **"updatePriority"** - Change priority level (requires priority parameter)
- **"updateColor"** - Change zone color (requires color parameter)
- **"updateType"** - Change zone type (requires zoneType parameter)

### Parameters Examples
```json
{
  "operation": "updatePriority",
  "parameters": { "priority": 8 }
}

{
  "operation": "updateColor",
  "parameters": { "color": "#FF5722" }
}

{
  "operation": "activate",
  "parameters": {}
}
```

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Zone not found
- **409 Conflict**: Zone name already exists or overlapping zones
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "Zone with name 'Downtown District' already exists"
}
```

## Usage Examples

### Frontend Implementation Requirements

#### 1. Zone Map Interface
- Display zones as colored polygons on map
- Show zone boundaries with customizable colors and opacity
- Click zones to view details
- Support zoom and pan operations

#### 2. Zone Management
- Create zones by drawing polygons on map
- Edit existing zone boundaries
- Update zone properties (name, type, priority, color)
- Delete zones with confirmation

#### 3. Zone Search and Filtering
- Search zones by name or description
- Filter by type, priority, operational status
- Filter by area size range
- Geographic filtering with bounding box

#### 4. Point-in-Zone Lookup
- Click on map to find containing zones
- GPS coordinate input for zone lookup
- Display all zones containing a specific point

#### 5. Zone Analytics
- Display zone statistics dashboard
- Show zone distribution by type and priority
- Area calculations and comparisons
- Operational vs inactive zone counts

### Recommended UI Features

#### Map Integration
- Interactive map with zone polygons
- Color-coded zones by type or priority
- Hover effects showing zone information
- Drawing tools for creating new zones

#### Zone List Management
- Sortable table with zone information
- Bulk selection and operations
- Export zone data
- Import zones from files

#### Zone Editor
- Polygon drawing and editing tools
- Color picker for zone appearance
- Priority slider (1-10)
- Metadata editor for custom properties

### Permissions
- **View Zones**: All authenticated users
- **Create/Edit Zones**: Zone Admin, System Admin
- **Delete Zones**: System Admin only
- **Bulk Operations**: Zone Admin, System Admin

---

**Last Updated**: October 2025  
**API Version**: v1.0
