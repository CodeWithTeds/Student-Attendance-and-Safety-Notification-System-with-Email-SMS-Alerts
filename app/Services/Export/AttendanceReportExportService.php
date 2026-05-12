<?php

namespace App\Services\Export;

use Illuminate\Support\Str;

class AttendanceReportExportService
{
    public function buildCsv(array $report, array $filters): string
    {
        $lines = [
            ['Attendance Report'],
            ['Report Type', $this->reportTypeLabel($filters['report_type'])],
            ['Date Range', "{$filters['date_from']} to {$filters['date_to']}"],
            [],
            ['Summary'],
            ['Total Records', $report['summary']['total_records']],
            ['Total Check-ins', $report['summary']['total_check_ins']],
            ['Total Check-outs', $report['summary']['total_check_outs']],
            ['Unique Students', $report['summary']['unique_students']],
            [],
            [$this->columnLabel($filters['report_type']), 'Check-ins', 'Check-outs', 'Total Events'],
        ];

        foreach ($report['rows'] as $row) {
            $lines[] = [$row['label'], $row['check_ins'], $row['check_outs'], $row['total']];
        }

        return collect($lines)
            ->map(fn (array $line): string => $this->csvLine($line))
            ->implode("\n");
    }

    public function buildPdf(array $report, array $filters): string
    {
        $writer = new SimplePdfWriter;
        $writer->addHeading('Attendance Report');
        $writer->addLine('Report Type: '.$this->reportTypeLabel($filters['report_type']));
        $writer->addLine("Date Range: {$filters['date_from']} to {$filters['date_to']}");
        $writer->addBlankLine();
        $writer->addHeading('Summary', 14);
        $writer->addLine('Total Records: '.$report['summary']['total_records']);
        $writer->addLine('Total Check-ins: '.$report['summary']['total_check_ins']);
        $writer->addLine('Total Check-outs: '.$report['summary']['total_check_outs']);
        $writer->addLine('Unique Students: '.$report['summary']['unique_students']);
        $writer->addBlankLine();
        $writer->addHeading($this->reportTypeLabel($filters['report_type']).' Details', 14);
        $writer->addTableHeader([$this->columnLabel($filters['report_type']), 'Check-ins', 'Check-outs', 'Total']);

        foreach ($report['rows'] as $row) {
            $writer->addTableRow([
                $row['label'],
                (string) $row['check_ins'],
                (string) $row['check_outs'],
                (string) $row['total'],
            ]);
        }

        if ($report['rows'] === []) {
            $writer->addLine('No attendance data found for the selected filters.');
        }

        return $writer->output();
    }

    public function filename(array $filters, string $format): string
    {
        $type = Str::of($filters['report_type'])->replace('_', '-');

        return "attendance-{$type}-{$filters['date_from']}-to-{$filters['date_to']}.{$format}";
    }

    protected function reportTypeLabel(string $reportType): string
    {
        return match ($reportType) {
            'daily' => 'Daily',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
            'per_student' => 'Per Student',
            'per_section' => 'Per Section',
            default => Str::headline($reportType),
        };
    }

    protected function columnLabel(string $reportType): string
    {
        return match ($reportType) {
            'daily' => 'Date',
            'weekly' => 'Week',
            'monthly' => 'Month',
            'per_student' => 'Student',
            'per_section' => 'Section',
            default => 'Label',
        };
    }

    protected function csvLine(array $values): string
    {
        return collect($values)
            ->map(fn ($value): string => '"'.str_replace('"', '""', (string) $value).'"')
            ->implode(',');
    }
}

class SimplePdfWriter
{
    protected const PAGE_WIDTH = 595;

    protected const PAGE_HEIGHT = 842;

    protected array $pages = [];

    protected array $commands = [];

    protected int $y = 792;

    public function __construct()
    {
        $this->startPage();
    }

    public function addHeading(string $text, int $fontSize = 18): void
    {
        $this->addText($text, 40, $this->y, $fontSize, true);
        $this->y -= $fontSize + 10;
    }

    public function addLine(string $text, int $fontSize = 10): void
    {
        foreach ($this->wrapText($text, 92) as $line) {
            $this->ensureSpace();
            $this->addText($line, 40, $this->y, $fontSize);
            $this->y -= 15;
        }
    }

    public function addBlankLine(): void
    {
        $this->y -= 12;
        $this->ensureSpace();
    }

    public function addTableHeader(array $headers): void
    {
        $this->ensureSpace(26);
        $this->commands[] = '0.94 0.94 0.94 rg 40 '.($this->y - 4).' 515 20 re f';
        $this->addTableCells($headers, true);
        $this->y -= 22;
    }

    public function addTableRow(array $cells): void
    {
        $wrapped = $this->wrapText($cells[0], 48);

        foreach ($wrapped as $index => $labelPart) {
            $this->ensureSpace();
            $row = $index === 0 ? [$labelPart, $cells[1], $cells[2], $cells[3]] : [$labelPart, '', '', ''];
            $this->addTableCells($row);
            $this->y -= 17;
        }
    }

    public function output(): string
    {
        $this->finishPage();

        $objects = [];
        $fontObjectNumber = 3;
        $contentObjectStart = 4;
        $pageObjectStart = $contentObjectStart + count($this->pages);

        $objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
        $kids = collect(range(0, count($this->pages) - 1))
            ->map(fn (int $index): string => ($pageObjectStart + $index).' 0 R')
            ->implode(' ');
        $objects[2] = "<< /Type /Pages /Kids [ {$kids} ] /Count ".count($this->pages).' >>';
        $objects[$fontObjectNumber] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

        foreach ($this->pages as $index => $content) {
            $stream = implode("\n", $content);
            $objects[$contentObjectStart + $index] = '<< /Length '.strlen($stream)." >>\nstream\n{$stream}\nendstream";
        }

        foreach ($this->pages as $index => $content) {
            $contentNumber = $contentObjectStart + $index;
            $objects[$pageObjectStart + $index] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '.self::PAGE_WIDTH.' '.self::PAGE_HEIGHT."] /Resources << /Font << /F1 {$fontObjectNumber} 0 R >> >> /Contents {$contentNumber} 0 R >>";
        }

        ksort($objects);

        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $number => $object) {
            $offsets[$number] = strlen($pdf);
            $pdf .= "{$number} 0 obj\n{$object}\nendobj\n";
        }

        $xrefOffset = strlen($pdf);
        $pdf .= "xref\n0 ".(count($objects) + 1)."\n";
        $pdf .= "0000000000 65535 f \n";

        for ($i = 1; $i <= count($objects); $i++) {
            $pdf .= str_pad((string) $offsets[$i], 10, '0', STR_PAD_LEFT)." 00000 n \n";
        }

        $pdf .= "trailer\n<< /Size ".(count($objects) + 1)." /Root 1 0 R >>\nstartxref\n{$xrefOffset}\n%%EOF";

        return $pdf;
    }

    protected function startPage(): void
    {
        $this->commands = [];
        $this->y = 792;
    }

    protected function finishPage(): void
    {
        if ($this->commands !== []) {
            $this->pages[] = $this->commands;
        }
    }

    protected function ensureSpace(int $space = 20): void
    {
        if ($this->y >= 48 + $space) {
            return;
        }

        $this->finishPage();
        $this->startPage();
    }

    protected function addTableCells(array $cells, bool $bold = false): void
    {
        $widths = [290, 75, 75, 75];
        $x = 45;

        foreach ($cells as $index => $cell) {
            $this->addText((string) $cell, $x, $this->y, 9, $bold);
            $x += $widths[$index] ?? 75;
        }
    }

    protected function addText(string $text, int $x, int $y, int $fontSize = 10, bool $bold = false): void
    {
        $escaped = $this->escape($bold ? Str::upper($text) : $text);
        $this->commands[] = "BT /F1 {$fontSize} Tf {$x} {$y} Td ({$escaped}) Tj ET";
    }

    protected function wrapText(string $text, int $maxLength): array
    {
        $wrapped = wordwrap($text, $maxLength, "\n", true);

        return explode("\n", $wrapped ?: $text);
    }

    protected function escape(string $text): string
    {
        return str_replace(['\\', '(', ')'], ['\\\\', '\(', '\)'], $text);
    }
}
