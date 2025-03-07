
interface Window {
  fbq: (
    action: string,
    event: string,
    params?: Record<string, any>
  ) => void;
  _fbq: any;
}

declare function fbq(
  action: string,
  event: string,
  params?: Record<string, any>
): void;
