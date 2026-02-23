import { NextResponse } from 'next/server';
import { getAllSurveyResponses, getAllInterviewResponses, getAllStepActivity } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const type = searchParams.get('type') || 'survey';

  try {
    let data: any[] = [];
    let filename = '';

    if (type === 'survey') {
      data = await getAllSurveyResponses();
      filename = 'survey_responses';
    } else if (type === 'interview') {
      data = await getAllInterviewResponses();
      filename = 'interview_responses';
    } else if (type === 'steps') {
      data = await getAllStepActivity();
      filename = 'step_activity';
    } else if (type === 'all') {
      const [surveys, interviews, steps] = await Promise.all([
        getAllSurveyResponses(),
        getAllInterviewResponses(),
        getAllStepActivity()
      ]);
      
      if (format === 'csv') {
        // Return all as separate CSV files in a zip would be ideal, but for simplicity return JSON
        return NextResponse.json({
          surveys,
          interviews,
          steps,
          exportedAt: new Date().toISOString()
        });
      }
      
      return NextResponse.json({
        surveys,
        interviews,
        steps,
        exportedAt: new Date().toISOString()
      });
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Default: JSON
    return NextResponse.json({
      data,
      exportedAt: new Date().toISOString(),
      count: data.length
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  // Flatten the data for CSV export
  const flattened = data.map(item => flattenObject(item));
  
  // Get all unique keys
  const keys = new Set<string>();
  flattened.forEach(item => {
    Object.keys(item).forEach(key => keys.add(key));
  });
  
  const headers = Array.from(keys);
  
  // Create CSV
  const csvRows = [
    headers.join(','), // Header row
    ...flattened.map(item => 
      headers.map(header => {
        const value = item[header] ?? '';
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}

function flattenObject(obj: any, prefix = ''): any {
  return Object.keys(obj).reduce((acc: any, k: string) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else if (Array.isArray(obj[k])) {
      acc[pre + k] = obj[k].join('; ');
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}
