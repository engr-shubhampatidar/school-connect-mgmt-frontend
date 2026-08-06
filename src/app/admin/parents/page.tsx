"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import {
  CreateParentDialog,
  ParentsTable,
  PARENTS_PAGE_SIZE,
  parentQueryKeys,
  useParentsQuery,
} from "@/modules/parents";

export default function AdminParentsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [creatingOpen, setCreatingOpen] = useState(false);

  const { data, isLoading, isFetching, error, refetch } = useParentsQuery({
    search: appliedSearch || undefined,
    page,
    pageSize: PARENTS_PAGE_SIZE,
  });

  const handleSearchApply = useCallback(() => {
    setAppliedSearch(search.trim());
    setPage(1);
  }, [search]);

  const parents = data?.parents ?? [];
  const total = data?.total ?? 0;
  const errorMessage =
    error instanceof Error
      ? error.message
      : error
        ? "Failed to load parents"
        : null;

  return (
    <div className="mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-[600] text-[#021034]">Parents</h1>
          <p className="mt-1 text-[14px] text-[#737373]">
            Create parent accounts and link them to students
          </p>
        </div>
        <Button variant="dark" onClick={() => setCreatingOpen(true)}>
          + Add Parent
        </Button>
      </div>

      <Card className="mb-5">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="sr-only">Search parents</label>
            <Input
              className="bg-[#F5F9FF]"
              placeholder="Search by name, email, or mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchApply();
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="dark" onClick={handleSearchApply}>
              Search
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSearch("");
                setAppliedSearch("");
                setPage(1);
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      <ParentsTable
        parents={parents}
        loading={isLoading || isFetching}
        error={errorMessage}
        total={total}
        page={page}
        pageSize={PARENTS_PAGE_SIZE}
        onRetry={() => void refetch()}
        onPageChange={setPage}
      />

      <CreateParentDialog
        open={creatingOpen}
        onClose={() => setCreatingOpen(false)}
        onCreated={() => {
          void queryClient.invalidateQueries({
            queryKey: parentQueryKeys.all,
          });
        }}
      />
    </div>
  );
}
