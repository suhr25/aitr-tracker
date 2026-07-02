"use client";

import { useState } from "react";
import { Criterion, Status } from "@/lib/types";
import { ChevronDown, ChevronUp, FileText, Calendar, MessageSquare, Edit2, Check } from "lucide-react";
import { useApp } from "@/contexts/AuthContext";

function StatusBadge({ status }: { status: Status }) {
  const colors: Record<string, string> = {
    "Pending": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "In Progress": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "Completed": "bg-green-500/10 text-green-600 dark:text-green-400",
    "Blocked": "bg-red-500/10 text-red-600 dark:text-red-400",
    "Not Applicable": "bg-gray-500/10 text-gray-500",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${colors[status]}`}>
      {status}
    </span>
  );
}

export function SectionAccordion({ section, criteria, onUpdate, isChairman }: {
  section: string;
  criteria: Criterion[];
  onUpdate: (id: string, status: Status, remarks: string) => void;
  isChairman?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { updateCriterionDueDate, updateChairmanFeedback } = useApp();

  const completed = criteria.filter((c) => c.status === "Completed").length;
  const total = criteria.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Local state for editing due dates and feedback
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [dateValue, setDateValue] = useState("");

  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);
  const [feedbackValue, setFeedbackValue] = useState("");

  const handleSaveDate = (id: string) => {
    if (dateValue) {
      updateCriterionDueDate(id, dateValue);
    }
    setEditingDate(null);
  };

  const handleSaveFeedback = (id: string) => {
    updateChairmanFeedback(id, feedbackValue);
    setEditingFeedback(null);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
          <FileText className="h-4 w-4 shrink-0" />
        </div>
        <span className="flex-1 font-semibold text-[15px]">{section}</span>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">{completed}/{total}</span>
          <div className="hidden sm:block w-24 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-bold w-10 text-right">{pct}%</span>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground ml-2" /> : <ChevronDown className="h-4 w-4 text-muted-foreground ml-2" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border divide-y divide-border bg-card/50">
          {criteria.map((c) => {
            const isOverdue = c.status !== "Completed" && c.status !== "Not Applicable" && new Date(c.dueDate) < new Date();
            
            return (
              <div key={c.id} className="px-5 py-4 transition-colors hover:bg-muted/20">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-[15px] font-semibold text-foreground">{c.title}</span>
                      <StatusBadge status={c.status} />
                      {isOverdue && (
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-500 uppercase border border-red-500/20">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                      {/* Due Date Section */}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 opacity-70" />
                        <span>Due: </span>
                        {editingDate === c.id ? (
                          <div className="flex items-center gap-1">
                            <input 
                              type="date" 
                              className="rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground outline-none focus:border-blue-500"
                              value={dateValue}
                              onChange={(e) => setDateValue(e.target.value)}
                              autoFocus
                            />
                            <button onClick={() => handleSaveDate(c.id)} className="p-1 rounded bg-green-500/20 text-green-500 hover:bg-green-500/30">
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className={`font-medium ${isOverdue ? "text-red-500" : "text-foreground"}`}>
                              {new Date(c.dueDate).toLocaleDateString()}
                            </span>
                            <button 
                              onClick={() => { setEditingDate(c.id); setDateValue(c.dueDate); }}
                              className="opacity-50 hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted"
                              title="Edit Due Date"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <span>Assigned: <span className="font-medium text-foreground">{c.assignedTo}</span></span>
                    </div>

                    {c.remarks && (
                      <div className="mt-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-[13px] text-muted-foreground">
                        <span className="font-semibold text-foreground">Coordinator Remarks: </span>
                        {c.remarks}
                      </div>
                    )}

                    {/* Chairman Feedback Section */}
                    {(c.chairmanFeedback || isChairman) && (
                      <div className="mt-3 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2.5">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Chairman Feedback</span>
                              {isChairman && editingFeedback !== c.id && (
                                <button 
                                  onClick={() => { setEditingFeedback(c.id); setFeedbackValue(c.chairmanFeedback || ""); }}
                                  className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                >
                                  <Edit2 className="h-3 w-3" />
                                  {c.chairmanFeedback ? "Edit" : "Add Feedback"}
                                </button>
                              )}
                            </div>
                            
                            {editingFeedback === c.id ? (
                              <div className="mt-2 space-y-2">
                                <textarea
                                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500 min-h-[60px] resize-y"
                                  placeholder="Type feedback here..."
                                  value={feedbackValue}
                                  onChange={(e) => setFeedbackValue(e.target.value)}
                                  autoFocus
                                />
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleSaveFeedback(c.id)}
                                    className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button 
                                    onClick={() => setEditingFeedback(null)}
                                    className="rounded px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              c.chairmanFeedback ? (
                                <p className="text-[13px] text-foreground leading-relaxed">{c.chairmanFeedback}</p>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {c.updatedBy && (
                      <p className="text-[11px] text-muted-foreground mt-3">
                        Last updated by <span className="font-medium text-foreground">{c.updatedBy}</span> on {new Date(c.lastUpdated).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Coordinator Status Update */}
                  {!isChairman && c.status !== "Completed" && c.status !== "Not Applicable" && (
                    <div className="mt-4 lg:mt-0 lg:ml-4 shrink-0">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const val = e.target.value as Status;
                          if (val) {
                            const remark = val === "Completed"
                              ? prompt("Add completion remarks (optional):") || ""
                              : val === "Blocked"
                              ? prompt("Reason for block:") || ""
                              : "";
                            onUpdate(c.id, val, remark);
                            e.target.value = "";
                          }
                        }}
                        className="w-full lg:w-auto rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer hover:bg-muted/50"
                      >
                        <option value="" disabled>Update Status →</option>
                        <option value="In Progress">Mark In Progress</option>
                        <option value="Completed">Mark Completed</option>
                        <option value="Blocked">Mark Blocked</option>
                        <option value="Not Applicable">Not Applicable</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
