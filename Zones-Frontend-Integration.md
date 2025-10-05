# Zones Management Module - Frontend Integration

## Overview
The Zones Management module provides comprehensive functionality for creating, managing, and visualizing geographical zones with polygon boundaries. This module includes interactive map integration with Google Maps API for drawing and editing zone polygons.

## Features
- **CRUD Operations**: Complete Create, Read, Update, Delete operations for zones
- **Interactive Map**: Google Maps integration with polygon drawing tools
- **Polygon Management**: Draw, edit, and validate geographical polygons
- **Zone Visualization**: Display zones on map with different colors based on status
- **Area Calculation**: Automatic calculation of zone area and perimeter
- **Search and Filtering**: Filter zones by name and status
- **Statistics Dashboard**: Overview of total zones, active zones, and total area

## Module Structure

```
views/zones/
├── components/
│   ├── ZoneCreate.vue          # Create zone form with map integration
│   ├── ZoneEdit.vue            # Edit zone form with map integration
│   ├── ZoneMap.vue             # Interactive map component with polygon drawing
│   └── ZoneMapViewer.vue       # Read-only map viewer for zone details
├── service/
│   └── index.ts                # API service layer
├── store/
│   └── index.ts                # Pinia store for state management
├── types/
│   └── index.ts                # TypeScript type definitions
└── index.ts                    # Table headers and fake data
```

## API Endpoints

### Zone Management
- `GET /zones` - Get paginated list of zones with filtering
- `GET /zones/{id}` - Get zone by ID
- `GET /zones/by-bounds` - Get zones within map bounds
- `POST /zones` - Create new zone
- `PUT /zones/{id}` - Update existing zone
- `DELETE /zones/{id}` - Delete zone
- `POST /zones/validate-polygon` - Validate polygon and calculate area/perimeter

### Query Parameters for GET /zones
- `pageNumber`: Page number for pagination
- `pageSize`: Number of items per page
- `name`: Filter by zone name (partial match)
- `isActive`: Filter by active status (true/false)

### Query Parameters for GET /zones/by-bounds
- `north`: Northern boundary latitude
- `south`: Southern boundary latitude
- `east`: Eastern boundary longitude
- `west`: Western boundary longitude

## Data Models

### Zone
```typescript
type Zone = {
  name: string
  description?: string
  polygon: ZonePolygon
  isActive: boolean
}
```

### ZoneDto
```typescript
type ZoneDto = BaseDto & Zone & {
  area?: number // calculated area in square meters
  perimeter?: number // calculated perimeter in meters
}
```

### ZonePolygon
```typescript
type ZonePolygon = {
  coordinates: Coordinate[]
}

type Coordinate = {
  lat: number
  lng: number
}
```

## Google Maps Integration

### Setup Requirements
1. **Google Maps API Key**: Required for map functionality
2. **Libraries**: Drawing library must be enabled
3. **API Configuration**: Update the API key in `ZoneMap.vue`

```javascript
const script = document.createElement('script')
script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCaCtuz1gOGSgHAtj6QNaboAb7D1poz36E&libraries=drawing`
```

### Map Features
- **Interactive Drawing**: Users can draw polygons directly on the map
- **Polygon Editing**: Existing polygons can be edited by dragging vertices
- **Zone Visualization**: All zones are displayed with different colors
- **Info Windows**: Click on zones to view details
- **Bounds-based Loading**: Zones are loaded based on current map view

### Drawing Tools
- **Polygon Tool**: Draw new zone boundaries
- **Edit Mode**: Modify existing polygon vertices
- **Clear Function**: Remove current polygon
- **Validation**: Ensure minimum 3 points for valid polygon

## Component Usage

### ZoneMap Component
```vue
<ZoneMap
  height="500px"
  :show-drawing-tools="true"
  :show-zones="true"
  :readonly="false"
/>
```

**Props:**
- `height`: Map container height (default: "400px")
- `showDrawingTools`: Show/hide drawing controls (default: true)
- `showZones`: Display existing zones on map (default: true)
- `readonly`: Disable editing capabilities (default: false)

### Store Usage
```typescript
const zoneStore = useZoneStore()

// Open create dialog
zoneStore.openCreateDialog()

// Open edit dialog
zoneStore.openEditDialog(zone)

// Open map viewer
zoneStore.openMapDialog(zone)

// Set drawing mode
zoneStore.setDrawingMode('polygon')

// Update polygon coordinates
zoneStore.setCurrentPolygon(coordinates)
```

## Validation Rules

### Zone Validation
- **Name**: Required field
- **Polygon**: Minimum 3 coordinates required
- **Coordinates**: Valid latitude/longitude values
- **Area**: Calculated automatically on backend

### Polygon Validation
- Minimum 3 points required for valid polygon
- Coordinates must be within valid lat/lng ranges
- Self-intersecting polygons should be avoided
- Maximum polygon complexity limits may apply

## UI Features

### Zone List View
- **Table Display**: Sortable columns for name, area, points count, status
- **Search**: Filter by zone name
- **Status Filter**: Filter by active/inactive status
- **Map Button**: Quick access to view zone on map
- **Statistics Cards**: Overview of zone metrics

### Create/Edit Forms
- **Basic Information**: Name, description, status
- **Interactive Map**: Draw or edit polygon boundaries
- **Real-time Validation**: Immediate feedback on polygon validity
- **Preview Section**: Summary of zone details
- **Status Indicators**: Visual feedback for polygon completion

### Map Viewer
- **Read-only Display**: View zone without editing capabilities
- **Zone Information**: Detailed zone metadata
- **Multiple Zones**: Display all zones in current view
- **Info Windows**: Click zones for quick details

## Styling and Theming

### Map Styling
- **Active Zones**: Green fill with darker green border
- **Inactive Zones**: Gray fill with darker gray border
- **Current Polygon**: Blue fill with darker blue border
- **Editable Polygons**: Enhanced stroke width and opacity

### UI Components
- **Arabic RTL Support**: All text and layouts support right-to-left
- **Dark Mode**: Full dark mode support for all components
- **Responsive Design**: Mobile-friendly layouts
- **Loading States**: Proper loading indicators during API calls

## Performance Considerations

### Map Optimization
- **Bounds-based Loading**: Only load zones in current view
- **Polygon Simplification**: Reduce complexity for large polygons
- **Lazy Loading**: Load map API only when needed
- **Memory Management**: Proper cleanup of map overlays

### Data Management
- **Pagination**: Server-side pagination for large datasets
- **Caching**: Store frequently accessed zones
- **Debounced Search**: Prevent excessive API calls during typing
- **Optimistic Updates**: Immediate UI feedback before API confirmation

## Error Handling

### Map Errors
- **API Load Failure**: Graceful fallback when Google Maps fails
- **Drawing Errors**: User-friendly messages for invalid polygons
- **Coordinate Validation**: Prevent invalid lat/lng values
- **Network Issues**: Retry mechanisms for failed requests

### Form Validation
- **Required Fields**: Clear indication of missing required data
- **Polygon Validation**: Real-time feedback on polygon validity
- **Server Errors**: Display backend validation messages
- **Conflict Resolution**: Handle concurrent edit scenarios

## Security Considerations

### API Security
- **Input Validation**: Sanitize all polygon coordinates
- **Rate Limiting**: Prevent excessive API calls
- **Authentication**: Verify user permissions for zone operations
- **Data Validation**: Server-side validation of all inputs

### Map Security
- **API Key Protection**: Secure Google Maps API key
- **Domain Restrictions**: Limit API key usage to specific domains
- **User Permissions**: Check privileges before allowing operations
- **Data Sanitization**: Clean user-provided polygon data

## Testing Recommendations

### Unit Tests
- **Service Layer**: Test all API interactions
- **Store Logic**: Validate state management
- **Validation Functions**: Test polygon validation rules
- **Utility Functions**: Test coordinate calculations

### Integration Tests
- **Map Integration**: Test Google Maps API integration
- **Form Submission**: Test create/edit workflows
- **Error Scenarios**: Test error handling paths
- **User Interactions**: Test drawing and editing flows

### E2E Tests
- **Complete Workflows**: Test full zone creation process
- **Map Interactions**: Test polygon drawing and editing
- **Search and Filter**: Test filtering functionality
- **Responsive Design**: Test on different screen sizes

## Deployment Notes

### Environment Configuration
- **Google Maps API Key**: Configure in environment variables
- **API Endpoints**: Update base URLs for different environments
- **Feature Flags**: Control map features per environment
- **Performance Monitoring**: Track map loading and interaction metrics

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation for unsupported features
- **Polyfills**: Include necessary polyfills for older browsers

## Future Enhancements

### Planned Features
- **Zone Templates**: Predefined zone shapes
- **Bulk Operations**: Import/export multiple zones
- **Zone Analytics**: Usage statistics and reporting
- **Advanced Drawing**: Support for circles and rectangles
- **Offline Support**: Cached zone data for offline viewing

### Integration Opportunities
- **GIS Systems**: Integration with existing GIS platforms
- **Real-time Updates**: WebSocket support for live zone updates
- **Mobile App**: Native mobile app integration
- **Third-party Maps**: Support for alternative map providers
