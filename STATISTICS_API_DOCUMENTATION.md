# Statistics API Documentation

This document describes the new statistics endpoints for the Reading Award Backend system. These endpoints provide data suitable for different chart types to visualize applicant statistics.

## Endpoints Overview

### 1. Gender Statistics (Pie Chart)
**Endpoint:** `GET /api/applicants/statistics/gender`

Returns gender distribution data suitable for pie charts.

**Response Format:**
```json
{
  "success": true,
  "message": "Gender statistics retrieved successfully",
  "data": {
    "chartData": [
      {
        "label": "Male",
        "value": 150,
        "percentage": "65.2"
      },
      {
        "label": "Female",
        "value": 80,
        "percentage": "34.8"
      }
    ],
    "total": 230
  }
}
```

**Chart Usage:**
- **Type:** Pie Chart
- **Labels:** Use `chartData[].label`
- **Values:** Use `chartData[].value`
- **Percentages:** Available in `chartData[].percentage`

### 2. HEPIQ vs Non-HEPIQ Statistics (Bar Chart)
**Endpoint:** `GET /api/applicants/statistics/hepiq`

Returns HEPIQ vs Non-HEPIQ applicant distribution. Applicants with emails containing "random.moheser.gov" are considered Non-HEPIQ.

**Response Format:**
```json
{
  "success": true,
  "message": "HEPIQ statistics retrieved successfully",
  "data": {
    "chartData": [
      {
        "label": "HEPIQ",
        "value": 180
      },
      {
        "label": "Non-HEPIQ",
        "value": 50
      }
    ],
    "total": 230
  }
}
```

**Chart Usage:**
- **Type:** Bar Chart
- **Labels:** Use `chartData[].label`
- **Values:** Use `chartData[].value`

### 3. Daily Registration Statistics (Line Chart)
**Endpoint:** `GET /api/applicants/statistics/daily`

Returns daily applicant registration counts suitable for line charts.

**Response Format:**
```json
{
  "success": true,
  "message": "Daily statistics retrieved successfully",
  "data": {
    "chartData": [
      {
        "date": "2024-01-15",
        "count": 12,
        "formattedDate": "15 كانون الثاني 2024"
      },
      {
        "date": "2024-01-16",
        "count": 8,
        "formattedDate": "16 كانون الثاني 2024"
      }
    ],
    "totalDays": 25,
    "totalApplicants": 230,
    "dateRange": {
      "start": "2024-01-15",
      "end": "2024-02-08"
    }
  }
}
```

**Chart Usage:**
- **Type:** Line Chart
- **X-axis:** Use `chartData[].date` or `chartData[].formattedDate`
- **Y-axis:** Use `chartData[].count`

## Implementation Details

### Technical Features
1. **Efficient Querying:** Uses Strapi's database query methods with proper filtering
2. **Large Dataset Handling:** Implements pagination with high limits for comprehensive data
3. **Data Formatting:** Provides chart-ready data formats
4. **Error Handling:** Comprehensive error handling with Arabic error messages
5. **Performance Optimized:** Uses count queries where possible to minimize data transfer

### Authentication
All endpoints currently have `auth: false` for testing purposes. In production, you should implement proper authentication.

### Error Responses
All endpoints return consistent error format:
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "حدث خطأ أثناء جلب الإحصائيات"
  }
}
```

## Frontend Integration Examples

### Chart.js Integration

#### Pie Chart (Gender)
```javascript
const genderData = await fetch('/api/applicants/statistics/gender').then(r => r.json());

const pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: genderData.data.chartData.map(item => item.label),
    datasets: [{
      data: genderData.data.chartData.map(item => item.value),
      backgroundColor: ['#3B82F6', '#EF4444']
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const item = genderData.data.chartData[context.dataIndex];
            return `${item.label}: ${item.value} (${item.percentage}%)`;
          }
        }
      }
    }
  }
});
```

#### Bar Chart (HEPIQ)
```javascript
const hepiqData = await fetch('/api/applicants/statistics/hepiq').then(r => r.json());

const barChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: hepiqData.data.chartData.map(item => item.label),
    datasets: [{
      label: 'Number of Applicants',
      data: hepiqData.data.chartData.map(item => item.value),
      backgroundColor: ['#10B981', '#F59E0B']
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
```

#### Line Chart (Daily)
```javascript
const dailyData = await fetch('/api/applicants/statistics/daily').then(r => r.json());

const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: dailyData.data.chartData.map(item => item.formattedDate),
    datasets: [{
      label: 'Daily Registrations',
      data: dailyData.data.chartData.map(item => item.count),
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
```
