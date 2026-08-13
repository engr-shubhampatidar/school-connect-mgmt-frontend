"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/use-toast";
import type { Parent } from "@/modules/parents/types";
import { useParentMutations } from "@/modules/parents/hooks/useParents";
import LinkChildrenDialog from "./LinkChildrenDialog";

type Props = {
  parent: Parent;
  loading?: boolean;
  onChanged?: () => void;
};

function formatRelationship(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export default function ParentDetailView({
  parent,
  loading,
  onChanged,
}: Props) {
  const { toast } = useToast();
  const { unlink } = useParentMutations();
  const [linkOpen, setLinkOpen] = useState(false);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const children = parent.children ?? [];
  const linkedIds = children.map((c) => c.id);

  const handleUnlink = async (studentId: string, name: string) => {
    const confirmed = window.confirm(
      `Unlink ${name} from this parent? This can be re-linked later.`,
    );
    if (!confirmed) return;

    setUnlinkingId(studentId);
    try {
      await unlink.mutateAsync({ parentId: parent.id, studentId });
      toast({
        title: "Child unlinked",
        description: `${name} was removed from this parent.`,
        type: "success",
      });
      onChanged?.();
    } catch (err) {
      toast({
        title: "Failed to unlink",
        description: (err as Error)?.message ?? "Unknown error",
        type: "error",
      });
    } finally {
      setUnlinkingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {parent.fullName || `${parent.firstName} ${parent.lastName}`}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{parent.email}</p>
          </div>
          <span className="inline-flex self-start rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {parent.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-slate-500">Mobile</div>
            <div className="mt-1 font-medium text-slate-900">
              {parent.mobile ?? "-"}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Gender</div>
            <div className="mt-1 font-medium text-slate-900">
              {parent.gender
                ? formatRelationship(parent.gender)
                : "-"}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Children linked</div>
            <div className="mt-1 font-medium text-slate-900">
              {parent.childrenCount ?? children.length}
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="text-slate-500">Address</div>
            <div className="mt-1 font-medium text-slate-900">
              {parent.address ?? "-"}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Linked Children
          </h3>
          <p className="text-sm text-slate-600">
            Manage which students this parent can access.
          </p>
        </div>
        <Button variant="dark" onClick={() => setLinkOpen(true)}>
          + Link Children
        </Button>
      </div>

      {children.length === 0 ? (
        <Card>
          <div className="text-center py-4">
            <h4 className="text-base font-medium text-slate-900">
              No children linked
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              Link one or more students to this parent account.
            </p>
            <div className="mt-4">
              <Button variant="dark" onClick={() => setLinkOpen(true)}>
                Link Children
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="rounded-lg bg-white border border-[#D7E3FC]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="hidden md:table-cell">Code</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {children.map((child) => (
                <TableRow
                  key={child.id}
                  className="border-t border-[#D7E3FC]"
                >
                  <TableCell className="pl-6 font-medium text-slate-900">
                    {child.fullName}
                  </TableCell>
                  <TableCell>
                    {[child.className, child.section]
                      .filter(Boolean)
                      .join(" - ") || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {child.studentCode ?? "-"}
                  </TableCell>
                  <TableCell>
                    {formatRelationship(child.relationship)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      disabled={unlinkingId === child.id || unlink.isPending}
                      onClick={() =>
                        void handleUnlink(child.id, child.fullName)
                      }
                    >
                      {unlinkingId === child.id ? "Unlinking…" : "Unlink"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <LinkChildrenDialog
        open={linkOpen}
        parentId={parent.id}
        alreadyLinkedIds={linkedIds}
        onClose={() => setLinkOpen(false)}
        onLinked={() => onChanged?.()}
      />
    </div>
  );
}
