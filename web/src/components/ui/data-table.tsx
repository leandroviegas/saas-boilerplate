import { cn } from '@/lib/utils'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { FaList, FaTable, FaAngleDown } from "react-icons/fa";
import Pagination, { PaginationMeta } from './pagination';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from '@/hooks/useTranslation';
import { Loading } from './loading';

interface DataFormat {
    // field key
    key: string
    // display header
    header: string
    // input type - default string
    type?: 'date' | 'string' | 'number' | 'price' | 'boolean'
    // currency for price type
    currency?: string
}

interface DataTableProps {
    className?: string
    list: React.ReactNode | null
    data: any[] | null
    tableId: string
    dataFormat: DataFormat[] | null
    status: 'loading' | 'success' | 'error'
    meta: PaginationMeta
    onPageChange?: (page: number, perPage: number) => void
    actions?: (item: any) => React.ReactNode
}

function getLocalStorageData(id: string, options?: { parse: boolean }) {
    if (typeof window == 'undefined') return;
    const value = localStorage.getItem(id);
    if (!value || !options?.parse) return value;
    return JSON.parse(value);
}

function setLocalStorageData(id: string, data: string) {
    if (typeof window == 'undefined') return;
    return localStorage.setItem(id, data);
}

function DataTable({ className, list, data, dataFormat, tableId, status, meta, onPageChange = (page, perPage) => { }, actions }: DataTableProps) {
    const { t } = useTranslation();
    const [view, setView] = useState<'table' | 'list'>(() => {
        const savedView = getLocalStorageData(`${tableId}_view`);
        if (savedView === 'table' || savedView === 'list') return savedView;
        if (data && data.length > 0) return 'table'
        if (list) return 'list'
        return 'table'
    })

    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set(getLocalStorageData(`${tableId}_hiddenColumns`, { parse: true }) || []))

    useEffect(() => {
        setLocalStorageData(`${tableId}_view`, view);
    }, [view, tableId]);

    useEffect(() => {
        setLocalStorageData(`${tableId}_hiddenColumns`, JSON.stringify(Array.from(hiddenColumns)));
    }, [hiddenColumns, tableId]);

    const canSwitchToTable = data && data.length > 0
    const canSwitchToList = list !== null

    const formats = [...(dataFormat || (data && data[0] ? Object.keys(data[0]).map(key => ({ key, header: key, type: 'string' as const })) : []))]
    if (actions) formats.push({ key: 'actions', header: t('actions'), type: 'string' })

    const toggleView = () => {
        if (view === 'table' && canSwitchToList) {
            setView('list')
        } else if (view === 'list' && canSwitchToTable) {
            setView('table')
        }
    }

    const formatValue = (value: any, format: DataFormat) => {
        const type = format.type || 'string'
        switch (type) {
            case 'date':
                if (!value) return '-'
                const date = new Date(value)
                if (isNaN(date.getTime())) return '-'
                return date.toISOString().split('T')[0]
            case 'number':
                return Number(value).toString()
            case 'price':
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: format.currency || 'USD' }).format(value)
            case 'boolean':
                return value ? t('yes') : t('no')
            case 'string':
            default:
                return String(value)
        }
    }

    const renderTable = () => {
        if (!data || data.length === 0) return null
        const visibleFormats = formats.filter(f => !hiddenColumns.has(f.key))
        return (
            <div className="overflow-hidden rounded-xl border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {visibleFormats.map(format => (
                                <TableHead key={format.key}>{format.header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index}>
                                {visibleFormats.map(format => (
                                    <TableCell key={format.key}>
                                        {format.key === 'actions' ? actions!(item) : formatValue(item[format.key], format)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    const renderList = () => {
        return list
    }

    if (status === 'loading') return <Loading />
    if (status === 'error') return <div className="text-center p-4 text-red-500">Error loading data</div>

    return (
        <div className={cn('', className)} suppressHydrationWarning={true}>
            <div className="flex justify-between align-middle mb-4">
                <div>
                    {view === 'table' && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-2">
                                    {t('columns')} <FaAngleDown />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="space-y-2">
                                    {formats.map(format => (
                                        <div key={format.key} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={format.key}
                                                checked={!hiddenColumns.has(format.key)}
                                                onCheckedChange={(checked) => {
                                                    const newHidden = new Set(hiddenColumns)
                                                    if (checked) {
                                                        newHidden.delete(format.key)
                                                    } else {
                                                        newHidden.add(format.key)
                                                    }
                                                    setHiddenColumns(newHidden)
                                                }}
                                            />
                                            <label htmlFor={format.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {format.header}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
                <div>
                    <Button
                        onClick={toggleView}
                        disabled={(view === 'table' && !canSwitchToList) || (view === 'list' && !canSwitchToTable)}
                    >
                        {view === 'table' ? <FaList /> : <FaTable />}
                    </Button>
                </div>
            </div>
            {view === 'table' ? renderTable() : renderList()}
            <hr className='border-border mt-12' />
            <div className="flex justify-center items-center gap-2 mt-8">
                <Pagination meta={meta} onPageChange={onPageChange} />
            </div>
        </div>
    )
}

export default DataTable