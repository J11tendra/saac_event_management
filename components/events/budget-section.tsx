"use client";

import type { BudgetRequest } from "@/lib/types";

interface BudgetSectionProps {
  budgetRequest: BudgetRequest;
}

export function BudgetSection({ budgetRequest }: BudgetSectionProps) {
  return (
    <div className="border-t pt-3">
      <div className="bg-muted/50 rounded-md p-3 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold">Budget Purpose</p>
            <p className="text-sm text-muted-foreground mt-1">
              {budgetRequest.purpose}
            </p>
          </div>
        </div>
        {budgetRequest.approval_comments && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-sm font-semibold">Approval Comments</p>
            <p className="text-sm text-muted-foreground mt-1">
              {budgetRequest.approval_comments}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
