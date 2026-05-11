import type { ReportRow } from '../types';

interface BarChartProps {
    data: ReportRow[];
    height?: number;
    /** truncate long labels to this length */
    maxLabelLength?: number;
}

const BAR_WIDTH = 32;
const BAR_GAP = 12;
const PADDING_LEFT = 48;   // space for Y-axis labels
const PADDING_BOTTOM = 56; // space for X-axis labels
const PADDING_TOP = 16;

function truncate(str: string, n: number): string {
    return str.length > n ? str.slice(0, n) + '…' : str;
}

/**
 * Pure-SVG grouped bar chart — no external library needed.
 *
 * How it works:
 * 1. Each ReportRow becomes a group of 2 bars (check-in / check-out).
 * 2. The chart computes the max value across all rows to scale bar heights.
 * 3. Y-axis renders 5 evenly-spaced grid lines with value labels.
 * 4. X-axis renders the row label (date, week, name, etc.) rotated -40°.
 * 5. A tooltip pattern shows the exact count on hover via CSS :hover + SVG title.
 */
export function AttendanceBarChart({ data, height = 240, maxLabelLength = 12 }: BarChartProps) {
    if (data.length === 0) {
        return (
            <div className="flex h-32 items-center justify-center text-xs text-[var(--muted-foreground)]">
                No data for this period
            </div>
        );
    }

    const chartWidth  = PADDING_LEFT + data.length * (BAR_WIDTH * 2 + BAR_GAP) + BAR_GAP;
    const chartHeight = height + PADDING_TOP + PADDING_BOTTOM;
    const plotHeight  = height;

    const maxValue = Math.max(...data.map((r) => Math.max(r.check_ins, r.check_outs, 1)));

    // Round up to a nice number for Y-axis
    const yMax = Math.ceil(maxValue / 5) * 5 || 5;
    const gridLines = 5;

    const toY = (value: number) => plotHeight - (value / yMax) * plotHeight + PADDING_TOP;
    const barH = (value: number) => (value / yMax) * plotHeight;

    return (
        <div className="overflow-x-auto">
            <svg
                width={Math.max(chartWidth, 320)}
                height={chartHeight}
                aria-label="Attendance bar chart"
                role="img"
            >
                {/* Y-axis grid lines & labels */}
                {Array.from({ length: gridLines + 1 }, (_, i) => {
                    const value = Math.round((yMax / gridLines) * i);
                    const y     = toY(value);

                    return (
                        <g key={i}>
                            <line
                                x1={PADDING_LEFT}
                                x2={chartWidth}
                                y1={y}
                                y2={y}
                                stroke="var(--border)"
                                strokeWidth={1}
                                strokeDasharray="4 4"
                            />
                            <text
                                x={PADDING_LEFT - 6}
                                y={y + 4}
                                textAnchor="end"
                                fontSize={10}
                                fill="var(--muted-foreground)"
                            >
                                {value}
                            </text>
                        </g>
                    );
                })}

                {/* Bars + X labels */}
                {data.map((row, index) => {
                    const groupX = PADDING_LEFT + BAR_GAP + index * (BAR_WIDTH * 2 + BAR_GAP);
                    const ciH    = barH(row.check_ins);
                    const coH    = barH(row.check_outs);
                    const labelX = groupX + BAR_WIDTH;
                    const labelY = height + PADDING_TOP + 8;

                    return (
                        <g key={index}>
                            {/* Check-in bar */}
                            <rect
                                x={groupX}
                                y={toY(row.check_ins)}
                                width={BAR_WIDTH}
                                height={Math.max(ciH, 1)}
                                rx={4}
                                fill="#10b981"
                                opacity={0.85}
                                className="transition-opacity hover:opacity-100"
                            >
                                <title>{`${row.label} — Check-ins: ${row.check_ins}`}</title>
                            </rect>

                            {/* Check-out bar */}
                            <rect
                                x={groupX + BAR_WIDTH + 2}
                                y={toY(row.check_outs)}
                                width={BAR_WIDTH}
                                height={Math.max(coH, 1)}
                                rx={4}
                                fill="#f97316"
                                opacity={0.85}
                                className="transition-opacity hover:opacity-100"
                            >
                                <title>{`${row.label} — Check-outs: ${row.check_outs}`}</title>
                            </rect>

                            {/* X-axis label, rotated */}
                            <text
                                x={labelX}
                                y={labelY}
                                textAnchor="end"
                                fontSize={10}
                                fill="var(--muted-foreground)"
                                transform={`rotate(-40, ${labelX}, ${labelY})`}
                            >
                                {truncate(row.label, maxLabelLength)}
                            </text>
                        </g>
                    );
                })}

                {/* Y-axis line */}
                <line
                    x1={PADDING_LEFT}
                    x2={PADDING_LEFT}
                    y1={PADDING_TOP}
                    y2={height + PADDING_TOP}
                    stroke="var(--border)"
                    strokeWidth={1}
                />
            </svg>
        </div>
    );
}
