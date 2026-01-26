"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBudgetRequest } from "@/lib/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddBudgetDialogProps {
  eventId: string;
  eventName: string;
  clubId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBudgetDialog({
  eventId,
  eventName,
  clubId,
  open,
  onOpenChange,
}: AddBudgetDialogProps) {
  const [budgetAmount, setBudgetAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addBudgetRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", clubId] });
      setBudgetAmount("");
      setPurpose("");
      setError("");
      onOpenChange(false);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to add budget request");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    if (!purpose.trim()) {
      setError("Please enter the purpose of the budget");
      return;
    }

    mutation.mutate({
      eventId,
      budgetAmount: amount,
      purpose: purpose.trim(),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add Budget Request</DialogTitle>
          <DialogDescription>
            Add a budget request for <strong>{eventName}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Budget Amount (₹)</Label>
              <Input
                id="budget-amount"
                type="number"
                step="0.01"
                placeholder="Enter amount in rupees"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                disabled={mutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Describe what the budget will be used for..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                disabled={mutation.isPending}
                rows={4}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Budget Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
