"use client";

import {
  HOMEWORK_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
  homeworkStatusClass,
  submissionStatusClass,
} from "@/modules/homework/utils/format";
import type { HomeworkStatus, SubmissionStatus } from "@/modules/homework/types";

export function HomeworkStatusBadge({ status }: { status: HomeworkStatus }) {
  return (
    <span className={homeworkStatusClass(status)}>
      {HOMEWORK_STATUS_LABELS[status]}
    </span>
  );
}

export function SubmissionStatusBadge({
  status,
}: {
  status: SubmissionStatus;
}) {
  return (
    <span className={submissionStatusClass(status)}>
      {SUBMISSION_STATUS_LABELS[status]}
    </span>
  );
}
