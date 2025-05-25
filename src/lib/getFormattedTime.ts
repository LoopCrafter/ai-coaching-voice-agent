import { format, formatDistanceToNow } from "date-fns";

export const getFormattedTime = (timestamp: number) => {
  const now = new Date();
  const createdAt = new Date(timestamp);

  const diffMs = now.getTime() - createdAt.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    return formatDistanceToNow(createdAt, { addSuffix: true });
  } else {
    return format(createdAt, "yyyy-MM-dd HH:mm");
  }
};
