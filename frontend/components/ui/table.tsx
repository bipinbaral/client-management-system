import { ReactNode } from "react"

interface Column {
  key: string
  header: string
  render?: (value: any, row: any) => ReactNode
}

interface TableProps {
  columns: Column[]
  data: any[]
  onRowClick?: (row: any) => void
}

export function Table({ columns, data, onRowClick }: TableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className={`${
                    onRowClick ? "cursor-pointer hover:bg-blue-50" : ""
                  } transition-colors`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-gray-700">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
