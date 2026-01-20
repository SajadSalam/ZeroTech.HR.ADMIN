import type { TooltipData, TooltipStyles } from "../types/employeeMap"

const DEFAULT_STYLES: Required<TooltipStyles> = {
  background: '#112443B8',
  borderRadius: '12px',
  padding: '10px 14px',
  minWidth: '180px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  fontFamily: "'Tajawal', sans-serif",
  onlineColor: '#27A727',
  offlineColor: '#980000'
}

/**
 * Create tooltip HTML content
 * @param data - Employee data for the tooltip
 * @param styles - Optional style overrides
 * @returns HTML string for the tooltip
 */
export function createTooltipHtml(
  data: TooltipData,
  styles: TooltipStyles = {}
): string {
  const opts = { ...DEFAULT_STYLES, ...styles }
  
  const statusText = data.isOnline 
    ? 'متصل الان' 
    : `اخر ظهور ${data.timeSinceLastUpdate || ''}`
  
  const statusColor = data.isOnline ? opts.onlineColor : opts.offlineColor

  return `
    <div class="employee-tooltip" style="
      background: ${opts.background};
      border-radius: ${opts.borderRadius};
      padding: ${opts.padding};
      min-width: ${opts.minWidth};
      box-shadow: ${opts.boxShadow};
      font-family: ${opts.fontFamily};
      direction: rtl;
    ">
      <div style="
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 2px;
        text-align: center;
      ">${data.fullName} / ${data.branchName}</div>
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      ">
        <span style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${statusColor};
          display: inline-block;
          flex-shrink: 0;
        "></span>
        <span style="
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
        ">${statusText}</span>
      </div>
    </div>
  `
}
