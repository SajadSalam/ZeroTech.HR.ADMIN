# Approval Step Frontend Integration Guide

This guide provides the essential information for integrating with the Approval Step API endpoints.

## Base URL
- **Base URL**: `/api/ApprovalStep`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token required

## Data Models

### Approval Step Response (ApprovalStepDTO)
```json
{
  "id": 1,
  "approvalChainId": 5,
  "name": "Direct Manager Approval",
  "description": "Approval by direct line manager",
  "stepOrder": 1,
  "isRequired": true,
  "allowsAutoApproval": false,
  "autoApprovalConditions": null,
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
  "escalationUser": {
    "id": 15,
    "username": "hr.manager",
    "email": "hr.manager@company.com"
  },
  "activationConditions": "{\"minAmount\": 1000}",
  "isActive": true,
  "approvalStepRoles": [
    {
      "id": 1,
      "stepId": 1,
      "roleId": 3,
      "role": {
        "id": 3,
        "name": "Manager",
        "description": "Department Manager"
      }
    }
  ],
  "approvalStepUsers": [
    {
      "id": 1,
      "stepId": 1,
      "userId": 25,
      "user": {
        "id": 25,
        "username": "john.manager",
        "email": "john.manager@company.com",
        "firstName": "John",
        "lastName": "Manager"
      }
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:00Z",
  "isActive": true
}
```

### Create Approval Step Request
```json
{
  "approvalChainId": 5,
  "name": "HR Review",
  "description": "Human Resources department review",
  "stepOrder": 2,
  "isRequired": true,
  "allowsAutoApproval": false,
  "allowsParallelApproval": true,
  "minRequiredApprovals": 2,
  "requiresAllApprovers": false,
  "maxCompletionHours": 48,
  "sendReminders": true,
  "firstReminderHours": 24,
  "reminderIntervalHours": 12,
  "maxReminders": 2,
  "timeoutAction": "Escalate",
  "escalationUserId": 10,
  "isActive": true
}
```

### Update Approval Step Request
```json
{
  "id": 1,
  "name": "Updated Step Name",
  "maxCompletionHours": 36,
  "sendReminders": false,
  "isActive": true
}
```

## API Endpoints

### 1. Get Approval Steps by Chain
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalStep/by-approval-chain/{approvalChainId}`
- **Path Parameters**:
  - `approvalChainId` (int, required) - Approval chain ID
- **Description**: Returns all steps for a chain, ordered by step order

**Example Request**:
```
GET /api/ApprovalStep/by-approval-chain/5
```

**Response**: List of approval steps with all approvers

### 2. Get Approval Step by ID
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalStep/{id}`
- **Path Parameters**:
  - `id` (int, required) - Approval step ID

**Example Request**:
```
GET /api/ApprovalStep/1
```

**Response**: Single approval step with full details and approvers

### 3. Get First Step in Chain
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalStep/first/{approvalChainId}`
- **Path Parameters**:
  - `approvalChainId` (int, required) - Approval chain ID
- **Description**: Returns the first step (step order = 1) in the chain

**Example Request**:
```
GET /api/ApprovalStep/first/5
```

**Response**: First approval step in the chain

### 4. Get Next Step
- **Method**: `GET`
- **Endpoint**: `/api/ApprovalStep/next`
- **Query Parameters**:
  - `approvalChainId` (int, required) - Approval chain ID
  - `currentStepOrder` (int, required) - Current step order number
- **Description**: Returns the next step after the current step order

**Example Request**:
```
GET /api/ApprovalStep/next?approvalChainId=5&currentStepOrder=1
```

**Response**: Next approval step in sequence

### 5. Create Approval Step
- **Method**: `POST`
- **Endpoint**: `/api/ApprovalStep`
- **Body**: CreateApprovalStepRequest (JSON)

**Example Request**:
```json
POST /api/ApprovalStep
{
  "approvalChainId": 5,
  "name": "Finance Approval",
  "description": "Financial review for budget impact",
  "stepOrder": 3,
  "isRequired": true,
  "maxCompletionHours": 72,
  "timeoutAction": "AutoReject"
}
```

**Response**: Created approval step details
**Status Codes**: 201 (Created), 400 (Bad Request), 500 (Server Error)

### 6. Update Approval Step
- **Method**: `PUT`
- **Endpoint**: `/api/ApprovalStep/{id}`
- **Path Parameters**:
  - `id` (int, required) - Approval step ID
- **Body**: UpdateApprovalStepRequest (JSON)

**Example Request**:
```json
PUT /api/ApprovalStep/1
{
  "id": 1,
  "name": "Updated Manager Approval",
  "maxCompletionHours": 48,
  "sendReminders": true,
  "firstReminderHours": 8
}
```

**Response**: Updated approval step details
**Status Codes**: 200 (OK), 400 (Bad Request), 404 (Not Found), 500 (Server Error)

### 7. Delete Approval Step
- **Method**: `DELETE`
- **Endpoint**: `/api/ApprovalStep/{id}`
- **Path Parameters**:
  - `id` (int, required) - Approval step ID

**Example Request**:
```
DELETE /api/ApprovalStep/1
```

**Response**: No content
**Status Codes**: 204 (No Content), 404 (Not Found), 500 (Server Error)

## Validation Rules

### Step Name
- **Required**: Yes
- **Length**: Max 100 characters
- **Format**: Any text

### Step Order
- **Required**: Yes
- **Type**: Integer
- **Range**: Must be >= 1
- **Unique**: Must be unique within the approval chain

### Approval Chain ID
- **Required**: Yes
- **Type**: Integer
- **Validation**: Must be a valid approval chain ID

### Completion Hours
- **Required**: No
- **Type**: Integer
- **Range**: Must be >= 1 if specified

### Parallel Approval Settings
- **Min Required Approvals**: Must be >= 1 if parallel approval enabled
- **Cannot exceed total number of assigned approvers**

### Reminder Settings
- **First Reminder Hours**: Must be >= 1 if reminders enabled
- **Reminder Interval Hours**: Must be >= 1 if reminders enabled
- **Max Reminders**: Must be >= 1 if reminders enabled

### Timeout Action
- **Required**: No
- **Values**: "AutoApprove", "AutoReject", "Escalate", "NextStep", "Notify"
- **Default**: "Escalate"

### Escalation User ID
- **Required**: Yes if timeout action is "Escalate"
- **Type**: Integer
- **Validation**: Must be a valid user ID

### Activation Conditions
- **Required**: No
- **Format**: Valid JSON string
- **Examples**: `{"minAmount": 1000}`, `{"department": "Finance"}`

## Business Rules

### Step Ordering
- Steps execute in numerical order (1, 2, 3, etc.)
- No gaps allowed in step order within a chain
- Step order must be unique within each chain

### Required Steps
- Required steps cannot be skipped
- Must be completed before proceeding to next step
- System will enforce completion

### Parallel Approval
- Multiple approvers can approve simultaneously
- Can require minimum number of approvals
- Can require all approvers to approve
- Useful for committee-style decisions

### Auto Approval
- Steps can auto-approve based on conditions
- Conditions evaluated at runtime
- Skips manual approval if conditions met

### Timeout Handling
- **AutoApprove**: Automatically approves and moves to next step
- **AutoReject**: Automatically rejects the entire request
- **Escalate**: Routes to escalation user for decision
- **NextStep**: Skips current step and moves to next
- **Notify**: Sends notification but takes no action

### Reminders
- Sent to pending approvers
- First reminder after specified hours
- Subsequent reminders at intervals
- Limited to maximum number of reminders

### Activation Conditions
- JSON-based rules that determine when step is active
- Evaluated when request reaches the step
- Step is skipped if conditions not met

## Error Responses

### Common Error Codes
- **400 Bad Request**: Invalid input data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Approval step not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "Approval step with ID 1 not found"
}
```

### Validation Error Response
```json
{
  "errors": {
    "Name": ["Step name is required"],
    "StepOrder": ["Step order must be greater than 0"]
  }
}
```

## Usage Examples

### Frontend Implementation Requirements

#### 1. Step Management Interface
- List all steps for a chain in order
- Create/edit steps with drag-and-drop ordering
- Configure approvers (roles and users)
- Set timing and reminder preferences

#### 2. Step Configuration Form
- Step name and description
- Order position with visual indicators
- Required/optional toggle
- Parallel approval settings
- Timeout and escalation options

#### 3. Approver Assignment
- Assign roles that can approve
- Assign specific users as approvers
- Handle parallel approval requirements
- Validate minimum approver requirements

#### 4. Flow Visualization
- Show step sequence with arrows
- Display step status and requirements
- Show timing and reminder settings
- Highlight current active step

### Recommended UI Features

#### Step Builder
- Drag-and-drop step reordering
- Visual step configuration wizard
- Approver selection interface
- Condition builder for activation rules

#### Step Testing
- Simulate step execution
- Test condition evaluation
- Validate approver assignments
- Preview step flow

#### Step Monitoring
- Track step completion times
- Monitor timeout situations
- Display reminder notifications
- Show escalation activities

### Common Use Cases

#### Simple Sequential Approval
1. Manager Approval (Step 1)
2. HR Review (Step 2)
3. Final Approval (Step 3)

#### Parallel Committee Approval
- Step with multiple approvers
- Require 2 out of 3 approvals
- All approvers can act simultaneously

#### Conditional Steps
- Skip finance approval for amounts under $500
- Auto-approve routine requests
- Escalate high-priority requests

### Permissions
- **View Steps**: All authenticated users
- **Create/Edit Steps**: HR Admin, System Admin
- **Delete Steps**: System Admin only
- **Assign Approvers**: HR Admin, Department Managers

---

**Last Updated**: October 2025  
**API Version**: v1.0
