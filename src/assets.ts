/** Public assets use the deployment path supplied by Vite (/, /rif-fm/, etc.). */
export function asset(fileName: string): string {
  return `${import.meta.env.BASE_URL}assets/${fileName}`;
}
