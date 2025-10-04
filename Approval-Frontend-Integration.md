# Approval Frontend Integration Guide

This guide provides the essential information for integrating with the Approval Chain API endpoints.

## Base URL
- **Base URL**: `/api/ApprovalChain` and `/api/ApprovalStep`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token required

## Data Models

### Approval Chain Response (ApprovalChainDTO)
```json
{
  "id": 1,
  "requestTypeId": 5,
  "requestType": {
    "id": 5,
    "name": "Annual Leave",
    "code": "ANNUAL_LEAVE"
  },
  "departmentId": 3,
  "department": {
    "id": 3,
    "name": "Engineering",
    "code": "ENG"
  },
  "name": "Engineering Annual Leave Approval",
  "description": "Standard approval process for engineering annual leave requests",
  "isActive": true,
  "priority": 1,
  "activationConditions": "{\"minDays\": 5}",
  "allowsParallelApproval": false,
  "allowsStepSkipping": true,
  "maxCompletionHours": 72,
  "timeoutAction": "Escalate",
  "escalationUserId": 10,
  "escalationUser": {
    "id": 10,
    "username": "hr.manager",
    "email": "hr.manager@company.com"
  },
  "approvalSteps": [
    {
      "id": 1,
      "name": "Direct Manager Approval",
      "stepOrder": 1,
      "isRequired": true,
      "maxCompletionHours": 24
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:00Z",
  "isActive": true
}
```

### Create Approval Chain Request
```json
{
  "requestTypeId": 5,
  "departmentId": 3,
  "name": "Engineering Annual Leave Approval",
  "description": "Standard approval process for engineering annual leave requests",
  "isActive": true,
  "priority": 1,
  "allowsParallelApproval": false,
  "allowsStepSkipping": true,
  "maxCompletionHours": 72,
  "timeoutAction": "Escalate",
  "escalationUserId": 10
}
```

### Approval Step Response (ApprovalStepDTO)
```json
{
  "id": 1,
  "approvalChainId": 1,
  "name": "Direct Manager Approval",
  "description": "Approval by direct line manager",
  "stepOrder": 1,
  "isRequired": true,
  "allowsAutoApproval": false,
  "allowsParallelApproval": false,
  "minRequiredApprovals": 1,
  "requiresAllApprovers": false,
  "maxCompletionHours": 24,
  "sendReminders": true,
  "firstReminderHours": 12,
  "reminderIntervalHours": 6,
  "maxReminders": 3,
  "timeoutAction": "Escalate",
  "escalationUserId": 15,
  "isActive": true,
  "approvalStepRoles": [
    {
      "id": 1,
      "roleId": 3,
      "role": {
        "id": 3,
        "name": "Manager"
      }
    }
  ],
  "approvalStepUsers": [
    {
      "id": 1,
      "userId": 25,
      "user": {
        "id": 25,
        "username": "john.manager",
        "email": "john.manager@company.com"
      }
    }
  ]
}
```

## API Endpoints

### Approval Chain Endpoints

#### 1. Get All Approval Chains
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalChain`
- **Query Parameters**:
  - `pageNumber` (int, optional) - Page number (default: 1)
  - `pageSize` (int, optional) - Items per page (default: 10)

**Example Request**:
```
GET /api/ApprovalChain?pageNumber=1&pageSize=20
```

**Response**: Paginated list of approval chains

#### 2. Get Approval Chain by ID
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalChain/{id}`
- **Path Parameters**:
  - `id` (int, required) - Approval chain ID

**Example Request**:
```
GET /api/ApprovalChain/1
```

**Response**: Single approval chain with all steps and approvers

#### 3. Get Approval Chains by Request Type and Department
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalChain/by-request-type-and-department`
- **Query Parameters**:
  - `requestTypeId` (int, required) - Request type ID
  - `departmentId` (int, required) - Department ID

**Example Request**:
```
GET /api/ApprovalChain/by-request-type-and-department?requestTypeId=5&departmentId=3
```

**Response**: List of approval chains for the specific request type and department

#### 4. Get Primary Approval Chain
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalChain/primary`
- **Query Parameters**:
  - `requestTypeId` (int, required) - Request type ID
  - `departmentId` (int, required) - Department ID
- **Description**: Returns the highest priority active approval chain

**Example Request**:
```
GET /api/ApprovalChain/primary?requestTypeId=5&departmentId=3
```

**Response**: Primary approval chain for the request type and department

#### 5. Create Approval Chain
- **Method**: `POST`
- **Endpoint**: `/api/ApprovalChain`
- **Body**: CreateApprovalChainRequest (JSON)

**Example Request**:
```json
POST /api/ApprovalChain
{
  "requestTypeId": 5,
  "departmentId": 3,
  "name": "Manager + HR Approval",
  "description": "Two-step approval process",
  "priority": 2,
  "maxCompletionHours": 48,
  "timeoutAction": "AutoReject"
}
```

**Response**: Created approval chain details
**Status Codes**: 201 (Created), 400 (Bad Request), 500 (Server Error)

#### 6. Update Approval Chain
- **Method**: `PUT`
- **Endpoint**: `/api/ApprovalChain/{id}`
- **Path Parameters**:
  - `id` (int, required) - Approval chain ID
- **Body**: UpdateApprovalChainRequest (JSON)

**Example Request**:
```json
PUT /api/ApprovalChain/1
{
  "id": 1,
  "name": "Updated Chain Name",
  "maxCompletionHours": 96,
  "isActive": true
}
```

**Response**: Updated approval chain details
**Status Codes**: 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Server Error)

#### 7. Delete Approval Chain
- **Method**: `DELETE`
- **Endpoint**: `/api/ApprovalChain/{id}`
- **Path Parameters**:
  - `id` (int, required) - Approval chain ID

**Example Request**:
```
DELETE /api/ApprovalChain/1
```

**Response**: No content
**Status Codes**: 204 (No Content), 404 (Not Found), 500 (Server Error)

### Approval Step Endpoints

#### 8. Get Approval Steps by Chain
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalStep/by-approval-chain/{approvalChainId}`
- **Path Parameters**:
  - `approvalChainId` (int, required) - Approval chain ID

**Example Request**:
```
GET /api/ApprovalStep/by-approval-chain/1
```

**Response**: List of approval steps for the chain, ordered by step order

## Validation Rules

### Approval Chain
- **Name**: Required, max 100 characters
- **Request Type ID**: Required, must be valid request type
- **Department ID**: Required, must be valid department
- **Priority**: Must be >= 0
- **Max Completion Hours**: Must be >= 1 if specified
- **Timeout Action**: Must be one of: "AutoApprove", "AutoReject", "Escalate", "Notify"
- **Escalation User ID**: Required if timeout action is "Escalate"

### Approval Step
- **Name**: Required, max 100 characters
- **Step Order**: Required, must be >= 1
- **Min Required Approvals**: Must be >= 1 if parallel approval enabled
- **Max Completion Hours**: Must be >= 1 if specified
- **Reminder Hours**: Must be >= 1 if reminders enabled
- **Must have at least one approver** (role or user)

## Business Rules

### Chain Priority
- Higher priority number = higher priority
- Only one chain can be primary (highest priority) per request type + department
- Inactive chains are not considered for approval routing

### Step Ordering
- Steps are executed in order (1, 2, 3, etc.)
- Step skipping allowed only if chain allows it
- Required steps cannot be skipped

### Parallel Approval
- When enabled, multiple approvers can approve simultaneously
- Can require minimum number of approvals or all approvers
- Useful for committee-style approvals

### Timeout Handling
- **AutoApprove**: Automatically approves the request
- **AutoReject**: Automatically rejects the request
- **Escalate**: Routes to escalation user for decision
- **Notify**: Sends notification but takes no action

### Activation Conditions
- JSON format conditions that determine when chain/step is used
- Examples: `{"minAmount": 1000}`, `{"requestDays": {">=": 5}}`
- Evaluated at runtime when request is submitted

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Approval chain or step not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "Approval chain with ID 1 not found"
}
```

## Usage Examples

### Frontend Implementation Requirements

#### 1. Approval Chain Management
- List all chains with filtering by request type and department
- Create/edit chains with step configuration
- Set priority and activation conditions
- Configure timeout and escalation settings

#### 2. Approval Step Configuration
- Define step order and requirements
- Assign approvers (roles and/or specific users)
- Set timing and reminder preferences
- Configure parallel approval rules

#### 3. Chain Selection Logic
- Find appropriate chain for request type + department
- Handle multiple chains with priority selection
- Evaluate activation conditions
- Display chain preview to users

#### 4. Approval Flow Visualization
- Show step-by-step approval process
- Display current step and pending approvers
- Show timeout and escalation information
- Track approval progress

### Recommended UI Features

#### Chain Builder
- Drag-and-drop step ordering
- Visual step configuration
- Approver assignment interface
- Condition builder for activation rules

#### Chain Testing
- Simulate approval flow
- Test condition evaluation
- Validate chain configuration
- Preview approval routing

#### Monitoring Dashboard
- Active chains overview
- Timeout alerts
- Escalation notifications
- Approval metrics

### Permissions
- **View Chains**: HR Admin, Department Managers
- **Create/Edit Chains**: HR Admin, System Admin
- **Delete Chains**: System Admin only
- **Manage Steps**: HR Admin, System Admin

---

**Last Updated**: October 2025  
**API Version**: v1.0
