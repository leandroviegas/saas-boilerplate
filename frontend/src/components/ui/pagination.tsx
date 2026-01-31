import React from "react"
import { Button } from "./button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation";

export interface PaginationMeta {
    page: number
    perPage: number
    total: number
}
interface PaginationProps {
    onPageChange: (page: number, perPage: number) => void
    meta: PaginationMeta
}


function Pagination({ meta, onPageChange }: PaginationProps) {
    const { t } = useTranslation();

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1, meta.perPage)}
                disabled={meta.page === 1}
            >
                <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(meta.page - 1, meta.perPage)}
                disabled={meta.page === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
                {t('page')} {meta.page} {t('of')} {Math.ceil(meta.total / meta.perPage)}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(meta.page + 1, meta.perPage)}
                disabled={meta.page >= Math.ceil(meta.total / meta.perPage)}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.ceil(meta.total / meta.perPage), meta.perPage)}
                disabled={meta.page >= Math.ceil(meta.total / meta.perPage)}
            >
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </>
    )
}

export default Pagination