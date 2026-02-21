import type { TooltipData, TooltipStyles } from "../types/employeeMap"

const DEFAULT_STYLES: TooltipStyles = {
  background: '#112443B8',
  borderRadius: '12px',
  padding: '10px 14px',
  minWidth: '180px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  fontFamily: "'Tajawal', sans-serif",
}

/**
 * Create tooltip HTML content
 * @param data - Point data for the tooltip
 * @param styles - Optional style overrides
 * @param showDetailsButton - When false, hides the "View Details" button
 * @returns HTML string for the tooltip
 */
export function createTooltipHtml(
  data: TooltipData,
  styles: TooltipStyles = {},
  showDetailsButton = true
): string {
  const opts = { ...DEFAULT_STYLES, ...styles }
  const recordedText = data.recordedAt ? `سجل في ${data.recordedAt}` : ''

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
      ">موظف #${data.employeeId}</div>
      ${recordedText ? `
      <div style="
        color: #ffffff;
        font-size: 13px;
        opacity: 0.9;
        text-align: center;
        ${showDetailsButton ? 'margin-bottom: 8px;' : ''}
      ">${recordedText}</div>
      ` : ''}
      ${showDetailsButton ? `
      <button
        data-employee-id="${data.employeeId}"
        class="employee-detail-btn"
        style="
          width: 100%;
          padding: 6px 12px;
          background: rgba(255,255,255,0.15);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          font-family: ${opts.fontFamily};
          cursor: pointer;
          transition: background 0.2s;
        "
        onmouseover="this.style.background='rgba(255,255,255,0.3)'"
        onmouseout="this.style.background='rgba(255,255,255,0.15)'"
      >عرض التفاصيل</button>
      ` : ''}
    </div>
  `
}
