export type MsGridJustify = 'none' | 'space-around' | 'space-between';

export function wait(time: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), time);
  })
}
