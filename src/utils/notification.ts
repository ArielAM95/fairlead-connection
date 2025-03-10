
import { toast } from "sonner";

export const showNotification = (title: string, description: string) => {
  toast(title, {
    description: description,
    duration: 5000,
  });
};
